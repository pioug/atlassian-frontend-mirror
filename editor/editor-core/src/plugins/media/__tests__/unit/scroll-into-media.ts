import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import { getFreshMediaProvider } from '@atlaskit/editor-test-helpers/media-provider';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorInstanceWithPlugin } from '@atlaskit/editor-test-helpers/create-editor';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { RefsNode } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  media,
  mediaGroup,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { Schema } from '@atlaskit/editor-test-helpers/schema';

describe('media scroll', () => {
  let editor: (
    doc: (schema: Schema<any, any>) => RefsNode,
  ) => EditorInstanceWithPlugin<any>;

  describe('when media provider is ready', () => {
    beforeEach(() => {
      const providerFactory = new ProviderFactory();
      const mediaProvider = getFreshMediaProvider();
      providerFactory.setProvider('mediaProvider', mediaProvider);

      const createEditor = createEditorFactory();
      editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
        createEditor({
          doc,
          editorProps: {
            media: { allowMediaSingle: true, featureFlags: { captions: true } },
          },
          providerFactory,
        });
    });

    describe('and when scrollIntoView is called', () => {
      let editorInstance: EditorInstanceWithPlugin<any>;

      beforeEach(() => {
        editorInstance = editor(
          doc(
            mediaGroup(
              '{<>}',
              media({
                id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                type: 'file',
                collection: 'MediaServicesSample',
              })(),
            ),
          ),
        );
      });

      it('should not throw an Error', () => {
        expect(() => {
          const editorView = editorInstance.editorView;
          let tr = editorView.state.tr;

          tr.setSelection(new NodeSelection(tr.doc.resolve(1)));
          editorView.dispatch(tr);

          tr = editorView.state.tr.scrollIntoView();
          editorView.dispatch(tr);
        }).not.toThrow();
      });
    });
  });

  describe('when media provider is not ready', () => {
    beforeEach(() => {
      const createEditor = createEditorFactory();
      editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
        createEditor({
          doc,
          editorProps: {
            media: { allowMediaSingle: true, featureFlags: { captions: true } },
          },
        });
    });

    describe('and when scrollIntoView is called', () => {
      let editorInstance: EditorInstanceWithPlugin<any>;

      beforeEach(() => {
        editorInstance = editor(
          doc(
            mediaGroup(
              '{<>}',
              media({
                id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                type: 'file',
                collection: 'MediaServicesSample',
              })(),
            ),
          ),
        );
      });

      it('should not throw an Error', () => {
        expect(() => {
          const editorView = editorInstance.editorView;
          const tr = editorView.state.tr;

          tr.setSelection(new NodeSelection(tr.doc.resolve(1)));
          tr.scrollIntoView();
          editorView.dispatch(tr);
        }).not.toThrow();
      });

      it('should not throw an RangeError', () => {
        expect(() => {
          const editorView = editorInstance.editorView;
          const tr = editorView.state.tr;

          tr.setSelection(new NodeSelection(tr.doc.resolve(1)));
          tr.scrollIntoView();
          editorView.dispatch(tr);
        }).not.toThrow(new RangeError('No node after pos 1'));
      });
    });
  });
});
