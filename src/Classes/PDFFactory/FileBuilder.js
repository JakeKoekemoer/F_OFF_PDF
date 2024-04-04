class FileBuilder{

    _PAGE = null;
    _RESOURCES = [];
    _CONTENT = [];
    _CONTENT_ID_LIST = null;

    //region Getters and Setters

    GetPage(){
        return this._PAGE;
    }

    SetPage(value){
        this._PAGE = value;

        let page = value.GetPageAsObject();
        let resources = page.Resources;
        let content = page.Content;

        this.SetResources(resources);
        this.SetContent(content);
    }

    GetResources(){
        return this._RESOURCES;
    }

    SetResources(value){
        this._RESOURCES = value;
    }

    GetContent(){
        return this._CONTENT;
    }

    SetContent(value){
        this._CONTENT = value;
    }

    GetContentIdList(){
        return this._CONTENT_ID_LIST;
    }

    SetContentIdList(value){
        this._CONTENT_ID_LIST = value;
    }

    //endregion Getters and Setters

    constructor(Page){
        this.SetPage(Page);
    }

    GetResourcePart(){
        let f = [];
        /** @var {PDFFontResource[]} */
        let fontResources = this.GetResources().GetFontResources();
        for(let j = 0; j < fontResources.length; j++){
            /** @var {PDFFontResource} */
            let fontResource = fontResources[j];
            f.push(`${fontResource.GetId()} 0 obj`);
            f.push(`<< /Font << /F${j} << /Type /${fontResource.GetType()} /Subtype /${fontResource.GetSubType()} /BaseFont /${fontResource.GetBaseFont()} >>`);
            f.push(`endobj`);
        }

        return f;
    }

    GetContentPart(){
        let f = [];

        /** @var {PDFContentObject[]} */
        let contentParts = this.GetContent();

        for(let j = 0; j < contentParts.length; j++){
            /** @var {PDFContentObject} */
            let contentObject = contentParts[j];

            f.push(`${contentObject.GetId()} 0 obj`);
            f.push(`<< >>`);
            f.push(`stream`);
            f.push(`${contentObject.GetPDFStream()}`);
            f.push(`endstream`);
            f.push(`endobj`);
        }

        let objectIdList = contentParts.map((contentObject) => {
            return `${contentObject.GetId()} 0 R`;
        });

        this.SetContentIdList(objectIdList.join(' '));

        return f;
    }

}