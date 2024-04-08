import {PDFContentObject} from "./PDFFactory/Page/PDFContentObject";
import {PDFImageObject} from "./PDFFactory/Page/PDFImageObject";

export class FileBuilder{
    static PDFPageListDictionaryObject(pageListDictionary){
        let f = [];

        f.push(`${pageListDictionary.Id} 0 obj`);
        f.push(`<< /Kids [${pageListDictionary.Kids}] /Type /${pageListDictionary.Type} /Count ${pageListDictionary.Count} >>`);
        f.push(`endobj`);

        return f;
    }

    /**
     * @param {PDFFontResource[]} fontResource
     **/
    static PDFFontResourceObject(fontResource){
        let f = [];

        for(let i = 0; i < fontResource.length; i++){
            let font = fontResource[i];

            f.push(`${font.GetId()} 0 obj`);
            f.push(`<<`);
            f.push(`/Type /${font.GetType()}`);
            f.push(`/BaseFont /${font.GetBaseFont()}`);
            f.push(`/Subtype /${font.GetSubType()}`);
            f.push(`/Encoding /${font.GetEncoding()}`);
            f.push(`/FirstChar ${font.GetFirstChar()}`);
            f.push(`/LastChar ${font.GetLastChar()}`);
            f.push(`>>`);
            f.push(`endobj`);
        }

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
     * @param resourcePart {PDFFontResource}
     * @param contentIdList {String}
     */
    static PDFPageObject(page, resourcePart, contentIdList){
        let f = [];

        /** @var {TPDF_Page_Sizes} pageSize */
        let pageSize = page.GetPageSize();


        f.push(`${page.GetId()} 0 obj`);
        f.push(`<<`);
        f.push(`/Type /${page.GetPageType()}`);
        f.push(`/Parent ${page.GetParentId()}`);
        f.push(`/Rotate ${page.GetPageRotation()}`);
        f.push(`/MediaBox [0 0 ${pageSize.x} ${pageSize.y}]`);

        f.push(`/Resources ${resourcePart.GetId()} 0 R`);

        f.push(`/Contents ${contentIdList}`);

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
        f.push(`/Title (${doc.GetTitle()})`);
        f.push(`/Author (${doc.GetAuthor()})`);
        f.push(`/Producer (${doc.GetProducer()})`);
        f.push(`/CreationDate (${doc.GetCreationDateMetaData()})`);
        f.push(`/ModDate (${doc.GetModDateMetaData()})`);
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
        f.push(`/Size ${trailerObjId}`);
        f.push(`/Root ${firstPageLayoutId} 0 R`);
        f.push(`/Info ${metaDataObjId} 0 R`);
        f.push(`>>`);
        f.push(`startxref`);
        f.push(`0`);
        f.push(`%%EOF`);

        return f;
    }

    /**
     * @param {PDFImageObject} imageObject
     **/
    static async PDFImageObj(imageObject) {
        let f = [];

        let base64ImageData = await imageObject.GetImageData();
        let binaryData = atob(base64ImageData);
        let binaryLength = binaryData.length;

        let escapes = {
            '\(': '\\(',
            '\)': '\\)',
            '\<': '\\<',
            '\>': '\\>',
            '\[': '\\[',
            '\]': '\\]',
            '\{': '\\{',
            '\}': '\\}',
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t',
            '\%': '\\%',
        }

        let escapedBinaryData = '';
        for (let i = 0; i < binaryLength; i++) {
            let char = binaryData.charAt(i);
            escapedBinaryData += escapes[char] || char;
        }
        let escapedBinaryLength = binaryData.length;

        f.push(`${imageObject.GetId()} 0 obj`);
        f.push(`<<`);
        f.push(`/Length ${escapedBinaryLength}`);
        f.push(`/Type /XObject`);
        f.push(`/Subtype /Image`);
        f.push(`/Width ${imageObject.GetImageSizeX()}`);
        f.push(`/Height ${imageObject.GetImageSizeY()}`);
        f.push(`/ColorSpace /DeviceRGB`);
        f.push(`/BitsPerComponent 8`);
        f.push(`/Filter /DCTDecode`);
        f.push(`>>`);
        f.push(`stream`);
        f.push(escapedBinaryData);
        f.push(`endstream`);
        f.push(`endobj`);

        return f;
    }

    /**
     * @param {PDFResourceContainer} ResourceContainer
     **/
    static PDFResourceDictionary(ResourceContainer){

        let _FONTS = ResourceContainer.GetFontResources();
        let _XOBJECTS = ResourceContainer.GetXObjectResources();

        let f = [];

        f.push(`${ResourceContainer.GetId()} 0 obj`);
        f.push(`<<`);
        f.push(`/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]`);

        f.push(`/Font <<`);
        for (let i = 0; i < _FONTS.length; i++) {
            let fontObj = _FONTS[i];
            f.push(`/F${fontObj.GetPDFFontName()} ${fontObj.GetId()} 0 R`);
        }
        f.push(`>>`);

        f.push(`/XObject <<`);
        for (let i = 0; i < _XOBJECTS.length; i++) {
            let xObject = _XOBJECTS[i];
            f.push(`/I${i} ${xObject.GetId()} 0 R`);
        }
        f.push(`>>`);

        f.push(`>>`);
        f.push(`endobj`);

        return f;
    }


    /**
     * @param {PDFPageLayout[]} pageLayoutsList
     **/
    static PDFPageLayoutDictionary(pageLayoutsList) {

        let f = [];

        for (let i = 0; i < pageLayoutsList.length; i++) {
            let LayoutObject = pageLayoutsList[i];

            f.push(`${LayoutObject.GetId()} 0 obj`);
            f.push(`<< /PageLayout /${LayoutObject.GetLayout()} /Pages ${LayoutObject.GetPageListDictionary().GetId()} 0 R /Type /${LayoutObject.GetType()} >>`);
            f.push(`endobj`);
        }

        return f;

    }

    /** @param {PDFContentObject[]|PDFImageObject[]} contentParts */
    static async GetContentPart(contentParts) {
        let f = [];

        for (let j = 0; j < contentParts.length; j++) {
            let contentPartObj = contentParts[j];
            let obj = null;

            if (contentPartObj instanceof PDFContentObject) obj = FileBuilder.PDFContentObj(contentPartObj);
            else if (contentPartObj instanceof PDFImageObject) obj = await FileBuilder.PDFImageObj(contentPartObj);

            if (obj !== null) f.push(...obj);
        }

        return f;
    }
}