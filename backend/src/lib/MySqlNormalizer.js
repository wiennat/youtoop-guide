import knex from 'knex';

class MySqlNormalizer {
  constructor({
    knex
  }) {
    this.knex = knex;
  }

  async normalize(word) {
    const ngWords = ["คุณ", "ไอ้"];
    const filteredWord = ngWords.reduce((inWord, ngWord) => inWord.replace(ngWord, ""), word);
    if (word === 'ep') {
      return "อีพี";
    }

    const term = await this.knex('sim_terms')
      .where("similar_term", filteredWord)
      .select({
        term: "term",
        similar_term: "similar_term"
      });
    if (term.length === 0) {
      return word;
    }
    return term[0].term;
  }
}

export default MySqlNormalizer;
