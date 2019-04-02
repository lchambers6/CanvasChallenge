var fs = require("fs");
// Stores the information about the canvas for the session
let canvas = { canvasString: "", height: "", width: "", adjWidth: 0 };
clearFile();
fs.readFile("input.txt", "utf8", function(err, contents) {
  let readString = contents;
  if (
    typeof contents === "undefined" ||
    readString.indexOf("\n") === -1 ||
    readString.indexOf(" ") === -1
  ) {
    console.log(
      "File must be named input.txt, and command arguments must be delimited by spaces, and commands must delimited by new lines characters"
    );
  } else {
    let newLines = contents.match(/\n/g || []).length;
    let command = "";
    for (let i = 1; i <= newLines; i++) {
      command = readString.substr(0, readString.indexOf("\n"));
      readString = readString.substr(
        readString.indexOf("\n") + 1,
        readString.length
      );
      parseCommand(command);
      if (i === newLines) {
        command = readString;
        parseCommand(command);
      }
    }
  }
});

// Parses the command for the drawing functions
function parseCommand(command) {
  command = command.trim().split(" ");
  switch (command[0]) {
    case "C":
      if (
        !Number.isNaN(parseInt(command[1])) &&
        !Number.isNaN(parseInt(command[2]))
      ) {
        writeFile(createCanvas(parseInt(command[1]), parseInt(command[2])));
      } else {
        console.log("Invalid Canvas dimensions");
      }
      break;
    case "L":
      if (canvas.canvasString.length === 0) {
        console.log("Must create a Canvas first");
      } else if (
        !Number.isNaN(parseInt(command[1])) &&
        !Number.isNaN(parseInt(command[2])) &&
        !Number.isNaN(parseInt(command[3])) &&
        !Number.isNaN(parseInt(command[4]))
      ) {
        writeFile(
          drawLine(
            parseInt(command[1]),
            parseInt(command[2]),
            parseInt(command[3]),
            parseInt(command[4])
          )
        );
      } else {
        console.log("Invalid Line dimensions");
      }
      break;
    case "R":
      if (canvas.canvasString.length === 0) {
        console.log("Must create a Canvas first");
      } else if (
        !Number.isNaN(parseInt(command[1])) &&
        !Number.isNaN(parseInt(command[2])) &&
        !Number.isNaN(parseInt(command[3])) &&
        !Number.isNaN(parseInt(command[4]))
      ) {
        writeFile(
          drawRectangle(
            parseInt(command[1]),
            parseInt(command[2]),
            parseInt(command[3]),
            parseInt(command[4])
          )
        );
      } else {
        console.log("Invalid Rectangle dimensions");
      }
      break;
    case "B":
      if (canvas.canvasString.length === 0) {
        console.log("Must create a Canvas first");
      } else if (
        !Number.isNaN(parseInt(command[1])) &&
        !Number.isNaN(parseInt(command[2])) &&
        command[3].length === 1
      ) {
        writeFile(
          bucketFill(parseInt(command[1]), parseInt(command[2]), command[3])
        );
      } else {
        console.log("Invalid Fill Arguments");
      }
      break;
    default:
      console.log("Invalid arguments");
  }
}

// Creates the Canvas
function createCanvas(width, height) {
  canvas.height = height;
  canvas.width = width;
  canvas.adjWidth = canvas.width + 3;
  for (let i = 0; i <= height + 1; i++) {
    for (let j = 0; j <= width + 1; j++) {
      if (i === 0 || i === height + 1) {
        canvas.canvasString += "-";
      } else if (j === 0 || j === width + 1) {
        canvas.canvasString += "|";
      } else {
        canvas.canvasString += " ";
      }
    }
    canvas.canvasString += "\n";
  }
  return canvas.canvasString;
}

// Draws a vertical or horizontal line
function drawLine(x1, y1, x2, y2) {
  if (
    y1 > canvas.height ||
    y2 > canvas.height ||
    x1 > canvas.width ||
    x2 > canvas.width
  ) {
    console.log("Line falls outside canvas");
  } else if (y1 === y2) {
    let start = y1 * canvas.adjWidth + x1;
    let end = start + x2 - x1;
    for (let i = start; i <= end; i++) {
      canvas.canvasString =
        canvas.canvasString.substr(0, i) +
        "x" +
        canvas.canvasString.substr(i + 1, canvas.canvasString.length);
    }
  } else {
    let start = y1 * canvas.adjWidth + x1;
    let end = y2 * canvas.adjWidth + x2;
    for (let i = start; i <= end; i = i + canvas.adjWidth) {
      canvas.canvasString =
        canvas.canvasString.substr(0, i) +
        "x" +
        canvas.canvasString.substr(i + 1, canvas.canvasString.length);
    }
  }
  return canvas.canvasString;
}

// Draws a rectangle
function drawRectangle(x1, y1, x2, y2) {
  drawLine(x1, y1, x2, y1);
  drawLine(x1, y2, x2, y2);
  drawLine(x1, y1 + 1, x1, y2 - 1);
  drawLine(x2, y1 + 1, x2, y2 - 1);
  return canvas.canvasString;
}

// Fills the are surrounding the given coordinate
function bucketFill(x, y, color) {
  let start = y * canvas.adjWidth + x;
  canvas.canvasString =
    canvas.canvasString.substr(0, start) +
    color +
    canvas.canvasString.substr(start + 1, canvas.canvasString.length);
  if (canvas.canvasString[start - 1] === " ") {
    canvas.canvasString =
      canvas.canvasString.substr(0, start - 1) +
      color +
      canvas.canvasString.substr(start - 1 + 1, canvas.canvasString.length);
    bucketFill(x - 1, y, color);
  }
  if (canvas.canvasString[start + 1] === " ") {
    canvas.canvasString.substr(0, start + 1) +
      color +
      canvas.canvasString.substr(start + 1 + 1, canvas.canvasString.length);
    bucketFill(x + 1, y, color);
  }
  if (canvas.canvasString[start + canvas.adjWidth] === " ") {
    canvas.canvasString.substr(0, start + canvas.adjWidth) +
      color +
      canvas.canvasString.substr(
        start + canvas.adjWidth + 1,
        canvas.canvasString.length
      );
    bucketFill(x, y + 1, color);
  }
  if (canvas.canvasString[start - canvas.adjWidth] === " ") {
    canvas.canvasString.substr(0, start - canvas.adjWidth) +
      color +
      canvas.canvasString.substr(
        start - canvas.adjWidth + 1,
        canvas.canvasString.length
      );
    bucketFill(x, y - 1, color);
  }
  return canvas.canvasString;
}

// Appends data to the output.txt file (Waits until file is saved and returned before proceeding)
async function writeFile(outData) {
  await fs.appendFileSync("output.txt", outData);
}

// Empties data from or creates the output.txt file (Waits until file is saved and returned before proceeding)
async function clearFile() {
  await fs.writeFileSync("output.txt", "");
}
