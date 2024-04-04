import {PDFPage} from "./PDFPage.js";
import {TPDF_Page_Types} from "../definitions.js";

export class PDFDocument{


    _LAST_OBJECT_ID = 0;
    _PAGES = [];

    _PAGE_LIST_DICTIONARY = null;

    _TITLE = null;
    _AUTHOR = null;
    _PRODUCER = null;
    _CREATION_DATE = null;
    _MOD_DATE = null;

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

    GetTitle(){
        return this._TITLE;
    }

    SetTitle(value){
        this._TITLE = value;
    }

    GetAuthor(){
        return this._AUTHOR;
    }

    SetAuthor(value){
        this._AUTHOR = value;
    }

    GetProducer(){
        return this._PRODUCER;
    }

    SetProducer(value){
        this._PRODUCER = value;
    }

    GetCreationDate(){
        return this._CREATION_DATE;
    }

    SetCreationDate(value){
        this._CREATION_DATE = value;
    }

    GetModDate(){
        return this._MOD_DATE;
    }

    SetModDate(value){
        this._MOD_DATE = value;
    }

    //endregion Getters and Setters

    SetCreatedDateToNow(){
        this.SetCreationDate(new Date());
    }

    SetModifiedDateToNow(){
        this.SetModDate(new Date());
    }

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


