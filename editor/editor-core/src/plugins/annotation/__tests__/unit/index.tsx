import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { ProviderFactory } from '@atlaskit/editor-common';
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
import {
  AnnotationTypeProviders,
  AnnotationCreateComponentProps,
  AnnotationViewComponentProps,
  InlineCommentPluginState,
} from '../../types';
import { removeInlineCommentNearSelection } from '../../commands';
import { inlineCommentPluginKey } from '../../pm-plugins/plugin-factory';
import { inlineCommentProvider, nullComponent } from '../_utils';
import annotationPlugin, { createAnnotation } from '../..';
import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../../analytics/types/enums';

jest.useFakeTimers();

describe('annotation', () => {
  const createEditor = createEditorFactory();
  const eventDispatcher = new EventDispatcher();
  const providerFactory = new ProviderFactory();
  const providers = {
    inlineComment: inlineCommentProvider,
  };
  let contentComponent: ReactWrapper;
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const editor = (
    doc: any,
    providers?: AnnotationTypeProviders,
    createComponent: React.ComponentType<
      AnnotationCreateComponentProps
    > = nullComponent,
    viewComponent: React.ComponentType<
      AnnotationViewComponentProps
    > = nullComponent,
  ) =>
    createEditor({
      doc,
      pluginKey: inlineCommentPluginKey,
      editorProps: {
        allowPanel: true,
        allowAnalyticsGASV3: true,
        annotationProvider: {
          createComponent,
          viewComponent,
          ...(providers && { providers }),
        },
      },
      createAnalyticsEvent,
    });

  function mountContentComponent(editorView: EditorView) {
    return mount(
      annotationPlugin({
        viewComponent: nullComponent,
        createComponent: nullComponent,
        providers,
      }).contentComponent!({
        editorView,
        editorActions: null as any,
        eventDispatcher,
        providerFactory,
        appearance: 'full-page',
        disabled: false,
        containerElement: null,
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
      mouseData: { x: 0, y: 0, isSelecting: false },
      bookmark: getBookmark(editorView, refs),
    };
    jest
      .spyOn(inlineCommentPluginKey, 'getState')
      .mockReturnValue(testInlineCommentState);
  }

  afterEach(() => {
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
              annotationType: 'inlineComment',
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
              annotationType: 'inlineComment',
              id: '123',
            })(
              annotation({ annotationType: 'inlineComment', id: 'nested' })(
                'dou{<>}ble',
              ),
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
              annotationType: 'inlineComment',
              id: 'nested',
            })('double'),
            'singleworld',
          ),
        ),
      );
    });
  });

  describe('component', () => {
    describe('passes selection as a dom property', () => {
      let editorView: EditorView<any>;
      let bookMarkPositions: Refs;
      beforeEach(() => {
        const editorData = editor(
          doc(
            p(
              annotation({ annotationType: 'inlineComment', id: 'first123' })(
                'hell{<>}o',
              ),
            ),
            p('{start}world{end}'),
          ),
          providers,
        );
        editorView = editorData.editorView;
        bookMarkPositions = editorData.refs;
      });

      it('based on current selection if there is no bookmarked selection', async () => {
        // Let the getState promise resolve
        jest.runOnlyPendingTimers();
        await new Promise(resolve => {
          process.nextTick(resolve);
        });
        contentComponent = mountContentComponent(editorView);

        const domElement = contentComponent.find(nullComponent).prop('dom');
        expect(domElement).toBeTruthy();
        expect(domElement.innerText).toBe('hello');
      });

      it('based on bookmarked selection if it is available', () => {
        mockPluginStateWithBookmark(editorView, bookMarkPositions);

        contentComponent = mountContentComponent(editorView);

        const domElement = contentComponent.find(nullComponent).prop('dom');
        expect(domElement).toBeTruthy();
        expect(domElement.innerText).toBe('world');
      });
    });

    it('passes the visible annotations to the component', async () => {
      const { editorView } = editor(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: 'inlineComment',
              id: '123',
            })(
              annotation({ annotationType: 'inlineComment', id: 'nested' })(
                'dou{<>}ble',
              ),
              'single',
            ),
            'world',
          ),
        ),
        providers,
      );

      // Let the getState promise resolve
      jest.runOnlyPendingTimers();
      await new Promise(resolve => {
        process.nextTick(resolve);
      });

      contentComponent = mountContentComponent(editorView);

      expect(contentComponent.find(nullComponent).prop('annotations')).toEqual([
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
              annotationType: 'inlineComment',
              id: 'second',
            })(
              annotation({ annotationType: 'inlineComment', id: 'first' })(
                'dou{<>}ble',
              ),
            ),

            annotation({ annotationType: 'inlineComment', id: 'first' })(
              'single',
            ),

            'world',
          ),
        ),
        providers,
      );

      // ensure nested annotation has [first, second] mark ids
      const innerNode = editorView.state.doc.nodeAt(
        editorView.state.selection.$from.pos,
      )!;

      expect(innerNode.marks[0].attrs.id).toEqual('first');
      expect(innerNode.marks[1].attrs.id).toEqual('second');

      // Let the getState promise resolve
      jest.runOnlyPendingTimers();
      await new Promise(resolve => {
        process.nextTick(resolve);
      });

      contentComponent = mountContentComponent(editorView);

      // since outer text also has 'first' mark id, we expect 'second' to appear first
      expect(contentComponent.find(nullComponent).prop('annotations')).toEqual([
        { type: 'inlineComment', id: 'second' },
        { type: 'inlineComment', id: 'first' },
      ]);
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
            annotation({ annotationType: 'inlineComment', id })(
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
            annotation({ annotationType: 'inlineComment', id })(
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
            annotation({ annotationType: 'inlineComment', id })('jib'),
          ),
          panel()(
            p(
              annotation({ annotationType: 'inlineComment', id })(
                'scourge of the',
              ),
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
            annotation({ annotationType: 'inlineComment', id })('jib'),
          ),
          code_block()('scourge of the seven seas'),
        ),
      );
    });
  });
});
