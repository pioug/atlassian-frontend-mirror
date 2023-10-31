/** @jsx jsx */
import { Component } from 'react';

import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

type DropdownItem = MenuItem & {
  value: {
    name: string;
  };
};

import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  addColumnAfter,
  addRowAfter,
  backspace,
  tooltip,
} from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { DropdownMenuSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import {
  backgroundPaletteTooltipMessages,
  cellBackgroundColorPalette,
  ColorPalette,
} from '@atlaskit/editor-common/ui-color';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
  ArrowKeyNavigationType,
  DropdownMenu,
} from '@atlaskit/editor-common/ui-menu';
import { closestElement } from '@atlaskit/editor-common/utils';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import { splitCell } from '@atlaskit/editor-tables/utils';

import {
  clearHoverSelection,
  hoverColumns,
  hoverMergedCells,
  hoverRows,
  toggleContextualMenu,
} from '../../commands';
import {
  deleteColumnsWithAnalytics,
  deleteRowsWithAnalytics,
  distributeColumnsWidthsWithAnalytics,
  emptyMultipleCellsWithAnalytics,
  insertColumnWithAnalytics,
  insertRowWithAnalytics,
  mergeCellsWithAnalytics,
  setColorWithAnalytics,
  sortColumnWithAnalytics,
  splitCellWithAnalytics,
} from '../../commands-with-analytics';
import { getPluginState } from '../../pm-plugins/plugin-factory';
import { getNewResizeStateFromSelectedColumns } from '../../pm-plugins/table-resizing/utils/resize-state';
import { canMergeCells } from '../../transforms';
import { TableCssClassName as ClassName } from '../../types';
import {
  getMergedCellsPositions,
  getSelectedColumnIndexes,
  getSelectedRowIndexes,
} from '../../utils';
import { contextualMenuDropdownWidth } from '../consts';

import { cellColourPreviewStyles } from './styles';

export interface Props {
  editorView: EditorView;
  isOpen: boolean;
  selectionRect: Rect;
  targetCellPosition?: number; // We keep this because we need to know when to rerender
  mountPoint?: HTMLElement;
  allowMergeCells?: boolean;
  allowColumnSorting?: boolean;
  allowBackgroundColor?: boolean;
  boundariesElement?: HTMLElement;
  offset?: Array<number>;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
  getEditorContainerWidth: GetEditorContainerWidth;
}

export interface State {
  isSubmenuOpen: boolean;
}

export class ContextualMenu extends Component<
  Props & WrappedComponentProps,
  State
