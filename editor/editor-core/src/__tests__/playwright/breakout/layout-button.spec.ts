import {
  EditorLayoutFloatingToolbarModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

test.describe('feature name: libra test', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowBreakout: true,
      allowLayouts: true,
    },
  });

  test.describe('breakout button hidden below popups', () => {
    test.describe('when the typeahead popup is above breakout button', () => {
      test('the breakout button should not be visible', async ({ editor }) => {
        await editor.typeAhead.searchAndInsert('Layouts');
        await editor.keyboard.type('a');
        await editor.waitForEditorStable();
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.type('b');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('c                                     ');
        await editor.page.setViewportSize({
          width: 1300,
          height: 300,
        });
        await editor.typeAhead.search('');
        const layoutFloatingToolbarModel =
          EditorLayoutFloatingToolbarModel.from(editor);
        const layoutBreakoutLocator =
          await layoutFloatingToolbarModel.breakoutGoWideButton;
        await editor.waitForEditorStable();
        await expect(layoutBreakoutLocator).not.toBeInSight();
      });
    });

    test.describe('when the link popup is above breakout button', () => {
      test('the breakout button should not be visible', async ({ editor }) => {
        await editor.typeAhead.searchAndInsert('Layouts');
        await editor.keyboard.type('a');
        await editor.waitForEditorStable();
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.type('b');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.press('Enter');
        await editor.keyboard.type('c                                     ');
        await editor.page.setViewportSize({
          width: 1300,
          height: 300,
        });
        await editor.typeAhead.searchAndInsert('Link');
        const layoutFloatingToolbarModel =
          EditorLayoutFloatingToolbarModel.from(editor);
        const layoutBreakoutLocator =
          await layoutFloatingToolbarModel.breakoutGoWideButton;

        await editor.waitForEditorStable();
        await expect(layoutBreakoutLocator).not.toBeInSight();
      });
    });
  });
});
