import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import adf from '../../../../__tests__/visual-regression/common/__fixtures__/with-content.json';

const BEFORE_PRIMARY_TOOLBAR_SELECTOR =
  '[data-testid="before-primary-toolbar-components-plugin"]';
const MAIN_TOOLBAR_SELECTOR = '[data-testid="ak-editor-main-toolbar"]';

describe('Before Primary Toolbar Components:', () => {
  let page: PuppeteerPage;

  const initEditor = async (
    adf: any,
    primaryToolbarComponents: any,
    viewport = { width: 1280, height: 300 },
  ) => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport,
      editorProps: {
        primaryToolbarComponents,
      },
    });
  };

  it('should render before primary editor toolbar components plugin when primary toolbar component is passed to editor with a before key', async () => {
    await initEditor(adf, { before: <div></div>, after: <div></div> });
    await page.waitForSelector(BEFORE_PRIMARY_TOOLBAR_SELECTOR);
    await snapshot(page, undefined, MAIN_TOOLBAR_SELECTOR);
  });

  it('should not render before primary editor toolbar components plugin when primary toolbar component is passed to editor without a before key', async () => {
    await initEditor(adf, { after: <div></div> });
    await page.waitForSelector(MAIN_TOOLBAR_SELECTOR);
    await snapshot(page, undefined, MAIN_TOOLBAR_SELECTOR);
  });

  it('should not render before primary editor toolbar components plugin when primary toolbar component is passed to editor without keys', async () => {
    await initEditor(adf, <div></div>);
    await page.waitForSelector(MAIN_TOOLBAR_SELECTOR);
    await snapshot(page, undefined, MAIN_TOOLBAR_SELECTOR);
  });
});
