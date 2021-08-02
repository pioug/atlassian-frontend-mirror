import { loadPage, PuppeteerPage } from '@atlaskit/visual-regression/helper';

type Options = {
  triggerSelector: string;
  viewport?: { width: number; height: number };
  modalSelector: string;
  scrollSelector?: string;
  scrollTo?: { x: number; y: number };
};

export const openModal = async (url: string, options: Options) => {
  const { page } = global;

  await loadPage(page, url);

  const viewport = options.viewport || { width: 800, height: 600 };
  await page.setViewport(viewport);

  if (options.scrollSelector && options.scrollTo) {
    await page.evaluate(
      ({ selector, scrollTo }) =>
        document.querySelector(selector).scrollTo(scrollTo.x, scrollTo.y),
      { selector: options.scrollSelector, scrollTo: options.scrollTo },
    );
  }

  await page.waitForSelector(options.triggerSelector);
  await page.click(options.triggerSelector);
  await page.waitForSelector(options.modalSelector);

  return page;
};

/* Waits for @atlaskit/tooltip component to appear and fade in.
 * This util function is from the VR of that package.
 */
export const waitForTooltip = async (page: PuppeteerPage, textContent = '') => {
  const xpath = textContent
    ? `//*[contains(@class, "Tooltip") and contains(text(), "${textContent}")]`
    : '//*[contains(@class, "Tooltip")]';
  await page.waitForXPath(xpath, {
    timeout: 5000,
    visible: true,
  });

  // The tooltip takes 350 ms to animate in (plus some buffer)
  await page.waitForTimeout(350);
};
