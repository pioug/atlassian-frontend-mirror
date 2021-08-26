import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initRendererWithADF } from '../_utils';
import {
  hoverOnHeadingWithLinkThenSnapshot,
  propsWithHeadingLinksEnabled,
  propsWithHeadingLinksEnabledWithHash,
  spoofMediaQuery,
} from './_heading-utils';
import adfHeadingsNestedLayout from '../../__fixtures__/headings-nested-layout.adf.json';
import adfHeadingsNestedPanel from '../../__fixtures__/headings-nested-panel.adf.json';
import adfHeadingsNestedTable from '../../__fixtures__/headings-nested-table.adf.json';
import adfHeadingsNestedExpands from '../../__fixtures__/headings-nested-expands.adf.json';

// Headings with anchor links enabled which are nested inside other container nodes
// FIXME: flaky test https://product-fabric.atlassian.net/browse/ED-13530
describe.skip('Nested headings with links', () => {
  let page: PuppeteerPage;

  const setPage = () => (page = global.page);

  beforeAll(setPage);
  beforeEach(setPage);

  describe('inside a layout', () => {
    it('should render anchor links on heading hover', async () => {
      await initRendererWithADF(page, {
        adf: adfHeadingsNestedLayout,
        rendererProps: propsWithHeadingLinksEnabled,
        appearance: 'full-page',
        viewport: {
          // smallest width to ensure the 2 col layout doesn't stack vertically.
          // This is a limitation of the testing page, not a general limitation.
          width: 1025,
          height: 400,
        },
      });
      await spoofMediaQuery(page);
      await hoverOnHeadingWithLinkThenSnapshot(page, '#LC-Heading-C');
      await hoverOnHeadingWithLinkThenSnapshot(page, '#RC-Heading-C');
    });
  });

  describe('inside a table', () => {
    beforeAll(async () => {
      await initRendererWithADF(page, {
        adf: adfHeadingsNestedTable,
        rendererProps: {
          ...propsWithHeadingLinksEnabled,
          allowColumnSorting: true,
        },
        appearance: 'full-page',
        viewport: {
          width: 640,
          height: 400,
        },
      });
      await spoofMediaQuery(page);
    });

    it('should render anchor links on heading hover', async () => {
      await hoverOnHeadingWithLinkThenSnapshot(page, '#Table-Heading-4');
      await hoverOnHeadingWithLinkThenSnapshot(
        page,
        '#Multiline-heading-that-wraps',
      );
    });
    it('should prematurely wrap heading when column sorting is enabled', async () => {
      // Reduce viewport width to force the multiline heading to wrap the
      // heading anchor link button onto a new line so that it doesn't impact
      // the column's sort button...
      await page.setViewport({ width: 620, height: 400 });
      await hoverOnHeadingWithLinkThenSnapshot(
        page,
        '#Multiline-heading-that-wraps',
      );
    });
  });

  describe('inside a panel', () => {
    it('should render anchor links on heading hover', async () => {
      await initRendererWithADF(page, {
        adf: adfHeadingsNestedPanel,
        rendererProps: propsWithHeadingLinksEnabled,
        appearance: 'full-page',
        viewport: {
          width: 320,
          height: 400,
        },
      });
      await spoofMediaQuery(page);
      await hoverOnHeadingWithLinkThenSnapshot(page, 'h4:first-of-type');
    });
  });

  describe('inside an expand', () => {
    it.each(['Heading-1', 'Heading-3'])(
      'should open expand containing deep linked heading and render anchor link on heading hover',
      async (headingId: string) => {
        await initRendererWithADF(page, {
          adf: adfHeadingsNestedExpands,
          rendererProps: propsWithHeadingLinksEnabledWithHash(headingId),
          appearance: 'full-page',
          viewport: {
            width: 320,
            height: 400,
          },
        });
        await spoofMediaQuery(page);
        await hoverOnHeadingWithLinkThenSnapshot(page, `#${headingId}`);
      },
    );
  });
});
