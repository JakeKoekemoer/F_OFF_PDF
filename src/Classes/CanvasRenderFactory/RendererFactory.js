import {DivRenderer} from "./DivRenderer.js";
import {CanvasRenderer} from "./CanvasRenderer.js";
import {TPDF_Page_Sizes} from "../definitions.js";

export class RendererFactory {
    _RENDER_WINDOW = null;
    _PREPPED_DIV = null;
    _PREPPED_CANVAS = null;

    static DefaultNewWindowParams = {
        scrollBars: false
        ,resizable: false
        ,status: false
        ,location: false
        ,toolbar: false
        ,menubar: false
        ,width: 0
        ,height: 0
        ,left: 0
        ,top: 0
    }

    constructor(
        {
            scrollBars = false
            ,resizable = false
            ,status = false
            ,location = false
            ,toolbar = false
            ,menubar = false
            ,width = 0
            ,height = 0
            ,left = 0
            ,top = 0
        } = RendererFactory.DefaultNewWindowParams){

        scrollBars = scrollBars ? 'yes' : 'no';
        resizable = resizable ? 'yes' : 'no';
        status = status ? 'yes' : 'no';
        location = location ? 'yes' : 'no';
        toolbar = toolbar ? 'yes' : 'no';
        menubar = menubar ? 'yes' : 'no';

        let windowParams = `scrollbars=${scrollBars}` +
            `, resizable=${resizable}` +
            `, status=${status}` +
            `, location=${location}` +
            `, toolbar=${toolbar}` +
            `, menubar=${menubar}` +
            `, width=${width}` +
            `, height=${height}` +
            `, left=${left}` +
            `, top=${top}`;

        let w = window.open('about:blank', '', windowParams);
        if(w === null) throw new Error("Failed to open a new window for rendering.");

        this.SetRenderWindow(w);
        this.DisplayInitialHTML();

        return this;
    }

    //region Getters and Setters

    GetRenderWindow(){
        return this._RENDER_WINDOW;
    }

    SetRenderWindow(value){
        this._RENDER_WINDOW = value;
    }

    GetPreppedDiv(){
        return this._PREPPED_DIV;
    }

    SetPreppedDiv(value){
        this._PREPPED_DIV = value;
    }

    GetRendererCanvas(){
        return this._PREPPED_CANVAS;
    }

    SetRendererCanvas(value){
        this._PREPPED_CANVAS = value;
    }

    //endregion Getters and Setters

    DisplayInitialHTML(){
        this.GetRenderWindow().document.write("<html lang='EN'><head><title>Rendering...</title></head><body>Please wait. Rendering your PDF.</body></html>");
    }

    PrepDivContainer(_html){
        let divRenderer = new DivRenderer();
        divRenderer.SetContent(_html);
        divRenderer.Build();

        this.SetPreppedDiv(divRenderer);

        // todo: Bernie, please make this nicer.
        this.GetRenderWindow().document.body.innerHTML = "";
        this.GetRenderWindow().document.body.appendChild(divRenderer.GetRendererDiv());

        // () => (w = this.GetRenderWindow()){
        //     w.document.body.innerHTML = "";
        //     w.document.body.appendChild(divRenderer.GetRendererDiv());
        // }

        return this;
    }

    BuildCanvas(_pdfPageSize = TPDF_Page_Sizes.A4){
        let div = this.GetPreppedDiv();
        let canvasRenderer = new CanvasRenderer();

        canvasRenderer.SetCanvasDocHeight(_pdfPageSize.y);
        canvasRenderer.SetCanvasDocWidth(_pdfPageSize.x);

        return new Promise((resolve, reject) => {
            canvasRenderer.Build(div).then((canvas) => {
                this.GetRenderWindow().document.body.appendChild(canvas.GetRendererCanvas());
                this.SetRendererCanvas(canvas);

                resolve(canvasRenderer);
            }).catch((e) => {
                reject(e);
            });
        });
    }
}