import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';

import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey as tablePluginKey } from '../pm-plugins/plugin-key';
import { updateStickyState } from '../pm-plugins/sticky-headers/commands';
import {
  syncStickyRowToTable,
  updateStickyMargins as updateTableMargin,
} from '../pm-plugins/table-resizing/utils/dom';
import type { DraggableSourceData, TablePluginState } from '../types';
import { TableCssClassName as ClassName, TableCssClassName } from '../types';
import {
  STICKY_HEADER_TOGGLE_TOLERANCE_MS,
  stickyHeaderBorderBottomWidth,
  stickyRowOffsetTop,
  tableControlsSpacing,
  tableScrollbarOffset,
} from '../ui/consts';
import type { TableDOMElements } from '../utils/dom';
import { getTop, getTree } from '../utils/dom';
import { supportedHeaderRow } from '../utils/nodes';

import TableNodeView from './TableNodeViewBase';

// limit scroll event calls
const HEADER_ROW_SCROLL_THROTTLE_TIMEOUT = 200;

// timeout for resetting the scroll class - if it’s too long then users won’t be able to click on the header cells,
// if too short it would trigger too many dom updates.
const HEADER_ROW_SCROLL_RESET_DEBOUNCE_TIMEOUT = 400;

export default class TableRow
  extends TableNodeView<HTMLTableRowElement>
  implements NodeView
{
  constructor(
    node: PMNode,
    view: EditorView,
    getPos: () => number | undefined,
    eventDispatcher: EventDispatcher,
  ) {
    super(node, view, getPos, eventDispatcher);

    this.isHeaderRow = supportedHeaderRow(node);
    this.isSticky = false;

    const { pluginConfig, isDragAndDropEnabled } = getPluginState(view.state);

    this.isStickyHeaderEnabled = !!pluginConfig.stickyHeaders;
    this.isDragAndDropEnabled = !!isDragAndDropEnabled;

    if (this.isHeaderRow) {
      this.dom.setAttribute('data-header-row', 'true');
      if (this.isStickyHeaderEnabled) {
        this.subscribe();
      }
    }

    if (this.isDragAndDropEnabled) {
      this.addDropTarget(this.contentDOM);
    }
  }

  /**
   * Variables
   */
  private isHeaderRow: boolean;
  private isStickyHeaderEnabled: boolean;
  // @ts-ignore
  private isDragAndDropEnabled: boolean;
  private editorScrollableElement?: HTMLElement | Window;
  private colControlsOffset = 0;
  private focused = false;
  private topPosEditorElement = 0;
  private isSticky: boolean;
  private lastStickyTimestamp: number | undefined;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private sentinels: {
    top?: HTMLElement | null;
    bottom?: HTMLElement | null;
  } = {};
  private stickyRowHeight?: number;
  private listening = false;
  private padding: number = 0;
  private top: number = 0;
  private dropTargetCleanup?: () => void;

  /**
   * Methods: Nodeview Lifecycle
   */
  update(node: PMNode, ..._args: any[]) {
    // do nothing if nodes were identical
    if (node === this.node) {
      return true;
    }

    // see if we're changing into a header row or
    // changing away from one
    const newNodeIsHeaderRow = supportedHeaderRow(node);
    if (this.isHeaderRow !== newNodeIsHeaderRow) {
      return false; // re-create nodeview
    }

    // node is different but no need to re-create nodeview
    this.node = node;

    // don't do anything if we're just a regular tr
    if (!this.isHeaderRow) {
      return true;
    }

    // something changed, sync widths
    if (this.isStickyHeaderEnabled) {
      const tbody = this.dom.parentElement;
      const table = tbody && tbody.parentElement;
      syncStickyRowToTable(table);
    }

    return true;
  }

  destroy() {
    if (this.isStickyHeaderEnabled) {
      this.unsubscribe();

      const tree = getTree(this.dom);
      if (tree) {
        this.makeRowHeaderNotSticky(tree.table, true);
      }

      this.emitOff(true);
    }

    // If a drop target cleanup method has been set then we should call it.
    this.dropTargetCleanup?.();
  }

  ignoreMutation(
    mutationRecord: MutationRecord | { type: 'selection'; target: Element },
  ) {
    /* tableRows are not directly editable by the user
     * so it should be safe to ignore mutations that we cause
     * by updating styles and classnames on this DOM element
     *
     * Update: should not ignore mutations for row selection to avoid known issue with table selection highlight in firefox
     * Related bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=1289673
     * */
    const isTableSelection =
      mutationRecord.type === 'selection' &&
      mutationRecord.target.nodeName === 'TR';
    /**
     * Update: should not ignore mutations when an node is added, as this interferes with
     * prosemirrors handling of some language inputs in Safari (ie. Pinyin, Hiragana).
     *
     * In paticular, when a composition occurs at the start of the first node inside a table cell, if the resulting mutation
     * from the composition end is ignored than prosemirror will end up with; invalid table markup nesting and a misplaced
     * selection and insertion.
     */
    const isNodeInsertion =
      mutationRecord.type === 'childList' &&
      mutationRecord.target.nodeName === 'TR' &&
      mutationRecord.addedNodes.length;

    if (isTableSelection || isNodeInsertion) {
      return false;
    }

    return true;
  }

  /**
   * Methods
   */

  private addDropTarget(element: HTMLElement) {
    const pos = this.getPos()!;
    if (!Number.isFinite(pos)) {
      return;
    }

    if (this.dropTargetCleanup) {
      this.dropTargetCleanup();
    }

    this.dropTargetCleanup = dropTargetForElements({
      element: element,
      canDrop: ({ source }) => {
        const data = source.data as DraggableSourceData;
        const { localId, targetIndex } = this.getCurrentData();
        return (
          // Only draggables of row type can be dropped on this target
          data.type === 'table-row' &&
          // Only draggables which came from the same table can be dropped on this target
          data.localId === localId &&
          // Only draggables which DO NOT include this drop targets index can be dropped
          !!data.indexes?.length &&
          data.indexes?.indexOf(targetIndex) === -1
        );
      },
      getIsSticky: () => true,
      getData: ({ input, element }) => {
        const { localId, targetIndex } = this.getCurrentData();
        const data = {
          localId,
          type: 'table-row',
          targetIndex,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['top', 'bottom'],
        });
      },
    });
  }

  private getCurrentData() {
    const resolvedPos = this.view.state.doc.resolve(this.getPos()!);
    const targetIndex = resolvedPos.index();
    const localId = resolvedPos.parent.attrs.localId;
    return { targetIndex, localId };
  }

  private headerRowMouseScrollEnd = debounce(() => {
    this.dom.classList.remove('no-pointer-events');
  }, HEADER_ROW_SCROLL_RESET_DEBOUNCE_TIMEOUT);

  // When the header is sticky, the header row is set to position: fixed
  // This prevents mouse wheel scrolling on the scroll-parent div when user's mouse is hovering the header row.
  // This fix sets pointer-events: none on the header row briefly to avoid this behaviour
  private headerRowMouseScroll = throttle(() => {
    if (this.isSticky) {
      this.dom.classList.add('no-pointer-events');
      this.headerRowMouseScrollEnd();
    }
  }, HEADER_ROW_SCROLL_THROTTLE_TIMEOUT);

  private subscribe() {
    this.editorScrollableElement =
      findOverflowScrollParent(this.view.dom as HTMLElement) || window;

    if (this.editorScrollableElement) {
      this.initObservers();
      this.topPosEditorElement = getTop(this.editorScrollableElement);
    }

    this.eventDispatcher.on(
      'widthPlugin',
      this.updateStickyHeaderWidth.bind(this),
    );

    this.eventDispatcher.on(
      (tablePluginKey as any).key,
      this.onTablePluginState.bind(this),
    );

    this.listening = true;

    this.dom.addEventListener('wheel', this.headerRowMouseScroll.bind(this), {
      passive: true,
    });
    this.dom.addEventListener(
      'touchmove',
      this.headerRowMouseScroll.bind(this),
      { passive: true },
    );
  }

  private unsubscribe() {
    if (!this.listening) {
      return;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      // ED-16211 Once intersection observer is disconnected, we need to remove the isObserved from the sentinels
      // Otherwise when newer intersection observer is created it will not observe because it thinks its already being observed
      [this.sentinels.top, this.sentinels.bottom].forEach((el) => {
        if (el) {
          delete el.dataset.isObserved;
        }
      });
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.eventDispatcher.off('widthPlugin', this.updateStickyHeaderWidth);
    this.eventDispatcher.off(
      (tablePluginKey as any).key,
      this.onTablePluginState,
    );

    this.listening = false;

    this.dom.removeEventListener('wheel', this.headerRowMouseScroll);
    this.dom.removeEventListener('touchmove', this.headerRowMouseScroll);
  }

  // initialize intersection observer to track if table is within scroll area
  private initObservers() {
    if (!this.dom || this.dom.dataset.isObserved) {
      return;
    }
    this.dom.dataset.isObserved = 'true';
    this.createIntersectionObserver();
    this.createResizeObserver();

    if (!this.intersectionObserver || !this.resizeObserver) {
      return;
    }

    this.resizeObserver.observe(this.dom);
    if (this.editorScrollableElement) {
      this.resizeObserver.observe(this.editorScrollableElement as HTMLElement);
    }

    window.requestAnimationFrame(() => {
      // we expect tree to be defined after animation frame
      const tableContainer = getTree(this.dom)?.wrapper.closest(
        `.${TableCssClassName.NODEVIEW_WRAPPER}`,
      );
      if (tableContainer) {
        this.sentinels.top = tableContainer
          .getElementsByClassName(ClassName.TABLE_STICKY_SENTINEL_TOP)
          .item(0) as HTMLElement;
        this.sentinels.bottom = tableContainer
          .getElementsByClassName(ClassName.TABLE_STICKY_SENTINEL_BOTTOM)
          .item(0) as HTMLElement;
        [this.sentinels.top, this.sentinels.bottom].forEach((el) => {
          // skip if already observed for another row on this table
          if (el && !el.dataset.isObserved) {
            el.dataset.isObserved = 'true';
            this.intersectionObserver!.observe(el);
          }
        });
      }
    });
  }

  // updating bottom sentinel position if sticky header height changes
  // to allocate for new header height
  private createResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const tree = getTree(this.dom);
      if (!tree) {
        return;
      }
      const { table } = tree;
      entries.forEach((entry) => {
        // On resize of the parent scroll element we need to adjust the width
        // of the sticky header
        if (
          entry.target.className ===
          (this.editorScrollableElement as HTMLElement)?.className
        ) {
          this.updateStickyHeaderWidth();
        } else {
          const newHeight = entry.contentRect
            ? entry.contentRect.height
            : (entry.target as HTMLElement).offsetHeight;

          if (
            this.sentinels.bottom &&
            // When the table header is sticky, it would be taller by a 1px (border-bottom),
            // So we adding this check to allow a 1px difference.
            Math.abs(newHeight - (this.stickyRowHeight || 0)) >
              stickyHeaderBorderBottomWidth
          ) {
            this.stickyRowHeight = newHeight;
            this.sentinels.bottom.style.bottom = `${
              tableScrollbarOffset + stickyRowOffsetTop + newHeight
            }px`;

            updateTableMargin(table);
          }
        }
      });
    });
  }

  private createIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
        const tree = getTree(this.dom);
        if (!tree) {
          return;
        }
        const { table } = tree;

        if (table.rows.length < 2) {
          // ED-19307 - When there's only one row in a table the top & bottom sentinels become inverted. This creates some nasty visiblity
          // toggling side-effects because the intersection observers gets confused.
          return;
        }

        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          // if the rootBounds has 0 height, e.g. confluence preview mode, we do nothing.
          if (entry.rootBounds?.height === 0) {
            return;
          }

          if (target.classList.contains(ClassName.TABLE_STICKY_SENTINEL_TOP)) {
            const sentinelIsBelowScrollArea =
              (entry.rootBounds?.bottom || 0) < entry.boundingClientRect.bottom;

            if (!entry.isIntersecting && !sentinelIsBelowScrollArea) {
              tree && this.makeHeaderRowSticky(tree, entry.rootBounds?.top);
              this.lastStickyTimestamp = Date.now();
            } else {
              table && this.makeRowHeaderNotSticky(table);
            }
          }

          if (
            target.classList.contains(ClassName.TABLE_STICKY_SENTINEL_BOTTOM)
          ) {
            const sentinelIsAboveScrollArea =
              entry.boundingClientRect.top - this.dom.offsetHeight <
              (entry.rootBounds?.top || 0);

            if (table && !entry.isIntersecting && sentinelIsAboveScrollArea) {
              // Not a perfect solution, but need to this code specific for FireFox ED-19177
              if (browser.gecko) {
                if (
                  this.lastStickyTimestamp &&
                  Date.now() - this.lastStickyTimestamp >
                    STICKY_HEADER_TOGGLE_TOLERANCE_MS
                ) {
                  this.makeRowHeaderNotSticky(table);
                }
              } else {
                this.makeRowHeaderNotSticky(table);
              }
            } else if (entry.isIntersecting && sentinelIsAboveScrollArea) {
              tree && this.makeHeaderRowSticky(tree, entry?.rootBounds?.top);
              this.lastStickyTimestamp = Date.now();
            }
          }
          return;
        });
      },
      { root: this.editorScrollableElement as Element },
    );
  }
  /* receive external events */

  private onTablePluginState(state: TablePluginState) {
    const tableRef = state.tableRef;

    const tree = getTree(this.dom);
    if (!tree) {
      return;
    }

    // when header rows are toggled off - mark sentinels as unobserved
    if (!state.isHeaderRowEnabled) {
      [this.sentinels.top, this.sentinels.bottom].forEach((el) => {
        if (el) {
          delete el.dataset.isObserved;
        }
      });
    }

    const isCurrentTableSelected = tableRef === tree.table;

    // If current table selected and header row is toggled off, turn off sticky header
    if (isCurrentTableSelected && !state.isHeaderRowEnabled && tree) {
      this.makeRowHeaderNotSticky(tree.table);
    }
    this.focused = isCurrentTableSelected;

    const { wrapper } = tree;

    const tableContainer = wrapper.parentElement!;
    const tableContentWrapper = tableContainer.parentElement;

    const layoutContainer =
      tableContentWrapper && tableContentWrapper.parentElement;

    if (isCurrentTableSelected) {
      this.colControlsOffset = tableControlsSpacing;

      if (
        layoutContainer &&
        layoutContainer.getAttribute('data-layout-content')
      ) {
        // move table a little out of the way
        // to provide spacing for table controls
        tableContentWrapper!.style.paddingLeft = '11px';
      }
    } else {
      this.colControlsOffset = 0;
      if (
        layoutContainer &&
        layoutContainer.getAttribute('data-layout-content')
      ) {
        tableContentWrapper!.style.removeProperty('padding-left');
      }
    }

    // run after table style changes have been committed
    setTimeout(() => {
      syncStickyRowToTable(tree.table);
    }, 0);
  }

  private updateStickyHeaderWidth() {
    // table width might have changed, sync that back to sticky row
    const tree = getTree(this.dom);
    if (!tree) {
      return;
    }

    syncStickyRowToTable(tree.table);
  }

  /**
   * Manually refire the intersection observers.
   * Useful when the header may have detached from the table.
   */
  private refireIntersectionObservers() {
    if (this.isSticky) {
      [this.sentinels.top, this.sentinels.bottom].forEach((el) => {
        if (el && this.intersectionObserver) {
          this.intersectionObserver.unobserve(el);
          this.intersectionObserver.observe(el);
        }
      });
    }
  }

  private makeHeaderRowSticky(tree: TableDOMElements, scrollTop?: number) {
    // If header row height is more than 50% of viewport height don't do this
    if (
      this.isSticky ||
      (this.stickyRowHeight && this.stickyRowHeight > window.innerHeight / 2)
    ) {
      return;
    }

    const { table, wrapper } = tree;

    // ED-16035 Make sure sticky header is only applied to first row
    const tbody = this.dom.parentElement;
    const isFirstHeader = tbody?.firstChild?.isEqualNode(this.dom);
    if (!isFirstHeader) {
      return;
    }

    const currentTableTop = this.getCurrentTableTop(tree);

    if (!scrollTop) {
      scrollTop = getTop(this.editorScrollableElement);
    }

    const domTop =
      currentTableTop > 0 ? scrollTop : scrollTop + currentTableTop;

    if (!this.isSticky) {
      syncStickyRowToTable(table);
      this.dom.classList.add('sticky');
      table.classList.add(ClassName.TABLE_STICKY);

      this.isSticky = true;

      /**
       * The logic below is not desirable, but acts as a fail safe for scenarios where the sticky header
       * detaches from the table. This typically happens during a fast scroll by the user which causes
       * the intersection observer logic to not fire as expected.
       */
      this.editorScrollableElement?.addEventListener(
        'scrollend',
        this.refireIntersectionObservers,
        { passive: true, once: true },
      );

      const fastScrollThresholdMs = 500;
      setTimeout(() => {
        this.refireIntersectionObservers();
      }, fastScrollThresholdMs);
    }

    this.dom.style.top = `${domTop}px`;
    updateTableMargin(table);
    this.dom.scrollLeft = wrapper.scrollLeft;

    this.emitOn(domTop, this.colControlsOffset);
  }

  private makeRowHeaderNotSticky(
    table: HTMLElement,
    isEditorDestroyed: boolean = false,
  ) {
    if (!this.isSticky || !table || !this.dom) {
      return;
    }

    this.dom.style.removeProperty('width');
    this.dom.classList.remove('sticky');
    table.classList.remove(ClassName.TABLE_STICKY);

    this.isSticky = false;
    this.dom.style.top = '';
    table.style.removeProperty('margin-top');

    this.emitOff(isEditorDestroyed);
  }

  private getWrapperoffset(inverse: boolean = false): number {
    const focusValue = inverse ? !this.focused : this.focused;
    return focusValue ? 0 : tableControlsSpacing;
  }

  private getWrapperRefTop(wrapper: HTMLElement): number {
    return Math.round(getTop(wrapper)) + this.getWrapperoffset();
  }

  // TODO: rename!
  private getScrolledTableTop(wrapper: HTMLElement): number {
    return this.getWrapperRefTop(wrapper) - this.topPosEditorElement;
  }

  private getCurrentTableTop(tree: TableDOMElements): number {
    return this.getScrolledTableTop(tree.wrapper) + tree.table.clientHeight;
  }

  /* emit external events */

  private emitOn(top: number, padding: number) {
    if (top === this.top && padding === this.padding) {
      return;
    }

    this.top = top;
    this.padding = padding;
    const pos = this.getPos()!;

    if (Number.isFinite(pos)) {
      updateStickyState({
        pos,
        top,
        sticky: true,
        padding,
      })(this.view.state, this.view.dispatch, this.view);
    }
  }

  private emitOff(isEditorDestroyed: boolean) {
    if (this.top === 0 && this.padding === 0) {
      return;
    }

    this.top = 0;
    this.padding = 0;
    const pos = this.getPos()!;

    if (!isEditorDestroyed && Number.isFinite(pos)) {
      updateStickyState({
        pos,
        sticky: false,
        top: this.top,
        padding: this.padding,
      })(this.view.state, this.view.dispatch, this.view);
    }
  }
}
