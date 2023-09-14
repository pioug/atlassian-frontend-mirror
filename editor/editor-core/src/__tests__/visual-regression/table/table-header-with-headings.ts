import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectElementWithText } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import tableAdf from './__fixtures__/table-headers-with-headings.adf.json';

describe('Table headers with headings', () => {
  let page: PuppeteerPage;

  const initEditor = async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: tableAdf,
      viewport: { width: 1280, height: 920 },
    });
  };

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor();
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should render first heading in header without margin-top', async () => {
    await page.waitForSelector('h1');
    await selectElementWithText({
      page,
      tag: 'h2',
      text: 'How are you?',
    });
    await waitForFloatingControl(page, 'Table floating controls');
  });
});
