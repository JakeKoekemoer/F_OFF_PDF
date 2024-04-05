/**
 * F-OFF PDF is a PDF library for developers who are tired of struggling with JS-PDF, HTML2PDF or even Puppeteer.
 * Don't get me wrong, those tools are great, but when you are having random issues like white space at the top of the
 * page or the text is not wrapping correctly, you will understand the pain.
 *
 * So without further ado, I present to you F-OFF PDF. A simple and easy to use PDF library that will make your life easier.
 * The library will eventually consume HTML and CSS to generate a PDF file.
 *
 * The library is still in development, but you can follow the progress on Github.
 *
 * @version 0.0.1
 * @author Jacques Koekemoer
 * @primary-contributor Bernard Muller
 * @license MIT
 */

import {F_OFF_PDF} from "./Classes/base.js";
import {HTMLRenderer} from "./Classes/CanvasRenderFactory/HTMLRenderer.js";
import {TPDF_Page_Sizes} from "./Classes/definitions.js";

var FuckOffPDF = function(title, author){
    let handle =  new F_OFF_PDF();

    handle.GetDoc().SetTitle(title);
    handle.GetDoc().SetAuthor(author);

    return handle;
}

var Html2CanvasHandler = async function (_HTMLContent) {
    let pageSize = TPDF_Page_Sizes.A4;

    console.log(`calling render on page size `, pageSize);

    let renderer = new HTMLRenderer(_HTMLContent, pageSize.x, pageSize.y);
    await renderer.RenderCanvas().then(() => {

        console.log("render complete");
    })
}

window.FuckOffPDF = FuckOffPDF;
window.DrawHTML = Html2CanvasHandler;