import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  LightEditorPlugin,
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import tablePlugin from '../../../../table';
import { buildColumnResizingDecorationSet } from '../../../decorations';
import { DecorationSet } from 'prosemirror-view';
import { TableDecorations } from '../../../types';
import { pluginKey } from '../../../pm-plugins/plugin-factory';

describe('table plugin: decorations', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
      pluginKey,
    });

  describe('#buildColumnResizingDecorationSet', () => {
    describe.each([
      [-1, TableDecorations.COLUMN_RESIZING_HANDLE, 0],
      [0, TableDecorations.COLUMN_RESIZING_HANDLE, 0],
      [1, TableDecorations.COLUMN_RESIZING_HANDLE, 1],
    ])(
      'when columnEndIndex is %i',
      (columnEndIndex, decorationKey, expectedDecorations) => {
        it(`should return a decorationSet with ${expectedDecorations} ${decorationKey} type`, async () => {
          const {
            editorView: { state },
          } = await editor(doc(table()(tr(tdCursor, tdEmpty))));
          const nextDecorationSet = buildColumnResizingDecorationSet(
            columnEndIndex,
          )({
            decorationSet: DecorationSet.empty,
            tr: state.tr,
          });

          const decorations = nextDecorationSet.find(
            undefined,
            undefined,
            spec => spec.key.indexOf(decorationKey) > -1,
          );

          expect(decorations).toHaveLength(expectedDecorations);
        });
      },
    );
  });
});
