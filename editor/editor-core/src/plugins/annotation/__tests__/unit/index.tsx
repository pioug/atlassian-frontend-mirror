import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TextSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { AnnotationTypes } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import * as prosemirrorUtils from '@atlaskit/editor-prosemirror/utils';

import type {
  Refs,
  DocBuilder,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  annotation,
  code_block,
  doc,
  h1,
  p,
  panel,
  hardBreak,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { getState } from '../_utils';
import {
  removeInlineCommentNearSelection,
  setInlineCommentDraftState,
} from '../../commands';
import type { InlineCommentPluginState } from '../../pm-plugins/types';
import type { InlineCommentAnnotationProvider } from '../..';
import annotationPlugin, { AnnotationUpdateEmitter } from '../..';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  CONTENT_COMPONENT,
  RESOLVE_METHOD,
} from '@atlaskit/editor-common/analytics';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
import * as commands from '../../commands/index';
import { inlineCommentPluginKey, getPluginState } from '../../utils';
import { getAnnotationViewClassname } from '../../nodeviews';
import type { AnnotationPlugin } from '../../index';

jest.mock('@atlaskit/editor-prosemirror/utils', () => {
  // Unblock prosemirror bump:
  // Workaround to enable spy on prosemirror-utils cjs bundle
  const originalModule = jest.requireActual(
    '@atlaskit/editor-prosemirror/utils',
  );

  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('annotation', () => {
  const createEditor = createEditorFactory();
  const eventDispatcher = new EventDispatcher();
  const providerFactory = new ProviderFactory();
  let contentComponent: RenderResult;
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  let inlineCommentProviderFake: InlineCommentAnnotationProvider;

  beforeEach(() => {
    inlineCommentProviderFake = {
      getState,
      createComponent: jest.fn().mockReturnValue(null),
      viewComponent: jest.fn().mockReturnValue(null),
    };
  });

  const editor = (
    doc: DocBuilder,
    inlineCommentOptions?: InlineCommentAnnotationProvider,
  ) =>
    createEditor({
      doc,
      pluginKey: inlineCommentPluginKey,
      editorProps: {
        allowPanel: true,
        allowAnalyticsGASV3: true,
        annotationProviders: {
          inlineComment: inlineCommentOptions || inlineCommentProviderFake,
        },
      },
      createAnalyticsEvent,
    });

  function mount(
    editorView: EditorView,
    editorAPI?: ExtractInjectionAPI<AnnotationPlugin>,
  ): RenderResult {
    return render(
      annotationPlugin({
        config: { inlineComment: inlineCommentProviderFake },
        api: editorAPI,
      }).contentComponent!({
        editorView,
        editorActions: null as any,
        eventDispatcher,
        providerFactory,
        appearance: 'full-page',
        disabled: false,
        containerElement: null,
        dispatchAnalyticsEvent: createAnalyticsEvent,
        wrapperElement: null,
      })!,
    );
  }

  function getBookmark(editorView: EditorView, refs: Refs) {
    const $start = editorView.state.doc.resolve(refs.start);
    const $end = editorView.state.doc.resolve(refs.end);
    const bookmarkedSelection = new TextSelection($start, $end);
    return bookmarkedSelection.getBookmark();
  }

  function mockPluginStateWithBookmark(editorView: EditorView, refs: Refs) {
    const testInlineCommentState: InlineCommentPluginState = {
      annotations: {},
      selectedAnnotations: [],
      mouseData: { isSelecting: false },
      bookmark: getBookmark(editorView, refs),
      disallowOnWhitespace: false,
      isVisible: true,
      skipSelectionHandling: false,
    };
    jest
      .spyOn(inlineCommentPluginKey, 'getState')
      .mockReturnValue(testInlineCommentState);
  }

  afterEach(() => {
    createAnalyticsEvent.mockClear();
    jest.restoreAllMocks();
    if (contentComponent) {
      contentComponent.unmount();
    }
  });

  describe('removeInlineCommentAtCurrentPos', () => {
    it('removes the annotation matching the id', () => {
      const { editorView } = editor(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: '123',
            })('anno{<>}tated'),
          ),
        ),
      );

      const { dispatch, state } = editorView;
      removeInlineCommentNearSelection('123')(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(doc(p('hello annotated')));
    });

    it('leaves other annotations alone', () => {
      const { editorView } = editor(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: '123',
            })(
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'nested',
              })('dou{<>}ble'),
              'single',
            ),
            'world',
          ),
        ),
      );

      const { dispatch, state } = editorView;
      removeInlineCommentNearSelection('123')(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'nested',
            })('double'),
            'singleworld',
          ),
        ),
      );
    });
  });

  describe('component', () => {
    describe('passes selection data to annotation create and view components', () => {
      let editorView: EditorView;
      let editorAPI: ExtractInjectionAPI<AnnotationPlugin> | undefined;
      let bookMarkPositions: Refs;

      beforeEach(async () => {
        const editorData = editor(
          doc(
            p(
              'aaa',
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'annotation-id-1',
              })('hell{<>}o'),
              'ghkk',
            ),
            p('{start}world{end}'),
          ),
        );

        // Let the getState promise resolve
        await flushPromises();

        ({ editorView } = editorData);
        editorAPI =
          editorData.editorAPI as ExtractInjectionAPI<AnnotationPlugin>;
        bookMarkPositions = editorData.refs;
      });

      it('passes dom based on current selection if there is no bookmarked selection', async () => {
        contentComponent = mount(editorView, editorAPI);

        expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalled();

        const { dom: domElement } = (
          inlineCommentProviderFake.viewComponent as jest.Mock
        ).mock.calls[0][0];
        expect(domElement.innerText).toBe('hello');
      });

      it('passes dom and textSelection based on bookmarked selection if it is available', () => {
        mockPluginStateWithBookmark(editorView, bookMarkPositions);

        contentComponent = mount(editorView, editorAPI);

        const { textSelection, dom: domElement } = (
          inlineCommentProviderFake.createComponent as jest.Mock
        ).mock.calls[0][0];
        expect(textSelection).toBe('world');
        expect(domElement.innerText).toBe('world');
      });
    });

    it('passes textSelection correctly when selection spans across multiple nodes', () => {
      const { editorView, refs } = editor(
        doc(p('{start}hello'), panel()(p('world{end}!!!'))),
      );

      mockPluginStateWithBookmark(editorView, refs);

      contentComponent = mount(editorView);

      const { textSelection } = (
        inlineCommentProviderFake.createComponent as jest.Mock
      ).mock.calls[0][0];
      expect(textSelection).toBe('helloworld');
    });

    describe('view annotation when findDomRefAtPos returns null', () => {
      beforeEach(async () => {
        const mock = jest.spyOn(prosemirrorUtils, 'findDomRefAtPos');
        mock.mockImplementation((pos, domAtPos) => {
          const error = new Error('Error message from mock');
          error.stack = 'stack trace';

          throw error;
        });

        const { editorView } = editor(
          doc(
            p(
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'first123',
              })('{start}hell{<>}o'),
            ),
            p('world'),
          ),
        );

        // Let the getState promise resolve
        await flushPromises();
        contentComponent = mount(editorView);
      });

      it('sends error analytics event', () => {
        // The first analytics event is the editor starting
        expect(createAnalyticsEvent).toHaveBeenCalledTimes(2);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.ERRORED,
          actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: expect.objectContaining({
            component: CONTENT_COMPONENT.INLINE_COMMENT,
            docSize: 16,
            error: 'Error: Error message from mock',
            position: 5,
            selection: {
              anchor: 5,
              head: 5,
              type: 'text',
            },
          }),
          nonPrivacySafeAttributes: expect.objectContaining({
            errorStack: 'stack trace',
          }),
        });
      });

      it("doesn't render", () => {
        expect(
          inlineCommentProviderFake.createComponent,
        ).not.toHaveBeenCalled();
      });
    });

    describe('view annotation', () => {
      let editorView: EditorView;
      let editorAPI: ExtractInjectionAPI<AnnotationPlugin> | undefined;
      let annotationPos: number;

      beforeEach(async () => {
        const editorData = editor(
          doc(
            p(
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'first123',
              })('{start}hell{<>}o'),
            ),
            p('world'),
          ),
        );
        ({ editorView } = editorData);
        editorAPI =
          editorData.editorAPI as ExtractInjectionAPI<AnnotationPlugin>;
        annotationPos = editorData.refs.start;

        // Let the getState promise resolve
        await flushPromises();
        contentComponent = mount(editorView, editorAPI);
      });

      it('renders correctly', () => {
        const { annotations } = (
          inlineCommentProviderFake.viewComponent as jest.Mock
        ).mock.calls[0][0];
        expect(annotations).toEqual([
          { type: 'inlineComment', id: 'first123' },
        ]);
      });

      it('sends view analytics event', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.ANNOTATION,
          actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            overlap: 0,
          },
        });
      });

      describe('is closed as expected', () => {
        it('via onClose callback', async () => {
          const { onClose } = (
            inlineCommentProviderFake.viewComponent as jest.Mock
          ).mock.calls[0][0];

          expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalledTimes(
            1,
          );
          onClose();
          // force rerender
          mount(editorView);

          expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalledTimes(
            1,
          );
        });

        it('when selection moved away from annotation', () => {
          expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalledTimes(
            1,
          );

          const { state } = editorView;
          editorView.dispatch(
            state.tr.setSelection(Selection.atEnd(state.doc)),
          );
          // force rerender
          mount(editorView);

          expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalledTimes(
            1,
          );
        });

        it('when annotation is deleted', async () => {
          expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalledTimes(
            1,
          );
          const { onDelete } = (
            inlineCommentProviderFake.viewComponent as jest.Mock
          ).mock.calls[0][0];

          onDelete('first123');

          // rerender to let onDelete update hidden state
          mount(editorView);
          // rerender after hidden state updated
          mount(editorView);

          expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalledTimes(
            1,
          );
        });

        it('not closed when clicking same annotation', () => {
          expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalledTimes(
            1,
          );
          const { state } = editorView;
          editorView.dispatch(
            state.tr.setSelection(
              Selection.near(state.doc.resolve(annotationPos)),
            ),
          );
          mount(editorView);
          expect(inlineCommentProviderFake.viewComponent).toHaveBeenCalledTimes(
            2,
          );
        });
      });

      describe('onResolve', () => {
        beforeEach(() => {
          const { onResolve } = (
            inlineCommentProviderFake.viewComponent as jest.Mock
          ).mock.calls[0][0];
          onResolve('first123');
        });

        it('resolves annotation', () => {
          const pluginState = getPluginState(editorView.state);
          expect(pluginState?.annotations).toStrictEqual({
            first123: true,
          });
        });

        it('sends resolve analytics event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: ACTION.RESOLVED,
            actionSubject: ACTION_SUBJECT.ANNOTATION,
            actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
            eventType: EVENT_TYPE.TRACK,
            attributes: expect.objectContaining({
              method: RESOLVE_METHOD.COMPONENT,
            }),
          });
        });
      });
    });

    describe('getAnnotationViewClassname', () => {
      it('should show unresolved and focused', () => {
        const result = getAnnotationViewClassname(true, true);
        expect(result).toEqual('ak-editor-annotation-focus');
      });

      it('should show unresolved and unfocused', () => {
        const result = getAnnotationViewClassname(true, false);
        expect(result).toEqual('ak-editor-annotation-blur');
      });

      it('should not show resolved and focused', () => {
        const result = getAnnotationViewClassname(false, true);
        expect(result).toBeUndefined();
      });

      it('should not show resolved and unfocused', () => {
        const result = getAnnotationViewClassname(false, false);
        expect(result).toBeUndefined();
      });
    });

    describe('view nested annotations', () => {
      let editorView: EditorView;
      beforeEach(async () => {
        const editorData = editor(
          doc(
            p(
              'hello ',
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'second',
              })(
                annotation({
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                  id: 'first',
                })('dou{<>}ble'),
              ),

              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'first',
              })('single'),

              'world',
            ),
          ),
        );
        editorView = editorData.editorView;

        // Let the getState promise resolve
        await flushPromises();

        contentComponent = mount(editorView);
      });

      it('sends view annotation analytics event with correct overlap value', async () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.ANNOTATION,
          actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            overlap: 1,
          },
        });
      });

      it('passes the annotations in nesting order', async () => {
        // ensure nested annotation has [first, second] mark ids
        const innerNode = editorView.state.doc.nodeAt(
          editorView.state.selection.$from.pos,
        )!;

        expect(innerNode.marks[0].attrs.id).toEqual('first');
        expect(innerNode.marks[1].attrs.id).toEqual('second');

        // since outer text also has 'first' mark id, we expect 'second' to appear first
        const { annotations } = (
          inlineCommentProviderFake.viewComponent as jest.Mock
        ).mock.calls[0][0];
        expect(annotations).toEqual([
          { type: 'inlineComment', id: 'second' },
          { type: 'inlineComment', id: 'first' },
        ]);
      });
    });
  });

  describe('create annotation', () => {
    it('calls dispatch just once', () => {
      const { editorView, refs, editorAPI } = editor(
        doc(p('Fluke {start}{<}jib scourge of the{>}{end} seven seas')),
      );
      mockPluginStateWithBookmark(editorView, refs);

      const dispatchSpy = jest.spyOn(editorView, 'dispatch');
      const id = 'annotation-id-123';
      commands.createAnnotation(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(id)(editorView.state, editorView.dispatch);

      let inlineCommentTransactionCalls = 0;
      dispatchSpy.mock.calls.forEach((call) => {
        call.forEach((tr) => {
          tr.getMeta(inlineCommentPluginKey) && inlineCommentTransactionCalls++;
        });
      });
      expect(inlineCommentTransactionCalls).toBe(1);
    });

    it('paragraph', () => {
      const { editorView, refs, editorAPI } = editor(
        doc(p('Fluke {start}{<}jib scourge of the{>}{end} seven seas')),
      );
      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(id)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Fluke ',
            annotation({ annotationType: AnnotationTypes.INLINE_COMMENT, id })(
              'jib scourge of the',
            ),
            ' seven seas',
          ),
        ),
      );
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      });
    });

    it('paragraph with trailing new line', () => {
      const { editorView, refs, editorAPI } = editor(
        doc(p('Fluke {start}{<}jib scourge of the'), p('{>}{end}seven seas')),
      );
      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(id)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Fluke ',
            annotation({ annotationType: AnnotationTypes.INLINE_COMMENT, id })(
              'jib scourge of the',
            ),
          ),
          p('seven seas'),
        ),
      );
    });

    it('with only text and a hardBreak', () => {
      const { editorView, editorAPI } = editor(
        doc(p('Fluke {<}jib scourge', hardBreak(), ' of the{>} seven seas')),
      );

      const id = 'annotation-id-123';
      setInlineCommentDraftState(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(true)(editorView.state, editorView.dispatch);
      commands.createAnnotation(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(id)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Fluke ',
            annotation({ annotationType: AnnotationTypes.INLINE_COMMENT, id })(
              'jib scourge',
            ),
            hardBreak(),
            annotation({ annotationType: AnnotationTypes.INLINE_COMMENT, id })(
              ' of the',
            ),
            ' seven seas',
          ),
        ),
      );
    });

    describe('selection and focus', () => {
      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(
          doc(p('Fluke {<}jib scourge of the{>} seven seas')),
        ));
        jest.spyOn(editorView, 'hasFocus').mockReturnValue(false);
        jest.spyOn(editorView, 'focus');
        // set the draft state first before creation annotation
        setInlineCommentDraftState(undefined)(true)(
          editorView.state,
          editorView.dispatch,
        );
      });

      it('after create', () => {
        const id = 'annotation-id-123';
        const previousToPos = editorView.state.selection.$to.pos;

        contentComponent = mount(editorView);

        const { onCreate } = (
          inlineCommentProviderFake.createComponent as jest.Mock
        ).mock.calls[0][0];
        onCreate(id);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'Fluke ',
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id,
              })('jib scourge of the'),
              '{<>} seven seas',
            ),
          ),
        );
        expect(editorView.state.selection.$from.pos).toEqual(previousToPos);
        expect(editorView.state.selection.$to.pos).toEqual(previousToPos);
        expect(editorView.focus).toBeCalled();
      });

      it('after close', () => {
        const previousFromPos = editorView.state.selection.$from.pos;
        const previousToPos = editorView.state.selection.$to.pos;

        contentComponent = mount(editorView);

        const { onClose } = (
          inlineCommentProviderFake.createComponent as jest.Mock
        ).mock.calls[0][0];
        onClose();

        expect(editorView.state.doc).toEqualDocument(
          doc(p('Fluke {<}jib scourge of the{>} seven seas')),
        );
        expect(editorView.state.selection.$from.pos).toEqual(previousFromPos);
        expect(editorView.state.selection.$to.pos).toEqual(previousToPos);
        expect(editorView.focus).toBeCalled();
      });
    });

    it('optimistic creation', async () => {
      const { editorView, editorAPI } = editor(
        doc(p('Fluke {<}jib scourge of the{>} seven seas')),
      );

      // set the draft state first before creation annotation
      setInlineCommentDraftState(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(true)(editorView.state, editorView.dispatch);

      const id = 'annotation-id-123';
      commands.createAnnotation(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(id)(editorView.state, editorView.dispatch);

      // Optimistic creation should create the comment in the state right away.
      const pluginState = getPluginState(editorView.state);
      expect(Object.keys(pluginState?.annotations || {})).toContain(id);
    });

    it('heading', () => {
      const { editorView, refs, editorAPI } = editor(
        doc(h1('Fluke {start}{<}jib scourge of the{>}{end} seven seas')),
      );

      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(id)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          h1(
            'Fluke ',
            annotation({ annotationType: AnnotationTypes.INLINE_COMMENT, id })(
              'jib scourge of the',
            ),
            ' seven seas',
          ),
        ),
      );
    });

    it('across panel', () => {
      const { editorView, refs, editorAPI } = editor(
        doc(
          p('Fluke {start}{<}jib'),
          panel()(p('scourge of the{>}{end} seven seas')),
        ),
      );

      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(id)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Fluke ',
            annotation({ annotationType: AnnotationTypes.INLINE_COMMENT, id })(
              'jib',
            ),
          ),
          panel()(
            p(
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id,
              })('scourge of the'),
              ' seven seas',
            ),
          ),
        ),
      );
    });

    it('across code_block', () => {
      // Annotation is not valid on code block
      const { editorView, refs, editorAPI } = editor(
        doc(
          p('Fluke {start}{<}jib'),
          code_block()('scourge of the{>}{end} seven seas'),
        ),
      );

      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(
        editorAPI?.analytics?.actions as EditorAnalyticsAPI,
      )(id)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Fluke ',
            annotation({ annotationType: AnnotationTypes.INLINE_COMMENT, id })(
              'jib',
            ),
          ),
          code_block()('scourge of the seven seas'),
        ),
      );
    });
  });

  it('does not try to update isSelecting on onMouseUp if not in select mode', () => {
    const updateMouseStateSpy = jest.spyOn(commands, 'updateMouseState');
    const { editorView } = editor(
      doc(p('Trysail Sail ho {<}Corsair smartly{>} boom gangway.')),
    );
    const mouseupEvent = new MouseEvent('mouseup', {});
    editorView.root.dispatchEvent(mouseupEvent);
    expect(updateMouseStateSpy).not.toHaveBeenCalled();
  });

  describe('toggle visibility', () => {
    const updateSubscriber = new AnnotationUpdateEmitter();

    const inlineCommentProviderFakeWithToggle = {
      ...inlineCommentProviderFake,
      updateSubscriber,
    };

    it('emitter is able to turn it off', () => {
      const { editorView } = editor(
        doc(
          p(
            'Fluke {start}{<}jib scourge',
            hardBreak(),
            ' of the{>}{end} seven seas',
          ),
        ),
        inlineCommentProviderFakeWithToggle,
      );

      // default is on
      let pluginState = getPluginState(editorView.state);
      expect(pluginState?.isVisible).toBe(true);

      // turn it off
      updateSubscriber.emit('setvisibility', false);
      pluginState = getPluginState(editorView.state);
      expect(pluginState?.isVisible).toBe(false);
    });

    it('emitter is able to turn it on', () => {
      const { editorView } = editor(
        doc(
          p(
            'Fluke {start}{<}jib scourge',
            hardBreak(),
            ' of the{>}{end} seven seas',
          ),
        ),
        inlineCommentProviderFakeWithToggle,
      );

      const { dispatch, state } = editorView;
      commands.setInlineCommentsVisibility(false)(state, dispatch);

      // current state is off
      let pluginState = getPluginState(editorView.state);
      expect(pluginState?.isVisible).toBe(false);

      // turn it on
      updateSubscriber.emit('setvisibility', true);
      pluginState = getPluginState(editorView.state);
      expect(pluginState?.isVisible).toBe(true);
    });
  });
});
