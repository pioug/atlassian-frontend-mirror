import type { MediaAttributes } from '@atlaskit/adf-schema';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  temporaryFileId,
  testCollectionName,
} from '@atlaskit/editor-test-helpers/media-provider';

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
        allowBorderMark: allowBorderMark,
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
