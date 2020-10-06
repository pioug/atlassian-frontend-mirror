import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  comment,
  fullpage,
  editable,
  linkToolbar,
} from '../_helpers';
import { messages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

const linkText1 = 'http://hello.com ';
const linkText2 = 'FAB-983';

// These tests verify correct beahviour for pages which aren't
// supported by Smartlinks from the CMD + K menu
//
// https://product-fabric.atlassian.net/browse/ED-4162 - Firefox
// Floating toolbar is not showin up on IE and edge
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-text.ts: Link: edit text to display with ${editor.name} editor`,
    {
      skip: ['edge', 'safari', 'firefox'],
    },
    async (client: any, testName: string) => {
      const textToDisplayInput = '[placeholder="Text to display"]';
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

      await browser.waitForSelector('[aria-label="Edit link"]');
      await browser.click('[aria-label="Edit link"]');

      await browser.waitForSelector(textToDisplayInput);
      await browser.type(textToDisplayInput, 'mmm');
      await browser.keys('Return');
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  BrowserTestCase(
    `hyperlink-text.ts: Link:edit with ${editor.name} editor`,
    {
      skip: ['edge', 'safari', 'firefox'],
    },
    async (client: any, testName: string) => {
      const textToDisplayInput = '[placeholder="Text to display"]';
      let browser = new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(editable);

      await browser.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await browser.type(linkToolbar, linkText2);
      await browser.keys(['ArrowDown', 'Return']);
      await browser.waitForSelector('a');

      await browser.keys(['ArrowLeft', 'ArrowLeft']);
      await browser.waitForSelector('[aria-label="Edit link"]');
      await browser.click('[aria-label="Edit link"]');

      await browser.waitForSelector(textToDisplayInput);
      await browser.type(textToDisplayInput, 'mmm');
      await browser.keys('Return');
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  BrowserTestCase(
    `hyperlink-text.ts: Link:edit with ${editor.name} editor and create with ESC`,
    {
      skip: ['edge', 'safari', 'firefox'],
    },
    async (client: any, testName: string) => {
      const textToDisplayInput = '[placeholder="Text to display"]';
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
      await browser.waitForSelector('[aria-label="Edit link"]');
      await browser.click('[aria-label="Edit link"]');

      await browser.waitForSelector(textToDisplayInput);
      await browser.type(textToDisplayInput, 'mmm');
      await browser.keys('Escape');
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
