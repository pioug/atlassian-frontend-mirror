import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  comment,
  fullpage,
  editable,
  copyToClipboard,
} from '../_helpers';

[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-2.ts: Link - paste link and add text, paste link into list for ${editor.name} editor`,
    { skip: ['edge', 'ie', 'safari'] },
    async (client: any, testName: string) => {
      const sample = new Page(client);
      const linkText1 = 'https://www.google.com';
      await copyToClipboard(
        sample,
        `<a href="${linkText1}">${linkText1}</a>`,
        'html',
      );
      await sample.goto(editor.path);
      await sample.waitForSelector(editor.placeholder);
      await sample.click(editor.placeholder);
      await sample.waitForSelector(editable);
      await sample.paste();
      await sample.type(editable, '.');
      await sample.keys(['Return']);

      // paste link into list
      await sample.type(editable, '* ');
      await sample.waitForSelector('li');
      await sample.paste();

      await sample.waitForSelector('a');
      const doc = await sample.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
