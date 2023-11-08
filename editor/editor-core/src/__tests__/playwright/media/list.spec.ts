import {
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
  EditorNodeContainerModel,
  EditorListModel,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  doc,
  ul,
  li,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { getMediaListAdf } from './__fixtures__/adf-documents';

const getMediaSingleDocument = (mediaTraceId: null | any) => {
  return mediaSingle()(
    media({
      id: 'a559980d-cd47-43e2-8377-27359fcb905f',
      type: 'file',
      collection: 'MediaServicesSample',
      alt: '',
      __external: false,
      __contextId: 'DUMMY-OBJECT-ID',
      __fileMimeType: 'image/jpeg',
      __fileName: 'tall_image.jpeg',
      __fileSize: expect.any(Number),
      __mediaTraceId: mediaTraceId,
      height: expect.any(Number),
      width: expect.any(Number),
    })(),
  );
};

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
});

test.describe('list', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
      },
    },
    adf: getMediaListAdf('bulletList'),
  });
  test('insert a media single inside a bullet list', async ({ editor }) => {
    fixTest({
      jiraIssueId: 'DTR-1764',
      reason:
        'Copy and pasting Media image is not populating __mediaTraceId - Firefox Browser (Libra)',
      browsers: [BROWSERS.firefox],
    });

    let nodes = EditorNodeContainerModel.from(editor);

    // Copy already rendered media image
    const firstMediaNode = nodes.media.first();
    await firstMediaNode.click();
    await editor.copy();

    // Pre-validate Paste already rendered media image
    const listNode = EditorListModel.from(editor);
    expect(await listNode.size()).toEqual(1);
    const bulletListNode = await listNode.listItem(0);
    await bulletListNode.click();
    await editor.paste();

    // Validate the page after pasting the image
    // Updated Nodes
    const updatedNodes = EditorNodeContainerModel.from(editor);
    await expect(updatedNodes.listItem).toHaveCount(1);
    await expect(updatedNodes.media).toHaveCount(2);

    // Added additional p() after first image, since the media element toolbar is blocking the click on bulletList
    // Adding ArrowRight key press after Copying, didn't work on Webkit browser
    await expect(editor).toMatchDocument(
      doc(
        getMediaSingleDocument(null),
        p(),
        ul(li(getMediaSingleDocument(expect.any(String)))),
      ),
    );
  });
});
