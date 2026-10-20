import React from 'react';

import { CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer';
import type { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import type { ListRowRenderer } from 'react-virtualized/dist/commonjs/List';

import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled/box';

import { ListRow } from '../ListRow';
import { TypeAheadItemRow } from './TypeAheadItemRow';
import type { TypeAheadItemComponent } from './typeAheadMenuTypes';
import { TypeAheadSectionRow } from './TypeAheadSectionRow';

const noOp = () => {};

export const createTypeAheadRowRenderer =
	({
		cache,
		hasScrollPadding = false,
		onMeasured,
		itemIndexByRowIndex,
		Item,
		listId,
		onItemHover,
		onItemLeave,
		onItemVisibilityChange,
		rows,
		selectedItemIndex,
	}: {
		cache: CellMeasurerCache;
		hasScrollPadding?: boolean;
		Item: TypeAheadItemComponent;
		itemIndexByRowIndex: Map<number, number>;
		listId: string;
		onItemHover: (itemIndex: number, itemKey: string) => void;
		onItemLeave: (itemKey: string) => void;
		onItemVisibilityChange: (itemKey: string, isVisible: boolean) => void;
		onMeasured: () => void;
		rows: Array<RegisterMenuItem | RegisterMenuSection>;
		selectedItemIndex: number;
	}): ListRowRenderer =>
	({ index, key, parent, style, isScrolling, isVisible }) => {
		const registration = rows[index];

		if (!registration) {
			return null;
		}

		const itemIndex = itemIndexByRowIndex.get(index);
		const rowContent =
			registration.type === 'menu-section' ? (
				<TypeAheadSectionRow registration={registration} />
			) : (
				<TypeAheadItemRow
					Item={Item}
					isSelected={itemIndex === selectedItemIndex}
					itemIndex={itemIndex ?? 0}
					listId={listId}
					onItemHover={onItemHover}
					onItemLeave={onItemLeave}
					onItemVisibilityChange={onItemVisibilityChange}
					isVisible={isVisible}
					registration={registration}
					rowIndex={index}
				/>
			);

		return (
			<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
				{({ measure }) => (
					<ListRow
						index={index}
						isScrolling={isScrolling}
						isVisible={isVisible}
						measure={measure}
						onMeasured={onMeasured}
						onMouseMove={noOp}
						style={style}
					>
						{hasScrollPadding ? (
							<Box
								paddingBlockStart={index === 0 ? 'space.100' : undefined}
								paddingBlockEnd={index === rows.length - 1 ? 'space.100' : undefined}
							>
								{rowContent}
							</Box>
						) : (
							rowContent
						)}
					</ListRow>
				)}
			</CellMeasurer>
		);
	};
