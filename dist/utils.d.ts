import { PageSize, PaperSize, SizeOptions } from './models';
/**
 * @function sendMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and receives a status of true
 *
 */
export declare function sendIpcMsg(channel: any, webContents: any, arg: any): Promise<unknown>;
export declare function parsePaperSize(pageSize?: PaperSize | SizeOptions): {
    width: number;
    height: number;
};
export declare function parsePaperSizeInMicrons(pageSize?: PaperSize | PageSize | SizeOptions): SizeOptions | PageSize;
export declare function convertPixelsToMicrons(pixels: number): number;
