import {TPDF_Object_Types} from "../definitions.js";

export class PDFPageListDictionary{

    _ID;
    _KIDS;
    _TYPE;

    // region Getters and Setters

    GetId(){
        return this._ID;
    }

    SetId(value){
        this._ID = value;
    }

    GetKids(){
        return this._KIDS;
    }

    SetKids(value){
        this._KIDS = value;
    }

    GetType(){
        return this._TYPE;
    }

    SetType(value){
        this._TYPE = value;
    }

    GetCount(){
        return this._KIDS.length;
    }

    // endregion Getters and Setters

    constructor(Id){
        this.SetType(TPDF_Object_Types.PDF_OBJ_TYPE_PAGES);
        this.SetKids([]);
        this.SetId(Id);
    }

    AddPage(page){
        this.GetKids().push(page);
    }

    GetKidsAsPDFArray(){
        return this.GetKids().map(page => {
            return `${page.GetId()} 0 R`;
        }).join(" ");
    }

    Build(){
        return {
            Id: this.GetId(),
            Type: this.GetType(),
            Kids: this.GetKidsAsPDFArray(),
            Count: this.GetKids().length
        };
    }

}