> {
  state: State = {
    isSubmenuOpen: false,
  };

  static defaultProps = {
    boundariesElement:
      typeof document !== 'undefined' ? document.body : undefined,
  };

  render() {
    const { isOpen, mountPoint, offset, boundariesElement } = this.props;
    const items = this.createItems();
    if (!items) {
      return null;
    }

    return (
      <div
        data-testid="table-cell-contextual-menu"
        onMouseLeave={this.closeSubmenu}
      >
        <DropdownMenu
          mountTo={mountPoint}
          //This needs be removed when the a11y is completely handled
          //Disabling key navigation now as it works only partially
          arrowKeyNavigationProviderOptions={{
            type: ArrowKeyNavigationType.MENU,
            disableArrowKeyNavigation: true,
          }}
          items={items}
          isOpen={isOpen}
          onOpenChange={this.handleOpenChange}
          onItemActivated={this.onMenuItemActivated}
          onMouseEnter={this.handleItemMouseEnter}
          onMouseLeave={this.handleItemMouseLeave}
          fitHeight={188}
          fitWidth={contextualMenuDropdownWidth}
          boundariesElement={boundariesElement}
          offset={offset}
        />
      </div>
    );
  }

  private handleSubMenuRef = (ref: HTMLDivElement | null) => {
    const parent = closestElement(
      this.props.editorView.dom as HTMLElement,
      '.fabric-editor-popup-scroll-parent',
    );
    if (!(parent && ref)) {
      return;
    }
    const boundariesRect = parent.getBoundingClientRect();
    const rect = ref.getBoundingClientRect();
    if (rect.left + rect.width > boundariesRect.width) {
      ref.style.left = `-${rect.width}px`;
    }
  };

  private createItems = () => {
    const {
      allowMergeCells,
      allowColumnSorting,
      allowBackgroundColor,
      editorView: { state },
      isOpen,
      selectionRect,
      intl: { formatMessage },
      editorView,
    } = this.props;
    const items: any[] = [];
    const { isSubmenuOpen } = this.state;
    // TargetCellPosition could be outdated: https://product-fabric.atlassian.net/browse/ED-8129
    const {
      targetCellPosition,
      pluginConfig: { allowDistributeColumns },
    } = getPluginState(editorView.state);
    if (allowBackgroundColor) {
      const node =
        isOpen && targetCellPosition
          ? state.doc.nodeAt(targetCellPosition)
          : null;
      const background = hexToEditorBackgroundPaletteColor(
        node?.attrs?.background || '#ffffff',
      );
      items.push({
        content: formatMessage(messages.cellBackground),
        value: { name: 'background' },
        elemAfter: (
          <div className={DropdownMenuSharedCssClassName.SUBMENU}>
            <div
              css={cellColourPreviewStyles(background)}
              className={ClassName.CONTEXTUAL_MENU_ICON}
            />
            {isSubmenuOpen && (
              <div
                className={ClassName.CONTEXTUAL_SUBMENU}
                ref={this.handleSubMenuRef}
              >
                <ColorPalette
                  cols={7}
                  onClick={this.setColor}
                  selectedColor={background}
                  paletteOptions={{
                    palette: cellBackgroundColorPalette,
                    paletteColorTooltipMessages:
                      backgroundPaletteTooltipMessages,
                    hexToPaletteColor: hexToEditorBackgroundPaletteColor,
                  }}
                />
              </div>
            )}
          </div>
        ),
      });
    }

    items.push({
      content: formatMessage(messages.insertColumn),
      value: { name: 'insert_column' },
      elemAfter: <div css={shortcutStyle}>{tooltip(addColumnAfter)}</div>,
    });

    items.push({
      content: formatMessage(messages.insertRow),
      value: { name: 'insert_row' },
      elemAfter: <div css={shortcutStyle}>{tooltip(addRowAfter)}</div>,
    });

    const { top, bottom, right, left } = selectionRect;
    const noOfColumns = right - left;
    const noOfRows = bottom - top;

    items.push({
      content: formatMessage(messages.removeColumns, {
        0: noOfColumns,
      }),
      value: { name: 'delete_column' },
    });

    items.push({
      content: formatMessage(messages.removeRows, {
        0: noOfRows,
      }),
      value: { name: 'delete_row' },
    });

    if (allowMergeCells) {
      items.push({
        content: formatMessage(messages.mergeCells),
        value: { name: 'merge' },
        isDisabled: !canMergeCells(state.tr),
      });
      items.push({
        content: formatMessage(messages.splitCell),
        value: { name: 'split' },
        isDisabled: !splitCell(state),
      });
    }

    if (allowDistributeColumns) {
      const newResizeState = getNewResizeStateFromSelectedColumns(
        selectionRect,
        state,
        editorView.domAtPos.bind(editorView),
        this.props.getEditorContainerWidth,
      );

      const wouldChange = newResizeState?.changed ?? false;

      items.push({
        content: formatMessage(messages.distributeColumns),
        value: { name: 'distribute_columns' },
        isDisabled: !wouldChange,
      });
    }

    if (allowColumnSorting) {
      const hasMergedCellsInTable =
        getMergedCellsPositions(state.tr).length > 0;
      const warning = hasMergedCellsInTable
        ? {
            tooltipDescription: formatMessage(messages.canNotSortTable),
            isDisabled: true,
          }
        : {};

      items.push({
        content: formatMessage(messages.sortColumnASC),
        value: { name: 'sort_column_asc' },
        ...warning,
      });

      items.push({
        content: formatMessage(messages.sortColumnDESC),
        value: { name: 'sort_column_desc' },
        ...warning,
      });
    }

    items.push({
      content: formatMessage(messages.clearCells, {
        0: Math.max(noOfColumns, noOfRows),
      }),
      value: { name: 'clear' },
      elemAfter: <div css={shortcutStyle}>{tooltip(backspace)}</div>,
    });

    return items.length ? [{ items }] : null;
  };

  private onMenuItemActivated = ({ item }: { item: DropdownItem }) => {
    const {
      editorView,
      selectionRect,
      editorAnalyticsAPI,
      getEditorContainerWidth,
    } = this.props;
    // TargetCellPosition could be outdated: https://product-fabric.atlassian.net/browse/ED-8129
    const { state, dispatch } = editorView;
    const { targetCellPosition } = getPluginState(state);

    switch (item.value.name) {
      case 'sort_column_desc':
        sortColumnWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.CONTEXT_MENU,
          selectionRect.left,
          SortOrder.DESC,
        )(state, dispatch);
        this.toggleOpen();
        break;
      case 'sort_column_asc':
        sortColumnWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.CONTEXT_MENU,
          selectionRect.left,
          SortOrder.ASC,
        )(state, dispatch);
        this.toggleOpen();
        break;
      case 'merge':
        mergeCellsWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.CONTEXT_MENU)(
          state,
          dispatch,
        );
        this.toggleOpen();
        break;
      case 'split':
        splitCellWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.CONTEXT_MENU)(
          state,
          dispatch,
        );
        this.toggleOpen();
        break;
      case 'distribute_columns':
        const newResizeStateWithAnalytics =
          getNewResizeStateFromSelectedColumns(
            selectionRect,
            state,
            editorView.domAtPos.bind(editorView),
            getEditorContainerWidth,
          );

        if (newResizeStateWithAnalytics) {
          distributeColumnsWidthsWithAnalytics(editorAnalyticsAPI)(
            INPUT_METHOD.CONTEXT_MENU,
            newResizeStateWithAnalytics,
          )(state, dispatch);
          this.toggleOpen();
        }
        break;
      case 'clear':
        emptyMultipleCellsWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.CONTEXT_MENU,
          targetCellPosition,
        )(state, dispatch);
        this.toggleOpen();
        break;
      case 'insert_column':
        insertColumnWithAnalytics(getEditorContainerWidth, editorAnalyticsAPI)(
          INPUT_METHOD.CONTEXT_MENU,
          selectionRect.right,
        )(state, dispatch, editorView);
        this.toggleOpen();
        break;
      case 'insert_row':
        insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.CONTEXT_MENU, {
          index: selectionRect.bottom,
          moveCursorToInsertedRow: true,
        })(state, dispatch);
        this.toggleOpen();
        break;
      case 'delete_column':
        deleteColumnsWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.CONTEXT_MENU,
          selectionRect,
        )(state, dispatch, editorView);
        this.toggleOpen();
        break;
      case 'delete_row':
        const {
          pluginConfig: { isHeaderRowRequired },
        } = getPluginState(state);

        deleteRowsWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.CONTEXT_MENU,
          selectionRect,
          !!isHeaderRowRequired,
        )(state, dispatch);
        this.toggleOpen();
        break;
    }
  };

  private toggleOpen = () => {
    const {
      isOpen,
      editorView: { state, dispatch },
    } = this.props;
    toggleContextualMenu()(state, dispatch);
    if (!isOpen) {
      this.setState({
        isSubmenuOpen: false,
      });
    }
  };

  private handleOpenChange = () => {
    const {
      editorView: { state, dispatch },
    } = this.props;
    toggleContextualMenu()(state, dispatch);
    this.setState({ isSubmenuOpen: false });
  };

  private handleItemMouseEnter = ({ item }: { item: any }) => {
    const {
      editorView: { state, dispatch },
      selectionRect,
    } = this.props;

    if (item.value.name === 'background') {
      if (!this.state.isSubmenuOpen) {
        this.setState({ isSubmenuOpen: true });
      }
    }

    if (item.value.name === 'delete_column') {
      hoverColumns(getSelectedColumnIndexes(selectionRect), true)(
        state,
        dispatch,
      );
    }

    if (item.value.name === 'delete_row') {
      hoverRows(getSelectedRowIndexes(selectionRect), true)(state, dispatch);
    }

    if (
      ['sort_column_asc', 'sort_column_desc'].indexOf(item.value.name) > -1 &&
      getMergedCellsPositions(state.tr).length !== 0
    ) {
      hoverMergedCells()(state, dispatch);
    }
  };

  private handleItemMouseLeave = ({ item }: { item: any }) => {
    const { state, dispatch } = this.props.editorView;
    if (item.value.name === 'background') {
      this.closeSubmenu();
    }
    if (
      [
        'sort_column_asc',
        'sort_column_desc',
        'delete_column',
        'delete_row',
      ].indexOf(item.value.name) > -1
    ) {
      clearHoverSelection()(state, dispatch);
    }
  };

  private closeSubmenu = () => {
    if (this.state.isSubmenuOpen) {
      this.setState({ isSubmenuOpen: false });
    }
  };

  private setColor = (color: string) => {
    const { editorView, editorAnalyticsAPI } = this.props;
    // TargetCellPosition could be outdated: https://product-fabric.atlassian.net/browse/ED-8129
    const { targetCellPosition } = getPluginState(editorView.state);
    const { state, dispatch } = editorView;
    setColorWithAnalytics(editorAnalyticsAPI)(
      INPUT_METHOD.CONTEXT_MENU,
      color,
      targetCellPosition,
    )(state, dispatch);
    this.toggleOpen();
  };
}

export default injectIntl(ContextualMenu);
