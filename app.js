const express = require("express");
const res = require("express/lib/response");
const morgan = require("morgan");
const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const nthline = require("nthline");

const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function fileLineCount({ fileLocation }) {
  const { stdout } = await exec(`findstr /R /N "^" logFile.txt | find /C ":"`);
  return stdout;
}

const datee = async (row, filename) => {
  let str = await nthline(row, filename);
  str = str.split(" ");
  return str[0];
};

const binarySearch = async (timee, filename, lineCount) => {
  var row = 0,
    low = 0,
    high = lineCount - 1;
  while (low <= high) {
    var mid = Math.floor((low + high) / 2);
    if ((await datee(mid, filename)) <= timee) {
      row = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return row;
};

const CustomFileReader = async (startTime, endTime) => {
  const lineCount = await fileLineCount({ fileLocation: "logFile.txt" });
  const lineStart =
    (await binarySearch(startTime, "logFile.txt", lineCount)) + 1;
  const lineEnd = await binarySearch(endTime, "logFile.txt", lineCount);
  let overall_data = "";
  for (let i = lineStart; i <= lineEnd; i++) {
    const data = await nthline(i, "logFile.txt");
    overall_data += data + "\n";
  }
  return overall_data;
};

app.all("*", async (req, res, next) => {
  const params = req.url.split("/");
  const startTime = params[3];
  const endTime = params[4];
  resp = await CustomFileReader(startTime, endTime);
  res.status(200).json({
    status: "success",
    resp,
  });
});

module.exports = app;
