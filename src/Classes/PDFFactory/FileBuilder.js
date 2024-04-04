export class FileBuilder{

    _PAGE = null;
    _CONTENT_ID_LIST = null;

    //region Getters and Setters

    /**
     * @returns {PDFPage}
     * */
    GetPage(){
        return this._PAGE;
    }

    SetPage(value){
        this._PAGE = value;
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
        let fontResources = this.GetPage().GetResourceContainer().GetFontResources();
        for(let j = 0; j < fontResources.length; j++){
            /** @var {PDFFontResource} */
            let fontResource = fontResources[j];
            // this is an embedded resource, so we don't create it into an object
            f.push(`\t\t<< /Font << /F${j} << /BaseFont /${fontResource.GetBaseFont()} /Subtype /${fontResource.GetSubType()} /Type /${fontResource.GetType()} >> >> >>`);
        }

        return f;
    }

    GetContentPart(){
        let f = [];

        /** @var {PDFContentObject[]} */
        let contentParts = this.GetPage().GetContent();

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