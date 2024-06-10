/** @jsx jsx */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

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
	height: DRAG_HANDLE_HEIGHT,
	width: DRAG_HANDLE_WIDTH,
	border: 'none',
	background: 'transparent',
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
	const handleClick = useCallback(() => {
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

	useEffect(() => {
		const element = buttonRef.current;
		if (!element) {
			return;
		}

		return draggable({
			element,
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				setCustomNativeDragPreview({
					render: ({ container }) => {
						const dom: HTMLElement | null = view.dom.querySelector(
							`[data-drag-handler-anchor-name="${anchorName}"]`,
						);
						if (!dom) {
							return;
						}
						return dragPreview(container, dom);
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

	const positionStyles = useMemo(() => {
		const supportsAnchor =
			CSS.supports('top', `anchor(${anchorName} start)`) &&
			CSS.supports('left', `anchor(${anchorName} start)`);
		const dom: HTMLElement | null = view.dom.querySelector(
			`[data-drag-handler-anchor-name="${anchorName}"]`,
		);
		if (supportsAnchor) {
			const hasResizer =
				(anchorName.includes('table') || anchorName.includes('mediaSingle')) && dom;
			return {
				left: hasResizer
					? getLeftPosition(dom, nodeType)
					: `calc(anchor(${anchorName} start) - ${DRAG_HANDLE_WIDTH}px - ${dragHandleGap(nodeType)}px)`,
				top: anchorName.includes('table')
					? `calc(anchor(${anchorName} start) + ${DRAG_HANDLE_HEIGHT}px)`
					: `anchor(${anchorName} start)`,
			};
		}
		if (!dom) {
			return;
		}

		return {
			left: getLeftPosition(dom, nodeType),
			top: getTopPosition(dom),
		};
	}, [anchorName, view, nodeType]);

	return (
		<button
			type="button"
			css={[dragHandleButtonStyles, dragHandleSelected && selectedStyles]}
			ref={buttonRef}
			style={positionStyles}
			onClick={handleClick}
			data-testid="block-ctrl-drag-handle"
		>
			<DragHandlerIcon label="" size="medium" />
		</button>
	);
};
