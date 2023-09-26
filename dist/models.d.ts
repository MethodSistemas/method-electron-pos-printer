export interface PosPrintOptions {
    /**
     * @description Print options
     * {@link https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback}
     * @field copies: number of copies to print
     * @field preview: bool，false=print，true=pop preview window
     * @field deviceName: string，default device name, check it at webContent.getPrinters()
     * @field timeoutPerLine: int，timeout，actual time is ：data.length * timeoutPerLine ms
     * @field silent: To print silently
     * @field pathTemplate: Path to HTML file for custom print options
     */
    header?: string;
    width?: string | number;
    footer?: string;
    copies?: number;
    preview?: boolean;
    printerName?: string;
    margin?: string;
    timeOutPerLine?: number;
    silent?: boolean;
    color?: boolean;
    printBackground?: boolean;
    margins?: {
        marginType?: 'default' | 'none' | 'printableArea' | 'custom';
        top?: number;
        bottom?: number;
        right?: number;
        left?: number;
    };
    landscape?: boolean;
    scaleFactor?: number;
    pagesPerSheet?: number;
    collate?: boolean;
    pageRanges?: {
        from: number;
        to: number;
    }[];
    duplexMode?: 'simplex' | 'shortEdge' | 'longEdge';
    pageSize?: PaperSize | SizeOptions | PageSize;
    dpi?: {
        horizontal: number;
        vertical: number;
    };
    pathTemplate?: string;
}
export declare type PageSize = 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid';
export declare type PaperSize = '80mm' | '78mm' | '76mm' | '57mm' | '58mm' | '44mm';
export interface SizeOptions {
    height: number;
    width: number;
}
/**
 * @type PosPrintPosition
 * @description Alignment for type barCode and qrCode
 *
 */
export declare type PosPrintPosition = 'left' | 'center' | 'right';
/**
 * @interface
 * @name PosPrintTableField
 * */
export interface PosPrintTableField {
    type: 'text' | 'image';
    value?: string;
    path?: string;
    css?: any;
    style?: string;
    width?: string;
    height?: string;
}
/**
 * @interface
 * @name PosPrintData
 * **/
export interface PosPrintData {
    /**
     * @property type
     * @description type data to print: 'text' | 'div' | 'barCode' | 'qrcode' | 'image' | 'table' | 'text-column'
     */
    type: PosPrintType;
    value?: string;
    css?: any;
    style?: string;
    width?: string;
    height?: string;
    fontsize?: number;
    displayValue?: boolean;
    position?: PosPrintPosition;
    path?: string;
    tableHeader?: PosPrintTableField[] | string[];
    tableBody?: PosPrintTableField[][] | string[][];
    tableFooter?: PosPrintTableField[] | string[];
    tableHeaderStyle?: string;
    tableBodyStyle?: string;
    tableFooterStyle?: string;
}
/**
 * @type PosPrintType
 * @name PosPrintType
 * **/
export declare type PosPrintType = 'text' | 'div' | 'barCode' | 'qrCode' | 'image' | 'table' | 'text-column';
