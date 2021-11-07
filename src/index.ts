import * as puppeteer from 'puppeteer';
import puppeteerConfig from "./config/puppetter.config";
import deviceConfig from "./config/device.config";

import { logger } from './util/logger';

try {
  setInterval(() => {
    (async () => {
      logger({severity: 'info', message: 'Starting...'});

      // @ts-ignore
      const browser = await puppeteer.launch(puppeteerConfig);
      const context = await browser.createIncognitoBrowserContext();
      logger({severity: 'info', message: 'Initializing browser options'});

      let page = await browser.newPage();
      // await blockImages(page);

      // Configure the navigation timeout
      await page.setDefaultNavigationTimeout(0);

      logger({severity: 'info', message: 'Emulating device'});
      await page.emulate(deviceConfig);

      try {
        logger({severity: 'info', message: 'Going to Secret Story...'});
        const url = 'https://app.ex.co/stories/item/5dd77e8b-82af-4e1f-9818-bac724b81844?feed=true&implementation=amp&src=%2F%2Fapp.ex.co%2Fstories%2Fitem%2F5dd77e8b-82af-4e1f-9818-bac724b81844&embedBy=00000000-0000-0000-0000-000000000000&game=%2Fstories%2Fitem%2F5dd77e8b-82af-4e1f-9818-bac724b81844&useComments=false&gameInfo=false&useShares=false&socialReferrer=false&height=auto&parentUrl=https%3A%2F%2Fwww.telecinco.es%2Fsecret-story%2Fvota-repesca_18_3229550141.html&parentHost=www.telecinco.es';
        await page.goto(url, { waitUntil: 'load' });
        await page.waitForSelector('iframe', { visible: true });
        const emmy = '.poll-answer-container:nth-child(1) > .answer-button-wrapper > button';
        const fiama = '.poll-answer-container:nth-child(2) > .answer-button-wrapper > button';
        const frigenti = '.poll-answer-container:nth-child(3) > .answer-button-wrapper > button';
        const lucia = '.poll-answer-container:nth-child(4) > .answer-button-wrapper > button';
        const adara = '.poll-answer-container:nth-child(5) > .answer-button-wrapper > button';

        const frame = page.frames().find(frame => frame.url() !== url || frame.url() === 'about:blank');

        logger({severity: 'info', message: 'Clicking...'});
        await frame.click(adara);
        logger({severity: 'success', message: 'Clicked...'});

        await page.waitForTimeout(5000);
        // await frame.waitForSelector('.poll-answer-container .selected', { visible: true });

        setTimeout(async () => {
          logger({severity: 'success', message: 'Closing...'});
          await page.close();
          await browser.close();
        }, 1000);
      } catch (error) {
        await page.screenshot({ path: `outputs/${Date.now()}.png` });
        logger({severity: 'error', message: 'There was an error'});
        logger({severity: 'error', message: error.message});
        logger({severity: 'error', message: 'Exiting'});
        process.exit(999);
      }
    })();
  }, 10000);
} catch (err) {
  logger({severity: 'error', message: 'Unknown fatal error, exiting!'});
  process.exit(1);
}