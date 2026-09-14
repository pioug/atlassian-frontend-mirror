import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { List } from 'react-virtualized/dist/commonjs/List';

import { typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import { Box, Text } from '@atlaskit/primitives/compiled';

import type { TypeAheadMenuModel } from './buildTypeAheadMenuModel';
import { createTypeAheadRowRenderer } from './createTypeAheadRowRenderer';
import { getTypeAheadGlobalViewMoreId } from './getTypeAheadGlobalViewMoreId';
import { PassThrough } from './PassThrough';
import { TypeAheadMenuFooter } from './TypeAheadMenuFooter';
import type { TypeAheadItemComponent } from './typeAheadMenuTypes';

const LIST_WIDTH = 340;
const ESTIMATED_ROW_HEIGHT = 56;
const MENU_FOOTER_HEIGHT = 48;

type Props = {
	Item: TypeAheadItemComponent;
	listId: string;
	listLabel: MessageDescriptor;
	maxHeight: number;
	model: TypeAheadMenuModel;
	onItemHover: (itemIndex: number) => void;
	selectedItemIndex: number;
};

export const TypeAheadMenuRenderer = ({
	Item,
	listLabel,
	listId,
	maxHeight,
	model,
	onItemHover,
	selectedItemIndex,
}: Props): React.JSX.Element | null => {
	const intl = useIntl();
	const listRef = useRef<List | null>(null);
	const rows = useMemo(() => model.sections.flat(), [model.sections]);
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
		itemIndexByRowIndex,
		Item,
		listId,
		onItemHover,
		rows,
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
	const listMaxHeight = Math.max(0, maxHeight - (model.footer ? MENU_FOOTER_HEIGHT : 0));

	return (
		<RootComponent>
			<Box aria-label={intl.formatMessage(listLabel)} id={listId} role="listbox">
				{rows.length === 0 ? (
					<Box paddingBlock="space.150" paddingInline="space.250">
						<Text align="center" as="p">
							{intl.formatMessage(typeAheadListMessages.emptySearchResults)}
						</Text>
					</Box>
				) : (
					<List
						containerRole="presentation"
						height={Math.min(rows.length * ESTIMATED_ROW_HEIGHT, listMaxHeight)}
						overscanRowCount={3}
						ref={listRef}
						role="presentation"
						rowCount={rows.length}
						rowHeight={cache.rowHeight}
						rowRenderer={renderRow}
						scrollToAlignment="auto"
						width={LIST_WIDTH}
					/>
				)}
				{model.footer && (
					<TypeAheadMenuFooter
						id={getTypeAheadGlobalViewMoreId(listId)}
						isSelected={selectedItemIndex === footerItemIndex}
						Item={Item}
						onMouseMove={onFooterItemHover}
						registration={model.footer}
					/>
				)}
			</Box>
		</RootComponent>
	);
};
