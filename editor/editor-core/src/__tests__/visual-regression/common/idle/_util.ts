import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf } from '../../_utils';
import { createAdf } from './_adf';
import { THRESHOLD } from './_config';

interface WindowWithRequestIdleCallback extends Window {
  PERF_TEST_STARTED_AT: number;
  PERF_TEST_ENDED_AT: number;
}

let window: WindowWithRequestIdleCallback;

export const getTimeUntilIdle = async (
  page: PuppeteerPage,
  adf: ReturnType<typeof createAdf>,
): Promise<number> => {
  const onNavigateToUrl = async () =>
    page.evaluate(() => {
      window.PERF_TEST_STARTED_AT = performance.now();
    });

  const onEditorMountCalled = async () =>
    await page.evaluate(() => {
      (window as any).requestIdleCallback(
        () => {
          window.PERF_TEST_ENDED_AT = performance.now();
        },
        {
          timeout: 0,
        },
      );
    });

  await initFullPageEditorWithAdf(
    page,
    adf,
    undefined,
    {
      width: 950,
      height: 1020,
    },
    {
      smartLinks: {
        resolveBeforeMacros: ['jira'],
        allowBlockCards: true,
        allowEmbeds: true,
      },
    },
    'light',
    // For proper perf tests, we want the browser
    // to be as busy as in customer's experiences.
    // Enable all the side-effects!
    {
      cursor: true,
      animation: true,
      transition: true,
      scroll: true,
    },
    undefined,
    undefined,
    { onNavigateToUrl, onEditorMountCalled },
  );

  await page.waitForFunction(`typeof window.PERF_TEST_ENDED_AT === 'number'`);
  return await page.$eval(
    'body',
    () => window.PERF_TEST_ENDED_AT - window.PERF_TEST_STARTED_AT,
  );
};

export const getSequence = (length: number) => {
  return Array(length)
    .fill(0)
    .map((_v, index) => index);
};

export const assertIdleTimesWithinRange = (
  times: number[],
  threshold = THRESHOLD,
): void => {
  try {
    const totalTime = times.reduce((acc, x) => acc + x, 0);
    expect(totalTime).toBeLessThan(threshold * times.length);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(times);
    // Dud assertion to enforce failure.
    expect(true).toBe(false);
  }
};
