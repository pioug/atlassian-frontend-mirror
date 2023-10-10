import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorFloatingToolbarModel,
  EditorHyperlinkModel,
  expect,
  EditorTypeAheadModel,
  EditorLinkPickerModel,
} from '@af/editor-libra';
import { basicHyperlinkAdf } from './__fixtures__/basic-hyperlink-adf';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, a, doc } from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  adf: basicHyperlinkAdf,
  editorProps: {
    appearance: 'full-page',
  },
});

test.describe('toolbar', () => {
  test('can unlink hyperlink using toolbar', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const link = nodes.link.first();
    await link.click();

    const hyperlinkModel = EditorHyperlinkModel.from(link);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      hyperlinkModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.unlink();

    await expect(editor).toHaveDocument(doc(p('http://atlassian.com')));
  });
  test('closes hyperlink floating toolbar when hit escape key', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const link = nodes.link.first();

    const hyperlinkModel = EditorHyperlinkModel.from(link);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      hyperlinkModel,
    );

    await link.click();
    await floatingToolbarModel.waitForStable();

    const isToolbarVisibleBeforeEscape = floatingToolbarModel.isVisible();

    expect(await isToolbarVisibleBeforeEscape).toBeTruthy();

    await editor.keyboard.press('Escape');
    const isToolbarVisibleAfterEscape = floatingToolbarModel.isVisible();

    expect(await isToolbarVisibleAfterEscape).toBeFalsy();
  });
  test('can edit hyperlink text with toolbar', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const link = nodes.link.first();
    await link.click();

    const hyperlinkModel = EditorHyperlinkModel.from(link);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      hyperlinkModel,
    );
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.editLink();
    await floatingToolbarModel.clickLabelField();
    await editor.keyboard.type('A URL');
    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(
      doc(p(a({ href: 'http://atlassian.com' })('A URL'))),
    );
  });
  test('can edit hyperlink URL with toolbar', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const link = nodes.link.first();
    await link.click();

    const hyperlinkModel = EditorHyperlinkModel.from(link);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      hyperlinkModel,
    );
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.editLink();
    await floatingToolbarModel.clearLink();
    await editor.keyboard.type('http://1234.com');
    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(
      doc(p(a({ href: 'http://1234.com' })('http://1234.com'))),
    );
  });
  test('can add anchor link URL with toolbar', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const link = nodes.link.first();
    await link.click();

    const hyperlinkModel = EditorHyperlinkModel.from(link);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      hyperlinkModel,
    );
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.editLink();
    await floatingToolbarModel.clearLink();
    await editor.keyboard.type('#anchor-link');
    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(
      doc(p(a({ href: '#anchor-link' })('#anchor-link'))),
    );
  });
  test("doesn't update hyperlink text if hit escape key", async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const link = nodes.link.first();

    const hyperlinkModel = EditorHyperlinkModel.from(link);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      hyperlinkModel,
    );

    await link.click();
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.editLink();
    await floatingToolbarModel.clickLabelField();
    await editor.keyboard.type('1234');

    const isToolbarVisibleBeforeEscape = floatingToolbarModel.isVisible();

    expect(await isToolbarVisibleBeforeEscape).toBeTruthy();

    await editor.keyboard.press('Escape');
    const isToolbarVisibleAfterEscape = floatingToolbarModel.isVisible();

    expect(await isToolbarVisibleAfterEscape).toBeFalsy();
    await expect(editor).toHaveDocument(
      doc(p(a({ href: 'http://atlassian.com' })('http://atlassian.com'))),
    );
  });
  test("doesn't update hyperlink URL if hit escape key", async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const link = nodes.link.first();

    const hyperlinkModel = EditorHyperlinkModel.from(link);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      hyperlinkModel,
    );

    await link.click();
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.editLink();
    await floatingToolbarModel.waitForStable();
    await editor.keyboard.type('1234');

    const isToolbarVisibleBeforeEscape = floatingToolbarModel.isVisible();

    expect(await isToolbarVisibleBeforeEscape).toBeTruthy();

    await editor.keyboard.press('Escape');
    const isToolbarVisibleAfterEscape = floatingToolbarModel.isVisible();

    expect(await isToolbarVisibleAfterEscape).toBeFalsy();

    await expect(editor).toHaveDocument(
      doc(p(a({ href: 'http://atlassian.com' })('http://atlassian.com'))),
    );
  });
  test("doesn't close edit link toolbar when text is selected using the mouse and the click is released outside of the toolbar", async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const link = nodes.link.first();
    await link.click();

    const hyperlinkModel = EditorHyperlinkModel.from(link);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      hyperlinkModel,
    );

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.editLink();
    const floatingToolbar = editor.page.getByLabel('Floating Toolbar');
    const toolbarBox = await floatingToolbar.boundingBox();

    // Moves the mouse from one corner of the floating toolbar to the other.
    await editor.page.mouse.move(toolbarBox!.x, toolbarBox!.y);
    await editor.page.mouse.down();
    await editor.page.mouse.move(
      toolbarBox!.x + toolbarBox!.width,
      toolbarBox!.y + toolbarBox!.height,
    );
    await editor.page.mouse.up();

    await floatingToolbarModel.waitForStable();
    const isToolbarVisibleBeforeEscape = floatingToolbarModel.isVisible();

    expect(await isToolbarVisibleBeforeEscape).toBeTruthy();
  });
  test.describe('with feature flag: lp-link-picker', () => {
    test.use({
      adf: basicHyperlinkAdf,
      editorProps: {
        appearance: 'full-page',
        featureFlags: { 'lp-link-picker': true },
      },
    });
    test('can edit hyperlink URL with toolbar', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const link = nodes.link.first();
      await link.click();

      const hyperlinkModel = EditorHyperlinkModel.from(link);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        hyperlinkModel,
      );
      await floatingToolbarModel.waitForStable();
      await floatingToolbarModel.editLink();
      await floatingToolbarModel.clearLink();
      await editor.keyboard.type('http://1234.com');
      await editor.keyboard.press('Enter');

      await expect(editor).toHaveDocument(
        doc(p(a({ href: 'http://1234.com' })('http://1234.com'))),
      );
    });
    test("doesn't update hyperlink text if hit escape key", async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const link = nodes.link.first();

      const hyperlinkModel = EditorHyperlinkModel.from(link);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        hyperlinkModel,
      );

      await link.click();
      await floatingToolbarModel.waitForStable();
      await floatingToolbarModel.editLink();
      await floatingToolbarModel.clickLabelField();
      await editor.keyboard.type('1234');

      const isToolbarVisibleBeforeEscape = floatingToolbarModel.isVisible();

      expect(await isToolbarVisibleBeforeEscape).toBeTruthy();

      await editor.keyboard.press('Escape');
      const isToolbarVisibleAfterEscape = floatingToolbarModel.isVisible();

      expect(await isToolbarVisibleAfterEscape).toBeFalsy();
      await expect(editor).toHaveDocument(
        doc(p(a({ href: 'http://atlassian.com' })('http://atlassian.com'))),
      );
    });
    test("doesn't update hyperlink URL if hit escape key", async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const link = nodes.link.first();

      const hyperlinkModel = EditorHyperlinkModel.from(link);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        hyperlinkModel,
      );

      await link.click();
      await floatingToolbarModel.waitForStable();
      await floatingToolbarModel.editLink();
      await floatingToolbarModel.waitForStable();

      await editor.keyboard.type('1234');

      const isToolbarVisibleBeforeEscape = floatingToolbarModel.isVisible();

      expect(await isToolbarVisibleBeforeEscape).toBeTruthy();

      await editor.keyboard.press('Escape');
      const isToolbarVisibleAfterEscape = floatingToolbarModel.isVisible();

      expect(await isToolbarVisibleAfterEscape).toBeFalsy();

      await expect(editor).toHaveDocument(
        doc(p(a({ href: 'http://atlassian.com' })('http://atlassian.com'))),
      );
    });
    test("doesn't close edit link toolbar when text is selected using the mouse and the click is released outside of the toolbar", async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const link = nodes.link.first();
      await link.click();

      const hyperlinkModel = EditorHyperlinkModel.from(link);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        hyperlinkModel,
      );

      await floatingToolbarModel.waitForStable();
      await floatingToolbarModel.editLink();
      const floatingToolbar = editor.page.getByLabel('Floating Toolbar');
      const toolbarBox = await floatingToolbar.boundingBox();

      // Moves the mouse from one corner of the floating toolbar to the other.
      await editor.page.mouse.move(toolbarBox!.x, toolbarBox!.y);
      await editor.page.mouse.down();
      await editor.page.mouse.move(
        toolbarBox!.x + toolbarBox!.width,
        toolbarBox!.y + toolbarBox!.height,
      );
      await editor.page.mouse.up();

      await floatingToolbarModel.waitForStable();
      const isToolbarVisibleBeforeEscape = floatingToolbarModel.isVisible();

      expect(await isToolbarVisibleBeforeEscape).toBeTruthy();
    });
    test('the url field of the link picker is autofocused when opened via typeahead', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const typeaheadModel = EditorTypeAheadModel.from(editor);
      const link = nodes.link.first();

      const hyperlinkModel = EditorHyperlinkModel.from(link);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        hyperlinkModel,
      );
      const linkPickerModel = EditorLinkPickerModel.from(floatingToolbarModel);

      const checkUrlFieldAutoFocus = async () => {
        // Open link picker via typeahead
        await typeaheadModel.searchAndInsert('link');
        await linkPickerModel.waitForUrlFieldToBeFocused();
        await expect(linkPickerModel.isUrlFieldFocused()).resolves.toBe(true);
      };

      await test.step('First check', checkUrlFieldAutoFocus);

      // Close link picker
      await editor.keyboard.press('Escape');

      await test.step(
        'Second check (repeated to ensure lazy-loaded assets have not affected test)',
        checkUrlFieldAutoFocus,
      );
    });
  });
});
