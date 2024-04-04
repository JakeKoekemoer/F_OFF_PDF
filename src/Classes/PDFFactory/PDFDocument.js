import {PDFPage} from "./PDFPage.js";
import {TPDF_Object_Types} from "../definitions.js";

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
        let Id = this.GetLastObjectId() + 1;
        this.SetLastObjectId(Id);
        return Id;
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

    GetCreationDateMetaData(){
        return `D:${this.GetCreationDate().getFullYear()}`;
    }

    SetCreationDate(value){
        this._CREATION_DATE = value;
    }

    GetModDate(){
        return this._MOD_DATE;
    }

    GetModDateMetaData(){
        let d = this.GetModDate();
        return `D:${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}Z`;
    }

    SetModDate(value){
        this._MOD_DATE = value;
    }

    //endregion Getters and Setters

    constructor() {
        this.SetLastObjectId(1); // We skip the first to leave space for the header object. :)
        this.SetCreationDate(new Date());
        this.SetModDate(new Date());
    }

    AddPage(page){
        if(page instanceof PDFPage)
            this._PAGES.push(page);
        else throw("You can only add instances of PDF Page to a PDF Document");
    }

    BuildPageListDictionary(){
        try{
            let pageCount = this._PAGES.length;
            let myId = 1; // The dictionary list will always be ID 1

            let pageObjectIdList = this.GetPages().map(page => {
                return `${page.GetId()} 0 R`;
            }).join(" ");

            this._PAGE_LIST_DICTIONARY = {
                Id:     myId,
                Kids:   pageObjectIdList,
                Type:   TPDF_Object_Types.PDF_OBJ_TYPE_PAGES,
                Count:  pageCount
            };

            this.IncrementLastObjectId();
        } catch(e){
            console.log(e);
            return false;
        }

        return true;
    }

}


