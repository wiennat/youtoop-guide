import express from 'express';
import chalk from 'chalk';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import logger from './logger';
import JsonDataSource from './lib/JsonDataSource';
import JsonNormalize from './lib/JsonNormalizer';

const app = express();
const PORT = process.env.PORT || 3000;
const dataPath = process.env.DATA_PATH || path.join(__dirname, './data');
const storyDatasource = new JsonDataSource(path.join(dataPath, 'data.json'));
const filterDatasource = new JsonNormalize(path.join(dataPath, 'filter.json'));
const analytics = {
    code: process.env.ANALYTICS_CODE,
    enabled: process.env.ANALYTICS_ENABLED === "true"
};

app.set('views', path.join(__dirname, './pages'));
app.set('view engine', 'ejs');

const getRemoteAddress = (req) => {
  return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
morgan.token('remote-addr', getRemoteAddress);

app.use(morgan(':method :url HTTP/:http-version :status :res[content-length] :remote-addr - :remote-user', {
  stream: logger.stream
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  return res.render('index', {
    rawKeywords: "",
    stories: [],
    analytics
  });
});

app.get('/search', (req, res) => {
  res.redirect('/');
});

app.get('/search/:keyword', (req, res) => {
  const tokens = req.params.keyword.trim().split(' ');
  const keywords = filterDatasource.normalize(req.params.keyword);
  const stories = storyDatasource.search(keywords);
  logger.info('search: %s - %s', keywords, getRemoteAddress(req));
  return res.render('index', {
    stories,
    rawKeywords: req.params.keyword,
    analytics
  });
});

app.post('/api/search', (req, res) => {
  const keyword = req.body.keyword;
  if (keyword.trim().length === 0) {
    return res.send([]);
  }

  logger.info('api search: %s - ', keyword, getRemoteAddress(req));
  const keywords = filterDatasource.normalize(keyword);
  const stories = storyDatasource.search(keywords);
  return res.send(stories);
});

app.post('/api/open', (req, res) => {
  const { ep, url, keyword }  = req.body;
  const ip = getRemoteAddress(req);
  logger.info('open: (%s), (%s), (%s), (%s)', ep, keyword, ip, url);
  return res.send("ok");
});

app.use(express.static('public'));

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
