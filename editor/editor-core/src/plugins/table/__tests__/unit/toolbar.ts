import {
  getToolbarMenuConfig,
  getToolbarCellOptionsConfig,
} from '../../toolbar';
import { ToolbarMenuConfig, ToolbarMenuState } from '../../types';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  doc,
  p,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { Command } from '../../../../types/command';
import { DropdownOptionT } from '../../../floating-toolbar/ui/types';
import { FloatingToolbarDropdown } from '../../../floating-toolbar/types';
import { splitCell } from '@atlaskit/editor-tables/utils';
import { canMergeCells } from '../../transforms';
import { Rect } from '@atlaskit/editor-tables/table-map';

jest.mock('@atlaskit/editor-tables/utils');
jest.mock('../../transforms');

const formatMessage: (t: unknown) => string = (id) => 'Lorem ipsum';
const ctx = { formatMessage };

describe('getToolbarMenuConfig', () => {
  it('hidden by default', () => {
    const menu = getToolbarMenuConfig({}, {}, ctx);
    expect(menu.hidden).toBe(true);
  });

  it('visible for allowHeaderRow', () => {
    const menu = getToolbarMenuConfig({ allowHeaderRow: true }, {}, ctx);
    expect(menu.hidden).toBe(false);
  });

  it('visible for allowHeaderColumn', () => {
    const menu = getToolbarMenuConfig({ allowHeaderColumn: true }, {}, ctx);
    expect(menu.hidden).toBe(false);
  });

  it('visible for allowNumberColumn', () => {
    const menu = getToolbarMenuConfig({ allowNumberColumn: true }, {}, ctx);
    expect(menu.hidden).toBe(false);
  });

  it('visible for allowCollapse', () => {
    const menu = getToolbarMenuConfig({ allowCollapse: true }, {}, ctx);
    expect(menu.hidden).toBe(false);
  });

  describe('collapse button states', () => {
    const getCollapseItem = (
      config: ToolbarMenuConfig,
      state: ToolbarMenuState,
    ) => {
      const menu = getToolbarMenuConfig(config, state, ctx);
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
  const state = createEditorState(doc(table()(row(td()(p('1{cursor}'))))));

  const formatMessage: (t: { id: string }) => string = (message) =>
    `${message.id}`;
  const rect = new Rect(1, 1, 1, 1);
  const cellOptionsMenu = getToolbarCellOptionsConfig(state, rect, {
    formatMessage,
  });

  it('is hidden by default', () => {
    expect(cellOptionsMenu.hidden).toBe(true);
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
      title: 'fabric.editor.clearCells',
      selected: false,
      disabled: false,
    });
  });

  it('should have enabled merge cells when multiple cells are selected', () => {
    ((canMergeCells as Function) as jest.Mock<{}>).mockImplementation(
      () => () => true,
    );

    const cellOptionsMenu = getToolbarCellOptionsConfig(state, rect, {
      formatMessage,
    });
    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const item = items.find(
      (item) => item.title === 'fabric.editor.mergeCells',
    );

    expect(item).toMatchObject({
      disabled: false,
    });
  });

  it('should have enabled split cell when cell can be splitted', () => {
    ((splitCell as Function) as jest.Mock<{}>).mockImplementation(() => () =>
      true,
    );

    const cellOptionsMenu = getToolbarCellOptionsConfig(state, rect, {
      formatMessage,
    });
    const items = cellOptionsMenu.options as Array<DropdownOptionT<Command>>;
    const splitCellItem = items.find(
      (item) => item.title === 'fabric.editor.splitCell',
    );

    expect(splitCellItem).toMatchObject({
      disabled: false,
    });
  });
});
