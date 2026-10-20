import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { List } from 'react-virtualized/dist/commonjs/List';
import type { ListRowRenderer, ListProps } from 'react-virtualized/dist/commonjs/List';

import { cssMap } from '@atlaskit/css';
import { QuickInsertEmptyState } from '@atlaskit/editor-common/quick-insert/empty-state';
import {
	getQuickInsertMenuRows,
	type QuickInsertMenuModel,
} from '@atlaskit/editor-common/quick-insert/registered-menu-model';
import { useMenuListHeight } from '@atlaskit/editor-common/quick-insert/use-menu-list-height';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import type { EmptyStateHandler } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterMenuItem, SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import {
	RegisteredInsertMenuItem,
	RegisteredInsertMenuPreviewContext,
} from './RegisteredInsertMenuItem';

const ESTIMATED_ROW_HEIGHT = 44;
// 44px item + 1px separator.
const MENU_FOOTER_HEIGHT = 45;
const MENU_SEARCH_HEIGHT = 64;
const LIST_WIDTH = 350;
const listAriaProps: Pick<ListProps, 'aria-readonly'> = {
	// @ts-expect-error react-virtualized forwards null to omit its grid-only default; its types exclude null.
	'aria-readonly': null,
};

const styles = cssMap({
	content: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: 0,
	},
	scrollable: {
		flexGrow: 1,
		minHeight: 0,
		overflowY: 'auto',
	},
	footer: {
		flexShrink: 0,
	},
	footerWithDivider: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
		flexShrink: 0,
	},
	externalControls: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
	},
});

type Props = {
	activePreviewItemKey?: string;
	editorView: EditorView;
	emptyStateHandler?: EmptyStateHandler;
	isOffline: boolean;
	listId: string;
	listLabel: string;
	maxHeight: number;
	menuOpenId: symbol;
	model: QuickInsertMenuModel;
	onClose: () => void;
	onItemBlur: (itemKey: string) => void;
	onItemFocus: (index: number, itemKey?: string) => void;
	onItemHover: (index: number, itemKey?: string) => void;
	onItemLeave: (itemKey: string) => void;
	onItemVisibilityChange: (itemKey: string, isVisible: boolean) => void;
	onRenderedItemsChange: (range: { startIndex: number; stopIndex: number }) => void;
	query: string;
	selectedItemIndex: number;
	surfaceContext: SurfaceContext;
};

type RegisteredInsertMenuItemRowProps = {
	editorView: EditorView;
	id: string;
	isOffline: boolean;
	isSelected: boolean;
	itemIndex: number;
	menuOpenId: symbol;
	onClose: () => void;
	onItemBlur: (itemKey: string) => void;
	onItemFocus: (index: number, itemKey?: string) => void;
	onItemHover: (index: number, itemKey?: string) => void;
	onItemLeave: (itemKey: string) => void;
	registration: RegisterMenuItem;
	surfaceContext: SurfaceContext;
};

const RegisteredInsertMenuItemRow = ({
	editorView,
	id,
	isOffline,
	isSelected,
	itemIndex,
	menuOpenId,
	onClose,
	onItemFocus,
	onItemBlur,
	onItemHover,
	onItemLeave,
	registration,
	surfaceContext,
}: RegisteredInsertMenuItemRowProps): React.JSX.Element => {
	useLayoutEffect(() => () => onItemLeave(registration.key), [onItemLeave, registration.key]);

	const onBlur = useCallback(
		(event: React.FocusEvent<HTMLDivElement>) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				onItemBlur(registration.key);
			}
		},
		[onItemBlur, registration.key],
	);

	return (
		<div
			onBlur={onBlur}
			onFocus={() => onItemFocus(itemIndex, registration.key)}
			onMouseLeave={() => onItemLeave(registration.key)}
			onMouseMove={() => onItemHover(itemIndex, registration.key)}
		>
			<RegisteredInsertMenuItem
				editorView={editorView}
				id={id}
				isOffline={isOffline}
				isSelected={isSelected}
				menuOpenId={menuOpenId}
				onClose={onClose}
				registration={registration}
				surfaceContext={surfaceContext}
			/>
		</div>
	);
};

