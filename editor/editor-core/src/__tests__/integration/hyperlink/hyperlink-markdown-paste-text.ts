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
    `hyperlink-markdown-paste-text.ts: Link - link markdown with pasting link text ${editor.name} editor`,
    {
      skip: ['ie', 'edge', 'safari'],
    },
    async (client: any, testName: string) => {
      const sample = new Page(client);
      await copyToClipboard(sample, 'https://hello.com');

      await sample.goto(editor.path);
      await sample.waitForSelector(editor.placeholder);
      await sample.click(editor.placeholder);
      await sample.waitForSelector(editable);

      await sample.type(editable, ['[link1](']);
      await sample.paste();
      await sample.type(editable, [')']);

      const doc = await sample.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
