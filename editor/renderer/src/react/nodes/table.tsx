import React from 'react';
import { useIntl } from 'react-intl-next';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TableLayout, UrlType } from '@atlaskit/adf-schema';
import { TableSharedCssClassName, tableMarginTop } from '@atlaskit/editor-common/styles';
import { tableMessages } from '@atlaskit/editor-common/messages';
import { WidthConsumer, overflowShadow } from '@atlaskit/editor-common/ui';
import type { OverflowShadowProps } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	createCompareNodes,
	convertProsemirrorTableNodeToArrayOfRows,
	hasMergedCell,
	compose,
} from '@atlaskit/editor-common/utils';
import { SortOrder } from '@atlaskit/editor-common/types';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { RendererAppearance, StickyHeaderConfig } from '../../ui/Renderer/types';
import { FullPagePadding } from '../../ui/Renderer/style';
import { TableHeader } from './tableCell';
import type { WithSmartCardStorageProps } from '../../ui/SmartCardStorage';
import { withSmartCardStorage } from '../../ui/SmartCardStorage';

import type { StickyMode } from './table/sticky';
import { StickyTable, tableStickyPadding, OverflowParent } from './table/sticky';
import { Table } from './table/table';
import type { SharedTableProps } from './table/types';
import {
	isCommentAppearance,
	isFullPageAppearance,
	isFullWidthAppearance,
	isFullWidthOrFullPageAppearance,
} from '../utils/appearance';
import { token } from '@atlaskit/tokens';

import { TableStickyScrollbar } from './TableStickyScrollbar';

import { TableProcessorWithContainerStyles } from './tableNew';

export type TableArrayMapped = {
	rowNodes: Array<PMNode | null>;
	rowReact: React.ReactElement;
};

export const isTableResizingEnabled = (appearance: RendererAppearance) =>
	isFullWidthOrFullPageAppearance(appearance) ||
	(isCommentAppearance(appearance) &&
		editorExperiment('support_table_in_comment', true, { exposure: true }));

export const isStickyScrollbarEnabled = (appearance: RendererAppearance) =>
	isFullWidthOrFullPageAppearance(appearance) &&
	editorExperiment('platform_renderer_table_sticky_scrollbar', true, { exposure: true });

export const orderChildren = (
	children: React.ReactElement[],
	tableNode: PMNode,
	smartCardStorage: WithSmartCardStorageProps['smartCardStorage'],
	tableOrderStatus?: TableOrderStatus,
): React.ReactElement[] => {
	if (!tableOrderStatus || tableOrderStatus.order === SortOrder.NO_ORDER) {
		return children;
	}

	const { order, columnIndex } = tableOrderStatus;

	const compareNodesInOrder = createCompareNodes(
		{
			getInlineCardTextFromStore(attrs) {
				const { url } = attrs as UrlType;
				if (!url) {
					return null;
				}

				return smartCardStorage.get(url) || null;
			},
		},
		order,
	);

	const tableArray = convertProsemirrorTableNodeToArrayOfRows(tableNode);

	const tableArrayWithChildren: TableArrayMapped[] = tableArray.map((rowNodes, index) => ({
		rowNodes,
		rowReact: children[index],
	}));

	const headerRow = tableArrayWithChildren.shift();

	const sortedTable = tableArrayWithChildren.sort(
		(rowA: TableArrayMapped, rowB: TableArrayMapped) =>
			compareNodesInOrder(rowA.rowNodes[columnIndex], rowB.rowNodes[columnIndex]),
	);

	if (headerRow) {
		sortedTable.unshift(headerRow);
	}

	return sortedTable.map((elem) => elem.rowReact);
};

export const hasRowspan = (row: PMNode) => {
	let hasRowspan = false;
	row.forEach((cell) => (hasRowspan = hasRowspan || cell.attrs.rowspan > 1));
	return hasRowspan;
};

export const getRefTop = (refElement: HTMLElement): number => {
	return Math.round(refElement.getBoundingClientRect().top);
};

