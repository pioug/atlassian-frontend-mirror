import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

/**
 * Generating the stating point (y) of each test case.
 *
 * This test suite takes a snapshot on each section of the page.
 * In order to do so, we need to know where each snapshot starting point is.
 * This function calculates the starting point using the previous test
 * starting point and height.
 * @return [testId, height, y][]
 */
type ProviderTestCase = [string, number, number];
const startLocation = 150;
const generate = (testCases: [string, number][]) =>
  testCases.reduce(
    (acc: ProviderTestCase[], curr: [string, number]): ProviderTestCase[] => {
      const [_, height, y] =
        acc.length === 0 ? ['', 0, startLocation] : acc[acc.length - 1];
      const testCase: ProviderTestCase = [...curr, height + y];
      return [...acc, testCase];
    },
    [],
  );

/**
 * Find the viewport size for the test cases.
 *
 * There must be a sufficient space in order to show hover preview
 * at the bottom of the inline link. (Otherwise, hover preview will adjust
 * itself and shows on top of the link.)
 *
 * This function calculate the total height of the page by combining
 * the test cases height together.
 */
const getViewport = (testCases: ProviderTestCase[]) => {
  const [_, height, y] = testCases[testCases.length - 1];
  return { width: 800, height: height + y };
};

describe('Card', () => {
  const runTest = (
    testName: string,
    testCases: ProviderTestCase[],
    isFlexUiBlockCard = false,
  ) => {
    const viewport = getViewport(testCases);

    it.each(testCases)(
      'renders %s link',
      async (testId: string, height: number, y: number) => {
        const url = getURL(testName);
        const page = await setup(url);
        await page.setViewport(viewport);

        const blockCardTestId = isFlexUiBlockCard
          ? 'smart-block-resolved-view'
          : 'block-card-resolved-view';
        await page.waitForSelector(`[data-testid="${blockCardTestId}"]`);

        const selector = `[data-testid="inline-card-${testId}-resolved-view"]`;
        await page.waitForSelector(selector);

        // Hover over the inline link to trigger hover preview
        await page.hover(selector);
        await page.waitForSelector('[data-testid="hover-card"]');
        await page.waitForSelector('[data-testid="smart-element-icon"]');

        const image = await takeSnapshot(page, height, y);
        expect(image).toMatchProdImageSnapshot();
      },
    );
  };

  describe('Atlas', () => {
    const height = 340;
    const testCases = generate([
      ['goal', height],
      ['project', height],
    ]);
    runTest('vr-card-atlas', testCases);
  });

  describe('Bitbucket', () => {
    const testCases = generate([
      ['branch', 430],
      ['commit', 260],
      ['file', 260],
      ['project', 430],
      // ['pr', 320], Found Flaky. FIXME: https://product-fabric.atlassian.net/browse/EDM-7257
      // ['repository', 260], Found Flaky. FIXME: https://product-fabric.atlassian.net/browse/EDM-7257
    ]);
    runTest('vr-card-bitbucket', testCases);
  });

  describe('Trello', () => {
    const testCases = generate([
      ['card', 430],
      ['board', 430],
    ]);
    runTest('vr-card-trello', testCases, true);
  });
});
