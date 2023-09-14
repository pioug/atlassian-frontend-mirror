// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { scrollToTable } from '@atlaskit/editor-test-helpers/page-objects/table';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import mediaSingleAdf from './__fixtures__/mediaSingle-in-table.adf.json';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;
  const initEditorWithMedia = async (appearance: Appearance) => {
    await initEditorWithAdf(page, {
      appearance: appearance,
      adf: mediaSingleAdf,
      editorProps: {
        media: {
          allowMediaSingle: true,
        },
        allowTables: {
          advanced: true,
        },
      },
    });
  };

  beforeAll(async () => {
    page = global.page;
  });

  it('can insert into fullPage appearance', async () => {
    await initEditorWithMedia(Appearance.fullPage);
    await waitForMediaToBeLoaded(page);
    await scrollToTable(page);

    await snapshot(page);
  });

  it('can insert into comment appearance', async () => {
    await initEditorWithMedia(Appearance.comment);
    await waitForMediaToBeLoaded(page);
    await scrollToTable(page);

    await snapshot(page);
  });
});