export const shouldHeaderStick = (
	scrollTop: number,
	tableTop: number,
	tableBottom: number,
	rowHeight: number,
) => tableTop <= scrollTop && !(tableBottom - rowHeight <= scrollTop);

export const shouldHeaderPinBottom = (scrollTop: number, tableBottom: number, rowHeight: number) =>
	tableBottom - rowHeight <= scrollTop && !(tableBottom < scrollTop);

export const addSortableColumn = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rows: React.ReactElement<any>[],
	tableOrderStatus: TableOrderStatus | undefined,
	onSorting: (columnIndex: number, sortOrder: SortOrder) => void,
) => {
	return React.Children.map(rows, (row, index) => {
		if (index === 0) {
			return React.cloneElement(React.Children.only(row), {
				tableOrderStatus,
				onSorting,
			});
		}

		return row;
	});
};

export type TableProps = SharedTableProps & {
	allowColumnSorting?: boolean;
	allowTableAlignment?: boolean;
	allowTableResizing?: boolean;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	children: React.ReactElement<any> | Array<React.ReactElement<any>>;
	disableTableOverflowShadow?: boolean;
	isPresentational?: boolean;
	rendererAppearance?: RendererAppearance;
	stickyHeaders?: StickyHeaderConfig;
	tableNode?: PMNode;
};

export const isHeaderRowEnabled = (
	rows: (React.ReactChild | React.ReactFragment | React.ReactPortal)[],
) => {
	if (!rows.length) {
		return false;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { children } = (rows[0] as React.ReactElement<any>).props;
	if (!children.length) {
		return false;
	}

	if (children.length === 1) {
		return children[0].type === TableHeader;
	}

	return children.every((node: React.ReactElement) => node.type === TableHeader);
};

type TableWrapperProps = {
	children: React.ReactNode;
	onScroll?: () => void;
	stickyHeaders?: StickyHeaderConfig;
	wrapperRef: React.RefObject<HTMLDivElement>;
};

/**
 * This TableWrapper component was created to make sure that the aria-label can be
 * internationalized without needing to add `intl` to the TableContainer.
 *
 * @param {TableWrapperProps} root0 - The props object.
 * @param {React.ReactNode} root0.children - The table content to render inside the wrapper.
 * @param {React.RefObject<HTMLDivElement>} root0.wrapperRef - Ref to the wrapper div element.
 * @param {(() => void) | undefined} root0.onScroll - Optional scroll event handler.
 * @param {StickyHeaderConfig | undefined} root0.stickyHeaders - Optional sticky header configuration.
 * @returns The rendered table wrapper component.
 * @example
 * <TableWrapper wrapperRef={ref} onScroll={handleScroll} stickyHeaders={config}>
 *   <Table>...</Table>
 * </TableWrapper>
 */
const TableWrapper = ({ children, wrapperRef, onScroll, stickyHeaders }: TableWrapperProps) => {
	const { formatMessage } = useIntl();

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={TableSharedCssClassName.TABLE_NODE_WRAPPER}
			ref={wrapperRef}
			onScroll={stickyHeaders ? onScroll : undefined}
			// Adding tabIndex here because this is a scrollable container and it needs to be focusable so keyboard users can scroll it.
			// eslint-disable-next-line @atlassian/a11y/no-noninteractive-tabindex
			tabIndex={0}
			role="region"
			aria-label={formatMessage(tableMessages.tableScrollRegion)}
		>
			{children}
		</div>
	);
};

export const tableCanBeSticky = (
	node: PMNode | undefined,
	children: (React.ReactChild | React.ReactFragment | React.ReactPortal)[],
) => {
	return isHeaderRowEnabled(children) && node && node.firstChild && !hasRowspan(node.firstChild);
};

export interface TableOrderStatus {
	columnIndex: number;
	order: SortOrder;
}

export interface TableState {
	headerRowHeight: number;
	stickyMode: StickyMode;
	wrapperWidth: number;
}

/**
 *
 */
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class TableContainer extends React.Component<
	TableProps & OverflowShadowProps & WithSmartCardStorageProps,
	TableState
