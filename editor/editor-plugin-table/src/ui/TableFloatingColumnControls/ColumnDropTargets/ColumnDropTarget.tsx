import React, { useEffect, useRef } from 'react';

import {
	attachClosestEdge,
	type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { getDragBehaviour } from '../../../pm-plugins/drag-and-drop/utils/getDragBehaviour';
import type { DraggableSourceData } from '../../../types';

interface Props {
	height?: number;
	index: number;
	localId?: string;
	marginTop?: number;
	width?: number;
}

export const ColumnDropTarget = ({
	index,
	localId,
	width,
	height,
	marginTop,
}: Props): React.JSX.Element => {
	const dropTargetRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!dropTargetRef.current) {
			return;
		}

		return dropTargetForElements({
			element: dropTargetRef.current,
			canDrop({ source, input }) {
				const data = source.data as DraggableSourceData;
				const behaviour = getDragBehaviour(input);

				// A move drop is limited too where it can go, however a clone can drop can go anywhere.
				const isDropValid =
					behaviour === 'move' ? data.indexes?.indexOf(index) === -1 : behaviour === 'clone';

				return (
					// Only draggables of row type can be dropped on this target
					data.type === 'table-column' &&
					// Only draggables which came from the same table can be dropped on this target
					data.localId === localId &&
					// Only draggables which DO NOT include this drop targets index can be dropped
					!!data.indexes?.length &&
					isDropValid
				);
			},
			getDropEffect: ({ input }) => (getDragBehaviour(input) === 'clone' ? 'copy' : 'move'),
			getIsSticky: () => true,
			getData({ source, input, element }) {
				const data = {
					localId,
					type: 'table-column',
					targetIndex: index,
				};
				const srcData = source.data as DraggableSourceData;
				const behaviour = getDragBehaviour(input);

				// During a move op there's no point in allowing edges to be dropped on which result in no change/move to occur.
				const allowedEdges: Edge[] =
					behaviour === 'move'
						? srcData.indexes?.reduce(
								(acc, v) => {
									if (v - index === -1) {
										acc.shift();
									}
									if (v - index === 1) {
										acc.pop();
									}
									return acc;
								},
								['left', 'right'],
							)
						: ['left', 'right'];

				return attachClosestEdge(data, {
					input,
					element,
					allowedEdges,
				});
			},
		});
	}, [index, localId]);

	return (
		<div
			ref={dropTargetRef}
			style={{
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
				width: width && `${width - 1}px`,
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
				height: height && `${height}px`,
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
				marginTop: marginTop && `${marginTop}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				pointerEvents: 'auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexShrink: 0,
			}}
			data-drop-target-index={index}
			data-drop-target-localid={localId}
			data-testid="table-floating-column-controls-drop-target"
		/>
	);
};
