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

describe('Snapshot Test: Media with link', () => {
  let page: Page;

  beforeEach(() => {
    page = global.page;
  });

  describe('in the toolbar', () => {
    describe('when media-link feature flag is enable', () => {
      let mediaLink = '';
      beforeEach(async () => {
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
      });

      it('should enable open link button if the link is safe', async () => {
        mediaLink = 'https://www.atlassian.com';
        await page.waitForSelector('.hyperlink-open-link', {
          visible: true,
        });
        await page.hover('.hyperlink-open-link');
        await waitForTooltip(page);
        await snapshot(page);
      });

      it('should disable open link button if the link is unsafe', async () => {
        mediaLink = "javascript:alert('hacks')";
        await page.waitForSelector('.hyperlink-open-link', {
          visible: true,
        });
        await page.hover('.hyperlink-open-link');
        await waitForTooltip(page);
        await snapshot(page);
      });
    });
  });
});
