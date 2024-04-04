/**
 * This is the PDF document container.
 * Not the actual PDF!
 */
class F_OFF_PDF{

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
        return this.GetLastPageId() + 1;
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

    prepPDFFile(){
        this.GetDoc().BuildPageListDictionary();
    }

    makePDFFile(){
        let pageListDictionary = this.GetDoc().GetPageListDictionary();

        let f = [`%PDF-${this._PDF_DOC_VERSION}`];

        // Builds the Page List Dictionary
        f.push(`${pageListDictionary.GetId()} 0 obj`);
        f.push(`<< /Kids [${pageListDictionary.Kids} /Type ${pageListDictionary.Type} /Pages ${pageListDictionary.Count} >>`);
        f.push(`endobj`);

        // Builds the Objects then Page containing the Objects
        let pages = this.GetDoc().GetPages();

        for(let i = 0; i < pages.length; i++){
            /** @var {PDFPage} */
            let page = pages[i];

            // This part adds the objects to the PDF File
            for(let j = 0; j < page.GetContent().length; j++){
                /** @var {PDFContentObject} */
                let contentObject = page.GetContent()[j];

                f.push(`${contentObject.GetId()} 0 obj`);
                f.push(`<< >>`);
                f.push(`stream`);
                f.push(`${contentObject.GetPDFStream()}`);
                f.push(`endstream`);
                f.push(`endobj`);
            }

            // This part adds the page to the PDF File

            f.push(`${page.GetId()} 0 obj`);
            f.push(`<< /Type /Page`);
            f.push(`/Parent ${page.GetParentId()}`);

            f.push(`>>`);

        }


    }

}