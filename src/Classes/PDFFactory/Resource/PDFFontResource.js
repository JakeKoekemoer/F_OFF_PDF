export class PDFFontResource {
    _TYPE = "Font";
    _BASE_FONT = "";
    _SUB_TYPE = "Type1";
    _PDF_FONT_NAME = "";
    _ENCODING = "WinAnsiEncoding";
    _FIRST_CHAR = 32;
    _LAST_CHAR = 255;
    _ID = null;

    constructor(BaseFont = "Times-Italic"){
        this.SetBaseFont(BaseFont);
    }

    //region Getters and Setters

    GetType(){
        return this._TYPE;
    }

    GetBaseFont(){
        return this._BASE_FONT;
    }

    SetBaseFont(value){
        this._BASE_FONT = value;
    }

    GetSubType(){
        return this._SUB_TYPE;
    }

    GetId(){
        return this._ID;
    }

    SetId(value){
        this._ID = value;
        this.SetPDFFontName(`F${value}`);
    }

    GetPDFFontName(){
        return this._PDF_FONT_NAME;
    }

    SetPDFFontName(value){
        this._PDF_FONT_NAME = value;
    }

    GetEncoding(){
        return this._ENCODING;
    }

    SetEncoding(value){
        this._ENCODING = value;
    }

    GetFirstChar(){
        return this._FIRST_CHAR;
    }

    SetFirstChar(value){
        this._FIRST_CHAR = value;
    }

    GetLastChar(){
        return this._LAST_CHAR;
    }

    SetLastChar(value){
        this._LAST_CHAR = value;
    }

    //endregion Getters and Setters
}