import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { List } from 'react-virtualized/dist/commonjs/List';
import type { ListProps, ListRowRenderer } from 'react-virtualized/dist/commonjs/List';

import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';

import { ActiveMenuItemKeyContext } from './ActiveMenuItemKeyContext';
import { MeasuredRow } from './MeasuredRow';
import { RegisteredMenuListItemRow } from './RegisteredMenuListItemRow';
import type { RegisteredMenuListItemIdParams } from './RegisteredMenuListItemRow';
import type { RegisteredMenuItemProps, RegisteredMenuSelectionSource } from './types';
import { useMenuListHeight } from './useMenuListHeight';

const ESTIMATED_ROW_HEIGHT = 44;

export type RegisteredMenuListProps = {
	activeItemKey?: string;
	containerRole?: 'presentation';
	getItemId: (params: RegisteredMenuListItemIdParams) => string;
	hasScrollPadding?: boolean;
	Item: React.ComponentType<RegisteredMenuItemProps>;
	lastRowPadding?: 'none' | 'space.100';
	maxHeight: number;
	omitAriaReadonly?: boolean;
	onItemBlur: (itemKey: string) => void;
	onItemFocus: (itemIndex: number, itemKey?: string) => void;
	onItemHover: (itemIndex: number, itemKey?: string) => void;
	onItemLeave: (itemKey: string) => void;
	onItemVisibilityChange: (itemKey: string, isVisible: boolean) => void;
	onRenderedItemsChange?: (range: { startIndex: number; stopIndex: number }) => void;
	role?: 'presentation' | 'group';
	rows: Array<RegisterMenuItem | RegisterMenuSection>;
	scrollResetKey?: string | number | symbol;
	scrollTo?: 'selected' | 'top-on-reset';
	selectedItemIndex: number;
	/** Whether the keyboard or the pointer made the current selection. */
	selectionSource?: RegisteredMenuSelectionSource;
	tabIndex?: number | null;
	width: number;
};

