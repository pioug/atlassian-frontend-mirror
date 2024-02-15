import {
  Side as GapCursorSide,
  setGapCursorSelection,
} from '@atlaskit/editor-common/selection';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  hr,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { setCellSelection } from '../../../utils/selection';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('toEqualDocumentAndSelection matches', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(rulePlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add(selectionPlugin)
    .add(tablesPlugin);

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset,
    });

  it('cursor positions', () => {
    const { editorView } = editor(doc(p('Hello{<>}World')));
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello{<>}World')),
    );
  });

  it('moved cursor positions', () => {
    const { editorView } = editor(doc(p('Hello{<>}')));
    insertText(editorView, 'World');
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld{<>}')),
    );
  });

  it('text selections', () => {
    const { editorView } = editor(doc(p('Hello{<}World{>}')));
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello{<}World{>}')),
    );
  });

  it('node selections', () => {
    const { editorView, refs } = editor(
      doc(p('HelloWorld{<>}'), '{nextPos}', hr()),
    );
    const { state, dispatch } = editorView;
    dispatch(
      state.tr.setSelection(NodeSelection.create(state.doc, refs.nextPos)),
    );
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld'), '{<node>}', hr()),
    );
  });

  it('gap cursor selections', () => {
    const { editorView, refs } = editor(
      doc(p('HelloWorld'), hr(), '{nextPos}'),
    );
    setGapCursorSelection(editorView, refs.nextPos, GapCursorSide.RIGHT);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('HelloWorld'), hr(), '{<|gap>}'),
    );
  });

  it('cell selections', () => {
    const { editorView, refs } = editor(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr('{firstCell}', td()(p('1{<>}')), td()(p('2')), td()(p('3'))),
          tr(td()(p('4')), td()(p('5')), '{lastCell}', td()(p('6'))),
        ),
      ),
    );
    setCellSelection(editorView, refs.firstCell, refs.lastCell);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(p('{<cell}1')), td()(p('2')), td()(p('3'))),
          tr(td()(p('4')), td()(p('5')), td()(p('6{cell>}'))),
        ),
      ),
    );
  });
});
