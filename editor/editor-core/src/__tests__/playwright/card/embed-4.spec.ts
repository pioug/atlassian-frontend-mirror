import { editorTestCase as test, expect } from '@af/editor-libra';
import { embedCardAdf } from './embed-4.spec.ts-fixtures/adf';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, doc, embedCard } from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  adf: embedCardAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
  },
});

test.describe('card', () => {
  test('embed card should render as block card if preview missing', async ({
    editor,
  }) => {
    // wait for block card to be ready
    const blockCardLocator = await editor.page.locator(
      '.block-card-resolved-view',
    );
    await expect(blockCardLocator).toBeVisible();

    // If the data for the embed card is missing it will fall back to block card
    // view on render, but stay in adf as embed card. We still know it's a block
    // card though because we can see it in the DOM above on line 30
    await expect(editor).toHaveDocument(
      doc(
        p(' '),
        embedCard({
          layout: 'center',
          originalHeight: undefined,
          originalWidth: undefined,
          url: 'https://embedCardTestUrl/fallback',
          width: 100,
        })(),
      ),
    );
  });
});
