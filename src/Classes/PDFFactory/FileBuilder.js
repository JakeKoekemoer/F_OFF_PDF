export class FileBuilder{
    static PDFPageListDictionaryObject(pageListDictionary){
        let f = [];

        f.push(`${pageListDictionary.Id} 0 obj`);
        f.push(`<< /Kids [${pageListDictionary.Kids}] /Type /${pageListDictionary.Type} /Count ${pageListDictionary.Count} >>`);
        f.push(`endobj`);

        return f;
    }

    /**
     * @param {PDFPageResource} fontResource
     **/
    static PDFFontResourceObject(fontResource, fontId){
        let f = [];

        f.push(`\t\t<< /Font << /F${fontId} << /BaseFont /${fontResource.GetBaseFont()} /Subtype /${fontResource.GetSubType()} /Type /${fontResource.GetType()} >> >> >>`);

        return f;
    }

    /**
     * @param {PDFContentObject} contentObject
     **/
    static PDFContentObject(contentObject){
        let f = [];

        f.push(`${contentObject.GetId()} 0 obj`);
        f.push(`<< >>`);
        f.push(`stream`);
        f.push(`${contentObject.GetPDFStream()}`);
        f.push(`endstream`);
        f.push(`endobj`);

        return f;
    }

    /**
     * @param page {PDFPage}
     * @param resourcePart {Array}
     * @param contentIdList {String}
     */
    static PDFPageObject(page, resourcePart, contentIdList){
        let f = [];

        /** @var {TPDF_Page_Sizes} pageSize */
        let pageSize = page.GetPageSize();


        f.push(`${page.GetId()} 0 obj`);
        f.push(`<<`);
        f.push(`\t/Type /${page.GetPageType()}`);
        f.push(`\t/Parent ${page.GetParentId()}`);
        f.push(`\t/Rotate ${page.GetPageRotation()}`);
        f.push(`\t/MediaBox [0 0 ${pageSize.x} ${pageSize.y}]`);

        f.push(`\t/Resources`);
        f.push(...resourcePart);

        f.push(`\t/Contents [${contentIdList}]`);

        f.push(`>>`);
        f.push(`endobj`);

        return f;
    }

}