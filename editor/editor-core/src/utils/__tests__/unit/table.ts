import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { isPositionNearTableRow } from '../../table';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';

const editorFactory = (doc: DocBuilder) => {
  const editor = createProsemirrorEditorFactory()({
    doc,
    preset: new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(tablesPlugin),
  });
  const { state } = editor.editorView;
  const pos = state.doc.resolve(editor.refs['<>']);
  return { schema: state.schema, pos };
};

describe('isPositionNearTableRow()', () => {
  describe('when direction is before', () => {
    it('return true when there is a sibling before that is a tableRow', () => {
      const { pos, schema } = editorFactory(
        doc(table()(tr(tdEmpty), tr(td()(p('{<>}'))))),
      );
      const actual = isPositionNearTableRow(pos, schema, 'before');
      expect(actual).toBe(true);
    });
    it('return true when the immediate sibling before is a tableRow', () => {
      const { pos, schema } = editorFactory(
        doc(table()(tr(tdEmpty), '{<>}', tr(tdEmpty))),
      );
      const actual = isPositionNearTableRow(pos, schema, 'before');
      expect(actual).toBe(true);
    });
    it('return false when there is no sibling before that is a tableRow', () => {
      const { pos, schema } = editorFactory(doc(table()(tr(td()(p('{<>}'))))));
      const actual = isPositionNearTableRow(pos, schema, 'before');
      expect(actual).toBe(false);
    });
    it('return false when the immediate sibling before is not a tableRow', () => {
      const { pos, schema } = editorFactory(doc(p(''), p('{<>}')));
      const actual = isPositionNearTableRow(pos, schema, 'before');
      expect(actual).toBe(false);
    });
  });
  describe('when direction is after', () => {
    it('return true when there is a sibling after that is a tableRow', () => {
      const { pos, schema } = editorFactory(
        doc(table()(tr(td()(p('{<>}'))), tr(tdEmpty))),
      );
      const actual = isPositionNearTableRow(pos, schema, 'after');
      expect(actual).toBe(true);
    });
    it('return true when the immediate sibling after is a tableRow', () => {
      const { pos, schema } = editorFactory(
        doc(table()(tr(tdEmpty), '{<>}', tr(tdEmpty))),
      );
      const actual = isPositionNearTableRow(pos, schema, 'after');
      expect(actual).toBe(true);
    });
    it('return false when there is no sibling after that is a tableRow', () => {
      const { pos, schema } = editorFactory(doc(table()(tr(td()(p('{<>}'))))));
      const actual = isPositionNearTableRow(pos, schema, 'after');
      expect(actual).toBe(false);
    });
    it('return false when the immediate sibling after is not a tableRow', () => {
      const { pos, schema } = editorFactory(doc(p('{<>}'), p('')));
      const actual = isPositionNearTableRow(pos, schema, 'after');
      expect(actual).toBe(false);
    });
  });
  it('return false when depth reaches zero and no tableRow is found', () => {
    const { pos, schema } = editorFactory(doc(p('{<>}')));
    const actual = isPositionNearTableRow(pos, schema, 'before');
    expect(actual).toBe(false);
  });
  it('return false when tableRow is not in the schema', () => {
    const editor = createProsemirrorEditorFactory()({
      doc: doc(p('{<>}')),
      preset: new Preset<LightEditorPlugin>(),
    });
    const { state } = editor.editorView;
    const pos = state.doc.resolve(editor.refs['<>']);
    const actual = isPositionNearTableRow(pos, state.schema, 'before');
    expect(actual).toBe(false);
  });
});
