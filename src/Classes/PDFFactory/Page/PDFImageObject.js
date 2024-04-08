import {TPDF_Object_Types} from "../../definitions.js";

export class PDFImageObject{
    _TYPE = TPDF_Object_Types.PDF_OBJ_TYPE_X_OBJECT;
    _SUB_TYPE = "Image";
    _ID = null;
    _IMAGE_DATA = null;
    _IMAGE_SIZE_X = null;
    _IMAGE_SIZE_Y = null;
    _X_OBJECT_NUMBER = null;

    constructor(){
    }

    attachImage(binaryData, xSize, ySize){
        this._IMAGE_DATA = binaryData;
        this._IMAGE_SIZE_X = xSize;
        this._IMAGE_SIZE_Y = ySize;
    }

    //region Getters and Setters

    GetId(){
        return this._ID;
    }

    SetId(value){
        this._ID = value;
    }

    GetImageData(){
        return this._IMAGE_DATA;
    }

    GetSubType(){
        return this._SUB_TYPE;
    }

    GetType(){
        return this._TYPE;
    }

    GetImageSizeX(){
        return this._IMAGE_SIZE_X;
    }

    GetImageSizeY(){
        return this._IMAGE_SIZE_Y;
    }

    SetXObjectNumber(value){
        this._X_OBJECT_NUMBER = value;
    }

    GetXObjectNumber(){
        return this._X_OBJECT_NUMBER;
    }

    //endregion Getters and Setters
}