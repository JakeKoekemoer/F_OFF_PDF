class PDFContentObject {


// 4 0 obj The page content stream
// << >>
// stream Beginning ofstream
// 1. 0. 0. 1. 50. 700. cm Position at (50, 700)
// BT Begin text block
// /F0 36. Tf Select /F0 font at 36pt
// (Hello, World!) Tj Place the text string
// ET End text block
// endstream End ofstream
// endobj

    _CONTENT_STRING = null;
    _OBJECT_ID = null;

    constructor(Id){
        this.SetId(Id);
    }

    //region Getters and Setters

    GetId(){
        return this._OBJECT_ID;
    }

    SetId(value){
        this._OBJECT_ID = value;
    }

    GetContentString(){
        return this._CONTENT_STRING;
    }

    SetContentString(value){
        this._CONTENT_STRING = value;
    }

    //endregion Getters and Setters

    GetPDFStream(){
        return `1. 0.000000 0.000000 1. 50. 770. cm BT /F0 36. Tf (${this.GetContentString()}) Tj ET`;
    }
}