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
        let contentObj = null;
        if(typeof content === "string") {
            contentObj = new PDFContentObject();
            contentObj.SetContentString(content);
        } else if(content instanceof PDFContentObject) contentObj = content;

        if(contentObj !== null){
            contentObj = this.GetParent().AddContent(contentObj);
            this._CONTENT.push(contentObj);
        }

        // let contentObject = new PDFContentObject(this.GetParent().GetNextAvailableObjectId());
        // contentObject.SetContentString(content);
        // this._CONTENT.push(contentObject);
    }

    AddImage(binaryData, width, length){
        let imageObject = new PDFImageObject();
        imageObject.attachImage(binaryData, width, length);

        let imageObj = this.GetParent().AddContent(imageObject);

        let contentObj = new PDFContentObject();
        contentObj.SetContentCommand(`/I${imageObj.GetXObjectNumber()} Do`);
        contentObj = this.GetParent().AddContent(contentObj);

        this._CONTENT.push(contentObj);
    }

    GetPagePart(){
        let f = [];
        let contentIdList = this.GetContent().map((contentObject) => {
            if(contentObject instanceof PDFContentObject)
                return `${contentObject.GetId()} 0 R`;
        }).join(' ');

        let resourcePart = this.GetParent().ResourceContainer().GetFontResources();

        if(resourcePart.length > 0) resourcePart = resourcePart[0];
        else console.error("Failed to identify the font resource.", resourcePart);

        if(!resourcePart instanceof PDFFontResource)
            throw new Error("Failed to identify the font resource. Resource is not a font.");

        let pageObj = FileBuilder.PDFPageObject(this, resourcePart, contentIdList);

        f.push(...pageObj);

        return f;
    }

}