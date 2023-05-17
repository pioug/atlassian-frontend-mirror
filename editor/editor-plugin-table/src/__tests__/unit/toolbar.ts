import {
  getToolbarMenuConfig,
  getToolbarCellOptionsConfig,
} from '../../plugins/table/toolbar';
import { ToolbarMenuConfig, ToolbarMenuState } from '../../plugins/table/types';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  tr as row,
  table,
  td,
  tr,
  tdEmpty,
  thEmpty,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type {
  Command,
  DropdownOptionT,
  FloatingToolbarDropdown,
} from '@atlaskit/editor-common/types';
import { splitCell } from '@atlaskit/editor-tables/utils';
import { canMergeCells } from '../../plugins/table/transforms';
import { Rect } from '@atlaskit/editor-tables/table-map';
import tablePlugin from '../../plugins/table';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import { getMergedCellsPositions } from '../../plugins/table/utils';
import { getNewResizeStateFromSelectedColumns } from '../../plugins/table/pm-plugins/table-resizing/utils/resize-state';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';

jest.mock('@atlaskit/editor-tables/utils');
jest.mock('../../plugins/table/transforms');
jest.mock('../../plugins/table/utils');
jest.mock('../../plugins/table/pm-plugins/table-resizing/utils/resize-state');

(getMergedCellsPositions as Function as jest.Mock<{}>).mockImplementation(
  () => () => [],
);

const formatMessage: (t: unknown) => string = (id) => 'Lorem ipsum';
const ctx = { formatMessage };

describe('getToolbarMenuConfig', () => {
  it('hidden by default', () => {
    const menu = getToolbarMenuConfig({}, {}, ctx, undefined);
    expect(menu.hidden).toBe(true);
  });

  it('visible for allowHeaderRow', () => {
    const menu = getToolbarMenuConfig(
      { allowHeaderRow: true },
      {},
      ctx,
      undefined,
    );
    expect(menu.hidden).toBe(false);
  });

  it('visible for allowHeaderColumn', () => {
    const menu = getToolbarMenuConfig(
      { allowHeaderColumn: true },
      {},
      ctx,
      undefined,
    );
    expect(menu.hidden).toBe(false);
  });

  it('visible for allowNumberColumn', () => {
    const menu = getToolbarMenuConfig(
      { allowNumberColumn: true },
      {},
      ctx,
      undefined,
    );
    expect(menu.hidden).toBe(false);
  });

  it('visible for allowCollapse', () => {
    const menu = getToolbarMenuConfig(
      { allowCollapse: true },
      {},
      ctx,
      undefined,
    );
    expect(menu.hidden).toBe(false);
  });

  describe('collapse button states', () => {
    const getCollapseItem = (
      config: ToolbarMenuConfig,
      state: ToolbarMenuState,
    ) => {
      const menu = getToolbarMenuConfig(config, state, ctx, undefined);
      const options = (menu as FloatingToolbarDropdown<Command>).options;

      if (Array.isArray(options)) {
        return options.find(
          (option) => option.id === 'editor.table.collapseTable',
        );
      }
    };

    it('should show tick if table is collapsed', () => {
      const item = getCollapseItem(
        { allowCollapse: true },
        { isTableCollapsed: true },
      )!;

      expect(item.selected).toBe(true);
    });
    it('should not show tick if table is not collapsed', () => {
      const item = getCollapseItem(
        { allowCollapse: true },
        { isTableCollapsed: false },
      )!;

      expect(item.selected).toBe(false);
    });

    it('should be enabled if table can be collapsed', () => {
      const item = getCollapseItem(
        { allowCollapse: true },
        { canCollapseTable: true },
      )!;

      expect(item.disabled).toBe(false);
    });

    it('should be disabled if table cannot be collapsed', () => {
      const item = getCollapseItem(
        { allowCollapse: true },
        { canCollapseTable: false },
      )!;

      expect(item.disabled).toBe(true);
    });

    it('should be hidden if collapse feature flag is disabled', () => {
      const item = getCollapseItem({ allowCollapse: false }, {})!;

      expect(item.hidden).toBe(true);
    });
  });
});

