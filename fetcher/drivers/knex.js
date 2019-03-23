const chalk = require('chalk');
const knex = require('knex');
const util = require('util');

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

function prepareStoryQueries(stories) {
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


function prepareFilterQueries(rows) {
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

function getQueryGenerator(command) {
  switch (command) {
    case "data":
      return prepareStoryQueries;
    case "filter":
      return prepareFilterQueries;
    default:
      console.error(chalk.red('unknown command'));
      exit(1);
  }
}

module.exports = {
  dataFn: writeDataResults,
  filterFn:  writeFilterResults,
  process: (command, sheetJson) => {
    const dbfn = getQueryGenerator(command);
    const query = dbfn(sheetJson);
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
  }
}
