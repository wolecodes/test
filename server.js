const http = require("http");
const fs = require("fs");

function doSomethingOnRequest(request, response) {
  if (request.method === "GET" && request.url === "/") {
    let page = fs.readFileSync("index.html", "utf-8");
    response.end(page);
  } else if (request.method === "GET" && request.url === "/styles.css") {
    let style = fs.readFileSync("styles.css", "utf-8");
    response.end(style);
  } else if (request.method === "POST" && request.url === "/sayHi") {
    fs.appendFileSync("hi_log.txt", "Somebody said hi.\n");
    response.end("hi back to you!");
  } else if (request.method === "POST" && request.url === "/greeting") {
    let body = [];

    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString() + "\n";
        fs.appendFileSync("hi_log.txt", body);
        response.end(body);
      });
  } else if (request.method === "PUT" && request.url === "/update-greeting") {
    let body = [];
    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString() + "\n";
        fs.writeFileSync("hi_log.txt", body);
        response.end(body);
      });
  } else if (
    request.method === "DELETE" &&
    request.url === "/delete-greeting"
  ) {
    fs.unlinkSync("hi_log.txt");
    response.end("Deleted reponse");
  } else {
    response.statusCode = 404;
    response.statusMessage = "Error: Not found";
    response.end();
  }
}

const server = http.createServer(doSomethingOnRequest);

server.listen(3001);
