/** @jsx jsx */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { key } from '../pm-plugins/main';
import type { BlockControlsPlugin } from '../types';
import { selectNode } from '../utils';
import { getLeftPosition, getTopPosition } from '../utils/drag-handle-positions';

import {
	DRAG_HANDLE_BORDER_RADIUS,
	DRAG_HANDLE_HEIGHT,
	DRAG_HANDLE_WIDTH,
	dragHandleGap,
} from './consts';
import { dragPreview } from './drag-preview';

const dragHandleButtonStyles = css({
	position: 'absolute',
	padding: `${token('space.025', '2px')} 0`,
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: DRAG_HANDLE_HEIGHT,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: DRAG_HANDLE_WIDTH,
	border: 'none',
	background: 'transparent',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: DRAG_HANDLE_BORDER_RADIUS,
	color: token('color.icon', '#44546F'),
	cursor: 'grab',
	zIndex: 2,

	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', '#091E420F'),
	},

	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed', '#091E4224'),
	},
});

const selectedStyles = css({
	backgroundColor: token('color.background.selected', '#E9F2FF'),
	color: token('color.icon.selected', '#0C66E4'),
});

export const DragHandle = ({
	view,
	api,
	getPos,
	anchorName,
	nodeType,
}: {
	view: EditorView;
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	getPos: () => number | undefined;
	anchorName: string;
	nodeType: string;
}) => {
	const start = getPos();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const [dragHandleSelected, setDragHandleSelected] = useState(false);
	const { featureFlagsState } = useSharedPluginState(api, ['featureFlags']);

	const handleOnClick = useCallback(() => {
		setDragHandleSelected(!dragHandleSelected);
		api?.core?.actions.execute(({ tr }) => {
			if (start === undefined) {
				return tr;
			}

			tr = selectNode(tr, start, nodeType);
			tr.setMeta(key, { pos: start });
			return tr;
		});

		api?.core?.actions.focus();
	}, [start, api, dragHandleSelected, setDragHandleSelected, nodeType]);

	// handleMouseDown required along with onClick to ensure the correct selection
	// is set immediately when the drag handle is clicked. Otherwise browser native
	// drag and drop can take over and cause unpredictable behaviour.
	const handleMouseDown = useCallback(() => {
		api?.core?.actions.execute(({ tr }) => {
			if (start === undefined) {
				return tr;
			}

			tr = selectNode(tr, start, nodeType);
			tr.setMeta(key, { pos: start });
			return tr;
		});
		api?.core?.actions.focus();
	}, [start, api, nodeType]);

	useEffect(() => {
		const element = buttonRef.current;
		if (!element) {
			return;
		}

		return draggable({
			element,
			getInitialData: () => ({
				type: 'element',
				start,
			}),
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				setCustomNativeDragPreview({
					render: ({ container }) => {
						const dom: HTMLElement | null = view.dom.querySelector(
							`[data-drag-handler-anchor-name="${anchorName}"]`,
						);
						if (!dom) {
							return;
						}
						return dragPreview(container, dom, nodeType);
					},
					nativeSetDragImage,
				});
			},
			onDragStart() {
				if (start === undefined) {
					return;
				}
				api?.core?.actions.execute(
					api?.blockControls?.commands.setNodeDragged(start, anchorName, nodeType),
				);
				api?.core?.actions.focus();
			},
			onDrop() {
				api?.core?.actions.execute(({ tr }) => {
					return tr.setMeta(key, { isDragging: false });
				});
			},
		});
	}, [api, start, view, anchorName, nodeType]);

	const macroInteractionUpdates = featureFlagsState?.macroInteractionUpdates;
	const positionStyles = useMemo(() => {
		const supportsAnchor =
			CSS.supports('top', `anchor(${anchorName} start)`) &&
			CSS.supports('left', `anchor(${anchorName} start)`);
		const dom: HTMLElement | null = view.dom.querySelector(
			`[data-drag-handler-anchor-name="${anchorName}"]`,
		);

		if (!dom) {
			return;
		}
		const hasResizer = anchorName.includes('table') || anchorName.includes('mediaSingle');
		const isExtension = anchorName.includes('extension') || anchorName.includes('bodiedExtension');

		const innerContainer: HTMLElement | null = hasResizer
			? dom.querySelector('.resizer-item')
			: isExtension
				? dom.querySelector('.extension-container[data-layout]')
				: null;

		if (supportsAnchor) {
			return {
				left:
					hasResizer || isExtension
						? getLeftPosition(dom, nodeType, innerContainer, macroInteractionUpdates)
						: `calc(anchor(${anchorName} start) - ${DRAG_HANDLE_WIDTH}px - ${dragHandleGap(nodeType)}px)`,
				top: anchorName.includes('table')
					? `calc(anchor(${anchorName} start) + ${DRAG_HANDLE_HEIGHT}px)`
					: `anchor(${anchorName} start)`,
			};
		}
		return {
			left: getLeftPosition(dom, nodeType, innerContainer, macroInteractionUpdates),
			top: getTopPosition(dom),
		};
	}, [anchorName, view, nodeType, macroInteractionUpdates]);

	return (
		<button
			type="button"
			css={[dragHandleButtonStyles, dragHandleSelected && selectedStyles]}
			ref={buttonRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={positionStyles}
			onClick={handleOnClick}
			onMouseDown={handleMouseDown}
			data-testid="block-ctrl-drag-handle"
		>
			<DragHandlerIcon label="" size="medium" />
		</button>
	);
};
