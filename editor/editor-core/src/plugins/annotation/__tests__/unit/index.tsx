import React from 'react';
import { mount } from 'enzyme';
import { ProviderFactory } from '@atlaskit/editor-common';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  annotation,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { EventDispatcher } from '../../../../event-dispatcher';
import { AnnotationTypeProviders } from '../../types';
import { removeInlineCommentNearSelection } from '../../commands';
import annotationPlugin, {
  AnnotationTypeProvider,
  InlineCommentState,
  AnnotationComponentProps,
} from '../..';
import { pluginKey } from '../../pm-plugins/plugin-factory';

const inlineCommentProvider: AnnotationTypeProvider<
  'inlineComment',
  InlineCommentState
> = {
  getState: async annotationIds =>
    annotationIds.map(id => {
      return {
        annotationType: 'inlineComment',
        id,
        state: { resolved: false },
      };
    }),
};

jest.useFakeTimers();

describe('annotation', () => {
  const createEditor = createEditorFactory();
  const eventDispatcher = new EventDispatcher();
  const providerFactory = new ProviderFactory();
  const mockComponent = () => {
    return null;
  };

  const editor = (
    doc: any,
    annotationComponent?: React.ComponentType<AnnotationComponentProps>,
    providers?: AnnotationTypeProviders,
  ) =>
    createEditor({
      doc,
      pluginKey,
      editorProps: {
        annotationProvider: {
          component: annotationComponent,
          ...(providers && { providers }),
        },
      },
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
    it('passes the visible annotations to the component', async () => {
      const providers = {
        inlineComment: inlineCommentProvider,
      };
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
        mockComponent,
        providers,
      );

      // Let the getState promise resolve
      jest.runOnlyPendingTimers();
      await new Promise(resolve => {
        process.nextTick(resolve);
      });

      const cc = mount(
        annotationPlugin({
          component: mockComponent,
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

      expect(cc.find(mockComponent).prop('annotations')).toEqual([
        { type: 'inlineComment', id: 'nested' },
        { type: 'inlineComment', id: '123' },
      ]);

      cc.unmount();
    });

    it('passes the annotations in nesting order', async () => {
      const providers = {
        inlineComment: inlineCommentProvider,
      };

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
        mockComponent,
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

      const cc = mount(
        annotationPlugin({
          component: mockComponent,
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

      // since outer text also has 'first' mark id, we expect 'second' to appear first
      expect(cc.find(mockComponent).prop('annotations')).toEqual([
        { type: 'inlineComment', id: 'second' },
        { type: 'inlineComment', id: 'first' },
      ]);

      cc.unmount();
    });
  });
});
