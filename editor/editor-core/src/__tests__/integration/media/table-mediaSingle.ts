import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  insertMedia,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  Appearance,
  editorCommentContentSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

const editors: { appearance: Appearance; snapshotSelector?: string }[] = [
  { appearance: Appearance.fullPage },
  {
    appearance: Appearance.comment,
    snapshotSelector: editorCommentContentSelector,
  },
];

editors.forEach((editor) => {
  BrowserTestCase(
    `Media tables : ${editor.appearance} editor, can insert into table`,
    { skip: [] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: editor.appearance,
        allowTables: {
          advanced: true,
        },
        media: {
          allowMediaSingle: true,
          allowMediaGroup: true,
        },
      });
      await page.click(
        `[aria-label="${insertBlockMessages.table.defaultMessage}"]`,
      );
      // second cell
      await page.keys('ArrowDown');

      await insertMedia(page);
      expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
        true,
      );

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
