import fs from 'fs';

class JsonNormalizer {
  constructor(filePath) {
    this.filePath = filePath;
  }

  load() {
    try {
      const data = fs.readFileSync(this.filePath, {
        encoding: 'utf8'
      });
      return JSON.parse(data);
    } catch (er) {
      throw new Error("Cannot load filter file");
    }
  }

  normalize(word) {
    const ngWords = ["คุณ", "ไอ้"];
    const filteredWord = ngWords.reduce((inWord, ngWord) => inWord.replace(ngWord, ""), word);
    if (word === 'ep') {
      return [" อีพี "];
    }

    const data = this.load();
    const normalizedWords = Object.keys(data).filter((key) => {
      return data[key].toLowerCase().includes(word.toLowerCase());
    });
    if (normalizedWords.length > 0) {
      return normalizedWords;
    }
    return [filteredWord];
  }
}

export default JsonNormalizer;
