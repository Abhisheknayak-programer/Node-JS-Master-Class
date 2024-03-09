const http = require("http");

const Server = http.createServer((req, res) => {
  let pathName = req.url;
  if (pathName === "/") res.end("I am Main page");
  else if (pathName === "/overview") res.end("I am Overview page");
  else if (pathName === "/product") res.end("I am Product page");
  else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>I am Error Page</h1>");
  }
  console.log(pathName);
});

Server.listen(8000, "127.0.0.1", () => {
  console.log(`Running Server at 127.0.0.1:8000`);
});
