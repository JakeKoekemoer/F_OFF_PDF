export class PDFContentObject {
    _CONTENT_STRING = null;
    _CONTENT_COMMAND = null;
    _OBJECT_ID = null;

    constructor(){
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

    GetContentCommand(){
        return this._CONTENT_COMMAND;
    }

    SetContentCommand(value){
        this._CONTENT_COMMAND = value;
    }

    //endregion Getters and Setters

    IsActionCommand(){
        return (this._CONTENT_COMMAND !== null);
    }

    GetPDFStream(){
        if(this.IsActionCommand())
            return this._CONTENT_COMMAND
        else
            return `1. 0.000000 0.000000 1. 50. 770. cm BT /F0 36. Tf (${this.GetContentString()}) Tj ET`;
    }
}