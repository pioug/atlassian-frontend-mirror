import {
  EditorBreakoutModel,
  EditorCodeBlockFloatingToolbarModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  breakout,
  code_block,
  doc,
  layoutColumn,
  layoutSection,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('breakout', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowBreakout: true,
      allowLayouts: true,
    },
  });

  test('breakout: should be able to switch to wide mode', async ({
    editor,
  }) => {
    const breakoutModel = EditorBreakoutModel.from(editor);
    await editor.typeAhead.searchAndInsert('code');
    await test.step('change layout to wide', async () => {
      await breakoutModel.toWide();
    });
    await expect(editor).toMatchDocument(
      doc(breakout({ mode: 'wide' })(code_block({})())),
    );
  });

  test('breakout: should be able to switch to full-width mode', async ({
    editor,
  }) => {
    const breakoutModel = EditorBreakoutModel.from(editor);
    await editor.typeAhead.searchAndInsert('code');
    await test.step('change layout to wide', async () => {
      await breakoutModel.toWide();
    });
    await test.step('change layout to full-width', async () => {
      await breakoutModel.toFullWidth();
    });
    await expect(editor).toHaveDocument(
      doc(breakout({ mode: 'full-width' })(code_block({})())),
    );
  });

  test('breakout: should be able to switch to center mode back', async ({
    editor,
  }) => {
    const breakoutModel = EditorBreakoutModel.from(editor);
    await editor.typeAhead.searchAndInsert('code');
    await test.step('change layout to wide', async () => {
      await breakoutModel.toWide();
    });
    await test.step('change layout to full-width', async () => {
      await breakoutModel.toFullWidth();
    });
    await test.step('change layout to center', async () => {
      await breakoutModel.toCenter();
    });
    await expect(editor).toHaveDocument(doc(code_block({})()));
  });

  test('breakout: width button should appear next to selected component', async ({
    editor,
  }) => {
    await editor.typeAhead.searchAndInsert('code');
    await editor.waitForEditorStable();
    const codeBlockModelFirst =
      EditorCodeBlockFloatingToolbarModel.from(editor);

    await expect(codeBlockModelFirst.breakoutGoWideButton).toBeVisible();

    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await expect(codeBlockModelFirst.breakoutGoWideButton).toBeHidden();
    await editor.keyboard.press('Enter');

    await editor.typeAhead.searchAndInsert('code');

    await expect(codeBlockModelFirst.breakoutGoWideButton).toBeVisible();
  });

  test('breakout: should be able to delete last character inside a "wide" codeBlock preserving the node', async ({
    editor,
  }) => {
    const breakoutModel = EditorBreakoutModel.from(editor);
    await editor.typeAhead.searchAndInsert('code');
    await test.step('change layout to wide', async () => {
      await breakoutModel.toWide();
    });
    await editor.keyboard.type('a');
    await editor.keyboard.press('Backspace');
    await expect(editor).toHaveDocument(
      doc(breakout({ mode: 'wide' })(code_block({})())),
    );
  });

  test('breakout: should be able to delete last character inside a "wide" layoutSection', async ({
    editor,
  }) => {
    const breakoutModel = EditorBreakoutModel.from(editor);
    await editor.typeAhead.searchAndInsert('layouts');
    await test.step('change layout to wide', async () => {
      await breakoutModel.toWide();
    });
    await editor.keyboard.type('a');
    await editor.keyboard.press('Backspace');
    await expect(editor).toHaveDocument(
      doc(
        breakout({ mode: 'wide' })(
          layoutSection(
            layoutColumn({ width: 50 })(p()),
            layoutColumn({ width: 50 })(p()),
          ),
        ),
      ),
    );
  });
});
