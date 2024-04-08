export class PDFResourceContainer{
    /** @var {PDFFontResource[]} */
    _FONTS = [];
    _ID = 0;
    _XOBJECTS = [];

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

    //endregion Getters and Setters

    AddFontResource(FontResource) {
        this._FONTS.push(FontResource);
    }

    GetFontResources(){
        return this._FONTS;
    }

    GetXObjectResources(){
        return this._XOBJECTS;
    }
}