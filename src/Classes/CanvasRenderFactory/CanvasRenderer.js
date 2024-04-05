import {DivRenderer} from "./DivRenderer";
import html2canvas from "html2canvas";

export class CanvasRenderer{

    _RENDER_CANVAS_ID = `DV_F_OFF_PDF_RENDER`;
    _RENDERER_CANVAS = null;
    _PPI = 0;
    CanvasDocWidth = 0;
    CanvasDocHeight = 0;

    _CONTENT_TO_RENDER = null;

    //region Getters and Setters

    GetRenderCanvasId(){
        return this._RENDER_CANVAS_ID;
    }

    GetRendererCanvas(){
        return this._RENDERER_CANVAS;
    }

    GetPPI(){
        return this._PPI;
    }

    GetCanvasDocWidth(){
        return this.CanvasDocWidth;
    }

    GetCanvasDocHeight(){
        return this.CanvasDocHeight;
    }

    SetPPI(ppi){
        this._PPI = ppi;
    }

    SetCanvasDocWidth(width){
        this.CanvasDocWidth = width;
    }

    SetCanvasDocHeight(height){
        this.CanvasDocHeight = height;
    }

    SetRendererCanvas(canvas){
        canvas.style.height = `${this.GetCanvasDocHeight()}px`;
        canvas.style.width = `${this.GetCanvasDocWidth()}px`;

        this._RENDERER_CANVAS = canvas;
        // this.GetRenderWindow().document.body.appendChild(canvas);
    }

    SetRenderContent(_content){
        this._CONTENT_TO_RENDER = _content;
    }

    GetRenderContent(){
        return this._CONTENT_TO_RENDER;
    }

    //endregion Getters and Setters

    Build(){
        let divRenderer = new DivRenderer();
        divRenderer.SetContent(this.GetRenderContent());
        divRenderer.Build();

        let _canvasId = this.GetRenderCanvasId();
        return new Promise((resolve, reject) => {
            try{

                let canvasOptions = {
                    width: this.GetCanvasDocWidth(),
                    height: this.GetCanvasDocHeight(),
                    windowWidth: this.GetCanvasDocWidth(),
                    windowHeight: this.GetCanvasDocHeight(),
                    scale: 1
                }

                html2canvas(divRenderer.GetRendererDiv(), canvasOptions).then(r => {
                    r.id = _canvasId;
                    this.SetRendererCanvas(r);
                    divRenderer.Destroy();
                }).then(() => {
                    resolve();
                });
            } catch(e){
                reject(e);
            }
        });
    }

    Destroy(){
        if(this.GetRendererCanvas() !== null){
            this.GetRendererCanvas().remove();
        }
        this._RENDERER_CANVAS = null;
    }

}