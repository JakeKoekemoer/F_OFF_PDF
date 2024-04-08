export class TPDF_Object_Types {
    static PDF_OBJ_TYPE_PAGES       = 'Pages'
    static PDF_OBJ_TYPE_PAGE        = 'Page'
    static PDF_OBJ_TYPE_CATALOG     = 'Catalog'
    static PDF_OBJ_TYPE_X_OBJECT    = 'XObject'
}


export class TPDF_Page_Sizes {
    static LETTER       = {x: 612,  y: 792}
    static LEGAL        = {x: 612,  y: 1008}
    static TABLOID      = {x: 792,  y: 1224}
    static LEDGER       = {x: 1224, y: 792}
    static EXECUTIVE    = {x: 522,  y: 756}
    static POSTCARD     = {x: 283,  y: 416}
    static A1           = {x: 1684, y: 2384}
    static A2           = {x: 1191, y: 1684}
    static A3           = {x: 842,  y: 1191}
    static A4           = {x: 595,  y: 842}
    static A5           = {x: 420,  y: 595}
    static A6           = {x: 297,  y: 420}
}

export class TPDF_Page_Layouts {
    static SINGLE_PAGE          = 'SinglePage'
    static ONE_COLUMN           = 'OneColumn'
    static TWO_COLUMN_LEFT      = 'TwoColumnLeft'
    static TWO_COLUMN_RIGHT     = 'TwoColumnRight'
    static TWO_PAGE_LEFT        = 'TwoPageLeft'
    static TWO_PAGE_RIGHT       = 'TwoPageRight'
}