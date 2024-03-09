const http = require("http");
const fs = require("fs");

const JsonData = fs.readFileSync("./data.json", "utf-8");
console.log(JsonData);
console.log(JSON.parse(JsonData));

const Server = http.createServer((req, res) => {
  let pathName = req.url;
  if (pathName === "/") res.end("I am Main page");
  else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JsonData);
  }
});

Server.listen(8000, "127.0.0.1", () => {
  console.log(`Running Server at 127.0.0.1:8000`);
});
