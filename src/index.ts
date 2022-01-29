import * as puppeteer from 'puppeteer';
import puppeteerConfig from "./config/puppetter.config";
import deviceConfig from "./config/device.config";
import nominationsConfig from "./config/nominations.config";

import { logger } from './util/logger';

try {
  setInterval(() => {
    (async () => {
      logger({severity: 'info', message: 'Starting...'});

      // @ts-ignore
      const browser = await puppeteer.launch(puppeteerConfig);
      logger({severity: 'info', message: 'Initializing browser options'});

      let page = await browser.newPage();

      // Configure the navigation timeout
      await page.setDefaultNavigationTimeout(0);

      logger({severity: 'info', message: 'Emulating device'});
      await page.emulate(deviceConfig);

      try {
        const url = nominationsConfig.url;
        logger({severity: 'info', message: `Going to Secret Story nomination page (${nominationsConfig.url})`});
        logger({severity: 'info', message: `Selected person ${nominationsConfig.chooseTo}`});
        await page.goto(url, { waitUntil: 'load' });
        await page.waitForSelector('#didomi-notice-agree-button', { visible: true });

        // @ts-ignore
        const selectedPerson = nominationsConfig.nominations[nominationsConfig.chooseTo];
        logger({severity: 'info', message: `Selected person button ${selectedPerson}`});

        const elementHandle = await page.$('iframe[data-device="desktop"]');
        // @ts-ignore
        const frame = await elementHandle.contentFrame();

        logger({severity: 'info', message: 'Clicking...'});

        // @ts-ignore
        await frame.click(selectedPerson);
        logger({severity: 'success', message: 'Clicked...'});

        await page.waitForTimeout(5000);

        setTimeout(async () => {
          logger({severity: 'success', message: 'Closing...'});
          await page.close();
          await browser.close();
        }, 1000);
      } catch (err: unknown) {
        await page.screenshot({ path: `outputs/${Date.now()}.png` });
        logger({severity: 'error', message: 'There was an error'});
        logger({severity: 'error', message: (err as Error).message});
        logger({severity: 'error', message: 'Exiting'});
        process.exit(999);
      }
    })();
  }, 60000);
} catch (err) {
  logger({severity: 'error', message: 'Unknown fatal error, exiting!'});
  process.exit(1);
}