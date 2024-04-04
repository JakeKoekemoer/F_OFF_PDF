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
        return this._DOC;
    }

    SetDoc(value){
        this._DOC = value;
    }

    GetLastPageId(){
        return this._LAST_PAGE_ID;
    }

    SetLastPageId(value){
        this._LAST_PAGE_ID = value;
    }

    GetNextAvailablePageId(){
        let id = this.GetLastPageId() + 1;
        this.SetLastPageId(id);
        return id;
    }

    //endregion Getters and Setters

    constructor(){
        this.SetDoc(new PDFDocument());
    }

    /**
     * Returns a <strong>new</strong> <u><strong>UNSAVED</strong></u> page object.
     * @returns {PDFPage}
     **/
    NewPage(){
        return new PDFPage(
            this.GetNextAvailablePageId()
            ,this._DOC
        );
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

        let f = [`%PDF-${this._PDF_DOC_VERSION}`];

        console.log(pageListDictionary);

        // Builds the Page List Dictionary
        f.push(`${pageListDictionary.Id} 0 obj`);
        f.push(`<< /Kids [${pageListDictionary.Kids} /Type ${pageListDictionary.Type} /Pages ${pageListDictionary.Count} >>`);
        f.push(`endobj`);

        // Builds the Objects then Page containing the Objects
        let pages = this.GetDoc().GetPages();

        for(let i = 0; i < pages.length; i++){
            /** @var {PDFPage} */
            let _page = pages[i];

            let fb = new FileBuilder(_page);
            let resourcePart = fb.GetResourcePart();
            let contentPart = fb.GetContentPart();
            let contentIdList = fb.GetContentIdList();

            // NB: Push the content objects first. Then link them to the page.
            f.push(...contentPart);

            f.push(`${_page.GetId()} 0 obj`);
            f.push(`<< /Type /Page`);
            f.push(`/Parent ${_page.GetParentId()}`);
            f.push(`/Rotate ${_page.GetPageRotation()}`);

            f.push(`/Resources`);
            f.push(...resourcePart);

            f.push(`/Content ${contentIdList}`);

            f.push(`>>`);
            f.push(`endobj`);
        }

        let metaDataObjId = this.GetNextAvailablePageId();
        let trailerObjId = this.GetNextAvailablePageId();
        f.push(`${metaDataObjId} 0 obj`);
        f.push(`<<`);
        f.push(`/Title (${this.GetDoc().GetTitle()})`);
        f.push(`/Author (${this.GetDoc().GetAuthor()})`);
        f.push(`/Producer (${this.GetDoc().GetProducer()})`);
        f.push(`/CreationDate (${this.GetDoc().GetCreationDate()})`);
        f.push(`/ModDate (${this.GetDoc().GetModDate()})`);
        f.push(`>>`);
        f.push(`endobj xref`);
        f.push(`0 ${trailerObjId}`);
        f.push(`trailer`);
        f.push(`<<`);
        f.push(`/Size ${this.GetLastPageId() + 1}`);
        f.push(`/Root ${pageListDictionary.Id} 0 R`);
        f.push(`/Info ${metaDataObjId} 0 R`);
        f.push(`>>`);

        let PDFFileContent = f.join("\n");

        const pdfFile = "data:application/pdf;charset=utf-8," + PDFFileContent;
        const encodedUri = encodeURI(pdfFile);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.pdf");
        document.body.appendChild(link); // Required for Firefox
        link.click();
    }

}