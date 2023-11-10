import {
  EditorFloatingToolbarModel,
  EditorHyperlinkModel,
  EditorLinkFloatingToolbarModel,
  EditorLinkPickerModel,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  editorTestCase as test,
  EditorTitleFocusModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  a as link,
  ul,
  li,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('Hyperlink', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('can insert hyperlink with only URL using toolbar', async ({
    editor,
  }) => {
    const linkModel = EditorLinkFloatingToolbarModel.from(editor);
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Link');
    await linkModel.isOpen();
    await editor.keyboard.type('http://atlassian.com');
    await editor.keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(p(link({ href: 'http://atlassian.com' })('http://atlassian.com'))),
    );
    const editorPageModel = EditorTitleFocusModel.from(editor);
    await expect(editorPageModel.editorLocator).toBeFocused();
  });

  test('can insert hyperlink with URL and text using toolbar', async ({
    editor,
  }) => {
    const linkModel = EditorLinkFloatingToolbarModel.from(editor);
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Link');
    await linkModel.isOpen();
    await editor.keyboard.type('http://atlassian.com');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.type('Atlassian');
    await editor.keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(p(link({ href: 'http://atlassian.com' })('Atlassian'))),
    );
    const editorPageModel = EditorTitleFocusModel.from(editor);
    await expect(editorPageModel.editorLocator).toBeFocused();
  });

  test('can insert hyperlink via quick insert menu', async ({ editor }) => {
    const linkModel = EditorLinkFloatingToolbarModel.from(editor);
    await editor.typeAhead.searchAndInsert('Link');
    await linkModel.isOpen();
    await editor.keyboard.type('http://atlassian.com');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.type('Atlassian');
    await editor.keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(p(link({ href: 'http://atlassian.com' })('Atlassian'))),
    );
    const editorPageModel = EditorTitleFocusModel.from(editor);
    await expect(editorPageModel.editorLocator).toBeFocused();
  });

  test.describe('with feature flag: lp-link-picker', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        featureFlags: {
          'lp-link-picker': true,
        },
      },
      editorMountOptions: {
        withLinkPickerOptions: true,
      },
    });
    test('can insert hyperlink with only URL using toolbar', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const hyperlinkModel = EditorHyperlinkModel.from(nodes.link.first());
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        hyperlinkModel,
      );
      const linkPickerModel = EditorLinkPickerModel.from(floatingToolbarModel);
      const toolbar = EditorMainToolbarModel.from(editor);
      await toolbar.clickAt('Link');
      await expect(linkPickerModel.urlFieldWithFocus).toBeFocused();
      await editor.keyboard.type('http://atlassian.com');
      await editor.keyboard.press('Enter');
      await expect(editor).toHaveDocument(
        doc(p(link({ href: 'http://atlassian.com' })('http://atlassian.com'))),
      );
      const editorPageModel = EditorTitleFocusModel.from(editor);
      await expect(editorPageModel.editorLocator).toBeFocused();
    });

    test('can insert hyperlink with URL and text using toolbar', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const hyperlinkModel = EditorHyperlinkModel.from(nodes.link.first());
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        hyperlinkModel,
      );
      const linkPickerModel = EditorLinkPickerModel.from(floatingToolbarModel);
      const toolbar = EditorMainToolbarModel.from(editor);
      await toolbar.clickAt('Link');
      await expect(linkPickerModel.urlFieldWithFocus).toBeFocused();
      await editor.keyboard.type('http://atlassian.com');
      await editor.keyboard.press('Tab');
      await editor.keyboard.press('Tab');
      await editor.keyboard.type('Atlassian');
      await editor.keyboard.press('Enter');

      await expect(editor).toHaveDocument(
        doc(p(link({ href: 'http://atlassian.com' })('Atlassian'))),
      );
      const editorPageModel = EditorTitleFocusModel.from(editor);
      await expect(editorPageModel.editorLocator).toBeFocused();
    });

    test('can insert hyperlink via quick insert menu', async ({ editor }) => {
      await editor.typeAhead.searchAndInsert('Link');
      await editor.keyboard.type('http://atlassian.com');
      await editor.keyboard.press('Tab');
      await editor.keyboard.press('Tab');
      await editor.keyboard.type('Atlassian');
      await editor.keyboard.press('Enter');
      await expect(editor).toHaveDocument(
        doc(p(link({ href: 'http://atlassian.com' })('Atlassian'))),
      );
      const editorPageModel = EditorTitleFocusModel.from(editor);
      await expect(editorPageModel.editorLocator).toBeFocused();
    });
  });

  test('can insert hyperlink via markdown', async ({ editor }) => {
    await editor.keyboard.type('[Atlassian](http://atlassian.com)');
    await expect(editor).toHaveDocument(
      doc(p(link({ href: 'http://atlassian.com' })('Atlassian'))),
    );
  });

  test('can insert hyperlink via markdown when pasting URL', async ({
    editor,
  }) => {
    await editor.keyboard.type('[Atlassian](');
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'http://atlassian.com',
    });
    await editor.keyboard.type(')');
    await expect(editor).toHaveDocument(
      doc(p(link({ href: 'http://atlassian.com' })('Atlassian'))),
    );
  });

  test('can paste hyperlink into paragraph', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'http://atlassian.com',
    });
    await expect(editor).toHaveDocument(
      doc(p(link({ href: 'http://atlassian.com' })('http://atlassian.com'))),
    );
  });

  test('can paste hyperlink into list', async ({ editor }) => {
    await editor.keyboard.type('* ');
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'http://atlassian.com',
    });
    await expect(editor).toHaveDocument(
      doc(
        ul(
          li(p(link({ href: 'http://atlassian.com' })('http://atlassian.com'))),
        ),
      ),
    );
  });
});
