export class DivRenderer{
    _RENDER_DIV_ID = `DV_F_OFF_PDF_RENDER`;
    _RENDERER_DIV = null;

    _CONTENT = null;

    //region Getters and Setters

    GetRendererDivId(){
        return this._RENDER_DIV_ID;
    }

    GetRendererDiv(){
        return this._RENDERER_DIV;
    }

    SetRendererDiv(div){
        this._RENDERER_DIV = div;
    }

    GetContent(){
        return this._CONTENT;
    }

    SetContent(content){
        this._CONTENT = content;
    }

    //endregion Getters and Setters

    Build(){
        let div = document.createElement("div");
        div.id = this.GetRendererDivId();
        div.innerHTML = this.GetContent();
        this.SetRendererDiv(div);
    }

    Destroy(){
        this.GetRendererDiv().remove();
    }


}