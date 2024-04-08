export class PDFContentObject {
    _CONTENT_STRING = null;
    _OBJECT_ID = null;

    constructor(Id){
        this.SetId(Id);
    }

    //region Getters and Setters

    GetId(){
        return this._OBJECT_ID;
    }

    SetId(value){
        this._OBJECT_ID = value;
    }

    GetContentString(){
        return this._CONTENT_STRING;
    }

    SetContentString(value){
        this._CONTENT_STRING = value;
    }

    //endregion Getters and Setters

    GetPDFStream(){
        return `1. 0.000000 0.000000 1. 50. 770. cm BT /F0 36. Tf (${this.GetContentString()}) Tj ET`;
    }
}