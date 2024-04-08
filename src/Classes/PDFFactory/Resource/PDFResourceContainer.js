export class PDFResourceContainer{
    /** @var {PDFFontResource[]} */
    _FONTS = [];
    _ID = 0;
    _XOBJECTS = [];
    _LAST_FONT_NUMBER = -1;

    constructor(ID){
        this.SetId(ID);
    }

    //region Getters and Setters

    GetId(){
        return this._ID;
    }

    SetId(value){
        this._ID = value;
    }

    GetLastFontNumber(){
        return this._LAST_FONT_NUMBER;
    }

    SetLastFontNumber(value){
        this._LAST_FONT_NUMBER = value;
    }

    GetNextAvailableFontNumber(){
        this.SetLastFontNumber(this.GetLastFontNumber() + 1);
        return this.GetLastFontNumber();
    }

    //endregion Getters and Setters

    AddFontResource(FontResource) {
        FontResource.SetPDFFontNumber(this.GetNextAvailableFontNumber());
        this._FONTS.push(FontResource);
    }

    GetFontResources(){
        return this._FONTS;
    }

    GetXObjectResources(){
        return this._XOBJECTS;
    }

    AddXObjectResource(XObjectResource){
        this._XOBJECTS.push(XObjectResource);
    }
}