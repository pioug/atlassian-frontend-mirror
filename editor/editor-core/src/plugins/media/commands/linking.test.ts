import {
  a,
  doc,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  flushPromises,
  getDefaultMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { ProviderFactory } from '@atlaskit/editor-common';

import hyperlinkPlugin from '../../hyperlink';
import mediaPlugin from '../';
import { MediaLinkingActionsTypes } from '../pm-plugins/linking/actions';
import { checkMediaType } from '../utils/check-media-type';
import { mediaLinkingPluginKey } from '../pm-plugins/linking';
import * as linking from './linking';
import { INPUT_METHOD } from '../../analytics/types';
import * as analyticUtils from '../../analytics/utils';
import * as commands from '../../../commands';

const { setUrlToMedia, showLinkingToolbarWithMediaTypeCheck, unlink } = linking;

jest.mock('../utils/check-media-type', () => ({
  checkMediaType: jest.fn(),
}));

describe('image linking', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>();
  const mediaProvider = Promise.resolve({
    viewMediaClientConfig: getDefaultMediaClientConfig(),
  });
  const providerFactory = ProviderFactory.create({
    mediaProvider,
  });

  preset
    .add([mediaPlugin, { allowMediaSingle: true, allowLinking: true }])
    .add(hyperlinkPlugin);

  const editor = (doc: any) => {
    return createEditor({
      doc,
      preset,
      providerFactory,
    });
  };

  const document = doc(
    '{<node>}',
    mediaSingle()(
      media({
        id: 'a559980d-cd47-43e2-8377-27359fcb905f',
        type: 'file',
        collection: 'MediaServicesSample',
      })(),
    ),
    mediaSingle()(
      media({
        id: 'a559980d-cd47-43e2-8377-27359fcb905f',
        type: 'file',
        collection: 'MediaServicesSample',
      })(),
    ),
  );

  const mockDispatch = jest.fn();

  afterEach(() => {
    (mockDispatch as jest.Mock).mockClear();
  });

  describe('analytics', () => {
    const FIRST_CALL = 0;
    const ANALYTIC_PAYLOAD = 2;
    const analyticUtilsSpy = jest.spyOn(analyticUtils, 'addAnalytics');
    beforeEach(() => {
      analyticUtilsSpy.mockReset();
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it('should call analytic when creating a link', () => {
      const { editorView } = editor(document);

      setUrlToMedia('http://google.com', INPUT_METHOD.MANUAL)(
        editorView.state,
        mockDispatch,
        editorView,
      );

      expect(analyticUtilsSpy).toBeCalled();
      expect(analyticUtilsSpy.mock.calls[FIRST_CALL][ANALYTIC_PAYLOAD]).toEqual(
        {
          action: 'added',
          actionSubject: 'media',
          actionSubjectId: 'link',
          attributes: expect.objectContaining({ inputMethod: 'manual' }),
          eventType: 'track',
        },
      );
    });

    describe('existing links', () => {
      const googleUrl = 'http://google.com';
      const documentWithMediaWithLink = doc(
        '{<node>}',
        mediaSingle()(
          a({ href: googleUrl })(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
          ),
        ),
      );

      it('should add edit analytic when modifying link', () => {
        const { editorView } = editor(documentWithMediaWithLink);
        setUrlToMedia('http://random-url.com', INPUT_METHOD.MANUAL)(
          editorView.state,
          editorView.dispatch,
          editorView,
        );

        expect(analyticUtilsSpy).toHaveBeenCalledTimes(1);
        expect(
          analyticUtilsSpy.mock.calls[FIRST_CALL][ANALYTIC_PAYLOAD],
        ).toEqual({
          action: 'edited',
          actionSubject: 'media',
          actionSubjectId: 'link',
          eventType: 'track',
        });
      });

      it('should delete analytic when removing a link', () => {
        const { editorView } = editor(documentWithMediaWithLink);

        unlink(editorView.state, editorView.dispatch, editorView);

        expect(analyticUtilsSpy).toBeCalledTimes(1);
        expect(
          analyticUtilsSpy.mock.calls[FIRST_CALL][ANALYTIC_PAYLOAD],
        ).toEqual({
          action: 'deleted',
          actionSubject: 'media',
          actionSubjectId: 'link',
          eventType: 'track',
        });
      });

      it("shouldn't call an analytic if the url was modified to the same url", () => {
        const { editorView } = editor(documentWithMediaWithLink);

        setUrlToMedia(googleUrl, INPUT_METHOD.MANUAL)(
          editorView.state,
          mockDispatch,
          editorView,
        );

        expect(analyticUtilsSpy).not.toBeCalled();
      });
    });

    describe('errors', () => {
      beforeAll(() => {
        jest
          .spyOn(commands, 'createToggleBlockMarkOnRange')
          .mockImplementation(() => {
            throw new Error('This error should be caught');
          });
      });
      it("should call analytic if there's an error creating a link", () => {
        const { editorView } = editor(document);

        try {
          setUrlToMedia('http://google.com', INPUT_METHOD.MANUAL)(
            editorView.state,
            mockDispatch,
            editorView,
          );
        } catch (e) {
          // noop
        }

        expect(
          analyticUtilsSpy.mock.calls[FIRST_CALL][ANALYTIC_PAYLOAD],
        ).toEqual({
          action: 'errored',
          actionSubject: 'media',
          actionSubjectId: 'link',
          attributes: { action: 'added' },
          eventType: 'track',
        });
      });
    });
  });

  describe('show linking toolbar', () => {
    describe('selected media is an image', () => {
      beforeAll(() => {
        (checkMediaType as jest.Mock).mockReturnValue(Promise.resolve('image'));
      });

      it('call dispatch with correct param with a media is selected', async () => {
        const { editorView } = editor(document);

        await flushPromises();
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

        await flushPromises();
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

        await flushPromises();

        expect(result).toEqual(false);
        expect(mockDispatch).not.toHaveBeenCalled();
      });

      it('does not call dispatch when selection has changed', async () => {
        const { editorView } = editor(document);

        const result = showLinkingToolbarWithMediaTypeCheck(
          editorView.state,
          mockDispatch,
          editorView,
        );

        sendKeyToPm(editorView, 'ArrowDown');

        await flushPromises();

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

        const result = showLinkingToolbarWithMediaTypeCheck(
          editorView.state,
          mockDispatch,
          editorView,
        );

        await flushPromises();

        expect(result).toEqual(false);
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });
  });
});
