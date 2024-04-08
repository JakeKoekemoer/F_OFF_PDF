import {PDFContentObject} from "./Page/PDFContentObject.js";
import {TPDF_Object_Types, TPDF_Page_Sizes} from "../definitions.js";
import {PDFFontResource} from "./Resource/PDFFontResource.js";
import {FileBuilder} from "../FileBuilder.js";
import {PDFImageObject} from "./Page/PDFImageObject.js";

export class PDFPage {

    _PAGE_ID = null;
    _PAGE_ROTATION = null;
    _TYPE = TPDF_Object_Types.PDF_OBJ_TYPE_PAGE;

    /** @var {PDFContentObject[]|PDFImageObject[]} */
    _CONTENT = [];
    /** @var {TPDF_Page_Sizes} */
    _PAGE_SIZE = null;
    /** @var {PDFResourceContainer} */
    _RESOURCE_CONTAINER = null;

    constructor(PageId) {
        this.SetId(PageId);

        this.SetPageRotation(0);
        this.SetPageSize(TPDF_Page_Sizes.A4);
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

    //endregion Getters and Setters

    AddContent(content){
        let contentObject = new PDFContentObject(this.GetParent().GetNextAvailableObjectId());
        contentObject.SetContentString(content);
        this._CONTENT.push(contentObject);
    }

    AddImage(binaryData, width, length){
        let imageObject = new PDFImageObject(this.GetParent().GetNextAvailableObjectId());
        imageObject.attachImage(binaryData, width, length);
        this._CONTENT.push(imageObject);
    }

    // SetupResourceContainer(){
    //     let ResourceContainer = new PDFPageResource();
    //
    //     let FontResource = new PDFFontResource("Times-Italic");
    //     ResourceContainer.AddFontResource(FontResource);
    //
    //     this.SetResourceContainer(ResourceContainer);
    // }

    // MakePageLayoutObject(){
    //     let id = this.GetParent().GetNextAvailableObjectId();
    //     this._PAGE_LAYOUT = {
    //         Id: id
    //         ,PageId: `${this.GetId()} 0 R`
    //         ,Layout: this.GetPageLayout()
    //         ,Type: TPDF_Object_Types.PDF_OBJ_TYPE_CATALOG
    //     };
    // }

    async GetContentPart() {
        let f = [];

        /** @var {PDFContentObject[]|PDFImageObject[]} */
        let contentParts = this.GetContent();

        for (let j = 0; j < contentParts.length; j++) {
            let contentPartObj = contentParts[j];
            let obj = null;

            if (contentPartObj instanceof PDFContentObject) obj = FileBuilder.PDFContentObj(contentPartObj);
            else if (contentPartObj instanceof PDFImageObject) obj = await FileBuilder.PDFImageObj(contentPartObj);

            if (obj !== null) f.push(...obj);
        }

        return f;
    }

    GetPagePart(){
        let f = [];
        let contentIdList = this.GetContent().map((contentObject) => {
            return `${contentObject.GetId()} 0 R`;
        }).join(' ');

        let resourcePart = this.GetParent().ResourceContainer().GetFontResources();

        if(resourcePart.length > 1) resourcePart = resourcePart[0];
        else {
            this.GetParent().AddDefaultFont();
            resourcePart = this.GetParent().ResourceContainer().GetFontResources();

            if(resourcePart.length === 0) throw new Error("Failed to identify the font resource.");
            else resourcePart = resourcePart[0];
        }

        if(!resourcePart instanceof PDFFontResource) throw new Error("Failed to identify the font resource. Resource is not a font.");

        let pageObj = FileBuilder.PDFPageObject(this, resourcePart, contentIdList);

        f.push(...pageObj);

        return f;
    }

}