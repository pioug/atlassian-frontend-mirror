import {
  setCellAttrs,
  findCellClosestToPos,
} from '@atlaskit/editor-tables/utils';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  tableBackgroundColorNames,
  rgbToHex,
  uuid,
} from '@atlaskit/adf-schema';
import { PluginConfig } from '../../../plugins/table/types';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import TableCellViews from '../../../plugins/table/nodeviews/tableCell';
import tablePlugin from '../../../plugins/table-plugin';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { widthPlugin } from '@atlaskit/editor-plugin-width';

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  browser: {
    chrome: false,
  },
}));

describe('table -> nodeviews -> tableCell.tsx', () => {
  const TABLE_LOCAL_ID = 'test-table-local-id';
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder, props?: PluginConfig) =>
    createEditor({
      doc,
      attachTo: document.body,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add([tablePlugin, { tableOptions: { advanced: true, ...props } }]),
      pluginKey,
    });

  describe('when background color is set to "red"', () => {
    beforeAll(() => {
      uuid.setStatic(TABLE_LOCAL_ID);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update cell DOM node style attribute with the new color', () => {
      const {
        editorView,
        refs: { pos },
      } = editor(
        doc(p('text'), table()(tr(td()(p('{pos}text')), tdEmpty, tdEmpty))),
      );
      const { state, dispatch } = editorView;
      const cell = findCellClosestToPos(state.doc.resolve(pos))!;
      const background = tableBackgroundColorNames.get('red');
      dispatch(setCellAttrs(cell, { background })(state.tr));
      const cellDomNode = document.querySelector('td')!;
      expect(rgbToHex(cellDomNode.style.backgroundColor!)).toEqual(background);
    });
  });

  describe('when background color is set to "white"', () => {
    it('should remove backgroundColor style attribute from cell DOM node ', () => {
      const {
        editorView,
        refs: { pos },
      } = editor(
        doc(
          p('text'),
          table()(
            tr(td({ background: 'red' })(p('{pos}text')), tdEmpty, tdEmpty),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      const cell = findCellClosestToPos(state.doc.resolve(pos))!;
      const background = tableBackgroundColorNames.get('white');
      dispatch(setCellAttrs(cell, { background })(state.tr));
      const cellDomNode = document.querySelector('td')!;
      expect(cellDomNode.style.backgroundColor).toEqual('');
    });
  });

  describe('nodeview update', () => {
    it('should not recreate nodeviews on attrs update', () => {
      const {
        editorView,
        refs: { pos },
      } = editor(
        doc(p('text'), table()(tr(td()(p('{pos}text')), tdEmpty, tdEmpty))),
        {
          tableCellOptimization: true,
        },
      );
      const { state, dispatch } = editorView;
      const cell = findCellClosestToPos(state.doc.resolve(pos))!;
      const background = tableBackgroundColorNames.get('red');
      const updateSpy = jest.spyOn(TableCellViews.prototype, 'update');
      dispatch(setCellAttrs(cell, { background })(state.tr));
      expect(updateSpy).toHaveReturnedWith(true);
      const cellDomNode = document.querySelector('td')!;
      expect(rgbToHex(cellDomNode.style.backgroundColor!)).toEqual(background);
    });
  });
});
