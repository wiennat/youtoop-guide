const fetch = require('isomorphic-fetch');
const chalk = require('chalk');
const fs = require('fs');

const SEARCH_LOG_SHEET = "'Sheet1'!A1%3D1";
const SEARCH_LOG_RANGE = "A1%3D1";

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('not enough arguments');
  usage();
  exit(1);
}

const [inputFile, sheetId, key, ...rest] = args;

console.log('loading file: ' + inputFile);

const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SEARCH_LOG_RANGE}:append?key=${key}`;
console.log('sending request to ' + chalk.blue(url));

const logData = {
  "range": SEARCH_LOG_RANGE,
  values: [
    ["2018-10-04T08:00:41.001",	"พี่แซม"]
  ]
}
fetch(url, {
  method: 'POST',
  body: JSON.stringify(logData)
})
  .then(res => res.json())
  .then(r => {
    console.log(chalk.green('response is'));
    console.log(r);

  });


const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?key=${key}&ranges=${SEARCH_LOG_RANGE}`;



fetch(fetchUrl)
  .then(res => res.json())
  .then(sheet => {
    console.log(chalk.green('response is'));
    console.log(sheet);
  });
