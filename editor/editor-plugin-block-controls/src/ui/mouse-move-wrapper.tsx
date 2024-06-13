/** @jsx jsx */
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

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
	const nodePos = useMemo(() => getPos(), [getPos]);
	const { blockControlsState } = useSharedPluginState(api, ['blockControls']);
	const [isDragging, setIsDragging] = useState(false);
	const [hideWrapper, setHideWrapper] = useState(blockControlsState?.activeNode?.pos === nodePos);
	const [pos, setPos] = useState<{ top: string; height: string }>();

	const onMouseEnter = useCallback(() => {
		if (!isDragging) {
			setHideWrapper(true);
		}

		if (nodePos === undefined) {
			return;
		}

		if (api && api.blockControls && !isDragging) {
			api?.core?.actions.execute(
				api.blockControls.commands.showDragHandleAt(nodePos, anchorName, nodeType),
			);
		}
	}, [setHideWrapper, isDragging, api, nodePos, anchorName, nodeType]);

	useEffect(() => {
		const unbind = api?.blockControls?.sharedState.onChange(({ nextSharedState }) => {
			setIsDragging(Boolean(nextSharedState?.isDragging));

			if (!nextSharedState?.activeNode) {
				return;
			}

			if (nextSharedState?.activeNode?.pos !== nodePos && !nextSharedState?.isDragging) {
				setHideWrapper(false);
				return;
			}

			if (nextSharedState?.isDragging) {
				setHideWrapper(true);
				return;
			}
		});
		return () => {
			unbind?.();
		};
	}, [nodePos, api]);

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
