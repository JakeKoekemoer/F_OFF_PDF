import {PDFPage} from "./PDFFactory/PDFPage.js";
import {PDFDocument} from "./PDFFactory/PDFDocument.js";
import {FileBuilder} from "./FileBuilder.js";
import {RendererFactory} from "./CanvasRenderFactory/RendererFactory";
import {TPDF_Page_Sizes} from "./definitions.js";
import {PDFFontResource} from "./PDFFactory/Resource/PDFFontResource";
import {PDFContentObject} from "./PDFFactory/Page/PDFContentObject";

/**
 * This is the PDF document container.
 * Not the actual PDF!
 */
export class F_OFF_PDF{

    _PDF_DOC_VERSION = "1.4";
    _LAST_PAGE_ID = 0;

    //region Getters and Setters

    GetDoc(){
        return window.PDFDoc;
    }

    SetDoc(value){
        window.PDFDoc = value;
    }

    GetNextAvailablePageId(){
        return this.GetDoc().GetNextAvailableObjectId();
    }

    //endregion Getters and Setters

    constructor(title, author, producer = "F_OFF_PDF"){
        this.SetDoc(new PDFDocument());

        if(title) this.GetDoc().SetTitle(title);
        if(author) this.GetDoc().SetAuthor(author);

        this.GetDoc().SetProducer(producer);
    }

    //region Setup Methods
    /**
     * Returns a <strong>new</strong> <u><strong>UNSAVED</strong></u> page object.
     * @returns {PDFPage}
     **/
    NewPage(){
        return new PDFPage(this.GetNextAvailablePageId());
    }

    NewContentObj(){
        return new PDFContentObject();
    }

    NewPageLayout(){
        return this.GetDoc().NewPageLayout();
    }

    AddPage(page){
        return this.GetDoc().AddPage(page);
    }

    AddFontResource(fontResource){
        this.GetDoc().AddFont(fontResource);
    }

    AddPageLayout(pageLayout){
        return this.GetDoc().AddPageLayout(pageLayout);
    }

    AddContent(contentObj){
        return this.GetDoc().AddContent(contentObj);
    }

    //endregion Setup Methods

    /**
     * @param {string} _html
     * @param {TPDF_Page_Sizes} _pdfPageSize
     **/
    async FromHTML(_html, _pdfPageSize = TPDF_Page_Sizes.A4) {
        return new Promise(async (resolve, reject) => {
            try{
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
                    pdfPageObj.SetPageSize(_pdfPageSize);

                    _pdfRenderer.PrepDivContainer(HtmlContent);
                    await _pdfRenderer.BuildCanvas(_pdfPageSize).then(async (canvasObj) => {

                        let binaryData = canvasObj.GetImageBinaryData();
                        pdfPageObj.AddImage(binaryData, _pdfPageSize.x, _pdfPageSize.y);
                        this.AddPage(pdfPageObj);
                    })
                }

                _pdfRenderer.Finish();

                resolve(this);
            } catch(e){
                reject(e);
            }
        });
    }

    async MakePDFFile() {
        /************************************************************************************
         *
         * GET THE DATA REQUIRED TO BUILD THE PDF FILE.
         *
         * ************************************************************************************/

        let doc = this.GetDoc();
        let pageListDictionaryObj = doc.GetPageListDictionary().Build();
        let pageLayoutsObj = doc.GetPageLayouts();
        let resourceContainer = doc.ResourceContainer();
        let contentObjects = doc.ContentObjects();

        let fontResourceObj = resourceContainer.GetFontResources();

        let pageListDictionary = FileBuilder.PDFPageListDictionaryObject(pageListDictionaryObj);
        let pageLayoutDictionary = FileBuilder.PDFPageLayoutDictionary(pageLayoutsObj);
        let resourceDictionary = FileBuilder.PDFResourceDictionary(resourceContainer);
        let fontResources = FileBuilder.PDFFontResourceObject(fontResourceObj);
        let contentObjectsList = await FileBuilder.GetContentPart(contentObjects);

        let metaDataObjId = this.GetNextAvailablePageId();
        let trailerObjId = this.GetNextAvailablePageId();

        let metaDataObj = FileBuilder.PDFMetaDataObj(metaDataObjId, doc);
        let trailer = FileBuilder.PDFTrailer(trailerObjId, metaDataObjId, pageLayoutsObj[0].GetId());

        let pages = this.GetDoc().GetPages();

        /************************************************************************************
         *
         * THIS PART BUILDS THE ACTUAL RAW PDF FILE CONTENT.
         *
         * ************************************************************************************/

        let f = [`%PDF-${this._PDF_DOC_VERSION}`];
        f.push(`%âãÏÓ`);

        f.push(...pageListDictionary);
        f.push(...pageLayoutDictionary);
        f.push(...contentObjectsList);
        f.push(...fontResources);

        for (let i = 0; i < pages.length; i++) {
            /** @var {PDFPage} */
            let _page = pages[i];

            //_page.MakePageLayoutObject();

            // let contentPartObj = await _page.GetContentPart();
            let pagePart = _page.GetPagePart();

            // NB: Push the content objects first. Then link them to the page.
            // f.push(...contentPartObj);
            f.push(...pagePart);
        }

        f.push(...resourceDictionary);

        f.push(...metaDataObj);
        f.push(...trailer);

        /************************************************************************************
         *
         * DOWNLOAD THE PDF IN THE BROWSER.
         *
         * ************************************************************************************/

        this.downloadPDF(f);
    }

    downloadPDF(pdfContent) {
        // Convert the PDF content to a Blob
        const pdfBlob = new Blob([pdfContent.join("\n")], { type: 'application/pdf' });

        // Create an object URL for the blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create a link and trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = 'generated-pdf.pdf'; // Specify the name of the file to be downloaded
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Cleanup: revoke the object URL to free up resources
        URL.revokeObjectURL(pdfUrl);
    }

}