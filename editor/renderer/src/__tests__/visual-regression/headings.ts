import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF } from './_utils';
import headings from '../__fixtures__/headings-adf.json';
import nestedHeadings from '../__fixtures__/nested-headings-adf.json';
import { selectors as rendererSelectors } from '../__helpers/page-objects/_renderer';

const hoverOnHeading = async (page: PuppeteerPage, selector: string) => {
  await page.waitForSelector(selector);
  await page.hover(selector);
  await page.waitForSelector(`${selector} button`);
  await page.hover(`${selector} button`);
  await waitForTooltip(page);
};

describe('Headings:', () => {
  let page: PuppeteerPage;

  describe('Nested UX', () => {
    beforeEach(async () => {
      page = global.page;
      await initRendererWithADF(page, {
        adf: headings,
        rendererProps: {
          allowHeadingAnchorLinks: {
            allowNestedHeaderLinks: true,
          },
          disableHeadingIDs: false,
        },
        appearance: 'full-page',
      });
    });

    afterEach(async () => {
      await snapshot(page);
    });

    test.each([1, 2, 3, 4, 5, 6])(
      'should render anchor link tooltip for h%s correctly',
      async headingLevel => {
        await hoverOnHeading(page, `h${headingLevel}:first-of-type`);
      },
    );

    it('should render first anchor link in layout correctly', async () => {
      await hoverOnHeading(page, '#Heading-in-layout');
    });

    it('should render second anchor link in layout correctly', async () => {
      await hoverOnHeading(page, '#Heading-in-layout\\.1');
    });
  });
  describe('Legacy UX', () => {
    beforeEach(async () => {
      page = global.page;
      await initRendererWithADF(page, {
        adf: headings,
        rendererProps: {
          allowHeadingAnchorLinks: true,
          disableHeadingIDs: false,
        },
        appearance: 'full-page',
      });
    });

    afterEach(async () => {
      await snapshot(page);
    });

    test.each([1, 2, 3, 4, 5, 6])(
      'should render anchor link tooltip for h%s correctly',
      async headingLevel => {
        await hoverOnHeading(page, `h${headingLevel}:first-of-type`);
      },
    );

    it('should render first anchor link in layout correctly', async () => {
      await hoverOnHeading(page, '#Heading-in-layout');
    });

    it('should render second anchor link in layout correctly', async () => {
      await hoverOnHeading(page, '#Heading-in-layout\\.1');
    });
  });
});

describe('Nested Headings', () => {
  const initRendererForNestedHeaders = async (
    page: PuppeteerPage,
    activeHeadingId: string,
  ) => {
    await initRendererWithADF(page, {
      adf: nestedHeadings,
      rendererProps: {
        allowHeadingAnchorLinks: {
          allowNestedHeaderLinks: true,
          activeHeadingId,
        },
        disableHeadingIDs: false,
      },
      appearance: 'full-page',
    });
  };

  it.each(['test1', 'test3', 'test7'])(
    'should open the expand containing the header %s',
    async (headerId: string) => {
      const page = global.page;
      await initRendererForNestedHeaders(page, headerId);
      await page.waitForSelector(`#${headerId}`);
      await snapshot(page, {}, rendererSelectors.document);
    },
  );
});
