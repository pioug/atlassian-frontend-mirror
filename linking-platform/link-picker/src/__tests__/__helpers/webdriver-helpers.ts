import Page from '@atlaskit/webdriver-runner/wd-wrapper';

export function isElementCompletelyVisible(page: Page, selector: string) {
  return page.execute((selector: string) => {
    const target = document.querySelector(selector);
    if (!target) {
      return false;
    }
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const { top, left, bottom, right } = target.getBoundingClientRect();

    const isWithinX = (pos: number) => {
      return pos > 0 && pos <= innerWidth;
    };
    const isWithinY = (pos: number) => {
      return pos > 0 && pos <= innerHeight;
    };

    return [left, right].every(isWithinX) && [top, bottom].every(isWithinY);
  }, selector);
}

export const testIdsToSelectors = <T extends Record<string, string>>(
  testIds: T,
): T => {
  return Object.entries(testIds).reduce(
    (acc, [key, testId]) => ({
      ...acc,
      [key]: `[data-testid="${testId}"]`,
    }),
    testIds,
  );
};
