import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';

import {
  em,
  doc,
  annotation,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  InlineCommentPluginState,
  InlineCommentMap,
} from '../../../../annotation/pm-plugins/types';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { PastePluginOptions } from '../../../index';

import hyperlinkPlugin from '../../../../hyperlink';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import pastePlugin from '../../../index';
import blockTypePlugin from '../../../../block-type';
import textFormattingPlugin from '../../../../text-formatting';
import { InlineCommentAnnotationProvider } from '../../../../annotation/types';
import annotationPlugin from '../../../../annotation';
import { inlineCommentPluginKey } from '../../../../annotation/utils';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

describe('paste: handlePaste', () => {
  const createEditor = createProsemirrorEditorFactory();
  let providerFactory: ProviderFactory;
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;
  let commentsPluginStateMock: jest.SpyInstance;
  interface PluginsOptions {
    paste?: PastePluginOptions;
  }

  const editor = (
    doc: DocBuilder,
    pluginsOptions?: PluginsOptions,
    attachTo?: HTMLElement,
  ) => {
    const inlineCommentProvider: InlineCommentAnnotationProvider = {
      getState: async (ids: string[]) => {
        return ids.map((id) => ({
          annotationType: AnnotationTypes.INLINE_COMMENT,
          id,
          state: { resolved: false },
        }));
      },
      createComponent: () => null,
      viewComponent: () => null,
    };
    providerFactory = ProviderFactory.create({
      annotationProviders: Promise.resolve({
        inlineComment: inlineCommentProvider,
      }),
    });

    createAnalyticsEvent = createAnalyticsEventMock();
    const pasteOptions: PastePluginOptions = (pluginsOptions &&
      pluginsOptions.paste) || {
      cardOptions: {},
    };

    const wrapper = createEditor({
      doc,
      providerFactory,
      attachTo,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([pastePlugin, pasteOptions])
        .add(blockTypePlugin)
        .add(textFormattingPlugin)
        .add(hyperlinkPlugin)
        .add([
          annotationPlugin,
          { inlineComment: { ...inlineCommentProvider } },
        ]),
    });

    createAnalyticsEvent.mockClear();

    return wrapper;
  };

  function mockCommentsStateWithAnnotations(annotations: InlineCommentMap) {
    const testInlineCommentState: InlineCommentPluginState = {
      annotations: annotations,
      selectedAnnotations: [],
      mouseData: { isSelecting: false },
      disallowOnWhitespace: false,
      isVisible: true,
    };
    return jest
      .spyOn(inlineCommentPluginKey, 'getState')
      .mockReturnValue(testInlineCommentState);
  }

  beforeEach(() => {
    commentsPluginStateMock = mockCommentsStateWithAnnotations({
      'annotation-id-1': false,
    });
  });

  afterEach(() => {
    commentsPluginStateMock.mockClear();
  });

  describe('when paste inside a normal paragraph', () => {
    it('should work', () => {
      const { editorView } = editor(
        /// doc(blockquote(p(strong('Paste here {<>}')))),
        doc(p('Paste here {<>}')),
      );
      const html = `<meta charset='utf-8'><p data-pm-slice="1 1 []"><span class="fabric-editor-annotation" data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="annotation-id-1">LOL</span></p>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Paste here ',

            annotation({
              id: 'annotation-id-1',
              annotationType: AnnotationTypes.INLINE_COMMENT,
            })('LOL'),
          ),
        ),
      );
    });
  });

  describe('when paste inside italic text', () => {
    it('should work', () => {
      const { editorView } = editor(doc(p(em('Paste here {<>}'))));
      const html = `<meta charset='utf-8'><p data-pm-slice="1 1 []"><span class="fabric-editor-annotation" data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="annotation-id-1">LOL</span></p>`;

      dispatchPasteEvent(editorView, { html });
      const expectedDocument = doc(
        p(
          em('Paste here '),
          annotation({
            id: 'annotation-id-1',
            annotationType: AnnotationTypes.INLINE_COMMENT,
          })(em('LOL')),
        ),
      );

      expect(editorView.state.doc).toEqualDocument(expectedDocument);
    });
  });
});
