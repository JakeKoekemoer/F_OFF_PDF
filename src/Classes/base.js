import {PDFPage} from "./PDFFactory/PDFPage.js";
import {PDFDocument} from "./PDFFactory/PDFDocument.js";
import {FileBuilder} from "./PDFFactory/FileBuilder.js";

/**
 * This is the PDF document container.
 * Not the actual PDF!
 */
export class F_OFF_PDF{

    _PDF_DOC_VERSION = "1.1";
    _DOC = null;
    _LAST_PAGE_ID = 0;

    //region Getters and Setters

    GetDoc(){
        return window.PDFDoc;
    }

    SetDoc(value){
        window.PDFDoc = value;
    }

    GetLastPageId(){
        return this._LAST_PAGE_ID;
    }

    GetNextAvailablePageId(){
        return this.GetDoc().GetNextAvailableObjectId();
    }

    //endregion Getters and Setters

    constructor(title, author, producer){
        this.SetDoc(new PDFDocument());

        if(title) this.GetDoc().SetTitle(title);
        if(author) this.GetDoc().SetAuthor(author);

        this.GetDoc().SetProducer("F_OFF_PDF");
    }

    /**
     * Returns a <strong>new</strong> <u><strong>UNSAVED</strong></u> page object.
     * @returns {PDFPage}
     **/
    NewPage(){
        return new PDFPage(this.GetNextAvailablePageId());
    }

    AddPage(page){
        this.GetDoc().AddPage(page);
    }

    PrepPDFFile(){
        this.GetDoc().BuildPageListDictionary();
    }

    MakePDFFile(){
        this.PrepPDFFile();

        let pageListDictionary = this.GetDoc().GetPageListDictionary();
        let firstPageLayoutId = null;

        let f = [`%PDF-${this._PDF_DOC_VERSION}`];

        // Builds the Page List Dictionary
        f.push(`${pageListDictionary.Id} 0 obj`);
        f.push(`<< /Kids [${pageListDictionary.Kids}] /Type /${pageListDictionary.Type} /Count ${pageListDictionary.Count} >>`);
        f.push(`endobj`);

        // Builds the Objects then Page containing the Objects
        let pages = this.GetDoc().GetPages();

        for(let i = 0; i < pages.length; i++){
            /** @var {PDFPage} */
            let _page = pages[i];

            _page.MakePageLayoutObject();

            let fb = new FileBuilder(_page);
            let resourcePart = fb.GetResourcePart();
            let contentPart = fb.GetContentPart();
            let contentIdList = fb.GetContentIdList();

            let pageSize = _page.GetPageSize();

            // NB: Push the content objects first. Then link them to the page.
            f.push(...contentPart);

            f.push(`${_page.GetId()} 0 obj`);
            f.push(`<<`);
            f.push(`\t/Type /${_page.GetPageType()}`);
            f.push(`\t/Parent ${_page.GetParentId()}`);
            f.push(`\t/Rotate ${_page.GetPageRotation()}`);
            f.push(`\t/MediaBox [0 0 ${pageSize.x} ${pageSize.y}]`);

            f.push(`\t/Resources`);
            f.push(...resourcePart);

            f.push(`\t/Contents [${contentIdList}]`);

            f.push(`>>`);
            f.push(`endobj`);

            let LayoutObject = _page.GetPageLayoutObject();
            f.push(`${LayoutObject.Id} 0 obj`);
            f.push(`<< /PageLayout /${LayoutObject.Layout} /Pages ${LayoutObject.PageId} /Type /${LayoutObject.Type} >>`);
            f.push(`endobj`);

            if(firstPageLayoutId === null) firstPageLayoutId = `${LayoutObject.Id} 0 R`;
        }

        let metaDataObjId = this.GetNextAvailablePageId();
        let trailerObjId = this.GetNextAvailablePageId();
        f.push(`${metaDataObjId} 0 obj`);
        f.push(`<<`);
        f.push(`\t/Title (${this.GetDoc().GetTitle()})`);
        f.push(`\t/Author (${this.GetDoc().GetAuthor()})`);
        f.push(`\t/Producer (${this.GetDoc().GetProducer()})`);
        f.push(`\t/CreationDate (${this.GetDoc().GetCreationDateMetaData()})`);
        f.push(`\t/ModDate (${this.GetDoc().GetModDateMetaData()})`);
        f.push(`>>`);
        f.push(`endobj`);

        // Calculate byte offsets for each object
        let xrefOffsets = [0];
        for (let i = 0; i < f.length; i++) {
            xrefOffsets.push(xrefOffsets[i] + f[i].length + 1);
        }

        // Build the xref section
        f.push(`xref`);
        f.push(`0 ${trailerObjId}`);
        for (let i = 0; i < xrefOffsets.length; i++) {
            f.push(`${("0000000000" + xrefOffsets[i]).slice(-10)} 00000 n`);
        }

        // Build the trailer
        f.push(`trailer`);
        f.push(`<<`);
        f.push(`\t/Size ${trailerObjId}`);
        f.push(`\t/Root ${firstPageLayoutId} 0 R`);
        f.push(`\t/Info ${metaDataObjId} 0 R`);
        f.push(`>>`);
        f.push(`startxref`);
        f.push(`${xrefOffsets[xrefOffsets.length - 1]}`);
        f.push(`%%EOF`);

        let PDFFileContent = f.join("\n").replaceAll("\t", "  ");

        const pdfFile = "data:application/pdf;charset=utf-8," + PDFFileContent;
        const encodedUri = encodeURI(pdfFile);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.pdf");
        document.body.appendChild(link); // Required for Firefox
        link.click();
    }

}