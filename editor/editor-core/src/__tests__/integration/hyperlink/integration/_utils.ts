import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';

export const isFocusTrapped = async (
  page: WebdriverPage,
  firstElement: WebdriverIO.Element,
  focusWithinSelector: string,
) => {
  // Should be focused on first element field
  expect(await firstElement.isFocused()).toBe(true);

  await page.pause(100);

  // Shift tab should take us to the last tabbable element
  await page.keys(['Shift', 'Tab'], true);
  await page.keys(['Shift'], true); // Second shift is to release

  const isFocusWithin = page.execute((selector) => {
    return document.querySelector(selector)?.contains(document.activeElement);
  }, focusWithinSelector);

  return isFocusWithin;
};
