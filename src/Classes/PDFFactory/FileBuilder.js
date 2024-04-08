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
    static PDFContentObj(contentObject){
        let f = [];

        let _content = contentObject.GetPDFStream();
        let streamLength = _content.length;

        f.push(`${contentObject.GetId()} 0 obj`);
        f.push(`<<`);
        f.push(`/Length ${streamLength} `);
        f.push(`>>`);
        f.push(`stream`);
        f.push(`${_content}`);
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

    /**
     * @param {int} metaDataObjId
     * @param {PDFDocument} doc
     */
    static PDFMetaDataObj(metaDataObjId, doc){
        let f = [];

        f.push(`${metaDataObjId} 0 obj`);
        f.push(`<<`);
        f.push(`\t/Title (${doc.GetTitle()})`);
        f.push(`\t/Author (${doc.GetAuthor()})`);
        f.push(`\t/Producer (${doc.GetProducer()})`);
        f.push(`\t/CreationDate (${doc.GetCreationDateMetaData()})`);
        f.push(`\t/ModDate (${doc.GetModDateMetaData()})`);
        f.push(`>>`);
        f.push(`endobj`);

        return f;
    }

    /**
     * @param {int} trailerObjId
     * @param {int} metaDataObjId
     * @param {int} firstPageLayoutId
     */
    static PDFTrailer(trailerObjId, metaDataObjId, firstPageLayoutId){
        let f = [];

        f.push(`xref`);
        f.push(`0 ${trailerObjId}`);

        // Build the trailer
        f.push(`trailer`);
        f.push(`<<`);
        f.push(`\t/Size ${trailerObjId}`);
        f.push(`\t/Root ${firstPageLayoutId} 0 R`);
        f.push(`\t/Info ${metaDataObjId} 0 R`);
        f.push(`>>`);
        f.push(`startxref`);
        f.push(`0`);
        f.push(`%%EOF`);

        return f;
    }

}