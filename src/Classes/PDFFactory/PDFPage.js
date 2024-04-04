import {PDFContentObject} from "./PDFContentObject.js";
import {PDFPageResource} from "./PDFPageResource.js";
import {TPDF_Object_Types, TPDF_Page_Sizes, TPDF_Page_Layouts} from "../definitions.js";
import {PDFFontResource} from "./PDFFontResource.js";

export class PDFPage {

    _PAGE_ID = null;
    _PAGE_ROTATION = null;
    _TYPE = null;

    /** @var {PDFContentObject[]} */
    _CONTENT = [];
    /** @var {TPDF_Page_Sizes} */
    _PAGE_SIZE = null;
    /** @var {PDFPageResource} */
    _RESOURCE_CONTAINER = null;
    /** @var {TPDF_Page_Layouts} */
    _PAGE_LAYOUT_TYPE = null;
    _PAGE_LAYOUT = null;

    constructor(PageId) {
        this.SetId(PageId);

        this.SetPageRotation(0);
        this.SetPageSize(TPDF_Page_Sizes.A4);
        this.SetPageType(TPDF_Object_Types.PDF_OBJ_TYPE_PAGE);
        this.SetPageLayout(TPDF_Page_Layouts.SINGLE_PAGE);

        this.SetupResourceContainer();
    }

    //region Getters and Setters

    GetId(){
        return this._PAGE_ID;
    }

    SetId(value){
        this._PAGE_ID = value;
    }

    GetParentId(){
        return `${this.GetParent().GetDocumentId()} 0 R`;
    }

    GetPageRotation(){
        return this._PAGE_ROTATION;
    }

    SetPageRotation(value){
        this._PAGE_ROTATION = value;
    }

    GetParent(){
        return window.PDFDoc;
    }

    GetContent(){
        return this._CONTENT;
    }

    GetPageSize(){
        return this._PAGE_SIZE;
    }

    SetPageSize(value){
        this._PAGE_SIZE = value;
    }

    GetPageType(){
        return this._TYPE;
    }

    SetPageType(value){
        this._TYPE = value;
    }

    /**
     * @returns {PDFPageResource}
     **/
    GetResourceContainer(){
        return this._RESOURCE_CONTAINER;
    }

    SetResourceContainer(value){
        this._RESOURCE_CONTAINER = value;
    }

    GetPageLayout(){
        return this._PAGE_LAYOUT_TYPE;
    }

    SetPageLayout(value){
        this._PAGE_LAYOUT_TYPE = value;
    }

    GetPageLayoutObject(){
        return this._PAGE_LAYOUT;
    }

    //endregion Getters and Setters

    AddContent(content){
        let contentObject = new PDFContentObject(this.GetParent().GetNextAvailableObjectId());
        contentObject.SetContentString(content);
        this._CONTENT.push(contentObject);
    }

    SetupResourceContainer(){
        let ResourceContainer = new PDFPageResource();

        let FontResource = new PDFFontResource("Times-Italic");
        ResourceContainer.AddFontResource(FontResource);

        this.SetResourceContainer(ResourceContainer);
    }

    MakePageLayoutObject(){
        let id = this.GetParent().GetNextAvailableObjectId();
        this._PAGE_LAYOUT = {
            Id: id
            ,PageId: `${this.GetId()} 0 R`
            ,Layout: this.GetPageLayout()
            ,Type: TPDF_Object_Types.PDF_OBJ_TYPE_CATALOG
        };
    }

}