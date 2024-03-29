/*
 * Copyright (c) 2019-2020. Author Hubert Formin <hformin@gmail.com>
 */

import { PosPrintData, PosPrintOptions } from './models';
import { convertPixelsToMicrons, parsePaperSize, parsePaperSizeInMicrons } from './utils';

if ((process as any).type == 'renderer') {
  throw new Error('method-electron-pos-printer: use remote.require("method-electron-pos-printer") in render process');
}

const { BrowserWindow, ipcMain } = require('electron');

/**
 * @class PosPrinter
 * **/
export class PosPrinter {
  /**
   * @Method: Print object
   * @Param arg {any}
   * @return {Promise<boolean>}
   */
  public static print(data: PosPrintData[], options: PosPrintOptions): Promise<boolean> {
    console.log(data, options);
    return new Promise(async (resolve, reject) => {
      /**
       * Validation
       */
      // 1. Reject if printer name is not set in live mode
      if (!options.preview && !options.printerName && !options.silent) {
        reject(
          new Error("A printer name is required, if you don't want to specify a printer name, set silent to true").toString()
        );
      }
      // 2. Reject if pageSize is object and pageSize.height or pageSize.width is not set
      if (typeof options.pageSize == 'object') {
        if (!options.pageSize.height || !options.pageSize.width) {
          reject(new Error('height and width properties are required for options.pageSize'));
        }
      }
      let printedState = false; // If the job has been printer or not
      let window_print_error: string | null = null; // The error returned if the printing fails
      let timeOut = options.timeOutPerLine ? options.timeOutPerLine * data.length + 200 : 400 * data.length + 200;

      /**
       * If in live mode i.e. `options.preview` is false & if `options.silent` is false
       * Check after a timeOut if the print data has been rendered and printed,
       * If the data is rendered & printer, printerState will be set to true.
       *
       * This is done because we don't want the printing process to hang, so after a specific time, we check if the
       * printing was completed and resolve/reject the promise.
       *
       * The printing process can hang (i.e. the print promise never gets resolved) if the process is trying to
       * send a print job to a printer that is not connected.
       *
       */
      // if (!options.preview || !options.silent) {
      //   setTimeout(() => {
      //     if (!printedState) {
      //       const errorMsg = window_print_error || '[TimedOutError] Make sure your printer is connected';
      //       reject(errorMsg);
      //       printedState = true;
      //     }
      //   }, timeOut);
      // }
      // open electron window
      let mainWindow = new BrowserWindow({
        ...parsePaperSize(options.pageSize),
        show: !!options.preview,
        webPreferences: {
          nodeIntegration: true, // For electron >= 4.0.0
          contextIsolation: false,
        },
      });
      // mainWindow
      mainWindow.on('closed', () => {
        (mainWindow as any) = null;
      });
      /*mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'print.html'),
                protocol: 'file:',
                slashes: true,
                // baseUrl: 'dist'
            }));*/
      mainWindow.loadFile(__dirname + '/pos.html');
      mainWindow.webContents.on('did-finish-load', async () => {
        // get system printers
        // const system_printers = mainWindow.webContents.getPrinters();
        // const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
        // // if system printer isn't found!!
        // if (!options.preview && printer_index == -1) {
        //     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
        //     return;
        // }
        // else start initialize render prcess page
        await sendIpcMsg('body-init', mainWindow.webContents, options);
        /**
         * Render print data as html in the mainwindow render process
         *
         */
        return await PosPrinter.renderPrintDocument(mainWindow, data)
          .then(async () => {
            let pageSize = parsePaperSizeInMicrons(options.pageSize);
            // Get the height of content window, if the pageSize is a string
            if (typeof options.pageSize === 'string') {
              const clientHeight = await mainWindow.webContents.executeJavaScript('document.body.clientHeight');
              if (typeof pageSize == 'object') {
                pageSize.height = convertPixelsToMicrons(clientHeight);
              }
            }
            if (!options.preview) {
              mainWindow.webContents.print(
                {
                  silent: !!options.silent,
                  printBackground: !!options.printBackground,
                  deviceName: options.printerName,
                  copies: options.copies ? options.copies : 1,
                  scaleFactor: options.scaleFactor ?? 100,
                  pageSize,
                  ...(options.header && { header: options.header }),
                  ...(options.footer && { footer: options.footer }),
                  ...(options.color && { color: options.color }),
                  ...(options.margins && { margins: options.margins }),
                  ...(options.landscape && { landscape: options.landscape }),
                  ...(options.scaleFactor && { scaleFactor: options.scaleFactor }),
                  ...(options.pagesPerSheet && { pagesPerSheet: options.pagesPerSheet }),
                  ...(options.collate && { collate: options.collate }),
                  ...(options.pageRanges && { pageRanges: options.pageRanges }),
                  ...(options.duplexMode && { duplexMode: options.duplexMode }),
                  ...(options.dpi && { dpi: options.dpi }),
                },
                (arg, err) => {
                  if (err) {
                    window_print_error = err;
                    reject(err);
                  }
                  if (!printedState) {
                    resolve(arg);
                    printedState = true;
                  }
                  mainWindow.close();
                }
              );
            } else {
              resolve(true);
            }
          })
          .catch((err) => reject(err));
      });
    });
  }
  /**
   * @Method
   * @Param data {any[]}
   * @Return {Promise}
   * @description Render the print data in the render process
   *
   */
  private static renderPrintDocument(window: any, data: PosPrintData[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      for (let lineIndex = 0; lineIndex < data.length; lineIndex++) {
        const line = data[lineIndex];
        await sendIpcMsg('render-line', window.webContents, { line, lineIndex })
          .then((result: any) => {
            if (!result.status) {
              window.close();
              reject(result.error);
              return;
            }
          })
          .catch((error) => {
            reject(error);
            return;
          });
      }
      // const promises = data.map(async (line, lineIndex) => {
      //   // if (line.type === 'image' && !line.path) {
      //   //     window.close();
      //   //     reject(new Error('An Image path is required for type image').toString());
      //   //     return;
      //   // }

      // await Promise.all(promises);

      // when the render process is done rendering the page, resolve
      resolve({ message: 'page-rendered' });
    });
  }
}
/**
 * @function sendMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and recieves a status of true
 *
 */
function sendIpcMsg(channel: any, webContents: any, arg: any) {
  return new Promise((resolve, reject) => {
    ipcMain.once(`${channel}-reply`, function (event, result) {
      if (result.status) {
        resolve(result);
      } else {
        reject(result.error);
      }
    });
    webContents.send(channel, arg);
  });
}
