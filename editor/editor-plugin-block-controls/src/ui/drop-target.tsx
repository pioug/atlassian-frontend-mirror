/** @jsx jsx */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../types';

const styleDropTarget = css({
	height: token('space.100', '8px'),
	marginTop: token('space.negative.100', '-8px'),
	position: 'relative',
});

export const DropTarget = ({
	api,
	index,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	index: number;
}) => {
	const ref = useRef(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	useEffect(() => {
		const element = ref.current;

		if (!element) {
			return;
		}

		const combined: CleanupFn[] = [];

		const scrollable = document.querySelector('.fabric-editor-popup-scroll-parent') as HTMLElement;

		if (scrollable) {
			combined.push(
				autoScrollForElements({
					element: scrollable,
				}),
			);
		}

		combined.push(
			dropTargetForElements({
				element,
				getIsSticky: () => true,
				onDrag: () => {
					scrollable.style.setProperty('scroll-behavior', 'unset');
				},
				onDragEnter: () => setIsDraggedOver(true),
				onDragLeave: () => setIsDraggedOver(false),
				onDrop: () => {
					scrollable.style.setProperty('scroll-behavior', null);

					const { activeNode, decorationState } =
						api?.blockControls?.sharedState.currentState() || {};
					if (!activeNode || !decorationState) {
						return;
					}
					const { pos } = decorationState.find((dec) => dec.index === index) || {};

					if (activeNode && pos !== undefined) {
						const { pos: start } = activeNode;
						api?.core?.actions.execute(api?.blockControls?.commands?.moveNode(start, pos));
					}
				},
			}),
		);

		return combine(...combined);
	}, [index, api]);

	return (
		// Note: Firefox has trouble with using a button element as the handle for drag and drop
		<div css={styleDropTarget} ref={ref} data-testid="block-ctrl-drop-target">
			{
				//4px gap to clear expand node border
				isDraggedOver && <DropIndicator edge="bottom" gap="4px" />
			}
		</div>
	);
};
