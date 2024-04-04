

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

    //endregion Getters and Setters

    BuildPageListDictionary(){
        try{
            let pageCount = this._PAGES.length;
            let myId = this.GetNextAvailableObjectId();

            let pageObjectIdList = this.GetPages().map(page => {
                return `${page.GetId()} 0 R`;
            }).join(" ");

            this._PAGE_LIST_DICTIONARY = {
                Id: myId,
                Kids: pageObjectIdList,
                Type: TPDF_Page_Types.PDF_OBJ_TYPE_PAGES,
                Count: pageCount
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

    AddObject(){
        /*
        1 0 obj
<< /Kids [2 0 R 3 0 R 13 0 R] /Type /Pages /Count 4 >>
endobj
        */
    }

}