> {
	state: TableState = {
		stickyMode: 'none',
		wrapperWidth: 0,
		headerRowHeight: 0,
	};
	tableRef = React.createRef<HTMLTableElement>();
	stickyHeaderRef = React.createRef<HTMLElement>();
	stickyScrollbarRef = React.createRef<HTMLDivElement>();

	// used for sync scroll + copying wrapper width to sticky header
	stickyWrapperRef = React.createRef<HTMLDivElement>();
	wrapperRef = React.createRef<HTMLDivElement>();
	stickyScrollbar?: TableStickyScrollbar;

	nextFrame: number | undefined;
	overflowParent: OverflowParent | null = null;

	private resizeObserver: ResizeObserver | null = null;

	private applyResizerChange: ResizeObserverCallback = (entries) => {
		let wrapperWidth = this.state.wrapperWidth;
		let headerRowHeight = this.state.headerRowHeight;

		for (const entry of entries) {
			if (entry.target === this.wrapperRef.current) {
				wrapperWidth = entry.contentRect.width;
			} else if (entry.target === this.stickyHeaderRef.current) {
				headerRowHeight = Math.round(entry.contentRect.height);
			}
		}

		if (
			headerRowHeight !== this.state.headerRowHeight ||
			wrapperWidth !== this.state.wrapperWidth
		) {
			this.setState({
				wrapperWidth,
				headerRowHeight,
			});
		}
	};

	/**
	 *
	 * @example
	 */
	componentDidMount() {
		this.resizeObserver = new ResizeObserver(this.applyResizerChange);
		if (this.wrapperRef.current) {
			this.resizeObserver.observe(this.wrapperRef.current);
		}
		if (this.stickyHeaderRef.current) {
			this.resizeObserver.observe(this.stickyHeaderRef.current);
		}

		if (this.props.stickyHeaders) {
			this.overflowParent = OverflowParent.fromElement(
				this.tableRef.current,
				this.props.stickyHeaders?.defaultScrollRootId_DO_NOT_USE,
			);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.overflowParent.addEventListener('scroll', this.onScroll);
		}

		if (this.wrapperRef.current && isStickyScrollbarEnabled(this.props.rendererAppearance)) {
			this.stickyScrollbar = new TableStickyScrollbar(this.wrapperRef.current);
		}
	}

	/**
	 *
	 * @param prevProps
	 * @param prevState
	 * @example
	 */
	componentDidUpdate(prevProps: TableProps, prevState: TableState) {
		// toggling sticky headers visiblity
		if (this.props.stickyHeaders && !this.overflowParent) {
			this.overflowParent = OverflowParent.fromElement(
				this.tableRef.current,
				this.props.stickyHeaders?.defaultScrollRootId_DO_NOT_USE,
			);
		} else if (!this.props.stickyHeaders && this.overflowParent) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.overflowParent.removeEventListener('scroll', this.onScroll);
			this.overflowParent = null;
		}

		// offsetTop might have changed, re-position sticky header
		if (this.props.stickyHeaders !== prevProps.stickyHeaders) {
			this.updateSticky();
		}

		// sync horizontal scroll in floating div when toggling modes
		if (prevState.stickyMode !== this.state.stickyMode) {
			this.onWrapperScrolled();
		}
	}

	componentWillUnmount = () => {
		if (this.overflowParent) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.overflowParent.removeEventListener('scroll', this.onScroll);
		}

		if (this.nextFrame) {
			cancelAnimationFrame(this.nextFrame);
		}

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}

		if (this.stickyScrollbar) {
			this.stickyScrollbar.dispose();
		}
	};

	getScrollTop = (): number => {
		const { stickyHeaders } = this.props;
		const offsetTop = (stickyHeaders && stickyHeaders.offsetTop) || 0;
		return (this.overflowParent ? this.overflowParent.top : 0) + offsetTop;
	};

	updateSticky = () => {
		const tableElem = this.tableRef.current;
		const refElem = this.stickyHeaderRef.current;
		if (!tableElem || !refElem) {
			return;
		}

		const scrollTop = this.getScrollTop() + tableStickyPadding;
		const tableTop = getRefTop(tableElem);
		const tableBottom = tableTop + tableElem.clientHeight;

		const shouldSticky = shouldHeaderStick(scrollTop, tableTop, tableBottom, refElem.clientHeight);
		const shouldPin = shouldHeaderPinBottom(scrollTop, tableBottom, refElem.clientHeight);

		let stickyMode: StickyMode = 'none';
		if (shouldPin) {
			stickyMode = 'pin-bottom';
		} else if (shouldSticky) {
			stickyMode = 'stick';
		}

		if (this.state.stickyMode !== stickyMode) {
			this.setState({ stickyMode });
		}

		this.nextFrame = undefined;
	};

	onScroll = () => {
		if (!this.nextFrame) {
			this.nextFrame = requestAnimationFrame(this.updateSticky);
		}
	};

	onWrapperScrolled = () => {
		if (!this.wrapperRef.current || !this.stickyWrapperRef.current) {
			return;
		}

		this.stickyWrapperRef.current.scrollLeft = this.wrapperRef.current.scrollLeft;

		if (this.stickyScrollbarRef.current) {
			this.stickyScrollbarRef.current.scrollLeft = this.wrapperRef.current.scrollLeft;
		}
	};

	/**
	 *
	 */
	get pinTop() {
		if (!this.tableRef.current || !this.stickyHeaderRef.current) {
			return;
		}

		return (
			this.tableRef.current.offsetHeight -
			this.stickyHeaderRef.current.offsetHeight +
			tableMarginTop -
			tableStickyPadding
		);
	}

	/**
	 *
	 */
	get shouldAddOverflowParentOffsetTop_DO_NOT_USE() {
		// IF the StickyHeaderConfig specifies that the default scroll root offsetTop should be added
		// AND the StickyHeaderConfig specifies a default scroll root id
		// AND the OverflowParent is the corresponding element
		// THEN we should add the OverflowParent offset top (RETURN TRUE)
		return (
			this.props.stickyHeaders &&
			!!this.props.stickyHeaders.shouldAddDefaultScrollRootOffsetTop_DO_NOT_USE &&
			!!this.props.stickyHeaders.defaultScrollRootId_DO_NOT_USE &&
			this.overflowParent &&
			this.overflowParent.id === this.props.stickyHeaders.defaultScrollRootId_DO_NOT_USE
		);
	}

	/**
	 *
	 */
	get stickyTop() {
		switch (this.state.stickyMode) {
			case 'pin-bottom':
				return this.pinTop;
			case 'stick':
				const offsetTop = this.props.stickyHeaders && this.props.stickyHeaders.offsetTop;
				if (typeof offsetTop === 'number' && this.shouldAddOverflowParentOffsetTop_DO_NOT_USE) {
					const overflowParentOffsetTop = this.overflowParent ? this.overflowParent.top : 0;
					return offsetTop + overflowParentOffsetTop;
				} else {
					return offsetTop;
				}
			default:
				return undefined;
		}
	}

	/**
	 *
	 * @example
	 */
	render() {
		const {
			isNumberColumnEnabled,
			layout,
			renderWidth,
			columnWidths,
			stickyHeaders,
			tableNode,
			rendererAppearance,
			isInsideOfBlockNode,
			isInsideOfTable,
			isinsideMultiBodiedExtension,
			allowTableAlignment,
			allowTableResizing,
			isPresentational,
		} = this.props;

		const { stickyMode } = this.state;

		const lineLengthFixedWidth = akEditorDefaultLayoutWidth;
		let left: number | undefined;
		let updatedLayout: TableLayout | 'custom';

		// The tableWidth and left offset logic below must stay aligned with the `breakout-ssr.tsx` logic
		// Please consider changes below carefully to not negatively impact SSR
		// `renderWidth` cannot be depended on during SSR
		const isRenderWidthValid = !!renderWidth && renderWidth > 0;

		const fullPageRendererWidthCSS = editorExperiment(
			'platform_editor_preview_panel_responsiveness',
			true,
			{
				exposure: true,
			},
		)
			? 'calc(100cqw - var(--ak-renderer--full-page-gutter) * 2)'
			: `100cqw - ${FullPagePadding}px * 2`;

		const renderWidthCSS = rendererAppearance === 'full-page' ? fullPageRendererWidthCSS : `100cqw`;

		const calcDefaultLayoutWidthByAppearance = (
			rendererAppearance: RendererAppearance,
			tableNode?: PMNode,
		): [number, string] => {
			if (rendererAppearance === 'full-width' && !tableNode?.attrs.width) {
				return [
					isRenderWidthValid
						? Math.min(akEditorFullWidthLayoutWidth, renderWidth)
						: akEditorFullWidthLayoutWidth,
					`min(${akEditorFullWidthLayoutWidth}px, ${renderWidthCSS})`,
				];
			} else if (
				rendererAppearance === 'comment' &&
				allowTableResizing &&
				!tableNode?.attrs.width
			) {
				const tableContainerWidth = getTableContainerWidth(tableNode);
				return [isRenderWidthValid ? renderWidth : tableContainerWidth, renderWidthCSS];
			} else {
				// custom width, or width mapped to breakpoint
				const tableContainerWidth = getTableContainerWidth(tableNode);
				return [
					isRenderWidthValid ? Math.min(tableContainerWidth, renderWidth) : tableContainerWidth,
					`min(${tableContainerWidth}px, ${renderWidthCSS})`,
				];
			}
		};

		const [tableWidth, tableWidthCSS] = calcDefaultLayoutWidthByAppearance(
			rendererAppearance,
			tableNode,
		);

		// Logic for table alignment in renderer
		const isTableAlignStart =
			tableNode &&
			tableNode.attrs &&
			tableNode.attrs.layout === 'align-start' &&
			allowTableAlignment;

		const fullWidthLineLength = isRenderWidthValid
			? Math.min(akEditorFullWidthLayoutWidth, renderWidth)
			: akEditorFullWidthLayoutWidth;
		const fullWidthLineLengthCSS = `min(${akEditorFullWidthLayoutWidth}px, ${renderWidthCSS})`;

		const commentLineLength = isRenderWidthValid ? renderWidth : lineLengthFixedWidth;
		const isCommentAppearanceAndTableAlignmentEnabled =
			isCommentAppearance(rendererAppearance) && allowTableAlignment;
		const lineLength = isFullWidthAppearance(rendererAppearance)
			? fullWidthLineLength
			: isCommentAppearanceAndTableAlignmentEnabled
				? commentLineLength
				: lineLengthFixedWidth;
		const lineLengthCSS = isFullWidthAppearance(rendererAppearance)
			? fullWidthLineLengthCSS
			: isCommentAppearanceAndTableAlignmentEnabled
				? renderWidthCSS
				: `${lineLengthFixedWidth}px`;

		// Setting fixTableSSRResizing to false while FG logic is true in tableNew
		const fixTableSSRResizing = false;
		const tableWidthNew = fixTableSSRResizing ? getTableContainerWidth(tableNode) : tableWidth;
		const shouldCalculateLeftForAlignment =
			!isInsideOfBlockNode &&
			!isInsideOfTable &&
			isTableAlignStart &&
			((isFullPageAppearance(rendererAppearance) && tableWidthNew <= lineLengthFixedWidth) ||
				isFullWidthAppearance(rendererAppearance) ||
				isCommentAppearanceAndTableAlignmentEnabled);

		let leftCSS: string | undefined;
		if (shouldCalculateLeftForAlignment) {
			left = (tableWidth - lineLength) / 2;
			leftCSS = `(${tableWidthCSS} - ${lineLengthCSS}) / 2`;
		}

		if (fixTableSSRResizing) {
			if (!shouldCalculateLeftForAlignment && isFullPageAppearance(rendererAppearance)) {
				// Note tableWidthCSS here is the renderer width
				// When the screen is super wide we want table to break out.
				// However if screen is smaller than 760px. We want table align to left.
				leftCSS = `min(0px, ${lineLengthCSS} - ${tableWidthCSS}) / 2`;
			}
		} else {
			if (
				!shouldCalculateLeftForAlignment &&
				isFullPageAppearance(rendererAppearance) &&
				tableWidthNew > lineLengthFixedWidth
			) {
				left = lineLengthFixedWidth / 2 - tableWidth / 2;
			}
		}

		const children = React.Children.toArray(this.props.children);

		// Historically, tables in the full-width renderer had their layout set to 'default' which is deceiving.
		// This check caters for those tables and helps with SSR logic
		const isFullWidth =
			!tableNode?.attrs.width && rendererAppearance === 'full-width' && layout !== 'full-width';

		if (isFullWidth) {
			updatedLayout = 'full-width';
			// if table has width explicity set, ensure SSR is handled
		} else if (tableNode?.attrs.width) {
			updatedLayout = 'custom';
		} else {
			updatedLayout = layout;
		}

		let finalTableContainerWidth = allowTableResizing ? tableWidthNew : 'inherit';

		// We can only use CSS to determine the width when we have a known width in container.
		// When appearance is full-page, full-width or comment we use CSS based width calculation.
		// Otherwise it's fixed table width (customized width) or inherit.
		if (
			(rendererAppearance === 'full-page' || rendererAppearance === 'full-width') &&
			fixTableSSRResizing
		) {
			finalTableContainerWidth = allowTableResizing ? `calc(${tableWidthCSS})` : 'inherit';
		}

		if (rendererAppearance === 'comment' && allowTableResizing && !allowTableAlignment) {
			// If table alignment is disabled and table width is akEditorDefaultLayoutWidth = 760,
			// it is most likely a table created before "Support Table in Comments" FF was enabled
			// and we would see a bug ED-24795. A table created before "Support Table in Comments",
			// should inhirit the width of the renderer container.

			// !NOTE: it a table resized to 760 is copied from 'full-page' editor and pasted in comment editor
			// where (allowTableResizing && !allowTableAlignment), the table will loose 760px width.
			finalTableContainerWidth =
				tableNode?.attrs.width && tableNode?.attrs.width !== akEditorDefaultLayoutWidth
					? fixTableSSRResizing
						? `calc(${tableWidthCSS})`
						: tableWidth
					: 'inherit';
		}

		if (rendererAppearance === 'comment' && allowTableResizing && allowTableAlignment) {
			// If table alignment is enabled and layout is not 'align-start' or 'center', we are loading a table that was
			// created before "Support Table in Comments" FF was enabled. So the table should have the same width as renderer container
			// instead of 760 that was set on tableNode when the table had been published.
			finalTableContainerWidth =
				(tableNode?.attrs.layout === 'align-start' || tableNode?.attrs.layout === 'center') &&
				tableNode?.attrs.width
					? fixTableSSRResizing
						? `calc(${tableWidthCSS})`
						: tableWidth
					: 'inherit';
		}

		let style;
		if (fixTableSSRResizing) {
			style = {
				width: finalTableContainerWidth,
				left: leftCSS ? `calc(${leftCSS})` : undefined,
				marginLeft:
					shouldCalculateLeftForAlignment && leftCSS !== undefined
						? `calc(-1 * (${leftCSS}))`
						: undefined,
			};
		} else {
			style = {
				width: finalTableContainerWidth,
				left: left,
				marginLeft: shouldCalculateLeftForAlignment && left !== undefined ? -left : undefined,
			};
		}

		return (
			<>
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={`${TableSharedCssClassName.TABLE_CONTAINER} ${
						this.props.shadowClassNames || ''
					}`}
					data-layout={updatedLayout}
					ref={this.props.handleRef}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={style}
				>
					{isStickyScrollbarEnabled(this.props.rendererAppearance) && (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={TableSharedCssClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP}
							data-testid="sticky-scrollbar-sentinel-top"
						/>
					)}
					{stickyHeaders && tableCanBeSticky(tableNode, children) && (
						<StickyTable
							isNumberColumnEnabled={isNumberColumnEnabled}
							tableWidth={tableWidth}
							layout={layout}
							renderWidth={renderWidth}
							handleRef={this.props.handleRef}
							shadowClassNames={this.props.shadowClassNames}
							top={this.stickyTop}
							mode={stickyMode}
							innerRef={this.stickyWrapperRef}
							wrapperWidth={this.state.wrapperWidth}
							columnWidths={columnWidths}
							rowHeight={this.state.headerRowHeight}
							tableNode={tableNode}
							rendererAppearance={rendererAppearance}
							allowTableResizing={allowTableResizing}
						>
							{[children && children[0]]}
						</StickyTable>
					)}
					{fg('editor_enghealth_focusable_scrollable_tables') ? (
						<TableWrapper
							wrapperRef={this.wrapperRef}
							onScroll={this.props.stickyHeaders ? this.onWrapperScrolled : undefined}
							stickyHeaders={stickyHeaders}
						>
							<Table
								innerRef={this.tableRef}
								columnWidths={columnWidths}
								layout={layout}
								isNumberColumnEnabled={isNumberColumnEnabled}
								renderWidth={renderWidth}
								tableNode={tableNode}
								rendererAppearance={rendererAppearance}
								isInsideOfBlockNode={isInsideOfBlockNode}
								isInsideOfTable={isInsideOfTable}
								isinsideMultiBodiedExtension={isinsideMultiBodiedExtension}
								allowTableResizing={allowTableResizing}
								isPresentational={isPresentational}
							>
								{this.grabFirstRowRef(children)}
							</Table>
						</TableWrapper>
					) : (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={TableSharedCssClassName.TABLE_NODE_WRAPPER}
							ref={this.wrapperRef}
							onScroll={this.props.stickyHeaders && this.onWrapperScrolled}
						>
							<Table
								innerRef={this.tableRef}
								columnWidths={columnWidths}
								layout={layout}
								isNumberColumnEnabled={isNumberColumnEnabled}
								renderWidth={renderWidth}
								tableNode={tableNode}
								rendererAppearance={rendererAppearance}
								isInsideOfBlockNode={isInsideOfBlockNode}
								isInsideOfTable={isInsideOfTable}
								isinsideMultiBodiedExtension={isinsideMultiBodiedExtension}
								allowTableResizing={allowTableResizing}
								isPresentational={isPresentational}
							>
								{this.grabFirstRowRef(children)}
							</Table>
						</div>
					)}

					{isStickyScrollbarEnabled(this.props.rendererAppearance) && (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={TableSharedCssClassName.TABLE_STICKY_SCROLLBAR_CONTAINER}
							ref={this.stickyScrollbarRef}
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								height: token('space.250', '20px'), // MAX_BROWSER_SCROLLBAR_HEIGHT
								// Follow editor to hide by default so it does not show empty gap in SSR
								// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/editor/editor-plugin-table/src/nodeviews/TableComponent.tsx#957
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								display: fixTableSSRResizing ? 'none' : 'block',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								width: '100%',
							}}
						>
							<div
								style={{
									width: this.tableRef.current?.clientWidth,
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									height: '100%',
								}}
							/>
						</div>
					)}
					{isStickyScrollbarEnabled(this.props.rendererAppearance) && (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={TableSharedCssClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM}
							data-testid="sticky-scrollbar-sentinel-bottom"
						/>
					)}
				</div>
			</>
		);
	}

	private grabFirstRowRef = (
		children: (React.ReactNode | React.ReactFragment | React.ReactPortal)[],
	): React.ReactNode[] => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return React.Children.map<React.ReactElement, any>(children || false, (child, idx) => {
			if (idx === 0 && React.isValidElement(child)) {
				return React.cloneElement(child, {
					innerRef: this.stickyHeaderRef,
				} as React.Attributes);
			}

			return child;
		});
	};
}

