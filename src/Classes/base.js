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
        this.prepPDFFile();

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

            let file = f.join("\n");

        }


    }

}