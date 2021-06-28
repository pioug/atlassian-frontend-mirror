import { mount, ReactWrapper } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { TextSelection, Selection } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import * as prosemirrorUtils from 'prosemirror-utils';

import {
  annotation,
  code_block,
  doc,
  h1,
  p,
  panel,
  hardBreak,
  Refs,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EventDispatcher } from '../../../../event-dispatcher';
import { inlineCommentProvider, nullComponent, selectorById } from '../_utils';
import {
  removeInlineCommentNearSelection,
  setInlineCommentDraftState,
} from '../../commands';
import { InlineCommentPluginState } from '../../pm-plugins/types';
import annotationPlugin, {
  InlineCommentAnnotationProvider,
  AnnotationUpdateEmitter,
} from '../..';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  CONTENT_COMPONENT,
} from '../../../analytics/types/enums';
import { flushPromises } from '../../../../__tests__/__helpers/utils';
import { AnnotationTestIds } from '../../types';
import { RESOLVE_METHOD } from '../../../analytics/types/inline-comment-events';
import * as commands from '../../commands/index';
import { inlineCommentPluginKey, getPluginState } from '../../utils';
import { getAnnotationViewClassname } from '../../nodeviews';

describe('annotation', () => {
  const createEditor = createEditorFactory();
  const eventDispatcher = new EventDispatcher();
  const providerFactory = new ProviderFactory();
  let contentComponent: ReactWrapper;
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

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
          inlineComment: inlineCommentOptions || inlineCommentProvider,
        },
      },
      createAnalyticsEvent,
    });

  function mountContentComponent(editorView: EditorView) {
    return mount(
      annotationPlugin({ inlineComment: inlineCommentProvider })
        .contentComponent!({
        editorView,
        editorActions: null as any,
        eventDispatcher,
        providerFactory,
        appearance: 'full-page',
        disabled: false,
        containerElement: null,
        dispatchAnalyticsEvent: createAnalyticsEvent,
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
    };
    jest
      .spyOn(inlineCommentPluginKey, 'getState')
      .mockReturnValue(testInlineCommentState);
  }

  afterEach(() => {
    createAnalyticsEvent.mockClear();
    jest.restoreAllMocks();
    if (contentComponent && contentComponent.length) {
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
      let editorView: EditorView<any>;
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

        editorView = editorData.editorView;
        bookMarkPositions = editorData.refs;
      });

      it('passes dom based on current selection if there is no bookmarked selection', async () => {
        contentComponent = mountContentComponent(editorView);

        const viewComponent = contentComponent.find(nullComponent);
        const domElement = viewComponent.prop('dom');
        expect(domElement).toBeTruthy();
        expect(domElement.innerText).toBe('hello');
      });

      it('passes dom and textSelection based on bookmarked selection if it is available', () => {
        mockPluginStateWithBookmark(editorView, bookMarkPositions);

        contentComponent = mountContentComponent(editorView);

        const createComponent = contentComponent.find(nullComponent);
        const textSelection = createComponent.prop('textSelection');
        expect(textSelection).toBe('world');

        const domElement = createComponent.prop('dom');
        expect(domElement).toBeTruthy();
        expect(domElement.innerText).toBe('world');
      });
    });

    it('passes textSelection correctly when selection spans across multiple nodes', () => {
      const { editorView, refs } = editor(
        doc(p('{start}hello'), panel()(p('world{end}!!!'))),
      );

      mockPluginStateWithBookmark(editorView, refs);

      contentComponent = mountContentComponent(editorView);

      const createComponent = contentComponent.find(nullComponent);
      const textSelection = createComponent.prop('textSelection');
      expect(textSelection).toBe('helloworld');
    });

    describe('view annotation when findDomRefAtPos returns null', () => {
      beforeEach(async () => {
        const mock = jest.spyOn(prosemirrorUtils, 'findDomRefAtPos');
        mock.mockImplementation((pos, domAtPos) => {
          throw new Error('Error message from mock');
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
        contentComponent = mountContentComponent(editorView);
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
        });
      });

      it("doesn't render", () => {
        const saveSelector = selectorById(AnnotationTestIds.componentSave);
        expect(saveSelector).toBeTruthy();
        const saveButton = contentComponent.find(saveSelector);
        expect(saveButton.length).toBe(0);
        const viewComponent = contentComponent.find(nullComponent);
        expect(viewComponent.length).toBe(0);
      });
    });

    describe('view annotation', () => {
      let editorView: EditorView<any>;
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
        editorView = editorData.editorView;
        annotationPos = editorData.refs.start;

        // Let the getState promise resolve
        await flushPromises();
        contentComponent = mountContentComponent(editorView);
      });

      it('renders correctly', () => {
        expect(selectorById(AnnotationTestIds.componentSave)).toBeTruthy();
        const viewComponent = contentComponent.find(nullComponent);
        expect(viewComponent).toBeTruthy();
        expect(viewComponent.prop('annotations')).toEqual([
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
          const viewComponent = contentComponent.find(nullComponent);
          expect(viewComponent.exists()).toBeTruthy();
          viewComponent.prop('onClose')();
          // force rerender
          contentComponent.setProps(contentComponent.props());
          expect(contentComponent.find(nullComponent).exists()).toBeFalsy();
        });

        it('when selection moved away from annotation', () => {
          expect(contentComponent.find(nullComponent)).toBeTruthy();
          const { state } = editorView;
          editorView.dispatch(
            state.tr.setSelection(Selection.atEnd(state.doc)),
          );
          contentComponent.setProps(contentComponent.props());
          expect(contentComponent.find(nullComponent).exists()).toBeFalsy();
        });

        it('when annotation is deleted', async () => {
          const viewComponent = contentComponent.find(nullComponent);
          expect(viewComponent.exists()).toBeTruthy();
          viewComponent.prop('onDelete')('first123');
          // rerender to let onDelete update hidden state
          contentComponent.setProps(contentComponent.props());
          // rerender after hidden state updated
          contentComponent.setProps(contentComponent.props());
          expect(contentComponent.find(nullComponent).exists()).toBeFalsy();
        });

        it('not closed when clicking same annotation', () => {
          expect(contentComponent.find(nullComponent)).toBeTruthy();
          const { state } = editorView;
          editorView.dispatch(
            state.tr.setSelection(
              Selection.near(state.doc.resolve(annotationPos)),
            ),
          );
          contentComponent.setProps(contentComponent.props());
          expect(contentComponent.find(nullComponent).exists()).toBeTruthy();
        });
      });

      describe('onResolve', () => {
        beforeEach(() => {
          const viewComponent = contentComponent.find(nullComponent);
          viewComponent.prop('onResolve')('first123');
        });

        it('resolves annotation', () => {
          const pluginState = getPluginState(editorView.state);
          expect(pluginState.annotations).toStrictEqual({
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
      let editorView: EditorView, contentComponent: ReactWrapper;
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

        contentComponent = mountContentComponent(editorView);
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
        expect(
          contentComponent.find(nullComponent).prop('annotations'),
        ).toEqual([
          { type: 'inlineComment', id: 'second' },
          { type: 'inlineComment', id: 'first' },
        ]);
      });
    });
  });

  describe('create annotation', () => {
    it('calls dispatch just once', () => {
      const { editorView, refs } = editor(
        doc(p('Fluke {start}{<}jib scourge of the{>}{end} seven seas')),
      );
      mockPluginStateWithBookmark(editorView, refs);

      const dispatchSpy = jest.spyOn(editorView, 'dispatch');
      const id = 'annotation-id-123';
      commands.createAnnotation(id)(editorView.state, editorView.dispatch);

      let inlineCommentTransactionCalls = 0;
      dispatchSpy.mock.calls.forEach((call) => {
        call.forEach((tr) => {
          tr.getMeta(inlineCommentPluginKey) && inlineCommentTransactionCalls++;
        });
      });
      expect(inlineCommentTransactionCalls).toBe(1);
    });

    it('paragraph', () => {
      const { editorView, refs } = editor(
        doc(p('Fluke {start}{<}jib scourge of the{>}{end} seven seas')),
      );
      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(id)(editorView.state, editorView.dispatch);
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

    it('with only text and a hardBreak', () => {
      const { editorView } = editor(
        doc(p('Fluke {<}jib scourge', hardBreak(), ' of the{>} seven seas')),
      );

      const id = 'annotation-id-123';
      setInlineCommentDraftState(true)(editorView.state, editorView.dispatch);
      commands.createAnnotation(id)(editorView.state, editorView.dispatch);
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
        setInlineCommentDraftState(true)(editorView.state, editorView.dispatch);
      });

      it('after create', () => {
        const id = 'annotation-id-123';
        const previousToPos = editorView.state.selection.$to.pos;

        contentComponent = mountContentComponent(editorView);

        const createComponent = contentComponent.find(nullComponent);
        const onCreate = createComponent.prop('onCreate');
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

        contentComponent = mountContentComponent(editorView);

        const createComponent = contentComponent.find(nullComponent);
        const onClose = createComponent.prop('onClose');
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
      const { editorView } = editor(
        doc(p('Fluke {<}jib scourge of the{>} seven seas')),
      );

      // set the draft state first before creation annotation
      setInlineCommentDraftState(true)(editorView.state, editorView.dispatch);

      const id = 'annotation-id-123';
      commands.createAnnotation(id)(editorView.state, editorView.dispatch);

      // Optimistic creation should create the comment in the state right away.
      const pluginState = getPluginState(editorView.state);
      expect(Object.keys(pluginState.annotations)).toContain(id);
    });

    it('heading', () => {
      const { editorView, refs } = editor(
        doc(h1('Fluke {start}{<}jib scourge of the{>}{end} seven seas')),
      );

      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(id)(editorView.state, editorView.dispatch);
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
      const { editorView, refs } = editor(
        doc(
          p('Fluke {start}{<}jib'),
          panel()(p('scourge of the{>}{end} seven seas')),
        ),
      );

      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(id)(editorView.state, editorView.dispatch);
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
      const { editorView, refs } = editor(
        doc(
          p('Fluke {start}{<}jib'),
          code_block()('scourge of the{>}{end} seven seas'),
        ),
      );

      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      commands.createAnnotation(id)(editorView.state, editorView.dispatch);
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

    const inlineCommentProviderWithToggle = {
      ...inlineCommentProvider,
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
        inlineCommentProviderWithToggle,
      );

      // default is on
      let pluginState = getPluginState(editorView.state);
      expect(pluginState.isVisible).toBe(true);

      // turn it off
      updateSubscriber.emit('setvisibility', false);
      pluginState = getPluginState(editorView.state);
      expect(pluginState.isVisible).toBe(false);
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
        inlineCommentProviderWithToggle,
      );

      const { dispatch, state } = editorView;
      commands.setInlineCommentsVisibility(false)(state, dispatch);

      // current state is off
      let pluginState = getPluginState(editorView.state);
      expect(pluginState.isVisible).toBe(false);

      // turn it on
      updateSubscriber.emit('setvisibility', true);
      pluginState = getPluginState(editorView.state);
      expect(pluginState.isVisible).toBe(true);
    });
  });
});
