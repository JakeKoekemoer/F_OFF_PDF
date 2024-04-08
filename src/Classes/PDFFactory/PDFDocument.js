import {PDFPage} from "./PDFPage.js";
import {PDFPageListDictionary} from "./PDFPageListDictionary.js";
import {PDFFontResource} from "./Resource/PDFFontResource.js";
import {PDFResourceContainer} from "./Resource/PDFResourceContainer.js";
import {PDFPageLayout} from "./PDFPageLayout";
import {PDFImageObject} from "./Page/PDFImageObject";

export class PDFDocument{


    _LAST_OBJECT_ID = 0;
    _LAST_X_OBJECT_ID = 0;
    /** @var {PDFPage[]} */
    _PAGES = [];
    /** @var {PDFResourceContainer} */
    _RESOURCE_CONTAINER = null;
    _OBJECTS = [];
    /** @var {PDFPageLayout[]} */
    _PAGE_LAYOUTS = [];

    _PAGE_LIST_DICTIONARY = null;

    // META DATA
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

    /**
     * @return {PDFResourceContainer}
     **/
    ResourceContainer(){
        return this._RESOURCE_CONTAINER;
    }

    ContentObjects(){
        return this._OBJECTS;
    }

    GetPageLayouts(){
        return this._PAGE_LAYOUTS;
    }

    GetLastXObjectNumber(){
        return this._LAST_X_OBJECT_ID;
    }

    SetLastXObjectNumber(value){
        this._LAST_X_OBJECT_ID = value;
    }

    GetNextAvailableXObjectNumber(){
        let Id = this.GetLastXObjectNumber() + 1;
        this.SetLastXObjectNumber(Id);
        return Id;
    }

    //endregion Getters and Setters

    constructor() {
        this.SetLastObjectId(0);
        this.SetCreationDate(new Date());
        this.SetModDate(new Date());

        this._PAGE_LIST_DICTIONARY = new PDFPageListDictionary(this.GetNextAvailableObjectId());
        this._RESOURCE_CONTAINER = new PDFResourceContainer(this.GetNextAvailableObjectId());

        this.AddDefaultFont();
        this.AddDefaultPageLayout();
    }

    //region Maker Methods
    AddPage(page){
        if(page instanceof PDFPage) {
            this._PAGES.push(page);
            this._PAGE_LIST_DICTIONARY.AddPage(page);

            return page;
        }
        else throw("You can only add instances of PDF Page to a PDF Document");
    }

    AddFont(font){
        font.SetId(this.GetNextAvailableObjectId());
        this.ResourceContainer().AddFontResource(font);
        return font;
    }

    AddPageLayout(pageLayout){
        pageLayout.SetId(this.GetNextAvailableObjectId());
        pageLayout.SetPageListDictionary(this.GetPageListDictionary());
        this._PAGE_LAYOUTS.push(pageLayout);
        return pageLayout;
    }

    AddContent(contentObj){
        contentObj.SetId(this.GetNextAvailableObjectId());
        this._OBJECTS.push(contentObj);

        if(contentObj instanceof PDFImageObject) {
            contentObj.SetXObjectNumber(this.GetNextAvailableXObjectNumber());
            this.ResourceContainer().AddXObjectResource(contentObj);
        }

        return contentObj;
    }

    //endregion Maker Methods

    //region Load Defaults

    AddDefaultFont(){
        let defaultFontResource = new PDFFontResource("Helvetica");
        this.AddFont(defaultFontResource);
    }

    AddDefaultPageLayout(){
        let defaultPageLayout = new PDFPageLayout();
        this.AddPageLayout(defaultPageLayout);
    }

    //endregion Load Defaults

    //region Methods


    //endregion Methods

}