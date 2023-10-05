"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPixelsToMicrons = exports.parsePaperSizeInMicrons = exports.parsePaperSize = exports.sendIpcMsg = void 0;
var electron_1 = require("electron");
/**
 * @function sendMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and receives a status of true
 *
 */
function sendIpcMsg(channel, webContents, arg) {
    return new Promise(function (resolve, reject) {
        // @ts-ignore
        electron_1.ipcMain.once(channel + "-reply", function (event, result) {
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
exports.sendIpcMsg = sendIpcMsg;
function parsePaperSize(pageSize) {
    var width = 219, height = 1200;
    if (typeof pageSize == 'string') {
        switch (pageSize) {
            case '44mm':
                width = 166;
                break;
            case '57mm':
                width = 215;
                break;
            case '58mm':
                width = 219;
                break;
            case '76mm':
                width = 287;
                break;
            case '78mm':
                width = 295;
                break;
            case '80mm':
                width = 302;
                break;
        }
    }
    else if (typeof pageSize == 'object') {
        width = pageSize.width;
        height = pageSize.height;
    }
    return {
        width: width,
        height: height,
    };
}
exports.parsePaperSize = parsePaperSize;
function parsePaperSizeInMicrons(pageSize) {
    var width = 58000, height = 10000; // in microns
    if (typeof pageSize == 'string') {
        switch (pageSize) {
            case '44mm':
                width = Math.ceil(44 * 1000);
                break;
            case '57mm':
                width = Math.ceil(57 * 1000);
                break;
            case '58mm':
                width = Math.ceil(58 * 1000);
                break;
            case '76mm':
                width = Math.ceil(76 * 1000);
                break;
            case '78mm':
                width = Math.ceil(78 * 1000);
                break;
            case '80mm':
                width = Math.ceil(80 * 1000);
                break;
            default:
                return pageSize;
        }
    }
    else if (typeof pageSize == 'object') {
        width = pageSize.width;
        height = pageSize.height;
    }
    else {
        return 'A4';
    }
    return {
        width: width,
        height: height,
    };
}
exports.parsePaperSizeInMicrons = parsePaperSizeInMicrons;
function convertPixelsToMicrons(pixels) {
    return Math.ceil(pixels * 264.5833);
}
exports.convertPixelsToMicrons = convertPixelsToMicrons;
