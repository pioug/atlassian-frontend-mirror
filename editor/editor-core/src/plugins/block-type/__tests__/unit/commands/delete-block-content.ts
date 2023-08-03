import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  inlineCard,
  ul,
  li,
  p,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import listPlugin from '../../../../list';
import codeBlockPlugin from '../../../../code-block';
import layoutPlugin from '../../../../layout';
import mediaPlugin from '../../../../media';
import panelPlugin from '../../../../panel';
import { cardPlugin } from '@atlaskit/editor-plugin-card';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import floatingToolbarPlugin from '../../../../floating-toolbar';
import editorDisabledPlugin from '../../../../editor-disabled';

import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import basePLugin from '../../../../base';
import { deleteBlockContent } from '../../../commands';
import { isNodeAWrappingBlockNode } from '../../../utils';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

describe('delete block content', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(basePLugin)
      .add(decorationsPlugin)
      .add(editorDisabledPlugin)
      .add(listPlugin)
      .add([codeBlockPlugin, { appearance: 'full-page' }])
      .add(layoutPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(gridPlugin)
      .add(floatingToolbarPlugin)
      .add(hyperlinkPlugin)
      .add([cardPlugin, { platform: 'web' }])
      .add([mediaPlugin, { allowMediaSingle: true }])
      .add(tablesPlugin)
      .add(panelPlugin);

    return createEditor({
      doc,
      preset,
    });
  };

  describe('when deleting in a panel', () => {
    it('should not delete the panel when deleting inlineCard', () => {
      const initialDoc = doc(
        panel()(
          p('{<}', inlineCard({ url: 'http://www.google.com' })(), '{>}'),
        ),
      );

      const expectedDoc = doc(panel()(p('{<>}')));

      const { editorView } = editor(initialDoc);
      deleteBlockContent(isNodeAWrappingBlockNode)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not delete the panel when deleting text', () => {
      const initialDoc = doc(panel()(p('{<}AAA{>}')));

      const expectedDoc = doc(panel()(p('{<>}')));

      const { editorView } = editor(initialDoc);
      deleteBlockContent(isNodeAWrappingBlockNode)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not delete the panel when deleting list', () => {
      const initialDoc = doc(
        panel()(ul(li(p('{<}a')), li(p('b')), li(p('c{>}')))),
      );

      const expectedDoc = doc(panel()(ul(li(p('{<>}')))));

      const { editorView } = editor(initialDoc);
      deleteBlockContent(isNodeAWrappingBlockNode)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not delete the panel when deleting across bottom of list', () => {
      const initialDoc = doc(
        panel()(ul(li(p('{<}aaa')), li(p('bbb')), li(p('ccc')))),
        p('ddd{>}'),
      );

      const expectedDoc = doc(panel()(ul(li(p('{<>}')))));

      const { editorView } = editor(initialDoc);
      deleteBlockContent(isNodeAWrappingBlockNode)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should delete the panel when deleting across top of list', () => {
      const initialDoc = doc(
        p('{<}aaa'),
        panel()(ul(li(p('bbb')), li(p('ccc')), li(p('ddd{>}')))),
      );

      const expectedDoc = doc(p('{<>}'));

      const { editorView } = editor(initialDoc);
      deleteBlockContent(isNodeAWrappingBlockNode)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });
});
