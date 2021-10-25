import {
  PuppeteerPage,
  waitForTooltip,
  waitForNoTooltip,
} from '@atlaskit/visual-regression/helper';
import { RendererPropsOverrides } from '../../__helpers/testing-example-helpers';
import { HeadingAnchorWrapperClassName } from '../../../react/nodes/heading-anchor';
import { selectors } from '../../__helpers/page-objects/_renderer';
import { snapshot } from '../_utils';

// ADF Fixtures
import headingsLeftAligned from '../../__fixtures__/headings-aligned-left.adf.json';
import headingsCenterAligned from '../../__fixtures__/headings-aligned-center.adf.json';
import headingsRightAligned from '../../__fixtures__/headings-aligned-right.adf.json';

// Helper for getting renderer props with or heading links enabled
function getRendererProps(
  enableHeadingLinks = false,
  legacy = false,
  activeHeadingId?: string,
): RendererPropsOverrides {
  if (!enableHeadingLinks) {
    return {
      disableHeadingIDs: false,
      allowHeadingAnchorLinks: false,
    };
  }
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
export const propsWithoutHeadingLinksEnabled = getRendererProps(false);

// `allowHeadingAnchorLinks` is object based
export const propsWithHeadingLinksEnabled = getRendererProps(true);
export const propsWithHeadingLinksEnabledWithHash = (activeHeadingId: string) =>
  getRendererProps(true, false, activeHeadingId);

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
 * as as a shortcut to mimicking the mobile experience. In Chrome this disables the media
 * query support automatically.
 * This is technically a no-op until Puppeteer supports the media query, but it's functional
 * on real Chrome for the case of debug runs.
 */
export async function spoofMediaQuery(page: PuppeteerPage) {
  const css = `.${HeadingAnchorWrapperClassName} {
      visibility: hidden;
    }
    .heading-wrapper:hover .${HeadingAnchorWrapperClassName} {
      visibility: visible;
    }`;
  await page.addStyleTag({
    content: css,
  });
}

export type Alignment = 'left' | 'center' | 'right';

export function getAlignmentADF(
  alignment: Alignment,
  injectParagraphs = false,
) {
  let adf: any;

  switch (alignment) {
    case 'left':
      adf = headingsLeftAligned;
      break;
    case 'center':
      adf = headingsCenterAligned;
      break;
    case 'right':
      adf = headingsRightAligned;
      break;
  }

  if (injectParagraphs) {
    adf = Object.assign({}, adf);

    // Add paragraphs to before and after the headings to show their alignment relative to the page margin.
    const paragraphFragment = {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Paragraph',
        },
      ],
    };
    const content: any[] = adf.content;
    content.unshift(paragraphFragment);
    content.push(paragraphFragment);
  }

  return adf;
}

async function animationFrame(page: any) {
  // Give browser time to render, waitForFunction by default fires on RAF.
  await page.waitForFunction('1 === 1');
}

export async function takeScreenshot(
  page: PuppeteerPage,
  snapshotMargin = false,
  snapshotWholePage = false,
) {
  if (snapshotWholePage) {
    await snapshot(page);
    return;
  }
  const screenshotSelector = snapshotMargin
    ? selectors.container
    : selectors.document;
  await snapshot(page, undefined, screenshotSelector);
}

export type HoverOnHeadingOptions = {
  snapshotMargin?: boolean;
  snapshotWholePage?: boolean;
  showTooltip?: boolean;
  screenshotOnHeadingHover?: boolean;
  screenshotOnCopyTooltip?: boolean;
  screenshotOnCopiedTooltip?: boolean;
};

export async function hoverOnHeadingWithLinkThenSnapshot(
  page: PuppeteerPage,
  headingSelector: string,
  options: HoverOnHeadingOptions = {
    snapshotMargin: false,
    snapshotWholePage: false,
    screenshotOnHeadingHover: true,
    screenshotOnCopyTooltip: false,
    screenshotOnCopiedTooltip: false,
  },
) {
  const {
    snapshotMargin,
    snapshotWholePage,
    screenshotOnHeadingHover,
    screenshotOnCopyTooltip,
    screenshotOnCopiedTooltip,
  } = options;
  // Hover over the heading and wait for the copy link button to appear
  await page.waitForSelector(headingSelector);
  await page.hover(headingSelector);

  const btnSelector = `${headingSelector} + span button`;
  await page.waitForSelector(btnSelector, { visible: true });
  await animationFrame(page);

  if (screenshotOnHeadingHover) {
    // Take screenshot without a tooltip
    await takeScreenshot(page, snapshotMargin, snapshotWholePage);
  }

  if (screenshotOnCopyTooltip || screenshotOnCopiedTooltip) {
    // Hover over the copy link button and wait for the tooltip
    await page.hover(btnSelector);
    await waitForTooltip(page, 'Copy link to heading');

    if (screenshotOnCopyTooltip) {
      // Take screenshot of copy link state
      await takeScreenshot(page, snapshotMargin, snapshotWholePage);
    }

    if (screenshotOnCopiedTooltip) {
      /*
      // FIXME: Copy to clipboard requires host OS permissions.
      // It's functional on Docker for Mac, but disabled in CI.
      // In theory the below code should allow its enablement in CI
      // but alas, it doesn't work.
      // Leaving this here in case someone else can figure it out.
      //
      // Ideally this could be set globally so all tests can benefit
      // without boilerplate: `build/test-utils/visual-regression/config/jest/globalSetup.js`

      beforeAll(async () => {
        const ctx = global.page.browser().defaultBrowserContext();
        const baseUrl = String(global.__BASEURL__);
        await ctx.overridePermissions(baseUrl, [
          'clipboard-write',
          'clipboard-read',
        ]);
      });
      afterAll(async () => {
        const ctx = global.page.browser().defaultBrowserContext();
        await ctx.clearPermissionOverrides();
      });
      */
      // Click the copy link button
      // await page.click(btnSelector);
      // await waitForTooltip(page, 'Copied!');
      // Take screenshot of copied link state
      // await takeScreenshot(page, snapshotMargin, snapshotWholePage);
    }

    // Click the center of the heading to move away so that it doesn't
    // impact subsequent calls to this method
    await page.click(headingSelector);
    await waitForNoTooltip(page);
  }
}
