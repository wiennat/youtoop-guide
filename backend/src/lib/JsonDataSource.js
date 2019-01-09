import fs from 'fs';

class JsonDataSource {
  constructor(filePath) {
    this.filePath = filePath;
  }

  load() {
    try {
      const data = fs.readFileSync(this.filePath, {
        encoding: 'utf8'
      });
      return JSON.parse(data);
    } catch (err){
      throw Error('Cannot load data file');
    }
  }

  async search(keyword) {
    const stories = this.load();
    const matches = stories.filter((story) => this.isMatch(story, keyword));
    return matches;
  }

  isMatch(story, keywords) {
    const keyword1 = story.keyword1 || "";
    const keyword2 = story.keyword2 || "";
    return keywords.some((keyword) => keyword1.includes(keyword) || keyword2.includes(keyword));
  }
}

export default JsonDataSource;
