# F.OFF.PDF
## _The Last PDF Generation Package, Ever_



F-OFF PDF is a PDF library for developers who are tired of struggling with JS-PDF, HTML2PDF or even Puppeteer.
Don't get me wrong, those tools are great, but when you are having random issues like white space at the top of the
page or the text is not wrapping correctly, you will understand the pain.

So without further ado, I present to you F-OFF PDF. A simple and easy to use PDF library that will make your life easier.
The library will eventually consume HTML and CSS to generate a PDF file.

The library is still in development, but you can follow the progress on Github.

## Features
- Eventually the code will convert an HTML file and watch it magically convert to PDF

## Build a distribution

Lets say you forked the project and you want to build a distribution. You can run the following command to build the distribution.

```bash
npm run build
```

## How To Use It

Include the script tag in your HTML file to reference the HTML Library. Or you can write your own module to implement the library.
Add the script tag to your project.

```html
<script src="../dist/bundle.js" type="module"></script>

```

Then you can use the library to generate a PDF file.

```javascript
function triggerMakeAPDF(){
    let txtOnPDF = "Hello World!"; // I want each page to say Hello World!
    let txtTitle = "Hello Document"; // This is what I want displayed as the document name in the tab title
    let txtAuthor = "John Doe"; // This is the author of the document

    let doc = new FuckOffPDF(txtTitle,txtAuthor);
    let page1 = doc.NewPage();
    page1.AddContent(txtOnPDF);
    doc.AddPage(page1);

    let page2 = doc.NewPage();
    page2.AddContent(`Page 2: ${txtOnPDF}`);
    doc.AddPage(page2);

    let page3 = doc.NewPage();
    page3.AddContent(`Page 3: ${txtOnPDF}`);
    doc.AddPage(page3);

    doc.MakePDFFile();
}
```

To Implement the library in your custom solution do the following:

```javascript
import {F_OFF_PDF} from "./Classes/base.js"; // Where ./ referrs to the path of the src file.
let handle =  new F_OFF_PDF();
```

From here you can set the document title and author

```javascript
handle.GetDoc().SetTitle(title);
handle.GetDoc().SetAuthor(author);

let page1 = handle.GetDoc().NewPage();
page1.AddContent('Add your content here');
handle.GetDoc().AddPage(page1);

handle.GetDoc().MakePDFFile();
```