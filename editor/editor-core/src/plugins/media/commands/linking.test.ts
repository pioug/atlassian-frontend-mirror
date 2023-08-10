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
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

import { widthPlugin } from '@atlaskit/editor-plugin-width';

import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import mediaPlugin from '../';
import floatingToolbarPlugin from '../../floating-toolbar';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';

import { MediaLinkingActionsTypes } from '../pm-plugins/linking/actions';
import { checkMediaType } from '../utils/check-media-type';
import { mediaLinkingPluginKey } from '../pm-plugins/linking';
import * as linking from './linking';
import { INPUT_METHOD } from '../../analytics/types';
import * as commands from '../../../commands';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

const { setUrlToMedia, showLinkingToolbarWithMediaTypeCheck, unlink } = linking;

jest.mock('../utils/check-media-type', () => ({
  checkMediaType: jest.fn(),
}));

jest.mock('../../../commands', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('../../../commands'),
}));

describe('image linking', () => {
  const createEditor = createProsemirrorEditorFactory();

  const mediaProvider = Promise.resolve({
    viewMediaClientConfig: getDefaultMediaClientConfig(),
  });
  const providerFactory = ProviderFactory.create({
    mediaProvider,
  });

  const editor = (doc: any) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(decorationsPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(gridPlugin)
        .add(editorDisabledPlugin)
        .add(floatingToolbarPlugin)
        .add([mediaPlugin, { allowMediaSingle: true, allowLinking: true }])
        .add(hyperlinkPlugin),
      providerFactory,
    });
  };

  const attachAnalyticsEvent = jest.fn().mockImplementation(() => () => {});
  const mockEditorAnalyticsAPI: EditorAnalyticsAPI = {
    attachAnalyticsEvent,
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
    afterEach(() => {
      attachAnalyticsEvent.mockClear();
    });
    afterAll(() => {
      jest.resetAllMocks();
    });

    it('should call analytic when creating a link', () => {
      const { editorView } = editor(document);
      setUrlToMedia(
        'http://google.com',
        INPUT_METHOD.MANUAL,
        mockEditorAnalyticsAPI,
      )(editorView.state, mockDispatch, editorView);

      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'added',
        actionSubject: 'media',
        actionSubjectId: 'link',
        attributes: expect.objectContaining({ inputMethod: 'manual' }),
        eventType: 'track',
      });
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
        setUrlToMedia(
          'http://random-url.com',
          INPUT_METHOD.MANUAL,
          mockEditorAnalyticsAPI,
        )(editorView.state, editorView.dispatch, editorView);

        expect(attachAnalyticsEvent).toHaveBeenCalledWith({
          action: 'edited',
          actionSubject: 'media',
          actionSubjectId: 'link',
          eventType: 'track',
        });
      });

      it('should delete analytic when removing a link', () => {
        const { editorView } = editor(documentWithMediaWithLink);

        unlink(mockEditorAnalyticsAPI)(
          editorView.state,
          editorView.dispatch,
          editorView,
        );

        expect(attachAnalyticsEvent).toHaveBeenCalledWith({
          action: 'deleted',
          actionSubject: 'media',
          actionSubjectId: 'link',
          eventType: 'track',
        });
      });

      it("shouldn't call an analytic if the url was modified to the same url", () => {
        const { editorView } = editor(documentWithMediaWithLink);

        setUrlToMedia(googleUrl, INPUT_METHOD.MANUAL, mockEditorAnalyticsAPI)(
          editorView.state,
          mockDispatch,
          editorView,
        );

        expect(attachAnalyticsEvent).not.toBeCalled();
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
          setUrlToMedia(
            'http://google.com',
            INPUT_METHOD.MANUAL,
            mockEditorAnalyticsAPI,
          )(editorView.state, mockDispatch, editorView);
        } catch (e) {
          // noop
        }

        expect(attachAnalyticsEvent).toHaveBeenCalledWith({
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
