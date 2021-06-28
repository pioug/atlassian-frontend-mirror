import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import { EditorAppearance } from '../../../types';

const baseADF = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

const panelSelector = '.ak-editor-panel__content p';
const gapCursorSelector = '.ProseMirror-gapcursor span';

['comment', 'full-page'].forEach((editor) => {
  ['Left', 'Right'].forEach((direction) => {
    BrowserTestCase(
      `gap-cursor: should display to ${direction} of block node after hitting ${direction} key for ${editor} editor`,
      { skip: ['edge'] },
      async (client: any) => {
        const page = await goToEditorTestingWDExample(client);

        await mountEditor(page, {
          appearance: editor as EditorAppearance,
          allowPanel: true,
          defaultValue: baseADF,
        });

        await page.waitForSelector(panelSelector);
        await page.click(panelSelector);
        await page.keys([`Arrow${direction}`, `Arrow${direction}`]);

        const gapCursorVisible = await page.isVisible(gapCursorSelector);
        expect(gapCursorVisible).toBe(true);
      },
    );
  });
});
