import {
  editorTestCase as test,
  expect,
  fixTest,
  EditorNodeContainerModel,
  EditorMediaInlineModel,
  BROWSERS,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, mediaInline } from '@atlaskit/editor-test-helpers/doc-builder';
import { mediaInlineAdf } from './copy-mediaInline.spec.ts-fixtures/adf-mediaInline';

const providedMediaInline = mediaInline({
  id: 'a3d20d67-14b1-4cfc-8ba8-918bbc8d71e1',
  type: 'file',
  collection: 'MediaServicesSample',
  alt: '',
  __external: false,
  __contextId: 'DUMMY-OBJECT-ID',
  __fileMimeType: expect.any(String),
  __fileName: 'text_file.txt',
  __fileSize: expect.any(Number),
});

const generatedMediaInline = mediaInline({
  id: 'a3d20d67-14b1-4cfc-8ba8-918bbc8d71e1',
  type: 'file',
  collection: 'MediaServicesSample',
  alt: '',
  __external: false,
  __contextId: 'DUMMY-OBJECT-ID',
  __fileMimeType: expect.any(String),
  __fileName: 'text_file.txt',
  __fileSize: expect.any(Number),
  __mediaTraceId: expect.any(String),
});

test.describe.configure({ mode: 'serial' });

test.describe('media inline', () => {
  test.use({
    adf: mediaInlineAdf,
    editorProps: {
      appearance: 'full-page',
      media: {
        featureFlags: {
          mediaInline: true,
        },
      },
    },
  });

  test('copies and pastes mediaInline on fullpage', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const mediaInlineModel = EditorMediaInlineModel.from(nodes.mediaInline);

    await mediaInlineModel.waitForReady();
    await mediaInlineModel.click();
    await editor.copy();
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Enter');
    await editor.paste();

    await expect(editor).toMatchDocument(
      doc(p(), p(providedMediaInline()), p(generatedMediaInline())),
    );
  });

  // This test is dependent on the prior test running as it uses the stored clipboard
  test('copies and pastes mediaInline between different Editor instances', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'UTEST-660',
      reason: 'Copy HTML element does not work on Firefox headless at all.',
      browsers: [BROWSERS.firefox],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const mediaInlineModel = EditorMediaInlineModel.from(nodes.mediaInline);

    await mediaInlineModel.waitForReady();
    await mediaInlineModel.click();
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Enter');
    await editor.paste();

    await expect(editor).toMatchDocument(
      doc(p(), p(providedMediaInline()), p(generatedMediaInline())),
    );
  });
});
