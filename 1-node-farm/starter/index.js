const fs = require("fs");
const http = require("http");

const productsData = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  "utf-8"
);

const Server = http.createServer((req, res) => {
  let pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.end("Main Page || Overview Page");
  } else if (pathName === "/api") {
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   console.log(JSON.parse(data)); // JavaScript Object to perform any operation
    //   res.writeHead(200, {
    //     "Content-Type": "application/json",
    //   });
    // res.end(data); // Sending only string response to display on webpage
    // });
    res.end(productsData); // Sending only string response to display on webpage
  } else if (pathName === "/products") {
    res.end("Products Page");
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
