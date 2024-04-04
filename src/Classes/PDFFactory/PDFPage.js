import {PDFContentObject} from "./PDFContentObject.js";
import {PDFPageResource} from "./PDFPageResource.js";
import {TPDF_Page_Types, TPDF_Pager_Sizes} from "../definitions.js";
import {PDFFontResource} from "./PDFFontResource.js";

export class PDFPage {

    _PAGE_ID = null;
    _RESOURCE_ID = null;
    _PARENT = null;
    _PAGE_ROTATION = 0;
    /** @var {PDFContentObject[]} */
    _CONTENT = [];

    constructor(PageId, Parent) {
        this.SetId(PageId);
        this.SetParent(Parent);

        this.SetResourceId(0);
    }

    //region Getters and Setters

    GetId(){
        return this._PAGE_ID;
    }

    SetId(value){
        this._PAGE_ID = value;
    }

    SetParent(value){
        this._PARENT = value;
    }

    GetParentId(){
        return `${this._PARENT.GetDocumentId()} 0 R`;
    }

    GetPageRotation(){
        return this._PAGE_ROTATION;
    }

    SetPageRotation(value){
        this._PAGE_ROTATION = value;
    }

    GetResourceId(){
        return this._RESOURCE_ID;
    }

    SetResourceId(value){
        this._RESOURCE_ID = value;
    }

    GetNextAvailableResourceId(){
        return this.GetResourceId() + 1;
    }

    GetParent(){
        return this._PARENT;
    }

    GetContent(){
        return this._CONTENT;
    }

    //endregion Getters and Setters

    AddContent(content){
        let contentObject = new PDFContentObject(this.GetParent().GetNextAvailableObjectId());
        contentObject.SetContentString(content);
        this._CONTENT.push(contentObject);
    }

    GetPageAsObject(){
    //     2 0 obj
    //     << /Type /Page It's a page
    //     /MediaBox [0 0 612 792] Paper size is US Letter Portrait (612 points by 792 points)
    // /Resources 3 0 R Reference to resources at object 3
    //     /Parent 1 0 R Reference back up to parent page list
    //     /Contents [4 0 R] Graphical content is in object4
    //     >>
    //     endobj

        let FontResource = new PDFFontResource(this.GetNextAvailableResourceId(), "Times-Italic");
        let ResourceContainer = new PDFPageResource();
        ResourceContainer.AddFontResource(FontResource);

        return {
            Id:         this.GetId(),
            Parent:     this.GetParentId(),
            Rotate:     this.GetPageRotation(),
            Type:       TPDF_Page_Types.PDF_OBJ_TYPE_PAGE,
            MediaBox:   TPDF_Pager_Sizes.A4,
            Resources:  ResourceContainer,
            Content:    this.GetContent()
        }
    }

}