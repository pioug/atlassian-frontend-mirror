import { DecorationSet } from 'prosemirror-view';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/schema-builder';

import tablePlugin from '../../../../../table';
import { buildColumnControlsDecorations } from '../../../../pm-plugins/decorations/utils';
import { pluginKey } from '../../../../pm-plugins/plugin-factory';
import { TableDecorations } from '../../../../types';

describe('tables: column controls decorations', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
      pluginKey,
    });

  describe('#buildColumnControlsDecorations', () => {
    const decorationKey = TableDecorations.COLUMN_CONTROLS_DECORATIONS;
    it(`should return a decorationSet with 2 ${decorationKey} type`, () => {
      const {
        editorView: { state },
      } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      const nextDecorationSet = buildColumnControlsDecorations({
        decorationSet: DecorationSet.empty,
        tr: state.tr,
      });

      const decorations = nextDecorationSet.find(
        undefined,
        undefined,
        (spec: any) => spec.key.indexOf(decorationKey) > -1,
      );

      expect(decorations).toHaveLength(2);
    });
  });
});
