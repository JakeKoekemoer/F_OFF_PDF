import {PDFPage} from "./PDFFactory/PDFPage.js";
import {PDFDocument} from "./PDFFactory/PDFDocument.js";
import {FileBuilder} from "./PDFFactory/FileBuilder.js";
import {RendererFactory} from "./CanvasRenderFactory/RendererFactory";
import {TPDF_Page_Sizes} from "./definitions";

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

    async FromHTML(_html, _pdfPageSize = TPDF_Page_Sizes.A4) {
        if (_html.indexOf("pdfPage") === -1) _html = `<div class="pdfPage">${_html}</div>`;

        let pageContainer = document.createElement("div");
        pageContainer.id = "dvPDFPagesContainer";
        pageContainer.innerHTML = _html;

        let pages = pageContainer.querySelectorAll("div.pdfPage");
        let _pdfRenderer = new RendererFactory();

        for (let i = 0; i < pages.length; i++) {
            let HtmlPage = pages[i];
            let HtmlContent = HtmlPage.innerHTML;
            let pdfPageObj = this.NewPage();

            console.log("Page ",i);

            _pdfRenderer.PrepDivContainer(HtmlContent);
            await _pdfRenderer.BuildCanvas(_pdfPageSize).then((canvasObj) => {
                let binaryData = canvasObj.GetImageBinaryData();
                let base64 = btoa(binaryData);

                pdfPageObj.AddContent(base64);
                //pdfPageObj.AddImage(base64); // eventually this will be the image object
            })


            pdfPageObj.SetPageSize(_pdfPageSize);
        }

        return this;
    }

    MakePDFFile(){
        this.PrepPDFFile();

        let pageListDictionary = FileBuilder.PDFPageListDictionaryObject(this.GetDoc().GetPageListDictionary());
        let firstPageLayoutId = null;

        let f = [`%PDF-${this._PDF_DOC_VERSION}`];

        f.push(...pageListDictionary);

        // Builds the Objects then Page containing the Objects
        let pages = this.GetDoc().GetPages();

        for(let i = 0; i < pages.length; i++){
            /** @var {PDFPage} */
            let _page = pages[i];

            _page.MakePageLayoutObject();

            let contentPartObj = _page.GetContentPart();
            let pagePart = _page.GetPagePart();

            // NB: Push the content objects first. Then link them to the page.
            f.push(...contentPartObj);
            f.push(...pagePart);

            if(firstPageLayoutId === null){
                let LayoutObject = _page.GetPageLayoutObject();
                f.push(`${LayoutObject.Id} 0 obj`);
                f.push(`<< /PageLayout /${LayoutObject.Layout} /Pages ${this.GetDoc().GetDocumentId()} 0 R /Type /${LayoutObject.Type} >>`);
                f.push(`endobj`);

                firstPageLayoutId = LayoutObject.Id;
            }
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

        // Build the xref section
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