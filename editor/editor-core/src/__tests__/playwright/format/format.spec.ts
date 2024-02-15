import { expect, editorTestCase as test } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  code,
  doc,
  em,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a as link,
  p,
  strike,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('format.ts', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('user should be able to create link using markdown', async ({
    editor,
  }) => {
    await editor.keyboard.type('[Atlassian](https://www.atlassian.com)');
    await editor.page.waitForSelector('a');

    await expect(editor).toHaveDocument(
      doc(p(link({ href: 'https://www.atlassian.com' })('Atlassian'))),
    );
  });

  test('user should be able to format bold, italics and strikethrough with markdown', async ({
    editor,
  }) => {
    const markdownArray: string[] = [
      '__bold__',
      '_italics_',
      '**starbold**',
      '*staritalics*',
      '~~strikethrough~~',
    ];

    for (let markdown of markdownArray) {
      await editor.keyboard.type(markdown + ' ');
    }

    await expect(editor).toHaveDocument(
      doc(
        p(
          strong('bold'),
          ' ',
          em('italics'),
          ' ',
          strong('starbold'),
          ' ',
          em('staritalics'),
          ' ',
          strike('strikethrough'),
          ' ',
        ),
      ),
    );
  });

  test('user should be able to write inline code', async ({ editor }) => {
    await editor.keyboard.type('`code` ');
    await expect(editor).toHaveDocument(doc(p(code('code'), ' ')));
  });

  const headingModifierShortcut =
    process.platform === 'darwin' ? 'Meta+Alt' : 'Control+Alt';
  test('should be able to use keyboard shortcuts to set headings', async ({
    editor,
  }) => {
    for (let headingNumber = 1; headingNumber <= 6; headingNumber++) {
      await editor.keyboard.press(
        headingModifierShortcut + `+${headingNumber}`,
      );
      await editor.keyboard.type('Heading ' + headingNumber);
      await editor.keyboard.press('Enter');
    }

    await expect(editor).toHaveDocument(
      doc(
        h1('Heading 1'),
        h2('Heading 2'),
        h3('Heading 3'),
        h4('Heading 4'),
        h5('Heading 5'),
        h6('Heading 6'),
        p(),
      ),
    );
  });
});
