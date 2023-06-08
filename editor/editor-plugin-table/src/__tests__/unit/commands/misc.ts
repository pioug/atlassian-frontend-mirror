import { PluginKey } from 'prosemirror-state';
import { isColumnSelected } from '@atlaskit/editor-tables/utils';
import {
  doc,
  table,
  tdEmpty,
  tr,
  DocBuilder,
  p,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import panelPlugin from '@atlaskit/editor-core/src/plugins/panel';
import {
  selectColumn,
  moveCursorBackward,
} from '../../../plugins/table/commands';
import { getDecorations } from '../../../plugins/table/pm-plugins/decorations/plugin';
import { getPluginState } from '../../../plugins/table/pm-plugins/plugin-factory';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import {
  TableDecorations,
  TablePluginState,
} from '../../../plugins/table/types';
import tablePlugin from '../../../plugins/table';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { widthPlugin } from '@atlaskit/editor-plugin-width';

describe('table plugin: commands', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(decorationsPlugin)
    .add(panelPlugin)
    .add(contentInsertionPlugin)
    .add(widthPlugin)
    .add([
      tablePlugin,
      {
        tableOptions: { allowHeaderColumn: true },
      },
    ]);
  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey>({
      doc,
      preset,
      pluginKey,
    });

  describe('#selectColumn', () => {
    it('should select a column and set targetCellPosition to point to the first cell', () => {
      const { editorView } = editor(doc(table()(tr(tdEmpty, tdEmpty))));
      const { state, dispatch } = editorView;
      selectColumn(1)(state, dispatch);
      const pluginState = getPluginState(editorView.state);
      expect(pluginState.targetCellPosition).toEqual(6);
      expect(isColumnSelected(1)(editorView.state.selection));
    });

    it('should create decorations to select the column', () => {
      const { editorView } = editor(doc(table()(tr(tdEmpty, tdEmpty))));
      const { state, dispatch } = editorView;
      selectColumn(1)(state, dispatch);
      const decorationSet = getDecorations(editorView.state);
      const columnSelectedDecorations = decorationSet.find(
        undefined,
        undefined,
        (spec) => spec.key.indexOf(TableDecorations.COLUMN_SELECTED) > -1,
      );

      expect(columnSelectedDecorations).toHaveLength(1);
    });
  });

  describe('#moveCursorBackwards', () => {
    describe(`press backspace in an empty paragraph`, () => {
      describe(`paragraph is not last node in document`, () => {
        it(`should delete the paragraph node and place the cursor inside the last table cell`, () => {
          const { editorView } = editor(
            doc(
              table({ localId: 'testId' })(
                tr(td({})(p()), td({})(p()), td({})(p())),
              ),
              p('{<>}'),
              p(),
            ),
          );
          const { state, dispatch } = editorView;
          moveCursorBackward(state, dispatch);
          const expectedDoc = doc(
            table({ localId: 'testId' })(
              tr(td({})(p()), td({})(p()), td({})(p('{<>}'))),
            ),
            p(),
          );
          expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
        });
      });

      describe(`paragraph is the last node in document`, () => {
        it(`should just place the cursor inside the last table cell`, () => {
          const { editorView } = editor(
            doc(
              table({ localId: 'testId' })(
                tr(td({})(p()), td({})(p()), td({})(p())),
              ),
              p('{<>}'),
            ),
          );
          const { state, dispatch } = editorView;
          moveCursorBackward(state, dispatch);
          const expectedDoc = doc(
            table({ localId: 'testId' })(
              tr(td({})(p()), td({})(p()), td({})(p('{<>}'))),
            ),
            p(),
          );
          expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
        });
      });
    });

    describe(`press backspace in paragraph with content`, () => {
      it(`should place cursor inside last table cell`, () => {
        const editorParagraphEnd = editor(
          doc(
            table({ localId: 'testId' })(
              tr(td({})(p()), td({})(p()), td({})(p())),
            ),
            p('{<>}hello there'),
          ),
        );
        const editorViewParagraphEnd = editorParagraphEnd.editorView;
        moveCursorBackward(
          editorViewParagraphEnd.state,
          editorViewParagraphEnd.dispatch,
        );
        const paragraphEndExpectedDoc = doc(
          table({ localId: 'testId' })(
            tr(td({})(p()), td({})(p()), td({})(p('{<>}'))),
          ),
          p('hello there'),
        );
        expect(editorViewParagraphEnd.state).toEqualDocumentAndSelection(
          paragraphEndExpectedDoc,
        );

        const editorParagraph = editor(
          doc(
            table({ localId: 'testId' })(
              tr(td({})(p()), td({})(p()), td({})(p())),
            ),
            p('{<>}hello there'),
            p('hello there'),
          ),
        );
        const editorViewParagraph = editorParagraph.editorView;
        moveCursorBackward(
          editorViewParagraph.state,
          editorViewParagraph.dispatch,
        );
        const paragraphExpectedDoc = doc(
          table({ localId: 'testId' })(
            tr(td({})(p()), td({})(p()), td({})(p('{<>}'))),
          ),
          p('hello there'),
          p('hello there'),
        );
        expect(editorViewParagraph.state).toEqualDocumentAndSelection(
          paragraphExpectedDoc,
        );
      });
    });
  });
});
