import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { List } from 'react-virtualized/dist/commonjs/List';

import { QuickInsertEmptyState } from '@atlaskit/editor-common/quick-insert/empty-state';
import { getQuickInsertMenuRows } from '@atlaskit/editor-common/quick-insert/registered-menu-model';
import { useMenuListHeight } from '@atlaskit/editor-common/quick-insert/use-menu-list-height';
import { typeAheadListMessages } from '@atlaskit/editor-common/type-ahead/messages';
import { Box, Text } from '@atlaskit/primitives/compiled';

import type { TypeAheadMenuModel } from './buildTypeAheadMenuModel';
import { createTypeAheadRowRenderer } from './createTypeAheadRowRenderer';
import { getTypeAheadGlobalViewMoreId } from './getTypeAheadGlobalViewMoreId';
import { PassThrough } from './PassThrough';
import { TypeAheadMenuFooter } from './TypeAheadMenuFooter';
import type { TypeAheadItemComponent } from './typeAheadMenuTypes';

const LIST_WIDTH = 320;
const ESTIMATED_ROW_HEIGHT = 44;
// 44px item + 1px separator.
const MENU_FOOTER_HEIGHT = 45;
const MENU_FOOTER_HEIGHT_WITH_SCROLL_PADDING = 51;

type Props = {
	hasScrollPadding?: boolean;
	Item: TypeAheadItemComponent;
	listId: string;
	listLabel: MessageDescriptor;
	maxHeight: number;
	model: TypeAheadMenuModel;
	onItemHover: (itemIndex: number, itemKey?: string) => void;
	onItemLeave: (itemKey: string) => void;
	onItemVisibilityChange: (itemKey: string, isVisible: boolean) => void;
	query?: string;
	selectedItemIndex: number;
};

export const TypeAheadMenuRenderer = ({
	Item,
	listLabel,
	listId,
	maxHeight,
	model,
	query = '',
	hasScrollPadding = false,
	onItemHover,
	onItemLeave,
	onItemVisibilityChange,
	selectedItemIndex,
}: Props): React.JSX.Element | null => {
	const intl = useIntl();
	const listRef = useRef<List | null>(null);
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

	useLayoutEffect(() => {
		if (selectedRowIndex >= 0) {
			listRef.current?.scrollToRow(selectedRowIndex);
		}
	}, [selectedRowIndex]);

	const renderRow = createTypeAheadRowRenderer({
		cache,
		onMeasured: updateHeight,
		itemIndexByRowIndex,
		Item,
		listId,
		onItemHover,
		onItemLeave,
		onItemVisibilityChange,
		rows,
		hasScrollPadding,
		selectedItemIndex,
	});
	const footerItemIndex = itemIndexByRowIndex.size;
	const onFooterItemHover = useCallback(
		() => onItemHover(footerItemIndex),
		[footerItemIndex, onItemHover],
	);

	if (!model.root) {
		return null;
	}

	const RootComponent = model.root.component ?? PassThrough;
	const listMaxHeight = Math.max(
		0,
		maxHeight -
			(model.footer
				? hasScrollPadding
					? MENU_FOOTER_HEIGHT_WITH_SCROLL_PADDING
					: MENU_FOOTER_HEIGHT
				: 0),
	);
	const hasListboxContent = rows.length > 0 || model.footer !== undefined;

	return (
		<RootComponent>
			<Box
				aria-label={hasListboxContent ? intl.formatMessage(listLabel) : undefined}
				id={listId}
				role={hasListboxContent ? 'listbox' : undefined}
			>
				{rows.length > 0 ? (
					<List
						containerRole="presentation"
						height={Math.min(measuredHeight, listMaxHeight)}
						onRowsRendered={updateHeight}
						overscanRowCount={3}
						ref={listRef}
						role="presentation"
						rowCount={rows.length}
						rowHeight={cache.rowHeight}
						rowRenderer={renderRow}
						scrollToAlignment="auto"
						width={LIST_WIDTH}
					/>
				) : query !== '' && model.fallbackItems?.length === 0 ? (
					<QuickInsertEmptyState mode="inline" spacing="spacious" />
				) : model.fallbackItems === undefined ? (
					<Box paddingBlock="space.150" paddingInline="space.250" role="group">
						<Text align="center" as="p">
							{intl.formatMessage(typeAheadListMessages.emptySearchResults)}
						</Text>
					</Box>
				) : null}
				{model.footer && (
					<TypeAheadMenuFooter
						id={getTypeAheadGlobalViewMoreId(listId)}
						isSelected={selectedItemIndex === footerItemIndex}
						Item={Item}
						onMouseMove={onFooterItemHover}
						registration={model.footer}
						hasScrollPadding={hasScrollPadding}
					/>
				)}
			</Box>
		</RootComponent>
	);
};
