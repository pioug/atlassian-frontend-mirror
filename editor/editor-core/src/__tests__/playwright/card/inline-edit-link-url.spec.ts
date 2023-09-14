import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorFloatingToolbarModel,
  EditorInlineCardModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, doc, inlineCard } from '@atlaskit/editor-test-helpers/doc-builder';
import { inlineCardAdf } from './inline-edit-link-url.spec.ts-fixtures/adf';

test.use({
  adf: inlineCardAdf,
  editorProps: {
    appearance: 'full-page',
    smartLinks: {},
  },
});

test.describe('Inline card edit link', () => {
  test('changing the link URL of an inline link to another supported link should re resolve smart card', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );

    // wait for inline card to be ready
    await inlineCardModel.waitForStable();
    await inlineCardModel.click();

    // edit inline card link
    await floatingToolbarModel.editLink();
    await floatingToolbarModel.clearLink();
    await editor.keyboard.type('https://www.atlassian.com');
    await editor.keyboard.press('Enter');

    const expectedInlineCard = inlineCard({
      data: {
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@type': 'Document',
        name: 'Welcome to Atlassian!',
        url: 'http://www.atlassian.com',
      },
    });

    await expect(editor).toHaveDocument(doc(p(expectedInlineCard(), ' ')));
  });
});
