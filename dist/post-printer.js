"use strict";
/*
 * Copyright (c) 2019-2020. Author Hubert Formin <hformin@gmail.com>
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosPrinter = void 0;
var utils_1 = require("./utils");
if (process.type == 'renderer') {
    throw new Error('method-electron-pos-printer: use remote.require("method-electron-pos-printer") in render process');
}
var _a = require('electron'), BrowserWindow = _a.BrowserWindow, ipcMain = _a.ipcMain;
/**
 * @class PosPrinter
 * **/
var PosPrinter = /** @class */ (function () {
    function PosPrinter() {
    }
    /**
     * @Method: Print object
     * @Param arg {any}
     * @return {Promise<boolean>}
     */
    PosPrinter.print = function (data, options) {
        var _this = this;
        console.log(data, options);
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var printedState, window_print_error, timeOut, mainWindow;
            var _this = this;
            return __generator(this, function (_a) {
                /**
                 * Validation
                 */
                // 1. Reject if printer name is not set in live mode
                if (!options.preview && !options.printerName && !options.silent) {
                    reject(new Error("A printer name is required, if you don't want to specify a printer name, set silent to true").toString());
                }
                // 2. Reject if pageSize is object and pageSize.height or pageSize.width is not set
                if (typeof options.pageSize == 'object') {
                    if (!options.pageSize.height || !options.pageSize.width) {
                        reject(new Error('height and width properties are required for options.pageSize'));
                    }
                }
                printedState = false;
                window_print_error = null;
                timeOut = options.timeOutPerLine ? options.timeOutPerLine * data.length + 200 : 400 * data.length + 200;
                mainWindow = new BrowserWindow(__assign(__assign({}, utils_1.parsePaperSize(options.pageSize)), { show: !!options.preview, webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false,
                    } }));
                // mainWindow
                mainWindow.on('closed', function () {
                    mainWindow = null;
                });
                /*mainWindow.loadURL(url.format({
                          pathname: path.join(__dirname, 'print.html'),
                          protocol: 'file:',
                          slashes: true,
                          // baseUrl: 'dist'
                      }));*/
                mainWindow.loadFile(__dirname + '/pos.html');
                mainWindow.webContents.on('did-finish-load', function () { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // get system printers
                            // const system_printers = mainWindow.webContents.getPrinters();
                            // const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
                            // // if system printer isn't found!!
                            // if (!options.preview && printer_index == -1) {
                            //     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
                            //     return;
                            // }
                            // else start initialize render prcess page
                            return [4 /*yield*/, sendIpcMsg('body-init', mainWindow.webContents, options)];
                            case 1:
                                // get system printers
                                // const system_printers = mainWindow.webContents.getPrinters();
                                // const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
                                // // if system printer isn't found!!
                                // if (!options.preview && printer_index == -1) {
                                //     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
                                //     return;
                                // }
                                // else start initialize render prcess page
                                _a.sent();
                                return [4 /*yield*/, PosPrinter.renderPrintDocument(mainWindow, data)
                                        .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var pageSize, clientHeight;
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    pageSize = utils_1.parsePaperSizeInMicrons(options.pageSize);
                                                    if (!(typeof options.pageSize === 'string')) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, mainWindow.webContents.executeJavaScript('document.body.clientHeight')];
                                                case 1:
                                                    clientHeight = _b.sent();
                                                    if (typeof pageSize == 'object') {
                                                        pageSize.height = utils_1.convertPixelsToMicrons(clientHeight);
                                                    }
                                                    _b.label = 2;
                                                case 2:
                                                    if (!options.preview) {
                                                        mainWindow.webContents.print(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ silent: !!options.silent, printBackground: !!options.printBackground, deviceName: options.printerName, copies: options.copies ? options.copies : 1, scaleFactor: (_a = options.scaleFactor) !== null && _a !== void 0 ? _a : 100, pageSize: pageSize }, (options.header && { header: options.header })), (options.footer && { footer: options.footer })), (options.color && { color: options.color })), (options.margins && { margins: options.margins })), (options.landscape && { landscape: options.landscape })), (options.scaleFactor && { scaleFactor: options.scaleFactor })), (options.pagesPerSheet && { pagesPerSheet: options.pagesPerSheet })), (options.collate && { collate: options.collate })), (options.pageRanges && { pageRanges: options.pageRanges })), (options.duplexMode && { duplexMode: options.duplexMode })), (options.dpi && { dpi: options.dpi })), function (arg, err) {
                                                            if (err) {
                                                                window_print_error = err;
                                                                reject(err);
                                                            }
                                                            if (!printedState) {
                                                                resolve(arg);
                                                                printedState = true;
                                                            }
                                                            mainWindow.close();
                                                        });
                                                    }
                                                    else {
                                                        resolve(true);
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })
                                        .catch(function (err) { return reject(err); })];
                            case 2: 
                            /**
                             * Render print data as html in the mainwindow render process
                             *
                             */
                            return [2 /*return*/, _a.sent()];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    /**
     * @Method
     * @Param data {any[]}
     * @Return {Promise}
     * @description Render the print data in the render process
     *
     */
    PosPrinter.renderPrintDocument = function (window, data) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var lineIndex, line;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lineIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(lineIndex < data.length)) return [3 /*break*/, 4];
                        line = data[lineIndex];
                        return [4 /*yield*/, sendIpcMsg('render-line', window.webContents, { line: line, lineIndex: lineIndex })
                                .then(function (result) {
                                if (!result.status) {
                                    window.close();
                                    reject(result.error);
                                    return;
                                }
                            })
                                .catch(function (error) {
                                reject(error);
                                return;
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        lineIndex++;
                        return [3 /*break*/, 1];
                    case 4:
                        // const promises = data.map(async (line, lineIndex) => {
                        //   // if (line.type === 'image' && !line.path) {
                        //   //     window.close();
                        //   //     reject(new Error('An Image path is required for type image').toString());
                        //   //     return;
                        //   // }
                        // await Promise.all(promises);
                        // when the render process is done rendering the page, resolve
                        resolve({ message: 'page-rendered' });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return PosPrinter;
}());
exports.PosPrinter = PosPrinter;
/**
 * @function sendMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and recieves a status of true
 *
 */
function sendIpcMsg(channel, webContents, arg) {
    return new Promise(function (resolve, reject) {
        ipcMain.once(channel + "-reply", function (event, result) {
            if (result.status) {
                resolve(result);
            }
            else {
                reject(result.error);
            }
        });
        webContents.send(channel, arg);
    });
}
