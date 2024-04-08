import {TPDF_Object_Types, TPDF_Page_Layouts} from "../definitions.js";

export class PDFPageLayout {

    _ID = null;
    _PAGE_ID = null;
    _LAYOUT= TPDF_Page_Layouts.SINGLE_PAGE;
    _TYPE = TPDF_Object_Types.PDF_OBJ_TYPE_CATALOG

    //region Getters and Setters

    GetId(){
        return this._ID;
    }

    SetId(value){
        this._ID = value;
    }

    GetPageId(){
        return this._PAGE_ID;
    }

    SetPageId(value){
        this._PAGE_ID = value;
    }

    GetLayout(){
        return this._LAYOUT;
    }

    SetLayout(value){
        this._LAYOUT = value;
    }

    GetType(){
        return this._TYPE;
    }

    SetType(value){
        this._TYPE = value;
    }

    //endregion Getters and Setters

    constructor(pageId){
        this.SetPageId(pageId);
    }

}