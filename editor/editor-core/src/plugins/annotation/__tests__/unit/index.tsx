import { mount, ReactWrapper } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  annotation,
  code_block,
  doc,
  h1,
  p,
  panel,
  Refs,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { EventDispatcher } from '../../../../event-dispatcher';
import { inlineCommentProvider, nullComponent, selectorById } from '../_utils';
import {
  removeInlineCommentNearSelection,
  setInlineCommentDraftState,
} from '../../commands';
import { inlineCommentPluginKey } from '../../pm-plugins/plugin-factory';
import { InlineCommentPluginState } from '../../pm-plugins/types';
import annotationPlugin, { createAnnotation } from '../..';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../../analytics/types/enums';
import { getPluginState } from './../../pm-plugins/inline-comment';
import { flushPromises } from '../../../../__tests__/__helpers/utils';
import { AnnotationTestIds } from '../../types';

describe('annotation', () => {
  const createEditor = createEditorFactory();
  const eventDispatcher = new EventDispatcher();
  const providerFactory = new ProviderFactory();
  let contentComponent: ReactWrapper;
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

  const editor = (doc: any) =>
    createEditor({
      doc,
      pluginKey: inlineCommentPluginKey,
      editorProps: {
        allowPanel: true,
        allowAnalyticsGASV3: true,
        annotationProviders: {
          inlineComment: inlineCommentProvider,
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
      annotationsInSelection: [],
      mouseData: { x: 0, y: 0, isSelecting: false },
      bookmark: getBookmark(editorView, refs),
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

    describe('view annotation', () => {
      let editorView: EditorView<any>;

      beforeEach(async () => {
        const editorData = editor(
          doc(
            p(
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'first123',
              })('hell{<>}o'),
            ),
            p('world'),
          ),
        );
        editorView = editorData.editorView;

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

      it('sends view annotation analytics event', () => {
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
    });

    describe('view nested annotations', () => {
      it('passes the visible annotations to the component', async () => {
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

        // Let the getState promise resolve
        await flushPromises();

        contentComponent = mountContentComponent(editorView);

        expect(
          contentComponent.find(nullComponent).prop('annotations'),
        ).toEqual([
          { type: 'inlineComment', id: 'nested' },
          { type: 'inlineComment', id: '123' },
        ]);
      });

      it('passes the annotations in nesting order', async () => {
        const { editorView } = editor(
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

        // Let the getState promise resolve
        await flushPromises();
        // ensure nested annotation has [first, second] mark ids
        const innerNode = editorView.state.doc.nodeAt(
          editorView.state.selection.$from.pos,
        )!;

        expect(innerNode.marks[0].attrs.id).toEqual('first');
        expect(innerNode.marks[1].attrs.id).toEqual('second');

        contentComponent = mountContentComponent(editorView);

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
    it('paragraph', () => {
      const { editorView, refs } = editor(
        doc(p('Fluke {start}{<}jib scourge of the{>}{end} seven seas')),
      );
      mockPluginStateWithBookmark(editorView, refs);

      const id = 'annotation-id-123';
      createAnnotation(editorView.state, editorView.dispatch)(id);
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
        action: ACTION.ADDED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      });
    });

    it('optimistic creation', async () => {
      const { editorView } = editor(
        doc(p('Fluke {<}jib scourge of the{>} seven seas')),
      );

      // set the draft state first before creation annotation
      setInlineCommentDraftState(true)(editorView.state, editorView.dispatch);

      const id = 'annotation-id-123';
      createAnnotation(editorView.state, editorView.dispatch)(id);

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
      createAnnotation(editorView.state, editorView.dispatch)(id);
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
      createAnnotation(editorView.state, editorView.dispatch)(id);
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
      createAnnotation(editorView.state, editorView.dispatch)(id);
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
});
