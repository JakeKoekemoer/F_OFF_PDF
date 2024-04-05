import html2canvas from "html2canvas";
import {DivRenderer} from "./DivRenderer.js";

export class HTMLRenderer{
    _RENDER_WINDOW = null;
    _CONTENT_TO_RENDER = null;

    // GetPageSizeInPixels(xPoints, yPoints) {
    //     // Convert points directly to pixels using the PPI value
    //     const xPixels = Math.round(xPoints * this.GetPPI());
    //     const yPixels = Math.round(yPoints * this.GetPPI());
    //
    //     return { width: xPixels, height: yPixels };
    // }

    constructor(_HTMLContent, pageSizeX, pageSizeY){
        // this.SetPPI(1); // GPT said that 72 is the most common PPI for most displays.

        // let pgSize = this.GetPageSizeInPixels(pageSizeX, pageSizeY);
        //
        // this.SetCanvasDocWidth(pgSize.width);
        // this.SetCanvasDocHeight(pgSize.height);

        // this.SetRenderContent(_HTMLContent);
    }

    // RenderDivContent(_HTML){
    //     let div = document.createElement("div");
    //     div.id = this.GetRendererDivId();
    //     div.style.position = "absolute";
    //     div.style.left = "5000px";
    //
    //     div.innerHTML = _HTML;
    //     this.SetRendererDiv(div);
    // }

    // RenderCanvas(){
    //     let divRenderer = new DivRenderer();
    //     divRenderer.SetContent(this.GetRenderContent());
    //     divRenderer.Build();
    //
    //     let _canvasId = this.GetRenderCanvasId();
    //     return new Promise((resolve, reject) => {
    //         try{
    //
    //             let canvasOptions = {
    //                 width: this.GetCanvasDocWidth(),
    //                 height: this.GetCanvasDocHeight(),
    //                 windowWidth: this.GetCanvasDocWidth(),
    //                 windowHeight: this.GetCanvasDocHeight(),
    //                 scale: 1
    //             }
    //
    //             html2canvas(divRenderer.GetRendererDiv(), canvasOptions).then(r => {
    //                 r.id = _canvasId;
    //                 this.SetRendererCanvas(r);
    //                 divRenderer.Destroy();
    //             }).then(() => {
    //                 resolve();
    //             });
    //         } catch(e){
    //             reject(e);
    //         }
    //     });
    // }

    //region Getters and Setters

    // SetRenderContent(_content){
    //     this._CONTENT_TO_RENDER = _content;
    // }
    //
    // GetRenderContent(){
    //     return this._CONTENT_TO_RENDER;
    // }

    // GetRendererDivId(){
    //     return this._RENDER_DIV_ID;
    // }

    // GetRenderCanvasId(){
    //     return this._RENDER_CANVAS_ID;
    // }
    //
    // GetRendererDiv(){
    //     return this._RENDERER_DIV;
    // }
    //
    // GetRendererCanvas(){
    //     return this._RENDERER_CANVAS;
    // }

    // GetPPI(){
    //     return this._PPI;
    // }

    // SetPPI(ppi){
    //     this._PPI = ppi;
    // }

    // SetCanvasDocWidth(width){
    //     this.CanvasDocWidth = width;
    // }
    //
    // SetCanvasDocHeight(height){
    //     this.CanvasDocHeight = height;
    // }
    //
    // SetRendererDiv(div){
    //     if(this.GetRendererDiv() !== null){
    //         this.GetRendererDiv().remove();
    //     }
    //
    //     this._RENDERER_DIV = div;
    //     document.body.appendChild(this.GetRendererDiv());
    // }

    // DeleteDivRenderer(){
    //     if(this.GetRendererDiv() !== null){
    //         this.GetRendererDiv().remove();
    //     }
    //     this._RENDERER_DIV = null;
    // }

    // SetRendererCanvas(canvas){
    //     if(this.GetRendererCanvas() !== null){
    //         this.DeleteCanvasRenderer();
    //     }
    //
    //     canvas.style.height = `${this.GetCanvasDocHeight()}px`;
    //     canvas.style.width = `${this.GetCanvasDocWidth()}px`;
    //
    //     this._RENDERER_CANVAS = canvas;
    //     this.GetRenderWindow().document.body.appendChild(canvas);
    // }

    GetRenderWindow(){
        let w = this._RENDER_WINDOW;

        if(w === null){
            debugger;
            let windowParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-5000,top=-5000`;
            w = window.open('about:blank', '', windowParams);

            if(w === null) throw new Error("Failed to open a new window for rendering.");

            this._RENDER_WINDOW = w;
        }

        return w;
    }

    // DeleteCanvasRenderer(){
    //     if(this.GetRendererCanvas() !== null){
    //         this.GetRendererCanvas().remove();
    //     }
    //     this._RENDERER_CANVAS = null;
    // }
    //
    // GetCanvasDocWidth(){
    //     return this.CanvasDocWidth;
    // }
    //
    // GetCanvasDocHeight(){
    //     return this.CanvasDocHeight;
    // }

    //endregion Getters and Setters


}