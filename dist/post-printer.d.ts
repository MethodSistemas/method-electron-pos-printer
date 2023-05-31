import { PosPrintData, PosPrintOptions } from './models';
/**
 * @class PosPrinter
 * **/
export declare class PosPrinter {
    /**
     * @Method: Print object
     * @Param arg {any}
     * @return {Promise<boolean>}
     */
    static print(data: PosPrintData[], options: PosPrintOptions): Promise<boolean>;
    /**
     * @Method
     * @Param data {any[]}
     * @Return {Promise}
     * @description Render the print data in the render process
     *
     */
    private static renderPrintDocument;
}