type TableProcessorState = {
	tableOrderStatus?: TableOrderStatus;
};

/**
 *
 */
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class TableProcessor extends React.Component<
	TableProps & OverflowShadowProps & WithSmartCardStorageProps,
	TableProcessorState
> {
	state = {
		tableOrderStatus: undefined,
	};

	/**
	 *
	 * @example
	 */
	render() {
		const { children } = this.props;
		if (!children) {
			return null;
		}

		const childrenArray = React.Children.toArray(children);
		const orderedChildren = compose(
			this.addNumberColumnIndexes,
			this.addSortableColumn,
			// @ts-expect-error TS2345: Argument of type '(ReactChild | ReactFragment | ReactPortal)[]' is not assignable to parameter of type 'ReactElement<any, string | JSXElementConstructor<any>>[]'
		)(childrenArray);

		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <TableContainer {...this.props}>{orderedChildren}</TableContainer>;
	}

	// adds sortable + re-orders children
	private addSortableColumn = (childrenArray: React.ReactElement[]) => {
		const { tableNode, allowColumnSorting, smartCardStorage } = this.props;
		const { tableOrderStatus } = this.state;

		if (
			allowColumnSorting &&
			isHeaderRowEnabled(childrenArray) &&
			tableNode &&
			!hasMergedCell(tableNode)
		) {
			return addSortableColumn(
				orderChildren(childrenArray, tableNode, smartCardStorage, tableOrderStatus),
				tableOrderStatus,
				this.changeSortOrder,
			);
		}

		return childrenArray;
	};

	private changeSortOrder = (columnIndex: number, sortOrder: SortOrder) => {
		this.setState({
			tableOrderStatus: {
				columnIndex,
				order: sortOrder,
			},
		});
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private addNumberColumnIndexes = (rows: React.ReactElement<any>[]) => {
		const { isNumberColumnEnabled } = this.props;

		const headerRowEnabled = isHeaderRowEnabled(rows);
		return React.Children.map(rows, (row, index) => {
			return React.cloneElement(React.Children.only(row), {
				isNumberColumnEnabled,
				index: headerRowEnabled ? (index === 0 ? '' : index) : index + 1,
			});
		});
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableWithShadowsAndContainerStyles: React.PropsWithChildren<any> = overflowShadow(
	TableProcessorWithContainerStyles,
	{
		/**
		 * The :scope is in reference to table container and we are selecting only
		 * direct children that match the table node wrapper selector, not their
		 * descendants.
		 */
		overflowSelector: `:scope > .${TableSharedCssClassName.TABLE_NODE_WRAPPER}`,
		useShadowObserver: true,
	},
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableWithShadows: React.PropsWithChildren<any> = overflowShadow(TableProcessor, {
	/**
	 * The :scope is in reference to table container and we are selecting only
	 * direct children that match the table node wrapper selector, not their
	 * descendants.
	 */
	overflowSelector: `:scope > .${TableSharedCssClassName.TABLE_NODE_WRAPPER}`,
	useShadowObserver: true,
});

const TableWithWidth = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props: React.PropsWithChildren<any>,
) => {
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform-ssr-table-resize')) {
		const colWidthsSum =
			props.columnWidths?.reduce((total: number, val: number) => total + val, 0) || 0;

		if (colWidthsSum || props.allowTableResizing) {
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			return <TableWithShadowsAndContainerStyles {...props} />;
		}
		return (
			<TableProcessorWithContainerStyles
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		);
	} else {
		return (
			<WidthConsumer>
				{({ width }) => {
					const renderWidth =
						props.rendererAppearance === 'full-page' ? width - FullPagePadding * 2 : width;
					const colWidthsSum =
						props.columnWidths?.reduce((total: number, val: number) => total + val, 0) || 0;

					if (colWidthsSum || props.allowTableResizing) {
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						return <TableWithShadows renderWidth={renderWidth} {...props} />;
					}
					// there should not be a case when colWidthsSum is 0 and table is in overflow state - so no need to render shadows in this case
					return (
						<TableProcessor
							renderWidth={renderWidth}
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...props}
						/>
					);
				}}
			</WidthConsumer>
		);
	}
};

export default withSmartCardStorage(TableWithWidth);
