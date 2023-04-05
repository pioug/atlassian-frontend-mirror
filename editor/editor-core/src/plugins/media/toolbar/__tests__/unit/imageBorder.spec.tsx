import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  media,
  DocBuilder,
  mediaSingle,
  doc,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MediaAttributes } from '@atlaskit/adf-schema';
import {
  temporaryFileId,
  testCollectionName,
} from '../../../../../__tests__/unit/plugins/media/_utils';
import { shouldShowImageBorder } from '../../imageBorder';

const attrs: MediaAttributes = {
  id: temporaryFileId,
  type: 'file',
  collection: testCollectionName,
};

const mediaNode = mediaSingle({ layout: 'center' })(media({ ...attrs })());

const createMediaNodeDoc = () => doc(mediaNode);

describe('image border toolbar', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder, allowBorderMark: boolean) => {
    const wrapper = createEditor({
      doc,
      editorProps: {
        UNSAFE_allowBorderMark: allowBorderMark,
        media: {
          allowMediaSingle: true,
        },
      },
    });
    return wrapper;
  };

  const setup = async (document: DocBuilder, allowBorderMark: boolean) => {
    const { editorView } = editor(document, allowBorderMark);

    return {
      editorView,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show image border toolbar', async () => {
    const { editorView } = await setup(createMediaNodeDoc(), true);
    const result = shouldShowImageBorder(editorView.state);
    expect(result).toBeTruthy();
  });

  it('should not show image border toolbar', async () => {
    const { editorView } = await setup(createMediaNodeDoc(), false);
    const result = shouldShowImageBorder(editorView.state);
    expect(result).toBeFalsy();
  });
});
