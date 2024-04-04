export class PDFPageResource{
    /** @var {PDFFontResource[]} */
    _FONTS = [];

    constructor(){

    }

    AddFontResource(FontResource) {
        this._FONTS.push(FontResource);
    }

    GetFontResources(){
        return this._FONTS;
    }
}