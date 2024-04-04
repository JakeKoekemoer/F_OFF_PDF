export class PDFFontResource{
    _TYPE = "Font";
    _BASE_FONT = "";
    _SUB_TYPE = "Type1";

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

    //endregion Getters and Setters
}