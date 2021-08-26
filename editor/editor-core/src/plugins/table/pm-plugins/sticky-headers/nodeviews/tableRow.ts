import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';

import { findOverflowScrollParent } from '@atlaskit/editor-common';

import { EventDispatcher } from '../../../../../event-dispatcher';
import { pluginKey as widthPluginKey } from '../../../../../plugins/width';
import { mapChildren } from '../../../../../utils/slice';
import {
  TableCssClassName as ClassName,
  TableCssClassName,
  TablePluginState,
} from '../../../types';
import {
  stickyHeaderBorderBottomWidth,
  stickyRowOffsetTop,
  tableControlsSpacing,
  tableScrollbarOffset,
} from '../../../ui/consts';
import { pluginKey as tablePluginKey } from '../../plugin-factory';
import {
  syncStickyRowToTable,
  updateStickyMargins as updateTableMargin,
} from '../../table-resizing/utils/dom';
import { updateStickyState } from '../commands';
import { getTop, getTree, TableDOMElements } from './dom';
import { getFeatureFlags } from '../../../../feature-flags-context';

export const supportedHeaderRow = (node: PmNode) => {
  const allHeaders = mapChildren(
    node,
    (child) => child.type.name === 'tableHeader',
  ).every(Boolean);

  const someMerged = mapChildren(
    node,
    (child) => child.attrs.rowspan || 0,
  ).some((rowspan) => rowspan > 1);

  return allHeaders && !someMerged;
};

export class TableRowNodeView implements NodeView {
  view: EditorView;
  node: PmNode;
  getPos: () => number;
  eventDispatcher: EventDispatcher;

  dom: HTMLTableRowElement;
  contentDOM: HTMLElement;

  isHeaderRow: boolean;

  scrollElement?: HTMLElement | Window;
  colControlsOffset = 0;
  focused = false;
  scrollElementTop = 0;
  isSticky = false;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;

  private stickyHeadersOptimization = false;
  private sentinels: {
    top?: HTMLElement | null;
    bottom?: HTMLElement | null;
  } = {};
  private stickyRowHeight?: number;

  get tree(): TableDOMElements | null | undefined {
    return getTree(this.dom);
  }

  constructor(
    node: PmNode,
    view: EditorView,
    getPos: any,
    eventDispatcher: EventDispatcher,
  ) {
    this.view = view;
    this.node = node;
    this.getPos = getPos;
    this.eventDispatcher = eventDispatcher;

    this.dom = document.createElement('tr');
    this.contentDOM = this.dom;

    const featureFlags = getFeatureFlags(view.state) || {};
    const { stickyHeadersOptimization } = featureFlags;
    this.stickyHeadersOptimization = !!stickyHeadersOptimization;

    this.isHeaderRow = supportedHeaderRow(node);

    if (this.isHeaderRow) {
      this.dom.setAttribute('data-header-row', 'true');
      this.subscribe();
    }
  }

  /* external events */
  listening = false;

  subscribe() {
    this.scrollElement =
      findOverflowScrollParent(this.view.dom as HTMLElement) || window;

    if (this.scrollElement) {
      if (this.stickyHeadersOptimization) {
        this.initObservers();
      } else {
        this.scrollElement.addEventListener('scroll', this.onScroll);
      }
      this.scrollElementTop = getTop(this.scrollElement);
    }

    this.eventDispatcher.on(
      (widthPluginKey as any).key,
      this.onWidthPluginState,
    );

    this.eventDispatcher.on(
      (tablePluginKey as any).key,
      this.onTablePluginState,
    );

    this.listening = true;
  }

