class PDFPage {

    _OBJ_ID = null;

    _PARENT_ID = null;

    constructor(PageId, ParentId) {
        this.SetId(PageId);
        this.SetParentId(ParentId);
    }

    //region Getters and Setters

    GetId(){
        return this._OBJ_ID;
    }

    SetId(value){
        this._OBJ_ID = value;
    }

    GetParentId(){
        return this._PARENT_ID;
    }

    SetParentId(value){
        this._PARENT_ID = value;
    }

    //endregion Getters and Setters

    GetPageAsObject(){
    //     2 0 obj
    //     << /Type /Page It's a page
    //     /MediaBox [0 0 612 792] Paper size is US Letter Portrait (612 points by 792 points)
    // /Resources 3 0 R Reference to resources at object 3
    //     /Parent 1 0 R Reference back up to parent page list
    //     /Contents [4 0 R] Graphical content is in object4
    //     >>
    //     endobj

        return {
            Id: this.GetId(),
            Type: TPDF_Page_Types.PDF_OBJ_TYPE_PAGE,
            MediaBox: TPDF_Pager_Sizes.A4,
            Resources: 3,
            Parent: 1,
            Contents: [4]
        }

    }

}