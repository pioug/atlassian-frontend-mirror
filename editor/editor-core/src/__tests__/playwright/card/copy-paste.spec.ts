import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import { inlineCardAdf, cardFatalAdf } from './copy-paste.spec.ts-fixtures';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  doc,
  inlineCard,
  a as link,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('card: copy-paste ', () => {
  test.use({
    adf: inlineCardAdf,
    editorProps: {
      appearance: 'full-page',
      smartLinks: {
        allowBlockCards: true,
      },
    },
  });

  test('within editor should work', async ({ editor }) => {
    fixTest({
      jiraIssueId: 'DTR-2015',
      reason:
        'document on firefox contains additional marks node not present in other browsers',
      browsers: [BROWSERS.firefox],
    });
    const nodes = EditorNodeContainerModel.from(editor);

    await nodes.inlineCard.waitFor({ state: 'visible' });
    await nodes.inlineCard.click();

    await expect(editor).toHaveSelection({ anchor: 1, type: 'node' });

    await editor.copy();
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.type(' duplicates ');
    await editor.paste();

    await expect(editor).toHaveDocument(
      doc(
        p(
          inlineCard({
            url: 'https://inlineCardTestUrl',
          })(),
          ' duplicates ',
          inlineCard({
            url: 'https://inlineCardTestUrl',
          })(),
        ),
      ),
    );
  });
});

test.describe('card: pasting ', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      smartLinks: {
        allowBlockCards: true,
      },
    },
  });

  test(`a link then typing still converts to inline card`, async ({
    editor,
  }) => {
    await editor.keyboard.type('To read more go to: ');

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'https://www.atlassian.com',
    });

    await editor.keyboard.type('and see the latest');

    await expect(editor).toHaveDocument(
      doc(
        p(
          'To read more go to: ',
          inlineCard({
            data: {
              '@context': 'https://www.w3.org/ns/activitystreams',
              '@type': 'Document',
              name: 'Welcome to Atlassian!',
              url: 'http://www.atlassian.com',
            },
          })(),
          ' and see the latest',
        ),
      ),
    );
  });
});

test.describe('card: invalid', () => {
  test.use({
    adf: cardFatalAdf,
    editorProps: {
      appearance: 'full-page',
      smartLinks: {},
    },
  });
  test(`a fatal error link should turn to href in adf`, async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    await expect(nodes.inlineCard.first()).toBeHidden();
    await expect(nodes.link.first()).toBeVisible();

    await expect(editor).toHaveDocument(
      doc(
        p(
          'hello have a fatal link ',
          link({ href: 'https://inlineCardTestUrl/errored/fatal' })(
            'https://inlineCardTestUrl/errored/fatal',
          ),
          ' ',
        ),
      ),
    );
  });
});
