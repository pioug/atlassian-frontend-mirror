import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';

import type { DocBuilder } from '@atlaskit/editor-common/types';
import {
  em,
  doc,
  annotation,
  p,
  layoutSection,
  layoutColumn,
} from '@atlaskit/editor-test-helpers/doc-builder';

import type {
  InlineCommentPluginState,
  InlineCommentMap,
} from '../../../../annotation/pm-plugins/types';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { PastePluginOptions } from '../../../index';

import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import pastePlugin from '../../../index';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import layoutPlugin from '../../../../layout';
import type { InlineCommentAnnotationProvider } from '../../../../annotation/types';
import annotationPlugin from '../../../../annotation';
import { inlineCommentPluginKey } from '../../../../annotation/utils';
import betterTypeHistoryPlugin from '../../../../better-type-history';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { undo, redo } from '@atlaskit/editor-prosemirror/history';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

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
        .add([analyticsPlugin, {}])
        .add(decorationsPlugin)
        .add(betterTypeHistoryPlugin)
        .add([pastePlugin, pasteOptions])
        .add(blockTypePlugin)
        .add(textFormattingPlugin)
        .add(hyperlinkPlugin)
        .add([
          annotationPlugin,
          { inlineComment: { ...inlineCommentProvider } },
        ])
        .add(layoutPlugin),
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

  describe('when paste over layout columns', () => {
    // Original doc has layout with text in two columns
    // Selection is over first and second column
    let originalDoc = doc(
      layoutSection(
        layoutColumn({ width: 50 })(p('First {<}--- Replace me')),
        layoutColumn({ width: 50 })(p('and me! ---{>} Last')),
      ),
    );

    // Document with content replaced and merged into first column
    // Layout section has two columns with the second being empty
    const updatedDocWithPastedContent = doc(
      layoutSection(
        layoutColumn({ width: 50 })(p('First TEXT THAT REPLACES OTHERS Last')),
        layoutColumn({ width: 50 })(p('')),
      ),
    );

    it('should merge the paragraphs together in the first layout column', () => {
      // Setup
      const { editorView } = editor(originalDoc);

      // Paste
      const textToPaste = `TEXT THAT REPLACES OTHERS`;
      dispatchPasteEvent(editorView, { plain: textToPaste });

      // Expect paste to succeed and not change layout structure
      expect(editorView.state.doc).toEqualDocument(updatedDocWithPastedContent);
    });

    it('should be able to undo paste', () => {
      // Setup
      const { editorView } = editor(originalDoc);

      // Paste
      const textToPaste = `TEXT THAT REPLACES OTHERS`;
      dispatchPasteEvent(editorView, { plain: textToPaste });

      // Undo
      undo(editorView.state, editorView.dispatch);

      // Expect undo paste correctly
      expect(editorView.state.doc).toEqualDocument(originalDoc);
    });

    it('should be able to redo undone paste', () => {
      // Setup
      const { editorView } = editor(originalDoc);

      // Paste
      const textToPaste = `TEXT THAT REPLACES OTHERS`;
      dispatchPasteEvent(editorView, { plain: textToPaste });

      // Undo
      undo(editorView.state, editorView.dispatch);

      // Redo
      redo(editorView.state, editorView.dispatch);

      // Expect redo paste correctly
      expect(editorView.state.doc).toEqualDocument(updatedDocWithPastedContent);
    });
  });
});
