import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { getParentOfTypeCount } from '@atlaskit/editor-common/nesting';
import { nodeVisibilityManager } from '@atlaskit/editor-common/node-visibility';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey as tablePluginKey } from '../pm-plugins/plugin-key';
import { updateStickyState } from '../pm-plugins/sticky-headers/commands';
import {
	syncStickyRowToTable,
	updateStickyMargins as updateTableMargin,
} from '../pm-plugins/table-resizing/utils/dom';
import type { TableDOMElements } from '../pm-plugins/utils/dom';
import { getTop, getTree } from '../pm-plugins/utils/dom';
import { supportedHeaderRow } from '../pm-plugins/utils/nodes';
import type { TablePluginState } from '../types';
import { TableCssClassName as ClassName, TableCssClassName } from '../types';
import {
	stickyHeaderBorderBottomWidth,
	stickyRowOffsetTop,
	tableControlsSpacing,
	tableScrollbarOffset,
} from '../ui/consts';

import TableNodeView from './TableNodeViewBase';

interface SentinelData {
	isIntersecting: boolean;
	boundingClientRect: DOMRectReadOnly | null;
	rootBounds: DOMRectReadOnly | null;
}

// limit scroll event calls
const HEADER_ROW_SCROLL_THROTTLE_TIMEOUT = 200;

// timeout for resetting the scroll class - if it's too long then users won't be able to click on the header cells,
// if too short it would trigger too many dom updates.
const HEADER_ROW_SCROLL_RESET_DEBOUNCE_TIMEOUT = 400;

