import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';
import { waitForMediaToBeLoaded } from '../../../../__tests__/__helpers/page-objects/_media';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

const getMediaWithLink = (link: string) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
      },
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            collection: 'MediaServicesSample',
            width: 320,
            height: 320,
          },
        },
      ],
      marks: [
        {
          type: 'link',
          attrs: {
            href: link,
          },
        },
      ],
    },
  ],
});

async function initEditor(page: PuppeteerPage, mediaLink: string) {
  await initFullPageEditorWithAdf(
    page,
    getMediaWithLink(mediaLink),
    Device.LaptopMDPI,
    undefined,
    {
      media: {
        allowMediaSingle: true,
        allowLinking: true,
      },
    },
  );

  await waitForMediaToBeLoaded(page);

  await retryUntilStablePosition(
    page,
    async () => await page.click('.mediaSingleView-content-wrap'),
    '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"] [aria-label="Edit link"]',
    1000,
  );
}

describe('Snapshot Test: Media with link', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('in the toolbar', () => {
    describe('when media-link feature flag is enable', () => {
      afterEach(async () => {
        await page.waitForSelector('.hyperlink-open-link', {
          visible: true,
        });
        await page.hover('.hyperlink-open-link');
        await waitForTooltip(page);
        // Additional delay to prevent flaky results for when the toolbar
        // hasn't finished centering underneath the media single.
        await page.waitFor(100);
        await snapshot(page);
      });

      // These tests are fixed in develop
      // Un-skip when merge to develop
      it.skip('should enable open link button if the link is safe', async () => {
        await initEditor(page, 'https://www.atlassian.com');
      });

      it.skip('should disable open link button if the link is unsafe', async () => {
        await initEditor(page, `javascript:alert('hacks')`);
      });
    });
  });
});
