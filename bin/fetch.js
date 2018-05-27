const fetch = require('isomorphic-fetch');
const chalk = require('chalk');
const fs = require('fs');

const FILTER_RANGE = "'Filter'!B4%3AC";
const DATA_RANGE = "'Data'!B5%3AK";

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('not enough arguments');
  usage();
  exit(1);
}

const [command, outputFile, sheetId, key, ...rest] = args;

let range, fn;
switch (command) {
  case "data":
    range = DATA_RANGE;
    fn = sheetToDataJson;
    break;
  case "filter":
    range = FILTER_RANGE;
    fn = sheetToFilterJson;
    break;
  default:
    console.error(chalk.red('unknown command'));
    exit(1);
}

console.log('loading sheets');

const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?key=${key}&ranges=${range}`;

fetch(url)
  .then(res => res.json())
  .then(sheet => {
    const resultJson = fn(sheet)

    console.log('Writing JSON file to ' + chalk.green(outputFile))
    fs.writeFileSync(outputFile, JSON.stringify(resultJson));
  });

function sheetToDataJson(sheet) {
  const sheetResult = sheet.valueRanges[0].values;
  return sheetResult.map((row) => {
    return {
      name: row[0],
      part: row[1],
      narrator: row[2],
      description: row[3],
      ep: row[5],
      epTime: row[6],
      keyword1: row[8],
      keyword2: row[9] || "",
    }
  });
}

function sheetToFilterJson(sheet) {
  const sheetResult = sheet.valueRanges[0].values;
  const compacted = sheetResult.filter(row => row.length > 0);
  const resultMap = {};
  compacted.forEach((row) => {
    resultMap[row[0]] = row[1];
  });

  return resultMap;
}
