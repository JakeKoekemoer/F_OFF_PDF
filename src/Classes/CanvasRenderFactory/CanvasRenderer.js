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
    }

    //endregion Getters and Setters

    Build(divRenderer){
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

                html2canvas(divRenderer.GetRendererDiv(), canvasOptions).then(canvasElement => {
                    canvasElement.id = _canvasId;
                    this.SetRendererCanvas(canvasElement);
                    divRenderer.Destroy();
                }).then(() => {
                    resolve(this);
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

    GetImageBinaryData(){
        let canvas = this.GetRendererCanvas();
        let dataURL = canvas.toDataURL('image/png');
        return atob(dataURL.split(',')[1]);
    }

}