class MySqlDataSource {
  constructor({
    knex
  }) {
    this.knex = knex;
  }

  async search(keyword) {
    const matches = await this.knex.select("*").table("sim_stories")
      .innerJoin("sim_story_terms1", "sim_stories.id", "sim_story_terms1.story_id")
      .where('term', keyword)
      .union([
        this.knex.select("*").table("sim_stories")
        .innerJoin("sim_story_terms2", "sim_stories.id", "sim_story_terms2.story_id")
        .where('term', keyword)
      ])
      .orderBy('order');
    return matches;
  }
}

export default MySqlDataSource;
