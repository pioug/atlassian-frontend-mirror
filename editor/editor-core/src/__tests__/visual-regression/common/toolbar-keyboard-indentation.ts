import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  Appearance,
  editorSelector,
  initEditorWithAdf,
  clickQuerySelectorElement,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { selectToolbarMenuWithKeyboard } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import * as indentedAdf from './__fixtures__/indented-nodes-adf.json';
import * as outdentedAdf from './__fixtures__/outdented-nodes-adf.json';

const buttonSelectors = {
  indent: '[data-testid="indent"]',
  outdent: '[data-testid="outdent"]',
};

describe('toolbar accessbility', () => {
  let page: PuppeteerPage;

  describe('triggering the outdentation button with the keyboard', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        viewport: { width: 1000, height: 500 },
        adf: indentedAdf,
        editorProps: {
          featureFlags: {
            indentationButtonsInTheToolbar: true,
          },
        },
      });
      await page.waitForSelector(buttonSelectors.outdent);
      await page.waitForSelector(buttonSelectors.indent);
    });

    // Skip due to failing VR Tests: https://product-fabric.atlassian.net/browse/ED-17719
    it.skip('should outdent for paragraphs', async () => {
      await clickQuerySelectorElement(page, 'p');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.outdent);
      await pressKey(page, 'Enter');

      await snapshot(page, undefined, editorSelector);
    });

    // Skip due to failing VR Tests: https://product-fabric.atlassian.net/browse/ED-17719
    it.skip('should outdent for headings', async () => {
      await clickQuerySelectorElement(page, 'h1');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.outdent);
      await pressKey(page, 'Enter');

      await snapshot(page, undefined, editorSelector);
    });

    // Skip due to failing VR Tests: https://product-fabric.atlassian.net/browse/ED-17719
    it.skip('should outdent for bullet lists', async () => {
      await clickQuerySelectorElement(page, 'li');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.outdent);
      await pressKey(page, 'Enter');

      await snapshot(page, undefined, editorSelector);
    });

    // Skip due to failing VR Tests: https://product-fabric.atlassian.net/browse/ED-17719
    it.skip('should outdent for task lists', async () => {
      await clickQuerySelectorElement(page, '.task-item', 1);

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.outdent);
      await pressKey(page, 'Enter');

      await snapshot(page, undefined, editorSelector);
    });
  });

  describe('triggering the indentation button with the keyboard', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        viewport: { width: 1000, height: 500 },
        adf: outdentedAdf,
        editorProps: {
          featureFlags: {
            indentationButtonsInTheToolbar: true,
          },
        },
      });
      await page.waitForSelector(buttonSelectors.outdent);
      await page.waitForSelector(buttonSelectors.indent);
    });

    // Skip due to failing VR Tests: https://product-fabric.atlassian.net/browse/ED-17719
    it.skip('should indent for paragraphs', async () => {
      await clickQuerySelectorElement(page, 'p');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      await snapshot(page, undefined, editorSelector);
    });

    // Skip due to failing VR Tests: https://product-fabric.atlassian.net/browse/ED-17719
    it.skip('should indent for headings', async () => {
      await clickQuerySelectorElement(page, 'h1');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      await snapshot(page, undefined, editorSelector);
    });

    // Skip due to failing VR Tests: https://product-fabric.atlassian.net/browse/ED-17719
    it.skip('should indent for bullet lists', async () => {
      await clickQuerySelectorElement(page, 'li', 5);

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      await snapshot(page, undefined, editorSelector);
    });

    // Skip due to failing VR Tests: https://product-fabric.atlassian.net/browse/ED-17719
    it.skip('should indent for task lists', async () => {
      await clickQuerySelectorElement(page, '.task-item', 5);

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      await snapshot(page, undefined, editorSelector);
    });
  });
});
