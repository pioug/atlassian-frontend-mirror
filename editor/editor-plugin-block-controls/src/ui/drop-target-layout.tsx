/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';
import { type IntlShape } from 'react-intl-next';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { B75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../types';
import { isBlocksDragTargetDebug } from '../utils/drag-target-debug';

// 8px gap + 16px on left and right
const DROP_TARGET_LAYOUT_DROP_ZONE_WIDTH = 40;

export type DropTargetLayoutProps = {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	getPos: () => number | undefined;
	formatMessage?: IntlShape['formatMessage'];
};

const dropTargetLayoutStyle = css({
	height: '100%',
	width: `${DROP_TARGET_LAYOUT_DROP_ZONE_WIDTH}px`,
	transform: 'translateX(-50%)',
	zIndex: 120,
	position: 'relative',
	display: 'flex',
	justifyContent: 'center',
});

const dropTargetLayoutHintStyle = css({
	height: '100%',
	position: 'relative',
	borderRight: `1px dashed ${token('color.background.selected.hovered', B75)}`,
	width: 0,
});

export const DropTargetLayout = (props: DropTargetLayoutProps) => {
	const { api, getPos } = props;

	const ref = useRef<HTMLDivElement | null>(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	const onDrop = useCallback(() => {
		const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
		if (!activeNode) {
			return;
		}

		const to = getPos();
		if (to !== undefined) {
			const { pos: from } = activeNode;
			api?.core?.actions.execute(api?.blockControls?.commands?.moveToLayout(from, to));
		}
	}, [api, getPos]);

	useEffect(() => {
		if (ref.current) {
			return dropTargetForElements({
				element: ref.current,
				onDragEnter: () => {
					setIsDraggedOver(true);
				},
				onDragLeave: () => {
					setIsDraggedOver(false);
				},
				onDrop,
			});
		}
	}, [onDrop]);

	return (
		<div ref={ref} css={dropTargetLayoutStyle} data-testid="block-ctrl-drop-indicator">
			{isDraggedOver || isBlocksDragTargetDebug() ? (
				<DropIndicator edge="right" gap={`-${DROP_TARGET_LAYOUT_DROP_ZONE_WIDTH}px`} />
			) : (
				<div css={dropTargetLayoutHintStyle}></div>
			)}
		</div>
	);
};
