import {
  PuppeteerPage,
  waitForTooltip,
  emulateDevice,
} from '@atlaskit/visual-regression/helper';
import { RendererAppearance } from '../../';
import { snapshot, initRendererWithADF, animationFrame } from './_utils';
import headings from '../__fixtures__/headings-adf.json';
import nestedHeadings from '../__fixtures__/nested-headings-adf.json';
import { selectors as rendererSelectors } from '../__helpers/page-objects/_renderer';
import { RendererPropsOverrides } from '../__helpers/testing-example-helpers';
import { HeadingAnchorWrapperClassName } from '../../react/nodes/heading-anchor';

const hoverOnHeading = async (page: PuppeteerPage, selector: string) => {
  await page.waitForSelector(selector);
  await page.hover(selector);
  await page.waitForSelector(`${selector} button`);
  await page.hover(`${selector} button`);
  await waitForTooltip(page);
};

function getRendererProps(
  legacy = false,
  activeHeadingId?: string,
): RendererPropsOverrides {
  return {
    disableHeadingIDs: false,
    allowHeadingAnchorLinks: legacy
      ? true
      : {
          allowNestedHeaderLinks: true,
          activeHeadingId,
        },
  };
}

// `allowHeadingAnchorLinks` is object based
const propsWithHeadingLinksEnabled = getRendererProps();

// `allowHeadingAnchorLinks` is a boolean instead of object
const legacypropsWithHeadingLinksEnabled = getRendererProps(true);

const initRenderer = async (
  page: PuppeteerPage,
  rendererProps: RendererPropsOverrides,
  appearance: RendererAppearance,
  adf: any = headings,
) => {
  await initRendererWithADF(page, {
    adf,
    rendererProps,
    appearance,
    viewport: {
      width: 500,
      height: 600,
    },
  });
};

/**
 * We use a CSS media query `(hover: hover) and (pointer: fine)` to set hover effects
 * for the nested header links on platforms that support a mouse.
 *
 * By default the buttons are visible (which is what we use for mobile), and the media
 * query changes that to be hidden by default, and shown on hover.
 *
 * Although this is supported in Chrome (and other browsers), the media query features
 * are disabled when Puppeteer runs headlessly.
 *
 * @see https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageemulatemediafeaturesfeatures
 * @see https://github.com/puppeteer/puppeteer/issues/5096
 *
 * Ideally we could emulate these features, but those properties aren't supported yet. e.g.
 *
 * ```
 * await page.emulateMediaFeatures([
 *    { name: 'hover', value: 'hover' },
 *    { name: 'pointer', value: 'fine' },
 * ]);
 *
 * The below CSS is an aproximation of what the real CSS does to toggle the visibility
 * so that the visual snapshots are accurately representative. It uses the `visibility`
 * property to ensure it doesn't negatively impact the real styles.
 *
 * To validate the default persistently visible experience on mobile we use device emulation
 * as as a shortcut to minimicking the mobile experience. In Chrome this disables the media
 * query support automatically.
 * This is technically a no-op until Puppeteer supports the media query, but it's functional
 * on real Chrome for the case of debug runs.
 */
async function spoofMediaQuery(page: PuppeteerPage) {
  const css = `.${HeadingAnchorWrapperClassName} {
      visibility: hidden;
    }
    h1:hover .${HeadingAnchorWrapperClassName},
    h2:hover .${HeadingAnchorWrapperClassName},
    h3:hover .${HeadingAnchorWrapperClassName},
    h4:hover .${HeadingAnchorWrapperClassName},
    h5:hover .${HeadingAnchorWrapperClassName},
    h6:hover .${HeadingAnchorWrapperClassName} {
      visibility: visible;
    }`;
  await page.addStyleTag({
    content: css,
  });
}

describe('Headings:', () => {
  let page: PuppeteerPage;
  let disableEmulation: (() => Promise<void>) | undefined;

  beforeEach(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);

    if (disableEmulation) {
      // Remove emulation so that it doesn't impact subsequent tests
      await disableEmulation();
      disableEmulation = undefined;
    }
  });

  describe('mobile', () => {
    it('should render persistently visible anchor link tooltip on mobile', async () => {
      /**
       * To validate the default persistently visible experience on mobile we use device emulation
       * as as a shortcut to minimicking the mobile experience.
       *
       * Note that although emulation shrinks the viewport to the mobile device width,
       * the `initRenderer` function resizes the viewport back to the desktop width internally.
       */
      disableEmulation = await emulateDevice(page, 'iPhone X');
      await initRenderer(page, propsWithHeadingLinksEnabled, 'mobile');
      await page.waitForSelector('h2:first-of-type');
    });
  });

  describe('unsupported appearance', () => {
    it("should not render anchor link tooltip when appearance === 'comment'", async () => {
      await initRenderer(page, propsWithHeadingLinksEnabled, 'comment');
      await page.waitForSelector('h2:first-of-type');
      await page.hover('h2:first-of-type');
      await animationFrame(page);
    });
  });

  describe('Nested UX', () => {
    beforeEach(async () => {
      await initRenderer(page, propsWithHeadingLinksEnabled, 'full-page');
      await spoofMediaQuery(page);
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
      await initRenderer(page, legacypropsWithHeadingLinksEnabled, 'full-page');
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
  it.each(['test1', 'test3', 'test7'])(
    'should open the expand containing the header %s',
    async (headerId: string) => {
      const page = global.page;
      await initRenderer(
        page,
        getRendererProps(false, headerId),
        'full-page',
        nestedHeadings,
      );
      await spoofMediaQuery(page);
      await hoverOnHeading(page, `#${headerId}`);
      await snapshot(page, {}, rendererSelectors.document);
    },
  );
});
