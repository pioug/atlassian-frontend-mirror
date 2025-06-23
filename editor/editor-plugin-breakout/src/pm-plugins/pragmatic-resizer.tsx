import React, { useLayoutEffect, useState } from 'react';

import { bind } from 'bind-event-listener';
import type { IntlShape, MessageDescriptor } from 'react-intl-next';
import uuid from 'uuid/v4';

import { breakoutMessages as messages } from '@atlaskit/editor-common/messages';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { fg } from '@atlaskit/platform-feature-flags';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import type { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/types';
import Tooltip from '@atlaskit/tooltip';

const getNodeName = (nodeName?: string) => {
	if (nodeName === 'layoutSection') {
		return 'layout';
	} else if (nodeName === 'codeBlock' || nodeName === 'expand') {
		return nodeName;
	} else {
		return 'node';
	}
};

export const resizeHandleMessage: Record<string, MessageDescriptor> = {
	expand: messages.resizeExpand,
	codeBlock: messages.resizeCodeBlock,
	layout: messages.resizeLayout,
	node: messages.resizeElement,
};

type Props = {
	rail: HTMLElement;
	target: HTMLElement;
	intl: IntlShape;
};
const RailWithTooltip = ({ rail, target, intl }: Props) => {
	const [nodeName, setNodeName] = useState('node');

	useLayoutEffect(() => {
		const node = target.querySelector<HTMLElement>('[data-prosemirror-node-name]');
		const name = getNodeName(node?.dataset.prosemirrorNodeName);
		setNodeName(name);
	}, [target]);

	return (
		<Tooltip content={intl.formatMessage(resizeHandleMessage[nodeName])} position="mouse">
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="pm-breakout-resize-handle-rail-inside-tooltip"
				ref={(el) => {
					if (el && rail.parentNode !== el) {
						el.appendChild(rail);
					}
				}}
			/>
		</Tooltip>
	);
};

export const createPragmaticResizer = ({
	target,
	onDragStart,
	onDrag,
	onDrop,
	intl,
	nodeViewPortalProviderAPI,
}: {
	target: HTMLElement;
	onDragStart: (args: BaseEventPayload<ElementDragType>) => void;
	onDrag: (args: BaseEventPayload<ElementDragType>) => void;
	onDrop: (args: BaseEventPayload<ElementDragType>) => void;
	intl: IntlShape;
	nodeViewPortalProviderAPI: PortalProviderAPI;
}) => {
	let state: 'default' | 'resizing' = 'default';

	const createHandle = (side: 'left' | 'right') => {
		const handle = document.createElement('div');
		handle.contentEditable = 'false';
		handle.classList.add('pm-breakout-resize-handle-container');

		if (fg('platform_editor_breakout_resizing_width_changes')) {
			handle.style.gridColumn = side === 'left' ? '1' : '3';
		}

		const rail = document.createElement('div');
		rail.classList.add('pm-breakout-resize-handle-rail');

		if (side === 'left') {
			handle.classList.add('pm-breakout-resize-handle-container--left');
			handle.setAttribute('data-testid', 'pragmatic-resizer-handle-left');
		} else {
			handle.classList.add('pm-breakout-resize-handle-container--right');
			handle.setAttribute('data-testid', 'pragmatic-resizer-handle-right');
		}

		const handleHitBox = document.createElement('div');
		handleHitBox.classList.add('pm-breakout-resize-handle-hit-box');

		const thumb = document.createElement('div');
		thumb.classList.add('pm-breakout-resize-handle-thumb');

		rail.appendChild(thumb);

		if (fg('platform_editor_breakout_resizing_hello_release')) {
			const tooltipContainer = document.createElement('div');
			tooltipContainer.classList.add('pm-breakout-resize-handle-rail-wrapper');
			handle.appendChild(tooltipContainer);
			handle.appendChild(handleHitBox);

			const key = uuid();

			nodeViewPortalProviderAPI.render(
				() => <RailWithTooltip rail={rail} target={target} intl={intl} />,
				tooltipContainer,
				key,
			);

			return {
				handle,
				rail,
				handleHitBox,
				destroyTooltip: () => nodeViewPortalProviderAPI.remove(key),
			};
		} else {
			handle.appendChild(rail);
			handle.appendChild(handleHitBox);
			return { handle, rail, handleHitBox, destroyTooltip: () => {} };
		}
	};

	const rightHandle = createHandle('right');
	const leftHandle = createHandle('left');

	const registerHandle = (handleElement: HTMLElement, handleSide: 'left' | 'right') => {
		return draggable({
			element: handleElement,
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				disableNativeDragPreview({ nativeSetDragImage });
				preventUnhandled.start();
			},
			getInitialData: () => ({ handleSide }),
			onDragStart(args) {
				state = 'resizing';
				handleElement.classList.add('pm-breakout-resize-handle-container--active');

				onDragStart(args);
			},
			onDrag,
			onDrop(args) {
				preventUnhandled.stop();

				state = 'default';
				handleElement.classList.remove('pm-breakout-resize-handle-container--active');

				onDrop(args);
			},
		});
	};

	const registerEvents = (element: HTMLElement) => {
		return [
			bind(element, {
				type: 'mouseenter',
				listener: () => {
					rightHandle.rail.style.setProperty('opacity', '1');
					leftHandle.rail.style.setProperty('opacity', '1');
				},
			}),
			bind(element, {
				type: 'mouseleave',
				listener: () => {
					if (state === 'resizing') {
						return;
					}
					rightHandle.rail.style.removeProperty('opacity');
					leftHandle.rail.style.removeProperty('opacity');
				},
			}),
		];
	};

	const unbindFns = [
		...registerEvents(target),
		...registerEvents(rightHandle.handleHitBox),
		...registerEvents(leftHandle.handleHitBox),
		...registerEvents(rightHandle.rail),
		...registerEvents(leftHandle.rail),
	];

	const destroyFns = [
		registerHandle(rightHandle.handle, 'right'),
		registerHandle(leftHandle.handle, 'left'),
		...(fg('platform_editor_breakout_resizing_hello_release')
			? [rightHandle.destroyTooltip, leftHandle.destroyTooltip]
			: []),
	];

	return {
		rightHandle: rightHandle.handle,
		leftHandle: leftHandle.handle,
		destroy: (isChangeToViewMode?: boolean) => {
			destroyFns.forEach((destroyFn) => destroyFn());
			unbindFns.forEach((unbindFn) => unbindFn());

			if (isChangeToViewMode && fg('platform_editor_breakout_resizing_hello_release')) {
				rightHandle.handle.parentElement?.removeChild(rightHandle.handle);
				leftHandle.handle.parentElement?.removeChild(leftHandle.handle);
			}
		},
	};
};
