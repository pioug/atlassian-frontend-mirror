import {
  editorTestCase as test,
  EditorNodeContainerModel,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaGroup,
  media,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  mediaGroupWithThreeMediaAndParagraphAtEnd,
  mediaGroupWithThreeMedia,
} from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: false,
      allowMediaGroup: true,
    },
    allowNewInsertionBehaviour: true,
  },
});

test.describe('media-group with three media nodes inside', () => {
  test.use({
    adf: mediaGroupWithThreeMedia,
  });
  test.describe('when selecting a media and typing text', () => {
    test('should replace the first media with the new text', async ({
      editor,
    }) => {
      const { media: mediaNodes } = EditorNodeContainerModel.from(editor);
      const firstMediaNode = mediaNodes.first();
      await firstMediaNode.click();
      await editor.keyboard.type('Hi');
      await expect(editor).toMatchDocument(
        doc(
          p('Hello{<>}'),
          p('Hi'),
          mediaGroup(
            media({
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
            media({
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
            })(),
          ),
        ),
      );
    });

    test('should replace the middle media with the new text', async ({
      editor,
    }) => {
      const { media: mediaNodes } = EditorNodeContainerModel.from(editor);
      const middleMediaNode = mediaNodes.nth(1);
      await middleMediaNode.click();
      await editor.keyboard.type('Hi');
      await editor.waitForEditorStable();
      await expect(editor).toMatchDocument(
        doc(
          p('Hello{<>}'),
          mediaGroup(
            media({
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
              __contextId: 'DUMMY-OBJECT-ID',
            })(),
          ),
          p('Hi'),
          mediaGroup(
            media({
              id: expect.any(String),
              collection: 'MediaServicesSample',
              type: 'file',
              __contextId: 'DUMMY-OBJECT-ID',
            })(),
          ),
        ),
      );
    });

    test.describe('when having 3 media nodes and an empty paragraph at the end', () => {
      test.use({
        adf: mediaGroupWithThreeMediaAndParagraphAtEnd,
      });
      test('should replace the last media with the new text', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'UTEST-707',
          reason:
            'This test does not work when we try to click in the media node (it can be done by setting ProseMirror selection manually)',
          browsers: [BROWSERS.firefox],
        });

        fixTest({
          jiraIssueId: 'ED-19138',
          reason:
            'This test does not work when we try to click in the media node (it can be done by setting ProseMirror selection manually)',
        });

        const { media: mediaNodes } = EditorNodeContainerModel.from(editor);
        const lastMediaNode = mediaNodes.last();
        await lastMediaNode.click();

        await editor.keyboard.type('Hi');
        await editor.waitForEditorStable();
        await expect(editor).toMatchDocument(
          doc(
            p('Hello'),
            mediaGroup(
              media({
                id: expect.any(String),
                collection: expect.any(String),
                __contextId: expect.any(String),
                type: 'file',
              })(),
              media({
                id: expect.any(String),
                collection: expect.any(String),
                type: 'file',
              })(),
            ),
            p('Hi'),
          ),
        );
      });
    });

    test.describe('when having 3 media nodes', () => {
      test.use({
        adf: mediaGroupWithThreeMedia,
      });
      test('TODO: DTR-1601 should replace the last media with the new text', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'DTR-1601', // https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-1601
          reason:
            'Bug: when there is no paragraph after media group, the replace does not work properly',
        });
        const { media: mediaNodes } = EditorNodeContainerModel.from(editor);

        await mediaNodes.last().click();
        await editor.keyboard.type('Hi');
        await editor.waitForEditorStable();
        await expect(editor).toMatchDocument(
          doc(
            p('Hello{<>}'),
            mediaGroup(
              media({
                id: expect.any(String),
                collection: expect.any(String),
                __contextId: expect.any(String),
                type: 'file',
              })(),
              media({
                id: expect.any(String),
                collection: expect.any(String),
                type: 'file',
              })(),
            ),
            p('Hi'),
          ),
        );
      });
    });
  });
});
