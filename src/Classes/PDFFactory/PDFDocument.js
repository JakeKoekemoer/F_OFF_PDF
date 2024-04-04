

class PDFDocument{


    _LAST_OBJECT_ID = 0;
    _PAGES = [];

    _PAGE_LIST_DICTIONARY = null;

    //region Getters and Setters

    GetLastObjectId(){
        return this._LAST_OBJECT_ID;
    }

    GetNextAvailableObjectId(){
        return this.GetLastObjectId() + 1;
    }

    SetLastObjectId(value){
        this._LAST_OBJECT_ID = value;
    }

    IncrementLastObjectId(){
        this._LAST_OBJECT_ID++;
    }

    GetPages(){
        return this._PAGES;
    }

    GetDocumentId(){
        return 1; // For now, we will assume there is always one document.
        // But maybe later when we want to merge PDFs then this might change.
    }

    GetPageListDictionary(){
        return this._PAGE_LIST_DICTIONARY;
    }

    //endregion Getters and Setters

    constructor() {
        this.SetLastObjectId(0);
    }

    AddPage(page){
        if(page instanceof PDFPage)
            this._PAGES.push(page);
        else throw("You can only add instances of PDF Page to a PDF Document");
    }

    BuildPageListDictionary(){
        try{
            let pageCount = this._PAGES.length;
            let myId = this.GetNextAvailableObjectId();

            let pageObjectIdList = this.GetPages().map(page => {
                return `${page.GetId()} 0 R`;
            }).join(" ");

            this._PAGE_LIST_DICTIONARY = {
                Id:     myId,
                Kids:   pageObjectIdList,
                Type:   TPDF_Page_Types.PDF_OBJ_TYPE_PAGES,
                Count:  pageCount
            };

            // 1 0 obj
            // << /Kids [2 0 R 3 0 R 13 0 R] /Type /Pages /Count 4 >>
            // endobj

            this.IncrementLastObjectId();
        } catch(e){
            console.log(e);
            return false;
        }

        return true;
    }

}


