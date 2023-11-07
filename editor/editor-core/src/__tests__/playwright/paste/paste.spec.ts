import { editorTestCase as test, expect } from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { a, p, doc } from '@atlaskit/editor-test-helpers/doc-builder';

import { emptyDocument } from './__fixtures__/adf-document';

test.use({
  editorProps: {
    appearance: 'full-page',
  },
});

test.describe('On paste `plain-text` should not be garbled', () => {
  test.use({
    adf: emptyDocument,
  });
  test('content with only HTML anchor Tag wrapping', async ({ editor }) => {
    const testText = '<a href="https://example.com">Example</a>';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          '<a href="',
          a({
            href: 'https://example.com',
          })('https://example.com'),
          '">Example</a>',
        ),
      ),
    );
  });

  test('HTML anchor Tag wrapping ASCII chars', async ({ editor }) => {
    const testText = '<a href="https://example.com">⚠️ 👍</a>';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          '<a href="',
          a({
            href: 'https://example.com',
          })('https://example.com'),
          '">⚠️ 👍</a>',
        ),
      ),
    );
  });

  test('HTML anchor Tag with additional attributes and wrapped an image', async ({
    editor,
  }) => {
    const testText =
      '<a title="Image Title" href="https://www.example.com/File:file.jpg"><img width="512" alt="alt-text" src="https://www.example.com/thumb/image.jpg"></a>';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });
    await expect(editor).toMatchDocument(
      doc(
        p(
          '<a title="Image Title" href="',
          a({
            href: 'https://www.example.com/File:file.jpg',
            title: 'Image Title',
          })('https://www.example.com/File:file.jpg'),
          '"><img width="512" alt="alt-text" src="',
          a({
            href: 'https://www.example.com/thumb/image.jpg',
          })('https://www.example.com/thumb/image.jpg'),
          '"></a>',
        ),
      ),
    );
  });

  test('HTML anchor tag in between text', async ({ editor }) => {
    const testText = 'Test <a href="https://example.com">Example</a> Test';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          'Test <a href="',
          a({
            href: 'https://example.com',
          })('https://example.com'),
          '">Example</a> Test',
        ),
      ),
    );
  });

  test('HTML Document as text', async ({ editor }) => {
    const testText =
      '<!DOCTYPE html><html><head><title>Playwright Test Report</title></head><body></body>';

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: testText,
    });

    await expect(editor).toMatchDocument(
      doc(
        p(
          '<!DOCTYPE html><html><head><title>Playwright Test Report</title></head><body></body>',
        ),
      ),
    );
  });
});
