const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

// const replaceTemplate = (htmlTemplate, product) => {
//   let output = htmlTemplate.replaceAll("{%PRODUCTNAME%}", product.productName);
//   output = output.replaceAll("{%IMAGE%}", product.image);
//   output = output.replaceAll("{%PRICE%}", product.price);
//   output = output.replaceAll("{%DESC%}", product.description);
//   output = output.replaceAll("{%QUANTITY%}", product.quantity);
//   output = output.replaceAll("{%ID%}", product.id);
//   output = output.replaceAll("{%NUTRIENTS%}", product.nutrients);
//   output = output.replaceAll("{%FROM%}", product.from);
//   if (product.organic === false) {
//     output = output.replaceAll("{%NOT_ORGANIC%}", "not-organic");
//   }
//   return output;
// };

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const productsData = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  "utf-8"
);
const productDataObj = JSON.parse(productsData);

const Server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    let cardsHTML = productDataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join("");
    const output = tempOverview.replace("{%PRODUCTS_CARDS%}", cardsHTML);
    res.end(output);
  } else if (pathname === "/product") {
    const product = productDataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   console.log(JSON.parse(data)); // JavaScript Object to perform any operation
    //   res.writeHead(200, {
    //     "Content-Type": "application/json",
    //   });
    // res.end(data); // Sending only string response to display on webpage
    // });
    res.end(productsData); // Sending only string response to display on webpage
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end(`<h1>This page is not available go back :)</h1>`);
  }
});

Server.listen(8000, "127.0.0.1", () => {
  console.log("Server Started at 127.0.0.1:8000");
});
