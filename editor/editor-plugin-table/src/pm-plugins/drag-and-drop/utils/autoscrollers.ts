import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';

import type { DraggableSourceData } from '../../../types';
import { dropTargetExtendedWidth } from '../../../ui/consts';

type AutoScrollerFactory = {
	tableWrapper: HTMLElement;
	getNode: () => PmNode;
};

export const autoScrollerFactory = ({ tableWrapper, getNode }: AutoScrollerFactory) => {
	return [
		autoScrollForElements({
			element: tableWrapper,
			canScroll: ({ source }) => {
				const { localId, type } = source.data as Partial<DraggableSourceData>;
				const node = getNode();
				return localId === node?.attrs.localId && type === 'table-column';
			},
		}),
		unsafeOverflowAutoScrollForElements({
			element: tableWrapper,
			canScroll: ({ source }) => {
				const { localId, type } = source.data as Partial<DraggableSourceData>;
				const node = getNode();
				return localId === node?.attrs.localId && type === 'table-column';
			},
			getOverflow: () => ({
				forTopEdge: {
					top: dropTargetExtendedWidth,
					right: dropTargetExtendedWidth,
					left: dropTargetExtendedWidth,
				},
				forRightEdge: {
					right: dropTargetExtendedWidth,
					top: dropTargetExtendedWidth,
					bottom: dropTargetExtendedWidth,
				},
				forLeftEdge: {
					top: dropTargetExtendedWidth,
					left: dropTargetExtendedWidth,
					bottom: dropTargetExtendedWidth,
				},
			}),
		}),
	];
};
