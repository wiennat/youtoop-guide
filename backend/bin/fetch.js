const fetch = require('isomorphic-fetch');
const chalk = require('chalk');
const fs = require('fs');
const knex = require('knex');
const util = require('util');

const FILTER_RANGE = "'Filter'!B4%3AC";
const DATA_RANGE = "'Data'!B5%3AK";

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('not enough arguments');
  usage();
  process.exit(1);
}

function usage(){
  console.log("npm run fetch:[data|filter] -- SHEET_ID KEY");
}

const [command, outputFile, sheetId, key, ...rest] = args;

let range, fn, dbfn;
switch (command) {
  case "data":
    range = DATA_RANGE;
    fn = sheetToDataJson;
    dbfn = writeDataResults;
    break;
  case "filter":
    range = FILTER_RANGE;
    fn = sheetToFilterJson;
    dbfn = writeFilterResults;
    break;
  default:
    console.error(chalk.red('unknown command'));
    process.exit(1);
}

console.log('loading sheets');

const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?key=${key}&ranges=${range}`;

fetch(url)
  .then(res => res.json())
  .then(sheet => {
    const resultJson = fn(sheet)
    console.log('Writing JSON file to ' + chalk.green(outputFile))
    fs.writeFileSync(outputFile, JSON.stringify(resultJson, null, 2));
    const query = dbfn(resultJson);
    console.log('Writing to db ' + chalk.green(process.env.DB_NAME))
    const kn = getClient();
    const ps = [];
    query.forEach(s => {
      s.forEach(async r => {
        ps.push(kn.raw(r)
          .catch((err)=> console.log(chalk.red(err)))
        );
      });
    });
    Promise.all(ps).finally(() => kn.destroy());
  });

function sheetToDataJson(sheet) {
  const sheetResult = sheet.valueRanges[0].values;
  return sheetResult.map((row, idx) => ({
      id: genId(row, idx),
      order: idx,
      name: row[0],
      part: row[1],
      narrator: row[2],
      description: row[3],
      url: row[4],
      ep: row[5],
      epTime: row[6],
      keyword1: row[8] ? row[8].split(' ').filter(Boolean) : [],
      keyword2: row[9] ? row[9].split(' ').filter(Boolean) : [],
  }));
}

function genId(row, idx) {
  return `${row[5]}-${idx}`;
}

function sheetToFilterJson(sheet) {
  const sheetResult = sheet.valueRanges[0].values;
  const compacted = sheetResult.filter(row => row.length > 0);
  const resultMap = {};
  compacted.forEach((row) => {
    resultMap[row[0].trim()] = row[1].split(" ").filter(Boolean);
  });

  return resultMap;
}

function getClient(){
  return knex({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME,
      charset: "utf8mb4"
    },
    debug: process.env.DEBUG
  });
}

function writeDataResults(stories) {
  const kn = getClient();
  // create map from list

  const storyIdMap = stories.reduce((map, story) => {
    let i = 1;
    let targetId = story.id;
    while (map[targetId] !== undefined){
      targetId = `${story.id}-${i++}`;
    }
    map[targetId] = story;
    story.id = targetId; // handle duplicated id
    return map;
  }, {});

  const rows = Object.keys(storyIdMap).map(key => {
    const story = storyIdMap[key];
    const { keyword1, keyword2, ...rest } = story;
    const insert = kn('sim_stories').insert({...rest}).toString();
    const update = kn('sim_stories').update({...rest}).toString();

    const query = util.format(
          '%s ON DUPLICATE KEY UPDATE %s',
          insert.toString(),
          update.toString().replace(/^update\s.*\sset\s/i, '')
        );
    return [ query, ...prepareTermsQuery(story, kn) ];
  });
  return rows;
}

function prepareTermsQuery(story, kn) {
  const { keyword1, keyword2, ...rest } = story;

  const keyword1Set = new Set(keyword1);
  const keyword2Set = new Set(keyword2);

  const kw1map = [...keyword1Set].map(term => ({"story_id": story.id, term }));
  const kw2map = [...keyword2Set].map(term => ({"story_id": story.id, term }));
  const kw1Queries = kn.insert(kw1map).into('sim_story_terms1').toString();
  const kw2Queries = kn.insert(kw2map).into('sim_story_terms2').toString();

  return [
      kw1Queries.replace(/^insert/i, 'insert ignore'),
      kw2Queries.replace(/^insert/i, 'insert ignore')
  ];
}

function writeFilterResults(rows) {
  const kn = getClient();

  const termSets = Object.keys(rows).reduce((acc, term) => {
    acc[term] = [...new Set(rows[term])];
    return acc;
  }, {});

  const queries = Object.keys(termSets).map(term => {
    const query = kn.insert(termSets[term].map(t => ({ term, similar_term: t })))
                    .into('sim_terms')
                    .toString()
                    .replace(/^insert/i, 'insert ignore')
      ;
    return query;
  });

  return [queries];
}
