const fs = require("fs");

// Synchronous file reading
const textIn = fs.readFileSync("./input.txt", "utf-8");
console.log(textIn);

//Synchronous file writing
const textOut = `I am Abhishek Nayak\nThe above paragraph is ${textIn}`;
fs.writeFileSync("./output.txt", textOut);

// Asynchronous file Reading
fs.readFile("./final.txt", "utf-8", (err, data) => {
  console.log(data);
});

// ASynchronous file Writing
fs.writeFile(
  "./Abhishek.txt",
  "I am Abhishek Nayak world best coder",
  "utf-8",
  (err) => {
    if (err) throw err;
    console.log("File Write Sucess");
  }
);

// Asynchronous Callback Hell
fs.readFile("./start.txt", "utf-8", (err, data1) => {
  fs.readFile(`./${data1}.txt`, "utf-8", (err, data2) => {
    fs.writeFile("./final.txt", `${data1} ${data2}`, "utf-8", (err) => {
      if (err) throw err;
      console.log("Write and Read sucess");
    });
  });
});