  unsubscribe() {
    if (!this.listening) {
      return;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.scrollElement && !this.stickyHeadersOptimization) {
      this.scrollElement.removeEventListener('scroll', this.onScroll);
    }

    this.eventDispatcher.off(
      (widthPluginKey as any).key,
      this.onWidthPluginState,
    );
    this.eventDispatcher.off(
      (tablePluginKey as any).key,
      this.onTablePluginState,
    );

    this.listening = false;
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

    window.requestAnimationFrame(() => {
      // we expect tree to be defined after animation frame
      const tableContainer = this.tree?.wrapper.closest(
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
      if (!this.tree) {
        return;
      }
      const { table } = this.tree;
      entries.forEach((entry) => {
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
      });
    });
  }

  private createIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
        if (!this.tree) {
          return;
        }
        const { table } = this.tree;
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
              this.tree && this.makeHeaderRowSticky(this.tree);
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
              this.makeRowHeaderNotSticky(table);
            } else if (entry.isIntersecting && sentinelIsAboveScrollArea) {
              this.tree && this.makeHeaderRowSticky(this.tree);
            }
          }
        });
      },
      { root: this.scrollElement as Element },
    );
  }
  /* paint/update loop */

  previousDomTop: number | undefined;
  previousPadding: number | undefined;

  latestDomTop: number | undefined;

  nextFrame: number | undefined;

  onScroll = () => {
    if (!this.tree) {
      return;
    }

    this.latestDomTop = getTop(this.tree.wrapper);

    // kick off rAF loop again if it hasn't already happened
    if (!this.nextFrame) {
      this.loop();
    }
  };

  loop = () => {
    this.nextFrame = window.requestAnimationFrame(() => {
      if (
        this.previousDomTop === this.latestDomTop &&
        this.previousPadding === this.padding
      ) {
        this.nextFrame = undefined;
        return;
      }

      // can't store these since React might re-render at any time
      const tree = this.tree;
      if (!tree) {
        this.nextFrame = undefined;
        return;
      }

      this.paint(tree);

      // run again on next frame
      this.previousPadding = this.padding;
      this.previousDomTop = this.latestDomTop;
      this.loop();
    });
  };

  paint = (tree: TableDOMElements) => {
    const { table, wrapper } = tree;

    if (this.shouldHeaderStick(tree)) {
      this.makeHeaderRowSticky(tree);
    } else {
      this.makeRowHeaderNotSticky(table);
    }

    // ensure scroll positions are locked
    this.dom.scrollLeft = wrapper.scrollLeft;
  };

  /* nodeview lifecycle */

  update(node: PmNode, ..._args: any[]) {
    // do nothing if nodes were identical
    if (node === this.node) {
      return true;
    }

    // see if we're changing into a header row or
    // changing away from one
    const newNodeisHeaderRow = supportedHeaderRow(node);
    if (this.isHeaderRow !== newNodeisHeaderRow) {
      return false; // re-create nodeview
    }

    // node is different but no need to re-create nodeview
    this.node = node;

    // don't do anything if we're just a regular tr
    if (!this.isHeaderRow) {
      return true;
    }

    // something changed, sync widths
    const tbody = this.dom.parentElement;
    const table = tbody && tbody.parentElement;
    syncStickyRowToTable(table);

    return true;
  }

  destroy() {
    this.unsubscribe();

    if (this.tree) {
      this.makeRowHeaderNotSticky(this.tree.table);
    }

    this.emitOff();
  }

  ignoreMutation(
    mutationRecord: MutationRecord | { type: 'selection'; target: Element },
  ) {
    /* tableRows are not directly editable by the user
     * so it should be safe to ignore mutations that we cause
     * by updating styles and classnames on this DOM element
     *
     * Update: should allow mutations for row selection to avoid known issue with table selection highlight in firefox
     * Related bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=1289673
     * */
    return !(
      mutationRecord.type === 'selection' &&
      mutationRecord.target.tagName === 'TR'
    );
  }

  /* receive external events */

  onTablePluginState = (state: TablePluginState) => {
    const tableRef = state.tableRef;
    let focusChanged = false;

    const tree = this.tree;
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
    if (isCurrentTableSelected !== this.focused) {
      focusChanged = true;
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
      // if focus changed while header is sticky - still repaint the positions will shift
      if (!this.stickyHeadersOptimization || (focusChanged && this.isSticky)) {
        this.paint(tree);
      }
      syncStickyRowToTable(tree.table);
    }, 0);
  };

  onWidthPluginState = () => {
    // table width might have changed, sync that back to sticky row
    const tree = this.tree;
    if (!tree) {
      return;
    }

    syncStickyRowToTable(tree.table);
  };

  shouldHeaderStick = (tree: TableDOMElements): boolean => {
    const { wrapper } = tree;
    const scrollTop = this.scrollElementTop;
    const refTop = this.getWrapperRefTop(wrapper);
    const wrapperRect = wrapper.getBoundingClientRect();

    // we don't have parent information in via the node,
    // so we need to look this up on scroll
    const firstHeaderRow = !this.dom.previousElementSibling;
    const subsequentRows = !!this.dom.nextElementSibling;

    const bottomVisible =
      scrollTop - wrapperRect.bottom < this.dom.clientHeight;

    return (
      refTop <= scrollTop && bottomVisible && firstHeaderRow && subsequentRows
    );
  };

  makeHeaderRowSticky = (tree: TableDOMElements) => {
    const { table } = tree;

    const currentTableTop = this.getCurrentTableTop(tree);
    const domTop =
      currentTableTop > 0
        ? this.scrollElementTop
        : this.scrollElementTop + currentTableTop;

    if (!this.isSticky) {
      syncStickyRowToTable(table);
      this.dom.classList.add('sticky');
      table.classList.add(ClassName.TABLE_STICKY);

      this.isSticky = true;
    }

    this.dom.style.top = `${domTop}px`;
    updateTableMargin(table);

    this.emitOn(domTop, this.colControlsOffset);
  };

  getWrapperoffset = (inverse: boolean = false): number => {
    const focusValue = inverse ? !this.focused : this.focused;
    return focusValue ? 0 : tableControlsSpacing;
  };

  getWrapperRefTop = (wrapper: HTMLElement): number =>
    Math.round(getTop(wrapper)) + this.getWrapperoffset();

  // TODO: rename!
  getScrolledTableTop = (wrapper: HTMLElement): number =>
    this.getWrapperRefTop(wrapper) - this.scrollElementTop;

  getCurrentTableTop = (tree: TableDOMElements): number =>
    this.getScrolledTableTop(tree.wrapper) + tree.table.clientHeight;

  makeRowHeaderNotSticky = (table: HTMLElement) => {
    if (!this.isSticky) {
      return;
    }

    this.dom.style.removeProperty('width');
    this.dom.classList.remove('sticky');
    table.classList.remove(ClassName.TABLE_STICKY);

    this.isSticky = false;

    this.dom.style.top = '';
    table.style.removeProperty('margin-top');

    this.emitOff();
  };

  /* emit external events */

  padding = 0;
  top = 0;

  emitOn = (top: number, padding: number) => {
    if (top === this.top && padding === this.padding) {
      return;
    }

    this.top = top;
    this.padding = padding;

    updateStickyState({
      pos: this.getPos(),
      top,
      sticky: true,
      padding,
    })(this.view.state, this.view.dispatch, this.view);
  };

  emitOff = () => {
    if (this.top === 0 && this.padding === 0) {
      return;
    }

    this.top = 0;
    this.padding = 0;

    updateStickyState({
      pos: this.getPos(),
      sticky: false,
      top: this.top,
      padding: this.padding,
    })(this.view.state, this.view.dispatch, this.view);
  };
}