describe('getToolbarCellOptionsConfig', () => {
  const createEditor = createProsemirrorEditorFactory();
  const props = {
    preset: new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add([
        tablePlugin,
        {
          tableOptions: {
            allowDistributeColumns: true,
            allowColumnResizing: true,
            allowColumnSorting: true,
          },
        },
      ]),
    pluginKey,
  };
  const { editorView } = createEditor({
    doc: doc(table()(row(td()(p('1{cursor}'))))),
    ...props,
  });
  const { state } = editorView;
  const getEditorContainerWidth = () => ({ width: 500 });

  const formatMessage: (t: { id: string }) => string = (message) =>
    `${message.id}`;
  const rect = new Rect(1, 1, 1, 1);
  const cellOptionsMenu = getToolbarCellOptionsConfig(
    state,
    editorView,
    rect,
    {
      formatMessage,
    },
    getEditorContainerWidth,
    undefined,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    (getMergedCellsPositions as Function as jest.Mock<{}>).mockImplementation(
      () => () => [],
    );
  });

  it('is a dropdown with the following dropdown items with the given order', () => {
    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    expect(items[0]).toMatchObject({
      title: 'fabric.editor.insertColumn',
      selected: false,
      disabled: false,
    });
    expect(items[1]).toMatchObject({
      title: 'fabric.editor.insertRow',
      selected: false,
      disabled: false,
    });
    expect(items[2]).toMatchObject({
      title: 'fabric.editor.removeColumns',
      selected: false,
      disabled: false,
    });
    expect(items[3]).toMatchObject({
      title: 'fabric.editor.removeRows',
      selected: false,
      disabled: false,
    });
    expect(items[4]).toMatchObject({
      title: 'fabric.editor.mergeCells',
      selected: false,
      disabled: true,
    });
    expect(items[5]).toMatchObject({
      title: 'fabric.editor.splitCell',
      selected: false,
      disabled: true,
    });
    expect(items[6]).toMatchObject({
      title: 'fabric.editor.distributeColumns',
      selected: false,
      disabled: true,
    });
    expect(items[7]).toMatchObject({
      title: 'fabric.editor.sortColumnASC',
      selected: false,
      disabled: false,
    });
    expect(items[8]).toMatchObject({
      title: 'fabric.editor.sortColumnDESC',
      selected: false,
      disabled: false,
    });
    expect(items[9]).toMatchObject({
      title: 'fabric.editor.clearCells',
      selected: false,
      disabled: false,
    });
  });

  it('should have enabled merge cells when multiple cells are selected', () => {
    (canMergeCells as Function as jest.Mock<{}>).mockImplementation(
      () => () => true,
    );
    //
    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      editorView,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );
    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const item = items.find(
      (item) => item.title === 'fabric.editor.mergeCells',
    );

    expect(item).toMatchObject({
      disabled: false,
    });
  });

  it('should have enabled split cell when cell can be splitted', () => {
    (splitCell as Function as jest.Mock<{}>).mockImplementation(
      () => () => true,
    );
    //
    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      editorView,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );
    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const splitCellItem = items.find(
      (item) => item.title === 'fabric.editor.splitCell',
    );

    expect(splitCellItem).toMatchObject({
      disabled: false,
    });
  });

  it('should disable sorting when merged cells are detected', () => {
    (getMergedCellsPositions as Function as jest.Mock<{}>).mockImplementation(
      () => [1, 2, 3],
    );

    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      editorView,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );

    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const sortItems = items.filter((item) =>
      item.id?.startsWith('editor.table.sortColumn'),
    );

    const isDisabled = sortItems.every((item) => item.disabled);
    const hasTooltip = sortItems.every((item) => item.tooltip);

    expect(isDisabled).toBeTruthy();
    expect(hasTooltip).toBeTruthy();
  });

  it('should allow sorting when there are no merged cells detected', () => {
    (getMergedCellsPositions as Function as jest.Mock<{}>).mockImplementation(
      () => [],
    );

    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      editorView,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );

    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const sortItems = items.filter((item) =>
      item.id?.startsWith('editor.table.sortColumn'),
    );

    const isDisabled = sortItems.every((item) => item.disabled);
    const hasTooltip = sortItems.every((item) => item.tooltip);

    expect(isDisabled).toBeFalsy();
    expect(hasTooltip).toBeFalsy();
  });

  it('should disable distribute columns when no resize detected', () => {
    (
      getNewResizeStateFromSelectedColumns as Function as jest.Mock<{}>
    ).mockImplementation(() => ({ changed: false }));

    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      editorView,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );

    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const distributeColumns = items.filter((item) =>
      item.id?.startsWith('editor.table.distributeColumns'),
    );

    const isDisabled = distributeColumns.every((item) => item.disabled);
    expect(isDisabled).toBeTruthy();
  });

  it('should allow distribute columns when resize detected', () => {
    (
      getNewResizeStateFromSelectedColumns as Function as jest.Mock<{}>
    ).mockImplementation(() => ({ changed: true }));

    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      editorView,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );

    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const distributeColumns = items.filter((item) =>
      item.id?.startsWith('editor.table.distributeColumns'),
    );

    const isDisabled = distributeColumns.every((item) => item.disabled);
    expect(isDisabled).toBeFalsy();
  });

  it('should disable distribute columns when editorView is undefined', () => {
    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      undefined,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );

    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const distributeColumns = items.filter((item) =>
      item.id?.startsWith('editor.table.distributeColumns'),
    );

    const isDisabled = distributeColumns.every((item) => item.disabled);
    expect(isDisabled).toBeTruthy();
  });

  it('should disable distribute columns if selected cells are without colwidths', () => {
    const { editorView } = createEditor({
      doc: doc(
        table()(
          tr(th({})(p('{<cell}')), thEmpty, thEmpty),
          tr(tdEmpty, td({})(p('{cell>}')), tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
      ...props,
    });

    const { state } = editorView;
    const rect = new Rect(1, 1, 2, 2);

    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      editorView,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );

    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const distributeColumns = items.filter((item) =>
      item.id?.startsWith('editor.table.distributeColumns'),
    );

    const isDisabled = distributeColumns.every((item) => item.disabled);
    expect(isDisabled).toBeTruthy();
  });

  it('should disable distribute columns if selection is on a single column', () => {
    const { editorView } = createEditor({
      doc: doc(
        table()(
          tr(th({})(p('{<cell}')), thEmpty, thEmpty),
          tr(td({})(p('{cell>}')), tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
      ...props,
    });

    const { state } = editorView;
    const rect = new Rect(1, 1, 1, 2);

    const cellOptionsMenu = getToolbarCellOptionsConfig(
      state,
      editorView,
      rect,
      {
        formatMessage,
      },
      getEditorContainerWidth,
      undefined,
    );

    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const distributeColumns = items.filter((item) =>
      item.id?.startsWith('editor.table.distributeColumns'),
    );

    const isDisabled = distributeColumns.every((item) => item.disabled);
    expect(isDisabled).toBeTruthy();
  });
});
