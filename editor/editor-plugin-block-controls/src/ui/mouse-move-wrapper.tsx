/** @jsx jsx */
import { useCallback, useLayoutEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';

import type { BlockControlsPlugin } from '../types';
import { getTopPosition } from '../utils/drag-handle-positions';

const basicStyles = css({
	position: 'absolute',
	width: '100%',
	left: '0',
	display: 'block',
	zIndex: -1,
});

const mouseMoveWrapperStyles = css({
	zIndex: 1,
});

export const MouseMoveWrapper = ({
	view,
	api,
	anchorName,
	nodeType,
	getPos,
}: {
	view: EditorView;
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	anchorName: string;
	nodeType: string;
	getPos: () => number | undefined;
}) => {
	const { blockControlsState } = useSharedPluginState(api, ['blockControls']);

	const activeNode = blockControlsState?.activeNode;
	const isDragging = blockControlsState?.isDragging;
	const [hideWrapper, setHideWrapper] = useState(false);
	const [pos, setPos] = useState<{ top: string; height: string }>();

	const onMouseEnter = useCallback(() => {
		const pos = getPos();
		if (pos === undefined) {
			return;
		}

		if (api && api.blockControls && activeNode?.pos !== pos && !isDragging) {
			api?.core?.actions.execute(
				api.blockControls.commands.showDragHandleAt(pos, anchorName, nodeType),
			);
		}
	}, [getPos, api, anchorName, isDragging, activeNode?.pos, nodeType]);

	useLayoutEffect(() => {
		if (!activeNode) {
			return;
		}
		const pos = getPos();
		if (activeNode.pos !== pos && !isDragging) {
			setHideWrapper(false);
			return;
		}
		setHideWrapper(true);
	}, [activeNode, isDragging, getPos]);

	useLayoutEffect(() => {
		const supportsAnchor =
			CSS.supports('height', `anchor-size(${anchorName} height)`) &&
			CSS.supports('top', `anchor(${anchorName} start)`);

		if (supportsAnchor) {
			setPos({
				height: `anchor-size(${anchorName} height)`,
				top: `anchor(${anchorName} start)`,
			});
			return;
		}

		const calcPos = requestAnimationFrame(() => {
			const dom: HTMLElement | null = view.dom.querySelector(
				`[data-drag-handler-anchor-name="${anchorName}"]`,
			);

			if (!dom) {
				return;
			}

			setPos({
				height: `${dom.offsetHeight}px`,
				top: getTopPosition(dom),
			});
		});

		return () => cancelAnimationFrame(calcPos);
	}, [view, anchorName]);

	return (
		<div
			onMouseEnter={onMouseEnter}
			css={[basicStyles, !hideWrapper && mouseMoveWrapperStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={pos}
		></div>
	);
};
