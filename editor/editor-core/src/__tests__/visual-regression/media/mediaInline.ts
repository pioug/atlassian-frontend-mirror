// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

const getMediaInlineAdf = () => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'mediaInline',
          attrs: {
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            collection: 'MediaServicesSample',
            alt: '',
          },
        },
      ],
    },
  ],
});

const mediaInlineLoadedViewSelector =
  '[data-testid="media-inline-card-loaded-view"]';

async function initEditor(page: PuppeteerPage) {
  await initFullPageEditorWithAdf(
    page,
    getMediaInlineAdf(),
    Device.LaptopMDPI,
    undefined,
    {
      media: {
        featureFlags: {
          mediaInline: true,
        },
      },
    },
  );

  await page.waitForSelector(mediaInlineLoadedViewSelector, {
    visible: true,
  });
}

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: Media Inline', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  describe('in editor', () => {
    it('should be visible', async () => {
      await initEditor(page);
    });

    it('should be selected', async () => {
      await initEditor(page);
      await page.click(mediaInlineLoadedViewSelector);
      await page.mouse.move(0, 0);
    });
  });
});
