import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  comment,
  fullpage,
  editable,
  linkToolbar,
  setProseMirrorTextSelection,
} from '../_helpers';
import { messages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

const linkText1 = 'http://hello.com ';
const linkText2 = 'FAB-983';

// This test verifies correct beahviour for page which aren't
// supported by Smartlinks from the CMD + K menu
//
// https://product-fabric.atlassian.net/browse/ED-4162 - Firefox
// Floating toolbar is not showin up on IE and edge
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-1.ts: Link:create link using toolbar,unlinkify ${editor.name} editor`,
    {
      skip: ['edge', 'safari', 'firefox'],
    },
    async (client: any, testName: string) => {
      let browser = new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(editable);

      await browser.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await browser.waitForSelector(linkToolbar);
      await browser.type(linkToolbar, linkText2);
      await browser.keys(['ArrowDown', 'Return']);
      await browser.waitForSelector('a');

      // unlink
      await browser.keys(['Return']);
      await browser.type(editable, linkText1);
      await browser.keys(['ArrowLeft', 'ArrowLeft']);
      await browser.waitForSelector('[aria-label=Unlink]');
      await browser.click('[aria-label=Unlink]');

      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  BrowserTestCase(
    `can open hyperlink toolbar`,
    { skip: ['edge'] },
    async (client: any) => {
      const page = await goToEditorTestingExample(client);

      await mountEditor(page, {
        appearance: fullpage.appearance,
        annotationProviders: true,
      });

      await page.type(editable, 'Over 9000');
      await setProseMirrorTextSelection(page, { anchor: 1, head: 5 });
      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkToolbar);
      expect(await page.isExisting(linkToolbar)).toBe(true);
    },
  );

  BrowserTestCase(
    `can close hyperlink toolbar with escape key press`,
    { skip: ['edge'] },
    async (client: any) => {
      const page = await goToEditorTestingExample(client);

      await mountEditor(page, {
        appearance: fullpage.appearance,
        annotationProviders: true,
      });

      await page.type(editable, 'Over 9000');
      await setProseMirrorTextSelection(page, { anchor: 1, head: 5 });
      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkToolbar);
      expect(await page.isExisting(linkToolbar)).toBe(true);
      await page.type(editable, 'Escape');
      expect(await page.isExisting(linkToolbar)).toBe(false);
    },
  );
});
