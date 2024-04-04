class PDFPageResource{
    _FONTS = [];

    constructor(){

    }

    AddFontResource(FontResource) {
        this._FONTS.push(font);
    }

    GetFontResources(){
        return this._FONTS;
    }
}