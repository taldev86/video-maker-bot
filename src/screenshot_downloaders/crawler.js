import { PuppeteerCrawler, RequestList, RequestQueue, log } from 'crawlee';
import fs from 'fs';
import { fakeUserAgent } from '../utils/helper.js';

const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

export class ScreenShotCrawler {
  constructor({ content, settings }) {
    this.content = content;
    this.settings = settings;
    this.path = `assets/temp/${content.provider}/${content.id}/png`;
    this.logger = log;
  }

  async requestHandler({ request, response, log, json, enqueueLinks }) {
    throw new Error('Not implemented');
  }

  async getStartUrls() {
    throw new Error('Not implemented');
  }

  async start() {
    this.logger.info(`Starting crawler for ${this.content.id}`);

    this.logger.info(`Creating directory ${this.path}`);
    fs.mkdirSync(this.path, { recursive: true });
    const startUrls = await this.getStartUrls();
    this.logger.info(`Found ${startUrls.length} start urls`);

    const requestList = await RequestList.open('startUrls', startUrls);
    const userAgent = await fakeUserAgent();
    this.requestQueue = await RequestQueue.open(
      `requestQueue-${this.content.id}`
    );

    const width = this.settings.resolution_width - 14;
    const height = this.settings.resolution_height + 4;
    const dsf = Math.floor(width / 600) + 1;
    this.logger.info(`Setting resolution to ${width}x${height}`);
    const crawler = new PuppeteerCrawler({
      requestList,
      requestQueue: this.requestQueue,
      requestHandler: this.requestHandler.bind(this),
      persistCookiesPerSession: true,
      headless: true,
      maxConcurrency: 1,
      launchContext: {
        launchOptions: {
          args: [
            ...minimal_args,
            // lang
            `--lang=${this.settings.lang || 'en-US'}`,
            // window size
            `--window-size=${width},${height}`,
            // scale factor
            `--force-device-scale-factor=${dsf}`,
          ],
          defaultViewport: {
            width: width,
            height: height,
            deviceScaleFactor: dsf,
          },
        },
        userAgent: userAgent['User-Agent'],
      },
      preNavigationHooks: [
        async ({ page, request, options }, gotoOptions) => {
          // set cookies
          // set viewport to mobile
          //   # Device scale factor (or dsf for short) allows us to increase the resolution of the screenshots
          //   # When the dsf is 1, the width of the screenshot is 600 pixels
          //   # so we need a dsf such that the width of the screenshot is greater than the final resolution of the video
          // dsf = (W // 600) + 1

          //   await page.setViewport({
          //     width: width,
          //     height: height,
          //     deviceScaleFactor: dsf,
          //   });

          gotoOptions.waitUntil = 'networkidle0';
        },
      ],
    });

    await crawler.run();
    this.logger.info(`Finished crawler for ${this.content.id}`);
    return this.content;
  }
}
