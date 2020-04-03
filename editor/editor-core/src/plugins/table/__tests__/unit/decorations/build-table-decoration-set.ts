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
import { buildTableDecorationSet } from '../../../decorations';
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

  describe('#buildTableDecorationSet', () => {
    describe.each([
      [true, TableDecorations.COLUMN_CONTROLS_DECORATIONS, 2],
      [false, TableDecorations.COLUMN_CONTROLS_DECORATIONS, 0],
    ])(
      'when shouldRecreateColumnControls is %p',
      (shouldRecreateColumnControls, decorationKey, expectedDecorations) => {
        it(`should return a decorationSet with ${expectedDecorations} ${decorationKey} type`, async () => {
          const {
            editorView: { state },
          } = await editor(doc(table()(tr(tdCursor, tdEmpty))));
          const nextDecorationSet = buildTableDecorationSet(
            shouldRecreateColumnControls,
          )({
            decorationSet: DecorationSet.empty,
            tr: state.tr,
          });

          const decorations = nextDecorationSet.find(
            undefined,
            undefined,
            (spec: any) => spec.key.indexOf(decorationKey) > -1,
          );

          expect(decorations).toHaveLength(expectedDecorations);
        });
      },
    );
  });
});
