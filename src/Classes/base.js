/**
 * This is the PDF document container.
 * Not the actual PDF!
 */
class F_OFF_PDF{

    _PDF_DOC_VERSION = "1.1";
    _DOC = null;

    //region Getters and Setters

    GetDoc(){
        return this._DOC;
    }

    SetDoc(value){
        this._DOC = value;
    }

    //endregion Getters and Setters

    constructor(){
        this.SetDoc(new PDFDocument());
    }

    getPDFContent(){
        this.GetDoc().BuildPageListDictionary();

        let content = `%PDF-${this._PDF_DOC_VERSION}\n`;

        this.pages.forEach(page => {
            //content += page.getPDFContent();

        });




    }

}