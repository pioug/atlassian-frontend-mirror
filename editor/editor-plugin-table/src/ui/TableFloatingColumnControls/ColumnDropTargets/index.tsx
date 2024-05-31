import React, { useRef } from 'react';

import { TableCssClassName as ClassName } from '../../../types';

import { ColumnDropTarget } from './ColumnDropTarget';

export interface Props {
	tableRef: HTMLTableElement;
	tableHeight?: number;
	localId?: string;
	colWidths?: (number | undefined)[];
	isHeaderSticky?: boolean;
	getScrollOffset?: () => number;
}

export const ColumnDropTargets = ({
	tableRef,
	tableHeight,
	localId,
	colWidths,
	isHeaderSticky,
	getScrollOffset,
}: Props) => {
	const dropTargetRef = useRef<HTMLDivElement>(null);

	if (!tableRef) {
		return null;
	}

	if (isHeaderSticky && dropTargetRef.current) {
		dropTargetRef.current.style.marginLeft = `-${getScrollOffset?.() ?? 0}px`;
	}

	return (
		<div
			ref={dropTargetRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={ClassName.DRAG_COLUMN_DROP_TARGET_CONTROLS}
			contentEditable={false}
		>
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={ClassName.DRAG_COLUMN_CONTROLS_INNER}
				data-testid="table-floating-column-controls-drop-targets"
			>
				{colWidths?.map((width, index) => {
					return (
						<ColumnDropTarget
							key={index}
							index={index}
							localId={localId}
							width={width}
							height={tableHeight}
							marginTop={0}
						/>
					);
				})}
			</div>
		</div>
	);
};