export const RegisteredInsertMenuList = ({
	editorView,
	emptyStateHandler,
	isOffline,
	listId,
	listLabel,
	maxHeight,
	menuOpenId,
	model,
	onClose,
	onItemFocus,
	onItemBlur,
	query,
	onItemHover,
	onItemLeave,
	onItemVisibilityChange,
	onRenderedItemsChange,
	selectedItemIndex,
	surfaceContext,
	activePreviewItemKey,
}: Props): React.JSX.Element | null => {
	const Root = model.root?.component ?? React.Fragment;
	const listRef = useRef<List | null>(null);
	const setListRef = useCallback((list: List | null) => {
		listRef.current = list;
	}, []);
	const rows = useMemo(() => getQuickInsertMenuRows(model), [model]);
	const cache = useMemo(
		() => new CellMeasurerCache({ defaultHeight: ESTIMATED_ROW_HEIGHT, fixedWidth: true }),
		[],
	);
	const itemIndexByRowIndex = useMemo(() => {
		const indexes = new Map<number, number>();
		let itemIndex = 0;

		rows.forEach((registration, rowIndex) => {
			if (registration.type === 'menu-item') {
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

	useLayoutEffect(() => {
		cache.clearAll();
		listRef.current?.recomputeRowHeights();
		listRef.current?.scrollToPosition(0);
	}, [cache, rowKeySignature]);

	const onRowsRendered = useCallback<NonNullable<ListProps['onRowsRendered']>>(
		({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
			if (activePreviewItemKey) {
				const previewRowIndex = rows.findIndex(({ key }) => key === activePreviewItemKey);
				if (previewRowIndex < startIndex || previewRowIndex > stopIndex) {
					onItemVisibilityChange(activePreviewItemKey, false);
				}
			}
			updateHeight();
			const indexes = [...itemIndexByRowIndex]
				.filter(([rowIndex]) => rowIndex >= overscanStartIndex && rowIndex <= overscanStopIndex)
				.map(([, itemIndex]) => itemIndex);
			onRenderedItemsChange({
				startIndex: indexes[0] ?? -1,
				stopIndex: indexes[indexes.length - 1] ?? -1,
			});
		},
		[
			activePreviewItemKey,
			itemIndexByRowIndex,
			onItemVisibilityChange,
			onRenderedItemsChange,
			rows,
			updateHeight,
		],
	);
	const onScrollableContentScroll = useCallback(
		(event: React.UIEvent<HTMLDivElement>) => {
			if (event.target === event.currentTarget && activePreviewItemKey) {
				onItemVisibilityChange(activePreviewItemKey, false);
			}
		},
		[activePreviewItemKey, onItemVisibilityChange],
	);

	const renderRow: ListRowRenderer = useCallback(
		({ index, key, parent, style }) => {
			const registration = rows[index];
			if (!registration) {
				return null;
			}

			const itemIndex = itemIndexByRowIndex.get(index);
			const rowContent =
				registration.type === 'menu-section' ? (
					React.createElement(registration.component ?? React.Fragment, null, null)
				) : (
					<RegisteredInsertMenuItemRow
						editorView={editorView}
						id={`${listId}-${itemIndex}`}
						isOffline={isOffline}
						isSelected={itemIndex === selectedItemIndex}
						itemIndex={itemIndex ?? 0}
						menuOpenId={menuOpenId}
						onClose={onClose}
						onItemFocus={onItemFocus}
						onItemBlur={onItemBlur}
						onItemHover={onItemHover}
						onItemLeave={onItemLeave}
						registration={registration}
						surfaceContext={surfaceContext}
					/>
				);

			return (
				<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
					{({ registerChild }) => (
						<div
							ref={(element) => registerChild?.(element ?? undefined)}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							style={style}
						>
							<Box paddingBlockEnd={index === rows.length - 1 ? 'space.100' : undefined}>
								{rowContent}
							</Box>
						</div>
					)}
				</CellMeasurer>
			);
		},
		[
			cache,
			editorView,
			isOffline,
			itemIndexByRowIndex,
			listId,
			menuOpenId,
			onClose,
			onItemFocus,
			onItemBlur,
			onItemHover,
			onItemLeave,
			rows,
			selectedItemIndex,
			surfaceContext,
		],
	);
	const footerItemIndex = itemIndexByRowIndex.size;
	const footerItemId = `${listId}-${footerItemIndex}`;
	const hasExternalControls = model.fallbackItems !== undefined && emptyStateHandler !== undefined;
	const hasNoSearchResults = query !== '' && rows.length === 0;
	const externalControls =
		hasExternalControls && emptyStateHandler
			? emptyStateHandler({
					mode: 'inline',
					searchTerm: query,
					showNoResultsMessage: false,
				})
			: null;
	const showFooterDivider = !hasNoSearchResults || Boolean(externalControls);
	const listMaxHeight = Math.max(
		0,
		maxHeight - MENU_SEARCH_HEIGHT - (model.footer ? MENU_FOOTER_HEIGHT : 0),
	);
	const contentStyle = { maxHeight: Math.max(0, maxHeight - MENU_SEARCH_HEIGHT) };
	const onFooterItemHover = useCallback(
		() => onItemHover(footerItemIndex),
		[footerItemIndex, onItemHover],
	);
	const onFooterItemFocus = useCallback(
		() => onItemFocus(footerItemIndex),
		[footerItemIndex, onItemFocus],
	);
	const footer = model.footer ? (
		<Box
			testId="registered-insert-menu-footer"
			xcss={showFooterDivider ? styles.footerWithDivider : styles.footer}
			onFocus={onFooterItemFocus}
			onMouseMove={onFooterItemHover}
		>
			<RegisteredInsertMenuItem
				editorView={editorView}
				id={footerItemId}
				isOffline={isOffline}
				isSelected={footerItemIndex === selectedItemIndex}
				menuOpenId={menuOpenId}
				onClose={onClose}
				registration={model.footer}
				surfaceContext={surfaceContext}
			/>
		</Box>
	) : null;

	if (!model.root) {
		return null;
	}

	return (
		<Root>
			<RegisteredInsertMenuPreviewContext.Provider value={activePreviewItemKey}>
				<Box xcss={styles.content} style={contentStyle}>
					<Box xcss={styles.scrollable} onScroll={onScrollableContentScroll}>
						<Box
							aria-label={listLabel}
							aria-owns={model.footer ? footerItemId : undefined}
							id={listId}
							role="listbox"
						>
							{rows.length > 0 && (
								<List
									// eslint-disable-next-line react/jsx-props-no-spreading -- Omits the library's grid-only ARIA default without declaring it on the group role.
									{...listAriaProps}
									tabIndex={null}
									containerRole="presentation"
									height={Math.min(measuredHeight, listMaxHeight)}
									overscanRowCount={3}
									onRowsRendered={onRowsRendered}
									ref={setListRef}
									role="group"
									rowCount={rows.length}
									rowHeight={cache.rowHeight}
									rowRenderer={renderRow}
									scrollToAlignment="auto"
									scrollToIndex={selectedRowIndex}
									width={LIST_WIDTH}
								/>
							)}
						</Box>
						{hasNoSearchResults && <QuickInsertEmptyState mode="inline" spacing="compact" />}
						{externalControls && (
							<Box testId="registered-insert-menu-external-controls" xcss={styles.externalControls}>
								{externalControls}
							</Box>
						)}
					</Box>
					{footer}
				</Box>
			</RegisteredInsertMenuPreviewContext.Provider>
		</Root>
	);
};
