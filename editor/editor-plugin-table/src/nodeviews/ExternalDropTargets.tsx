import React, { useEffect, useState } from 'react';

import { tableMarginTop } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { DraggableSourceData } from '../types';
import { dropTargetExtendedWidth, dropTargetsZIndex } from '../ui/consts';
import { ColumnDropTarget } from '../ui/TableFloatingColumnControls/ColumnDropTargets/ColumnDropTarget';
import { getColumnsWidths } from '../utils';

export const ExternalDropTargets = ({
	editorView,
	node,
	getScrollOffset,
	getTableWrapperWidth,
}: {
	editorView: EditorView;
	node?: PMNode;
	getScrollOffset: () => number;
	getTableWrapperWidth: () => number;
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const currentNodeLocalId = node?.attrs.localId;

	useEffect(() => {
		return monitorForElements({
			canMonitor({ source }) {
				const { type, indexes, localId } = source.data as Partial<DraggableSourceData>;
				return type === 'table-column' && !!indexes?.length && localId === currentNodeLocalId;
			},
			onDragStart() {
				setIsDragging(true);
			},
			onDrop() {
				setIsDragging(false);
			},
		});
	}, [currentNodeLocalId, editorView]);

	if (!isDragging) {
		return null;
	}

	const colWidths = getColumnsWidths(editorView);

	return (
		<div
			style={{
				width: getTableWrapperWidth(),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				overflow: 'hidden',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				position: 'absolute',
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
				top: `-${dropTargetExtendedWidth - tableMarginTop}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				pointerEvents: 'auto',
				zIndex: `${dropTargetsZIndex}`,
			}}
			data-testid="table-floating-column-extended-drop-targets"
		>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// move drop targets based on table wrapper scroll
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
					marginLeft: `-${getScrollOffset()}px`,
				}}
			>
				{colWidths?.map((width, index) => {
					return (
						<ColumnDropTarget
							key={index}
							index={index}
							localId={currentNodeLocalId}
							width={width}
							height={dropTargetExtendedWidth}
							marginTop={0}
						/>
					);
				})}
			</div>
		</div>
	);
};
