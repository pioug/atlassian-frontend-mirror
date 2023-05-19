import {
  EditorLinkModel,
  EditorLinkFloatingToolbarModel,
  editorTestCase as test,
  expect,
} from '@atlaskit/editor-test-helpers/playwright';
import { doc, p, a } from '@atlaskit/editor-test-helpers/doc-builder';
import { emptyDocument } from './__fixtures__/adf-documents';

test.describe('hyperlink toolbar', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: emptyDocument,
  });

  test('inserts a link via hyperlink toolbar', async ({ editor }) => {
    const smartLinkModel = EditorLinkModel.from(editor);

    await smartLinkModel.addViaToolbar({
      url: 'www.atlassian.com',
      label: 'Hello world!',
    });
    await smartLinkModel.isVisibleByText('Hello world!');

    await expect(editor).toMatchDocument(
      doc(p(a({ href: 'http://www.atlassian.com' })('Hello world!'))),
    );
  });

  test("doesn't insert a link via hyperlink toolbar when switching between fields", async ({
    editor,
  }) => {
    const smartLinkToolbarModel = EditorLinkFloatingToolbarModel.from(editor);

    await smartLinkToolbarModel.openViaKeyboardShortcut();

    await editor.keyboard.type('www.atlassian.com');
    await smartLinkToolbarModel.clickLabel();
    await smartLinkToolbarModel.clickUrl();

    await expect(editor).toMatchDocument(doc(p()));
  });

  test("doesn't insert a link via hyperlink toolbar when clicking out of toolbar", async ({
    editor,
  }) => {
    const smartLinkToolbarModel = EditorLinkFloatingToolbarModel.from(editor);

    // Write some text to click on later to not have to make assumptions about where this test is ran
    await editor.keyboard.type('Click Me');
    await editor.keyboard.press('Enter');

    await smartLinkToolbarModel.openViaKeyboardShortcut();

    await editor.keyboard.type('www.atlassian.com');

    // Click outside the toolbar
    await editor.page.getByText('Click Me').click();

    await expect(editor).toMatchDocument(doc(p('Click Me'), p()));
  });

  // DTR-1554 Clear button is not selectable on Safari by Tab
  test.fixme(
    'inserts a link when tabbing through hyperlink toolbar',
    async ({ editor }) => {
      const smartLinkToolbarModel = EditorLinkFloatingToolbarModel.from(editor);

      await smartLinkToolbarModel.openViaKeyboardShortcut();

      await editor.page.pause();
      await editor.keyboard.type('www.atlassian.com');
      await editor.keyboard.press('Tab'); // To clear link button
      await editor.keyboard.press('Tab'); // To label field
      await editor.keyboard.type('Hello world!');
      await editor.keyboard.press('Tab'); // To clear text button
      await editor.keyboard.press('Tab'); // Submit

      const smartLinkModel = EditorLinkModel.from(editor);
      await smartLinkModel.isVisibleByText('Hello world!');

      await expect(editor).toMatchDocument(
        doc(p(a({ href: 'http://www.atlassian.com' })('Hello world!'))),
      );
    },
  );
});
