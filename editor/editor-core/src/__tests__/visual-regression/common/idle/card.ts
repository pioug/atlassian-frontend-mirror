import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import {
  getTimeUntilIdle,
  getSequence,
  assertIdleTimesWithinRange,
} from './_util';
import {
  NUMBER_OF_BATCHES,
  NUMBER_OF_RUNS,
  THRESHOLD_INITIAL,
} from './_config';
import { createAdf } from './_adf';

// TODO: https://product-fabric.atlassian.net/browse/EDM-1743
describe.skip('Cards:', () => {
  let page: PuppeteerPage;
  let timesToIdle: number[] = [];
  let timesToIdleForInitialRender: number[] = [];

  beforeEach(async () => {
    page = global.page;
  });

  // NOTE: Do not convert this code to using a `.forEach()` with
  // asynchronous logic inside of it. This is to prevent inconsistent behaviour
  // when running this test, which leads to flakiness (due to timeouts).
  for (const batchNumber of getSequence(NUMBER_OF_BATCHES)) {
    it(`allows browser to be idle in <5s - batch ${batchNumber}`, async () => {
      const adf = createAdf();
      const runs = getSequence(NUMBER_OF_RUNS);

      for await (const run of runs) {
        const timeTaken = await getTimeUntilIdle(page, adf);
        // We compare initial renders in their own bucket,
        // as they have similar boostrapping requirements (
        // empty browser cache, loading of async JS, etc).
        if (run === 0) {
          timesToIdleForInitialRender.push(timeTaken);
        } else {
          timesToIdle.push(timeTaken);
        }
        await page.reload();
      }
      // Dud assertion to complete the test.
      expect(true).toBe(true);
    });
  }

  afterAll(async () => {
    // Real assertion: check we're in a healthy range still.
    assertIdleTimesWithinRange(timesToIdle);
    assertIdleTimesWithinRange(timesToIdleForInitialRender, THRESHOLD_INITIAL);
  });
});
