const http = require("http");

const Server = http.createServer((req, res) => {
  res.end("Hello from the server!");
});

Server.listen(8000, "127.0.0.1", () => {
  console.log(`Running Server at 127.0.0.1:8000`);
});
