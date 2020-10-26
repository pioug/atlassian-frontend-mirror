import { doc, media, mediaSingle, p } from '@atlaskit/editor-test-helpers';

import { showLinkingToolbarWithMediaTypeCheck } from '../../../commands/linking';

import { checkMediaType } from '../../../../../plugins/media/utils/check-media-type';

import { NodeSelection } from 'prosemirror-state';
import { MediaLinkingActionsTypes } from '../../../pm-plugins/linking/actions';
import { mediaLinkingPluginKey } from '../../../pm-plugins/linking';
import { EditorView } from 'prosemirror-view';
jest.mock('../../../../../plugins/media/utils/check-media-type', () => ({
  checkMediaType: jest.fn(),
}));
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';

import mediaPlugin from '../../../index';

import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ProviderFactory } from '@atlaskit/editor-common';

describe('#showLinkingToolbarWithMediaTypeCheck', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>();
  const mediaProvider = Promise.resolve({
    viewMediaClientConfig: getDefaultMediaClientConfig(),
  });
  const providerFactory = ProviderFactory.create({
    mediaProvider,
  });

  preset.add([mediaPlugin, { allowMediaSingle: true }]);

  const editor = (doc: any) => {
    return createEditor({
      doc,
      preset,
      providerFactory,
    });
  };

  const document = doc(
    mediaSingle()(
      media({
        id: 'a559980d-cd47-43e2-8377-27359fcb905f',
        type: 'file',
        collection: 'MediaServicesSample',
      })(),
    ),
    p('{<>}'),
    mediaSingle()(
      media({
        id: 'a559980d-cd47-43e2-8377-27359fcb905f',
        type: 'file',
        collection: 'MediaServicesSample',
      })(),
    ),
  );

  const setSelection = (editorView: EditorView, pos: number) => {
    const tr = editorView.state.tr.setSelection(
      NodeSelection.create(editorView.state.doc, pos),
    );
    editorView.dispatch(tr);
  };

  const selectFirstMedia = (editorView: EditorView) => {
    setSelection(editorView, 0);
  };

  const selectLastMedia = (editorView: EditorView) => {
    setSelection(editorView, 5);
  };

  const mockDispatch = jest.fn();

  afterEach(() => {
    (mockDispatch as jest.Mock).mockClear();
  });

  describe('selected media is an image', () => {
    beforeAll(() => {
      (checkMediaType as jest.Mock).mockReturnValue(Promise.resolve('image'));
    });

    it('call dispatch with correct param with a media is selected', async () => {
      const { editorView } = editor(document);

      selectFirstMedia(editorView);

      await Promise.resolve(true);

      const result = showLinkingToolbarWithMediaTypeCheck(
        editorView.state,
        mockDispatch,
        editorView,
      );

      const expectTransaction = editorView.state.tr.setMeta(
        mediaLinkingPluginKey,
        {
          type: MediaLinkingActionsTypes.showToolbar,
        },
      );

      await Promise.resolve(true);
      expect(result).toEqual(true);
      expect(mockDispatch).toHaveBeenCalledWith(expectTransaction);
    });

    it('does not call dispatch when selection is not a media single node', async () => {
      const { editorView } = editor(document);

      const result = showLinkingToolbarWithMediaTypeCheck(
        editorView.state,
        mockDispatch,
        editorView,
      );

      await Promise.resolve(true);

      expect(result).toEqual(false);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not call dispatch when selection has changed', async () => {
      const { editorView } = editor(document);

      selectFirstMedia(editorView);

      const result = showLinkingToolbarWithMediaTypeCheck(
        editorView.state,
        mockDispatch,
        editorView,
      );

      selectLastMedia(editorView);

      await Promise.resolve(true);

      expect(result).toEqual(false);
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('selected media is a video', () => {
    beforeAll(() => {
      (checkMediaType as jest.Mock).mockReturnValue(Promise.resolve('video'));
    });

    it('does not call dispatch', async () => {
      const { editorView } = editor(document);

      selectFirstMedia(editorView);

      const result = showLinkingToolbarWithMediaTypeCheck(
        editorView.state,
        mockDispatch,
        editorView,
      );

      await Promise.resolve(true);

      expect(result).toEqual(false);
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
