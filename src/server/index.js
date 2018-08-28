import express from 'express';
import chalk from 'chalk';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import logger from './logger';
import JsonDataSource from './lib/JsonDataSource';
import JsonNormalize from './lib/JsonNormalizer';

const app = express();
const PORT = process.env.PORT || 3000;
const dataPath = process.env.DATA_PATH || path.join(__dirname, './data');
const storyDatasource = new JsonDataSource(path.join(dataPath, 'data.json'));
const filterDatasource = new JsonNormalize(path.join(dataPath, 'filter.json'));

app.set('views', path.join(__dirname, './pages'));
app.set('view engine', 'ejs');

app.use(morgan(':method :url HTTP/:http-version :status :res[content-length] :remote-addr - :remote-user', {
  stream: logger.stream
}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/assets', express.static('assets'));
app.get('/', (req, res) => {
  return res.render('index', {
    rawKeywords: "",
    stories: []
  });
});

app.get('/search/:keyword', (req, res) => {
  const keywords = filterDatasource.normalize(req.params.keyword);
  const stories = storyDatasource.search(keywords);
  logger.info('search: ' + keyword);
  return res.render('index', {
    stories,
    rawKeywords: req.params.keyword
  });
});

app.post('/api/search', (req, res) => {
  const keyword = req.body.keyword;
  if (keyword.trim().length === 0) {
    return res.send([]);
  }

  logger.info('api search: ' + keyword);
  const keywords = filterDatasource.normalize(keyword);
  const stories = storyDatasource.search(keywords);
  return res.send(stories);
});


// error handler
app.use(function (err, req, res, next) {
  logger.error(chalk.red(`${err.message}
  ${err.stack}`));
  res.status(err.status || 500).send(err.message);
});

app.listen(PORT, () => {
  logger.debug(chalk.green(`Server listening on http://localhost:${PORT}/ ..`))
});

export default app;