export const RegisteredMenuList = ({
	rows,
	Item,
	selectedItemIndex,
	activeItemKey,
	maxHeight,
	width,
	getItemId,
	onItemHover,
	onItemFocus,
	onItemLeave,
	onItemBlur,
	onItemVisibilityChange,
	onRenderedItemsChange,
	scrollResetKey,
	role = 'presentation',
	containerRole = 'presentation',
	tabIndex,
	omitAriaReadonly = false,
	hasScrollPadding = false,
	lastRowPadding = 'none',
	scrollTo = 'selected',
	selectionSource = 'keyboard',
}: RegisteredMenuListProps): React.JSX.Element | null => {
	const listRef = useRef<List | null>(null);
	const cache = useMemo(
		() => new CellMeasurerCache({ defaultHeight: ESTIMATED_ROW_HEIGHT, fixedWidth: true }),
		[],
	);
	const itemIndexByRowIndex = useMemo(() => {
		const indexes = new Map<number, number>();
		let itemIndex = 0;
		rows.forEach((row, rowIndex) => {
			if (row.type === 'menu-item') {
				indexes.set(rowIndex, itemIndex++);
			}
		});
		return indexes;
	}, [rows]);
	const selectedRowIndex = useMemo(() => {
		for (const [rowIndex, itemIndex] of itemIndexByRowIndex) {
			if (itemIndex === selectedItemIndex) {
				return rowIndex;
			}
		}
		return -1;
	}, [itemIndexByRowIndex, selectedItemIndex]);
	const rowKeySignature = useMemo(
		() => rows.map(({ key, type }) => `${type}:${key}`).join('\0'),
		[rows],
	);
	const { height: measuredHeight, updateHeight } = useMenuListHeight(
		cache,
		rows.length,
		rowKeySignature,
	);
	// react-virtualized forwards null to omit its grid-only default value.
	const ariaReadonly = omitAriaReadonly ? (null as unknown as boolean) : undefined;

	useLayoutEffect(() => {
		cache.clearAll();
		listRef.current?.recomputeRowHeights();
	}, [cache, rowKeySignature]);

	// Only keyboard selections scroll into view; pointer selections leave the scroll position alone.
	const scrollToSelectedItem = selectionSource === 'keyboard';
	const previousResetKeyRef = useRef(scrollResetKey);
	useLayoutEffect(() => {
		if (scrollTo === 'top-on-reset' && previousResetKeyRef.current !== scrollResetKey) {
			previousResetKeyRef.current = scrollResetKey;
			listRef.current?.scrollToPosition(0);
			return;
		}
		previousResetKeyRef.current = scrollResetKey;
		if (scrollToSelectedItem && selectedRowIndex >= 0) {
			listRef.current?.scrollToRow(selectedRowIndex);
		}
	}, [scrollResetKey, rowKeySignature, scrollTo, scrollToSelectedItem, selectedRowIndex]);

	const handleRowsRendered = useCallback<NonNullable<ListProps['onRowsRendered']>>(
		({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
			if (activeItemKey) {
				const activeRowIndex = rows.findIndex(
					(row) => row.type === 'menu-item' && row.key === activeItemKey,
				);
				if (activeRowIndex >= 0 && (activeRowIndex < startIndex || activeRowIndex > stopIndex)) {
					onItemVisibilityChange(activeItemKey, false);
				}
			}
			updateHeight();
			const indexes = [...itemIndexByRowIndex]
				.filter(([rowIndex]) => rowIndex >= overscanStartIndex && rowIndex <= overscanStopIndex)
				.map(([, itemIndex]) => itemIndex);
			onRenderedItemsChange?.({
				startIndex: indexes[0] ?? -1,
				stopIndex: indexes[indexes.length - 1] ?? -1,
			});
		},
		[
			activeItemKey,
			itemIndexByRowIndex,
			onItemVisibilityChange,
			onRenderedItemsChange,
			rows,
			updateHeight,
		],
	);

	const renderRow = useCallback<ListRowRenderer>(
		({ index, key, parent, style, isScrolling = false, isVisible = true }) => {
			const registration = rows[index];
			if (!registration) {
				return null;
			}
			const itemIndex = itemIndexByRowIndex.get(index);
			const RegisteredComponent = registration.component;
			const paddingBlockStart = hasScrollPadding && index === 0 ? 'space.100' : undefined;
			const paddingBlockEnd =
				(hasScrollPadding || lastRowPadding === 'space.100') && index === rows.length - 1
					? 'space.100'
					: undefined;

			return (
				<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
					{({ registerChild, measure }) => (
						<div
							ref={(element) => registerChild?.(element ?? undefined)}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- react-virtualized provides row offsets at runtime.
							style={style}
						>
							<MeasuredRow
								paddingBlockStart={paddingBlockStart}
								paddingBlockEnd={paddingBlockEnd}
								isScrolling={isScrolling}
								isVisible={isVisible}
								measure={measure}
								onMeasured={updateHeight}
							>
								{registration.type === 'menu-section' ? (
									RegisteredComponent ? (
										<RegisteredComponent />
									) : null
								) : (
									<RegisteredMenuListItemRow
										Item={Item}
										getItemId={getItemId}
										itemIndex={itemIndex ?? 0}
										isVisible={isVisible}
										onItemBlur={onItemBlur}
										onItemFocus={onItemFocus}
										onItemHover={onItemHover}
										onItemLeave={onItemLeave}
										onItemVisibilityChange={onItemVisibilityChange}
										registration={registration}
										rowIndex={index}
										selectedItemIndex={selectedItemIndex}
									/>
								)}
							</MeasuredRow>
						</div>
					)}
				</CellMeasurer>
			);
		},
		[
			Item,
			cache,
			getItemId,
			hasScrollPadding,
			itemIndexByRowIndex,
			lastRowPadding,
			onItemBlur,
			onItemFocus,
			onItemHover,
			onItemLeave,
			onItemVisibilityChange,
			rows,
			selectedItemIndex,
			updateHeight,
		],
	);

	if (rows.length === 0) {
		return null;
	}

	return (
		<ActiveMenuItemKeyContext.Provider value={activeItemKey}>
			<List
				aria-readonly={ariaReadonly}
				containerRole={containerRole}
				height={Math.min(measuredHeight, Math.max(0, maxHeight))}
				ref={listRef}
				onRowsRendered={handleRowsRendered}
				overscanRowCount={3}
				role={role}
				rowCount={rows.length}
				rowHeight={cache.rowHeight}
				rowRenderer={renderRow}
				scrollToAlignment="auto"
				scrollToIndex={
					scrollTo === 'selected' && scrollToSelectedItem ? selectedRowIndex : undefined
				}
				tabIndex={tabIndex}
				width={width}
			/>
		</ActiveMenuItemKeyContext.Provider>
	);
};
