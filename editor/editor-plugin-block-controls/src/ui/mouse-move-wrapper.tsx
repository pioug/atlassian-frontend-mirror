/** @jsx jsx */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';

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
	const [isDragging, setIsDragging] = useState(false);
	const [hideWrapper, setHideWrapper] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const [pos, setPos] = useState<{ top: string; height: string }>();

	useEffect(() => {
		// Adding this event listener to fix issue where wrapper isn't hidden if user navigates to node before page finishes loading
		// This will be removed when we refactor to remove this component
		let unbind: () => void;
		if (ref.current) {
			unbind = bind(ref.current, {
				type: 'mousemove',
				listener: () => {
					setHideWrapper(true);
					unbind();
				},
			});
		}
		return () => unbind?.();
	}, []);

	const onMouseEnter = useCallback(() => {
		if (!isDragging) {
			setHideWrapper(true);
		}
		const pos = getPos();
		if (pos === undefined) {
			return;
		}

		if (api && api.blockControls && !isDragging) {
			api?.core?.actions.execute(
				api.blockControls.commands.showDragHandleAt(pos, anchorName, nodeType),
			);
		}
	}, [setHideWrapper, getPos, isDragging, api, anchorName, nodeType]);

	useEffect(() => {
		setIsDragging(Boolean(blockControlsState?.isDragging));
		const pos = getPos();

		if (!blockControlsState?.activeNode) {
			return;
		}

		if (blockControlsState?.activeNode?.pos !== pos && !blockControlsState?.isDragging) {
			setHideWrapper(false);
			return;
		}

		if (blockControlsState?.isDragging) {
			setHideWrapper(true);
			return;
		}
	}, [getPos, blockControlsState]);

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
			ref={ref}
			onMouseEnter={onMouseEnter}
			css={[basicStyles, !hideWrapper && mouseMoveWrapperStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={pos}
		></div>
	);
};
