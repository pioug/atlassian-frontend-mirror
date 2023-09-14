import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorBlockCardModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, blockCard, doc } from '@atlaskit/editor-test-helpers/doc-builder';
import { blockCardAdf } from './block-3.spec.ts-fixtures/adf-blockCard';

test.use({
  adf: blockCardAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
    },
  },
});

test.describe('blockCard', () => {
  test('copy paste of link should work as expected in editor', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

    // copy block card
    await blockCardModel.waitForStable();
    await blockCardModel.click();
    await editor.copy();

    // paste it below
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('Enter');
    await editor.paste();

    const expectedBlockCard = blockCard({
      data: {
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@type': 'Document',
        generator: {
          icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
        },
        name: 'Welcome to Atlassian!',
        url: 'http://www.atlassian.com',
      },
    });

    await expect(editor).toMatchDocument(
      doc(p(' '), expectedBlockCard(), expectedBlockCard()),
    );
  });
});
