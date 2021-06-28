import { tableCellBorderWidth } from '@atlaskit/editor-common';
import { ShadowEvent, TableCssClassName as ClassName } from '../types';
import { tableInsertColumnButtonSize } from '../ui/consts';
import { updateShadowListForStickyStyles } from './update-overflow-shadows';

export class OverflowShadowsObserver {
  private tableIntersectionObserver?: IntersectionObserver;
  private updateShadowState: (shadowKey: ShadowEvent, value: boolean) => void;
  private table: HTMLElement;
  private wrapper: HTMLDivElement;

  private firstCell: HTMLElement | null = null;
  private lastCell: HTMLElement | null = null;

  private getFirstCell: (
    isSticky?: boolean,
    hasHeaderRow?: boolean,
  ) => HTMLElement | null = (isSticky, hasHeaderRow) =>
    this.table?.querySelector(
      isSticky || !hasHeaderRow ? 'table tbody tr td' : 'table tbody tr th',
    );
  private getLastCell: (
    isSticky?: boolean,
    hasHeaderRow?: boolean,
  ) => HTMLElement | null = (isSticky, hasHeaderRow) =>
    this.table?.querySelector(
      isSticky || !hasHeaderRow
        ? 'table tbody tr td:last-child'
        : 'table tbody tr th:last-child',
    );

  private isSticky = false;
  private stickyRowHeight = 0;

  // updateShadowState is a method to update shadow key
  constructor(
    updateShadowState: (shadowKey: ShadowEvent, value: boolean) => void,
    table: HTMLElement,
    wrapper: HTMLDivElement,
  ) {
    this.updateShadowState = updateShadowState;
    this.table = table;
    this.wrapper = wrapper;

    this.init();
  }

  private init = () => {
    const table = this.table;

    if (!this.wrapper || !table) {
      return;
    }

    if (!this.tableIntersectionObserver) {
      const intersectonOnbserverCallback = (
        entry: IntersectionObserverEntry,
      ) => {
        if (!entry.rootBounds?.height && !entry.rootBounds?.width) {
          return;
        }
        if (entry.target !== this.firstCell && entry.target !== this.lastCell) {
          return;
        }
        this.updateStickyShadowsHeightIfChanged();
        this.checkIntersectionEvent(
          entry,
          this.firstCell === entry.target
            ? ShadowEvent.SHOW_BEFORE_SHADOW
            : ShadowEvent.SHOW_AFTER_SHADOW,
        );
      };

      this.tableIntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
          entries.forEach((entry) => intersectonOnbserverCallback(entry));
        },
        {
          threshold: [0, 1],
          root: this.wrapper,
          rootMargin: `0px ${
            tableInsertColumnButtonSize / 2 - tableCellBorderWidth
          }px 0px 0px`,
        },
      );
      return;
    }
  };

  private checkIntersectionEvent = (
    entry: IntersectionObserverEntry,
    shadowKey: ShadowEvent,
  ) => {
    if (
      // If it's in full view, don't show shadow.
      entry.isIntersecting &&
      entry.intersectionRatio === 1
    ) {
      this.updateShadowState(shadowKey, false);
    } else if (
      // If it's in partial view, show a shadow
      entry.intersectionRatio < 1
    ) {
      this.updateShadowState(shadowKey, true);
    }
  };

  private updateStickyShadowsHeightIfChanged() {
    if (!this.isSticky) {
      return;
    }
    const stickyCell = this.getStickyCell();
    if (!stickyCell) {
      return;
    }
    const newStickyRowHeight = stickyCell.clientHeight + 1;
    if (newStickyRowHeight! === this.stickyRowHeight) {
      this.stickyRowHeight = newStickyRowHeight;
      this.updateStickyShadows(this.stickyRowHeight);
    }
  }

  private getStickyCell() {
    const stickyRow = this.wrapper?.querySelector('tr.sticky');
    const stickyCell = stickyRow && stickyRow.firstElementChild;
    return stickyCell;
  }

  observeCells = (isSticky?: boolean, hasHeaderRow?: boolean) => {
    const stickyChanged = !!isSticky !== this.isSticky;
    this.isSticky = !!isSticky;

    // update sticky shadows
    this.updateStickyShadowsHeightIfChanged();

    if (!stickyChanged) {
      const firstCell = this.getFirstCell(isSticky, hasHeaderRow);
      const lastCell = this.getLastCell(isSticky, hasHeaderRow);
      if (
        !firstCell ||
        !lastCell ||
        (firstCell === this.firstCell && lastCell === this.lastCell)
      ) {
        return;
      }
    }

    this.firstCell = this.getFirstCell(isSticky, hasHeaderRow);
    this.lastCell = this.getLastCell(isSticky, hasHeaderRow);

    if (this.tableIntersectionObserver && this.firstCell && this.lastCell) {
      this.tableIntersectionObserver.disconnect();
      this.tableIntersectionObserver.observe(this.firstCell);
      this.tableIntersectionObserver.observe(this.lastCell);
    }
  };

  /**
   * Takes a heightStyle if it can be computed in a less expensive manner,
   * e.g. bounds on an IntersectionObserverEntry, otherwise proceed with
   * reading it from sticky cell
   */
  updateStickyShadows = (stickyRowHeight?: number) => {
    if (!this.isSticky) {
      return;
    }
    const stickyCell = this.getStickyCell();
    if (!stickyCell || !this.wrapper?.parentElement) {
      return;
    }
    const heightStyleOrCompute = `${
      stickyRowHeight || stickyCell.clientHeight + 1
    }px`;
    // Use getElementsByClassName here for a live node list to capture
    // sticky shadows
    const liveRightShadows = this.wrapper?.parentElement?.getElementsByClassName(
      `${ClassName.TABLE_RIGHT_SHADOW}`,
    );
    const liveLeftShadows = this.wrapper?.parentElement?.getElementsByClassName(
      `${ClassName.TABLE_LEFT_SHADOW}`,
    );
    updateShadowListForStickyStyles(heightStyleOrCompute, liveLeftShadows);
    updateShadowListForStickyStyles(heightStyleOrCompute, liveRightShadows);
  };

  dispose() {
    if (this.tableIntersectionObserver) {
      this.tableIntersectionObserver.disconnect();
      this.tableIntersectionObserver = undefined;
    }
  }
}
