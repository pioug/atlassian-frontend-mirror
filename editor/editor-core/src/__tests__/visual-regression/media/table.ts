// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { scrollToTable } from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import mediaSingleAdf from './__fixtures__/mediaSingle-in-table.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: Media', () => {
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
