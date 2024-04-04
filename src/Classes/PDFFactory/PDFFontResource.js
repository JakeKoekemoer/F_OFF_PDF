class PDFFontResource{
    _ID = null;
    _TYPE = "Font";
    _BASE_FONT = "";
    _SUB_TYPE = "Type1";

    constructor(FontId, BaseFont = "Times-Italic"){
        this.SetId(FontId);
        this.SetBaseFont(BaseFont);
    }

    //region Getters and Setters

    GetId(){
        return this._ID;
    }

    SetId(value){
        this._ID = value;
    }

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

    GetFontAsObject(){
        return {
            Id: this.GetId(),
            Type: this.GetType(),
            BaseFont: this.GetBaseFont(),
            SubType: this.GetSubType()
        }
    }
}