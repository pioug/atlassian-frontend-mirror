import React from 'react';

import { CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer';
import type { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import type { ListRowRenderer } from 'react-virtualized/dist/commonjs/List';

import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';

import { ListRow } from '../ListRow';

import { TypeAheadItemRow } from './TypeAheadItemRow';
import type { TypeAheadItemComponent } from './typeAheadMenuTypes';
import { TypeAheadSectionRow } from './TypeAheadSectionRow';

const noOp = () => {};

export const createTypeAheadRowRenderer =
	({
		cache,
		itemIndexByRowIndex,
		Item,
		listId,
		onItemHover,
		rows,
		selectedItemIndex,
	}: {
		cache: CellMeasurerCache;
		Item: TypeAheadItemComponent;
		itemIndexByRowIndex: Map<number, number>;
		listId: string;
		onItemHover: (itemIndex: number) => void;
		rows: Array<RegisterMenuItem | RegisterMenuSection>;
		selectedItemIndex: number;
	}): ListRowRenderer =>
	({ index, key, parent, style, isScrolling, isVisible }) => {
		const registration = rows[index];

		if (!registration) {
			return null;
		}

		const itemIndex = itemIndexByRowIndex.get(index);

		return (
			<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
				{({ measure }) => (
					<ListRow
						index={index}
						isScrolling={isScrolling}
						isVisible={isVisible}
						measure={measure}
						onMouseMove={noOp}
						style={style}
					>
						{registration.type === 'menu-section' ? (
							<TypeAheadSectionRow registration={registration} />
						) : (
							<TypeAheadItemRow
								Item={Item}
								isSelected={itemIndex === selectedItemIndex}
								itemIndex={itemIndex ?? 0}
								listId={listId}
								onItemHover={onItemHover}
								registration={registration}
								rowIndex={index}
							/>
						)}
					</ListRow>
				)}
			</CellMeasurer>
		);
	};
