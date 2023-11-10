import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
  EditorLinkPickerModel,
  EditorFloatingToolbarModel,
  EditorNodeContainerModel,
  EditorInlineCardModel,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  doc,
  inlineCard,
  a,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('with feature flag: lp-link-picker', () => {
  test.use({
    editorProps: {
      featureFlags: {
        'lp-link-picker': true,
      },
      appearance: 'full-page',
      smartLinks: {
        allowEmbeds: true,
      },
    },
    editorMountOptions: {
      providers: {
        cards: true,
      },
      withLinkPickerOptions: true,
    },
  });

  test(`card: selecting a link from floating menu should create an inline card with click`, async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );
    const linkPickerModel = EditorLinkPickerModel.from(floatingToolbarModel);

    await toolbar.clickAt('Link');

    await linkPickerModel.urlFieldWithFocus.waitFor({ state: 'visible' });
    await editor.keyboard.type('home opt-in');
    await linkPickerModel.listItems.first().click();

    await expect(editor).toMatchDocument(
      doc(
        p(
          inlineCard({
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              name: expect.any(String),
              url: expect.any(String),
            },
          })(),
          ' ',
        ),
      ),
    );
  });

  test(`card: selecting a link from floating menu should create an inline card using keyboard`, async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );

    const linkPickerModel = EditorLinkPickerModel.from(floatingToolbarModel);

    await toolbar.clickAt('Link');

    await linkPickerModel.urlFieldWithFocus.waitFor({ state: 'visible' });
    await editor.keyboard.type('home opt-in');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        p(
          inlineCard({
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              name: expect.any(String),
              url: expect.any(String),
            },
          })(),
          ' ',
        ),
      ),
    );
  });

  const shortcut = process.platform === 'darwin' ? 'Meta+k' : 'Control+k';
  test(`card: inserting a link with CMD + K with keyboard should retain display text and insert a link`, async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20829',
      reason:
        'FIXME: This test was automatically skipped due to failure on 09/11/2023: https://product-fabric.atlassian.net/browse/ED-20829',
      browsers: [BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );

    const linkPickerModel = EditorLinkPickerModel.from(floatingToolbarModel);

    await editor.keyboard.press(shortcut);

    await linkPickerModel.urlFieldWithFocus.waitFor({ state: 'visible' });
    await editor.keyboard.type('home opt-in');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Tab+Tab');

    await editor.keyboard.type('Link label');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        p(
          a({
            href: expect.any(String),
          })('Link label'),
        ),
      ),
    );
  });

  test(`card: inserting a link with CMD + K with click should retain display text and insert a link`, async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20829',
      reason:
        'FIXME: This test was automatically skipped due to failure on 09/11/2023: https://product-fabric.atlassian.net/browse/ED-20829',
      browsers: [BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );

    const linkPickerModel = EditorLinkPickerModel.from(floatingToolbarModel);

    await editor.keyboard.press(shortcut);

    await linkPickerModel.urlFieldWithFocus.waitFor({ state: 'visible' });
    await editor.keyboard.type('home opt-in');
    await editor.keyboard.press('Tab+Tab');

    await editor.keyboard.type('Link label');

    await linkPickerModel.listItems.first().click();

    await expect(editor).toMatchDocument(
      doc(
        p(
          a({
            href: expect.any(String),
          })('Link label'),
        ),
      ),
    );
  });
});
