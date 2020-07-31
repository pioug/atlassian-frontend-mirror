import { waitForTooltip } from '@atlaskit/visual-regression/helper';
import { Page } from '../../../../__tests__/__helpers/page-objects/_types';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';

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
            type: 'external',
            width: 320,
            height: 320,
            url:
              'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
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

async function initEditor(page: Page, mediaLink: string) {
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

  await page.click('.mediaSingleView-content-wrap');

  await page.waitForSelector('[aria-label="Edit link"]', {
    visible: true,
  });
}

describe('Snapshot Test: Media with link', () => {
  let page: Page;

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
