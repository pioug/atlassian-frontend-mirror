import {
  editorTestCase as test,
  EditorExpandModel,
  expect,
  EditorNodeContainerModel,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import { expandAdf } from './tab-navigation.spec.ts-fixtures/adf';

test.use({
  adf: expandAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    allowExpand: true,
  },
});

test.describe('expand', () => {
  ['Enter', 'Space'].forEach((key) => {
    test(`when press tab + ${key}, should collapse the expand, press ${key} again, should expand the expand`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'DTR-1687',
        reason: 'Press tab does not focus on expand icon in safari',
        browsers: [BROWSERS.webkit],
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const expandModel = EditorExpandModel.from(nodes.expand);

      //make sure the cursor is before the expand
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');

      // tab should set focus to expand icon
      await editor.keyboard.press('Tab');
      const isFocused = await expandModel.isExpandIconFocused();
      expect(isFocused).toBeTruthy();

      // press {key} should collapse the expand
      await editor.keyboard.press(key);
      let isExpanded = await expandModel.isExpanded();
      expect(isExpanded).toBeFalsy();

      // press {key} again should expand the expand
      await editor.keyboard.press(key);
      isExpanded = await expandModel.isExpanded();
      expect(isExpanded).toBeTruthy();
    });
  });
});
