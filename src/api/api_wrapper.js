import { createLogger } from '../utils/logger.js';

export class TrendApiWrapper {
  constructor(engine) {
    this.logger = createLogger('trend-api');
    this.engine = engine;
  }

  async run() {
    // get videos that have not been done.
    this.logger.info('Getting videos that have not been done...');
    const video = await this.engine.parse();

    if (!video) {
      this.logger.info('No more videos to generate.');
      return null;
    }

    return video;
  }
}