export default class TableRow extends TableNodeView<HTMLTableRowElement> implements NodeView {
	private nodeVisibilityObserverCleanupFn?: () => void;

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: () => number | undefined,
		eventDispatcher: EventDispatcher,
	) {
		super(node, view, getPos, eventDispatcher);

		this.isHeaderRow = supportedHeaderRow(node);
		this.isSticky = false;

		const { pluginConfig } = getPluginState(view.state);

		this.isStickyHeaderEnabled = !!pluginConfig.stickyHeaders;
		const pos = this.getPos();
		this.isInNestedTable = false;
		if (pos) {
			this.isInNestedTable =
				getParentOfTypeCount(view.state.schema.nodes.table)(view.state.doc.resolve(pos)) > 1;
		}

		if (this.isHeaderRow) {
			if (editorExperiment('platform_editor_nodevisibility', false, { exposure: true })) {
				this.subscribeWhenRowVisible();
			} else {
				const { observe } = nodeVisibilityManager(view.dom);
				this.nodeVisibilityObserverCleanupFn = observe({
					element: this.contentDOM,
					onFirstVisible: () => {
						this.subscribeWhenRowVisible();
					},
				});
			}
		}
	}

	subscribeWhenRowVisible() {
		if (this.listening) {
			return;
		}

		this.dom.setAttribute('data-header-row', 'true');
		if (this.isStickyHeaderEnabled) {
			this.subscribe();
		}
	}

	/**
	 * Variables
	 */
	private isHeaderRow: boolean;
	private isInNestedTable: boolean;
	private isStickyHeaderEnabled: boolean;
	private editorScrollableElement?: HTMLElement | Window;
	private colControlsOffset = 0;
	private focused = false;
	private topPosEditorElement = 0;
	private isSticky: boolean;
	private intersectionObserver?: IntersectionObserver;
	private resizeObserver?: ResizeObserver;
	private tableContainerObserver?: MutationObserver;
	private sentinels: {
		top?: HTMLElement | null;
		bottom?: HTMLElement | null;
	} = {};
	private sentinelData: {
		top: SentinelData;
		bottom: SentinelData;
	} = {
		top: {
			isIntersecting: false,
			boundingClientRect: null,
			rootBounds: null,
		},
		bottom: {
			isIntersecting: false,
			boundingClientRect: null,
			rootBounds: null,
		},
	};
	private stickyRowHeight?: number;
	private listening = false;
	private padding: number = 0;
	private top: number = 0;

	/**
	 * Methods: Nodeview Lifecycle
	 */
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

			this.nodeVisibilityObserverCleanupFn && this.nodeVisibilityObserverCleanupFn();

			const tree = getTree(this.dom);
			if (tree) {
				this.makeRowHeaderNotSticky(tree.table, true);
			}

			this.emitOff(true);
		}

		if (this.tableContainerObserver) {
			this.tableContainerObserver.disconnect();
		}
	}

	ignoreMutation(mutationRecord: MutationRecord | { type: 'selection'; target: Node }) {
		/* tableRows are not directly editable by the user
		 * so it should be safe to ignore mutations that we cause
		 * by updating styles and classnames on this DOM element
		 *
		 * Update: should not ignore mutations for row selection to avoid known issue with table selection highlight in firefox
		 * Related bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=1289673
		 * */
		const isTableSelection =
			mutationRecord.type === 'selection' && mutationRecord.target.nodeName === 'TR';
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
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.editorScrollableElement = findOverflowScrollParent(this.view.dom as HTMLElement) || window;

		if (this.editorScrollableElement) {
			this.initObservers();
			this.topPosEditorElement = getTop(this.editorScrollableElement);
		}

		this.eventDispatcher.on('widthPlugin', this.updateStickyHeaderWidth.bind(this));

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.eventDispatcher.on((tablePluginKey as any).key, this.onTablePluginState.bind(this));

		this.listening = true;

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this.dom.addEventListener('wheel', this.headerRowMouseScroll.bind(this), {
			passive: true,
		});
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this.dom.addEventListener('touchmove', this.headerRowMouseScroll.bind(this), { passive: true });
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
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.eventDispatcher.off((tablePluginKey as any).key, this.onTablePluginState);

		this.listening = false;

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this.dom.removeEventListener('wheel', this.headerRowMouseScroll);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
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
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			this.resizeObserver.observe(this.editorScrollableElement as HTMLElement);
		}

		window.requestAnimationFrame(() => {
			const getTableContainer = () =>
				getTree(this.dom)?.wrapper.closest(`.${TableCssClassName.NODEVIEW_WRAPPER}`);

			// we expect tree to be defined after animation frame
			let tableContainer = getTableContainer();

			if (tableContainer) {
				const getSentinelTop = () =>
					tableContainer &&
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					(tableContainer
						.getElementsByClassName(ClassName.TABLE_STICKY_SENTINEL_TOP)
						.item(0) as HTMLElement);
				const getSentinelBottom = () => {
					// Multiple bottom sentinels may be found if there are nested tables.
					// We need to make sure we get the last one which will belong to the parent table.
					const bottomSentinels =
						tableContainer &&
						tableContainer.getElementsByClassName(ClassName.TABLE_STICKY_SENTINEL_BOTTOM);

					return (
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						bottomSentinels && (bottomSentinels.item(bottomSentinels.length - 1) as HTMLElement)
					);
				};

				const sentinelsInDom = () => getSentinelTop() !== null && getSentinelBottom() !== null;

				const observeStickySentinels = () => {
					this.sentinels.top = getSentinelTop();
					this.sentinels.bottom = getSentinelBottom();
					[this.sentinels.top, this.sentinels.bottom].forEach((el) => {
						// skip if already observed for another row on this table
						if (el && !el.dataset.isObserved) {
							el.dataset.isObserved = 'true';
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							this.intersectionObserver!.observe(el);
						}
					});
				};

				if (fg('platform_editor_table_initial_load_fix')) {
					const isInitialProsemirrorToDomRender = tableContainer.hasAttribute(
						'data-prosemirror-initial-toDOM-render',
					);

					// Sentinels may be in the DOM but they're part of the prosemirror placeholder structure which is replaced with the fully rendered React node.
					if (sentinelsInDom() && !isInitialProsemirrorToDomRender) {
						// great - DOM ready, observe as normal
						observeStickySentinels();
					} else {
						// concurrent loading issue - here TableRow is too eager trying to
						// observe sentinels before they are in the DOM, use MutationObserver
						// to wait for sentinels to be added to the parent Table node DOM
						// then attach the IntersectionObserver
						this.tableContainerObserver = new MutationObserver(() => {
							// Check if the tableContainer is still connected to the DOM. It can become disconnected when the placholder
							// prosemirror node is replaced with the fully rendered React node (see _handleTableRef).
							if (!tableContainer || !tableContainer.isConnected) {
								tableContainer = getTableContainer();
							}
							if (sentinelsInDom()) {
								observeStickySentinels();
								this.tableContainerObserver?.disconnect();
							}
						});

						const mutatingNode = tableContainer;
						if (mutatingNode && this.tableContainerObserver) {
							this.tableContainerObserver.observe(mutatingNode, { subtree: true, childList: true });
						}
					}
				} else {
					if (sentinelsInDom()) {
						// great - DOM ready, observe as normal
						observeStickySentinels();
					} else {
						// concurrent loading issue - here TableRow is too eager trying to
						// observe sentinels before they are in the DOM, use MutationObserver
						// to wait for sentinels to be added to the parent Table node DOM
						// then attach the IntersectionObserver
						const tableContainerObserver = new MutationObserver(() => {
							if (sentinelsInDom()) {
								observeStickySentinels();
								tableContainerObserver.disconnect();
							}
						});

						const mutatingNode = tableContainer;
						if (mutatingNode) {
							tableContainerObserver.observe(mutatingNode, { subtree: true, childList: true });
						}
					}
				}
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
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				if (entry.target.className === (this.editorScrollableElement as HTMLElement)?.className) {
					this.updateStickyHeaderWidth();
				} else {
					const newHeight = entry.contentRect
						? entry.contentRect.height
						: // Ignored via go/ees005
							// eslint-disable-next-line @atlaskit/editor/no-as-casting
							(entry.target as HTMLElement).offsetHeight;

					if (
						this.sentinels.bottom &&
						// When the table header is sticky, it would be taller by a 1px (border-bottom),
						// So we adding this check to allow a 1px difference.
						Math.abs(newHeight - (this.stickyRowHeight || 0)) > stickyHeaderBorderBottomWidth
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
				// IMPORTANT: please try and avoid using entry.rootBounds it's terribly inconsistent. For example; sometimes it may return
				// 0 height. In safari it will multiply all values by the window scale factor, however chrome & firfox won't.
				// This is why i just get the scroll view bounding rect here and use it, and fallback to the entry.rootBounds if needed.
				const rootBounds = (this.editorScrollableElement as Element)?.getBoundingClientRect?.();

				entries.forEach((entry) => {
					const { target, isIntersecting, boundingClientRect } = entry;
					// This observer only every looks at the top/bottom sentinels, we can assume if it's not one then it's the other.
					const targetKey = target.classList.contains(ClassName.TABLE_STICKY_SENTINEL_TOP)
						? 'top'
						: 'bottom';
					// Cache the latest sentinel information
					this.sentinelData[targetKey] = {
						isIntersecting,
						boundingClientRect,
						rootBounds: rootBounds ?? entry.rootBounds,
					};
					// Keep the other sentinels rootBounds in sync with this latest one
					this.sentinelData[targetKey === 'top' ? 'bottom' : targetKey].rootBounds =
						rootBounds ?? entry.rootBounds;
				});
				this.refreshStickyState();
			},
			{ threshold: 0, root: this.editorScrollableElement as Element },
		);
	}

	private refreshStickyState() {
		const tree = getTree(this.dom);
		if (!tree) {
			return;
		}
		const { table } = tree;
		const shouldStick = this.shouldSticky();
		if (this.isSticky !== shouldStick) {
			if (shouldStick) {
				// The rootRect is kept in sync across sentinels so it doesn't matter which one we use.
				const rootRect = this.sentinelData.top.rootBounds ?? this.sentinelData.bottom.rootBounds;
				this.makeHeaderRowSticky(tree, rootRect?.top);
			} else {
				this.makeRowHeaderNotSticky(table);
			}
		}
	}

	private shouldSticky() {
		if (
			// is Safari
			navigator.userAgent.includes('AppleWebKit') &&
			!navigator.userAgent.includes('Chrome')
		) {
			const pos = this.getPos();
			if (typeof pos === 'number') {
				const $tableRowPos = this.view.state.doc.resolve(pos);

				// layout -> layout column -> table -> table row
				if ($tableRowPos.depth >= 3) {
					const isInsideLayout = findParentNodeClosestToPos($tableRowPos, (node) => {
						return node.type.name === 'layoutColumn';
					})?.node;

					if (isInsideLayout) {
						return false;
					}
				}
			}
		}

		return this.isHeaderSticky();
	}

	private isHeaderSticky() {
		/*
    # Overview
      I'm going to list all the view states associated with the sentinels and when they should trigger sticky headers.
      The format of the states are;    {top|bottom}:{in|above|below}
      ie sentinel:view-position -- both "above" and "below" are equal to out of the viewport

      For example; "top:in" means top sentinel is within the viewport. "bottom:above" means the bottom sentinel is
      above and out of the viewport

      This will hopefully simplify things and make it easier to determine when sticky should/shouldn't be triggered.

    # States
      top:in / bottom:in - NOT sticky
      top:in / bottom:above - NOT sticky - NOTE: This is an inversion clause
      top:in / bottom:below - NOT sticky
      top:above / bottom:in - STICKY
      top:above / bottom:above - NOT sticky
      top:above / bottom:below - STICKY
      top:below / bottom:in - NOT sticky - NOTE: This is an inversion clause
      top:below / bottom:above - NOT sticky - NOTE: This is an inversion clause
      top:below / bottom:below - NOT sticky

    # Summary
      The only time the header should be sticky is when the top sentinel is above the view and the bottom sentinel
      is in or below it.
    */

		const { top: sentinelTop, bottom: sentinelBottom } = this.sentinelData;
		// The rootRect is kept in sync across sentinels so it doesn't matter which one we use.
		const rootBounds = sentinelTop.rootBounds ?? sentinelBottom.rootBounds;

		if (!rootBounds || !sentinelTop.boundingClientRect || !sentinelBottom.boundingClientRect) {
			return false;
		}

		// Normalize the sentinels to y points
		// Since the sentinels are actually rects 1px high we want make sure we normalise the inner most values closest to the table.
		const sentinelTopY = sentinelTop.boundingClientRect.bottom;
		const sentinelBottomY = sentinelBottom.boundingClientRect.top;

		// If header row height is more than 50% of viewport height don't do this
		const isRowHeaderTooLarge =
			this.stickyRowHeight && this.stickyRowHeight > window.innerHeight * 0.5;

		const isTopSentinelAboveScrollArea =
			!sentinelTop.isIntersecting && sentinelTopY <= rootBounds.top;

		const isBottomSentinelInOrBelowScrollArea =
			sentinelBottom.isIntersecting || sentinelBottomY > rootBounds.bottom;

		// This makes sure that the top sentinel is actually above the bottom sentinel, and that they havn't inverted.
		const isTopSentinelAboveBottomSentinel = sentinelTopY < sentinelBottomY;

		return (
			isTopSentinelAboveScrollArea &&
			isBottomSentinelInOrBelowScrollArea &&
			isTopSentinelAboveBottomSentinel &&
			!isRowHeaderTooLarge
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

		const tableContainer = wrapper.parentElement;
		const tableContentWrapper = tableContainer?.parentElement;

		const parentContainer = tableContentWrapper && tableContentWrapper.parentElement;

		const isTableInsideLayout =
			parentContainer && parentContainer.getAttribute('data-layout-content');

		if (tableContentWrapper) {
			if (isCurrentTableSelected) {
				this.colControlsOffset = tableControlsSpacing;

				// move table a little out of the way
				// to provide spacing for table controls
				if (isTableInsideLayout) {
					tableContentWrapper.style.paddingLeft = '11px';
				}
			} else {
				this.colControlsOffset = 0;
				if (isTableInsideLayout) {
					tableContentWrapper.style.removeProperty('padding-left');
				}
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
			(this.stickyRowHeight && this.stickyRowHeight > window.innerHeight / 2) ||
			this.isInNestedTable
		) {
			return;
		}

		const { table, wrapper } = tree;

		// TODO: ED-16035 - Make sure sticky header is only applied to first row
		const tbody = this.dom.parentElement;
		const isFirstHeader = tbody?.firstChild?.isEqualNode(this.dom);
		if (!isFirstHeader) {
			return;
		}

		const currentTableTop = this.getCurrentTableTop(tree);

		if (!scrollTop) {
			scrollTop = getTop(this.editorScrollableElement);
		}

		const domTop = currentTableTop > 0 ? scrollTop : scrollTop + currentTableTop;

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
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
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
		this.dom.style.top = `0px`;
		updateTableMargin(table);
		this.dom.scrollLeft = wrapper.scrollLeft;

		this.emitOn(domTop, this.colControlsOffset);
	}

	private makeRowHeaderNotSticky(table: HTMLElement, isEditorDestroyed: boolean = false) {
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
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
