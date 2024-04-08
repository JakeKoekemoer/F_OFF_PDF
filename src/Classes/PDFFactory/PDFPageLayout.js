import {TPDF_Object_Types, TPDF_Page_Layouts} from "../definitions.js";

export class PDFPageLayout {
    _ID = null;
    _TYPE = TPDF_Object_Types.PDF_OBJ_TYPE_CATALOG;
    _LAYOUT = TPDF_Page_Layouts.SINGLE_PAGE;
    _PAGE_LIST_DICTIONARY = null;

    //region Getters and Setters

    GetId(){
        return this._ID;
    }

    SetId(value){
        this._ID = value;
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

    SetPageListDictionary(value){
        this._PAGE_LIST_DICTIONARY = value;
    }

    GetPageListDictionary(){
        return this._PAGE_LIST_DICTIONARY;
    }

    //endregion Getters and Setters
}