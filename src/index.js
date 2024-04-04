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

let doc = new F_OFF_PDF();

let page1 = doc.NewPage();
page1.AddContent("Hello, World!");

doc.AddPage(page1);