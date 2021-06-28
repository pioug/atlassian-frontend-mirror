import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

export const waitForTypeAheadMenu = async (page: PuppeteerPage) => {
  await page.waitForSelector('.fabric-editor-typeahead');
};

export const waitForMenuIconsToLoad = async (
  page: PuppeteerPage,
  minItems: number,
) => {
  const menuIconSelector = '.fabric-editor-typeahead [class^="Item-"] svg';
  await page.waitForFunction(
    (selector: string, minItems: number) => {
      const els = Array.from(document.querySelectorAll(selector));
      const visibleEls = els.filter((el) => {
        const rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        );
      });
      return visibleEls.length > minItems;
    },
    {},
    menuIconSelector,
    minItems,
  );
};
