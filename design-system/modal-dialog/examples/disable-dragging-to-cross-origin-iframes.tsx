import React, { useEffect, useRef, useState } from 'react';

// Using Global for helpful debugging in an example.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
import { Global } from '@emotion/react';
import { bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { dropTargetForTextSelection } from '@atlaskit/pragmatic-drag-and-drop/text-selection/adapter';
import { Box, Flex, Inline, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { disableDraggingToCrossOriginIFramesForElement } from '../src/internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { disableDraggingToCrossOriginIFramesForExternal } from '../src/internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/external';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { disableDraggingToCrossOriginIFramesForTextSelection } from '../src/internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';

const inIframeStyles = xcss({
	backgroundColor: 'color.background.accent.red.subtler',
	borderWidth: token('border.width.outline'),
	borderRadius: token('border.radius'),
	borderColor: 'color.border.accent.red',
	display: 'flex',
	flexDirection: 'column',
	padding: 'space.100',
	gap: 'space.100',
	height: '100%',
});

function InIframe() {
	useEffect(() => {
		function log(event: DragEvent) {
			console.log(event.type, event.target);
		}
		const eventNames = ['dragstart', 'dragenter', 'dragleave', 'drop', 'dragend'] as const;
		return bindAll(
			window,
			eventNames.map((eventName) => ({ type: eventName, listener: log })),
		);
	}, []);

	return (
		<Box xcss={inIframeStyles}>
			<span>
				<code>iframe</code> on same <code>origin</code>
			</span>
			<Draggable />
			<DropTarget />
		</Box>
	);
}

type DropTargetState = 'idle' | 'over-with-element' | 'over-with-external' | 'over-with-text';

const dropTargetStateStyles: { [Key in DropTargetState]: ReturnType<typeof xcss> } = {
	idle: xcss({ backgroundColor: 'color.background.accent.purple.subtle' }),
	'over-with-element': xcss({ backgroundColor: 'color.background.accent.purple.bolder.hovered' }),
	'over-with-external': xcss({ backgroundColor: 'color.background.accent.purple.bolder.hovered' }),
	'over-with-text': xcss({ backgroundColor: 'color.background.accent.purple.bolder.hovered' }),
};

const dropTargetStyles = xcss({
	padding: 'space.100',
	display: 'flex',
	flexDirection: 'column',
	flexGrow: '1',
	borderRadius: token('border.radius'),
});

function DropTarget() {
	const ref = useRef<HTMLDivElement | null>(null);
	const [state, setState] = useState<DropTargetState>('idle');

	useEffect(() => {
		const element = ref.current;

		invariant(element);
		return combine(
			dropTargetForElements({
				element,
				onDragEnter() {
					setState('over-with-element');
				},
				onDragLeave() {
					setState('idle');
				},
				onDrop() {
					setState('idle');
				},
			}),
			dropTargetForExternal({
				element,
				onDragEnter() {
					setState('over-with-external');
				},
				onDragLeave() {
					setState('idle');
				},
				onDrop() {
					setState('idle');
				},
			}),
			dropTargetForTextSelection({
				element,
				onDragEnter() {
					setState('over-with-text');
				},
				onDragLeave() {
					setState('idle');
				},
				onDrop() {
					setState('idle');
				},
			}),
		);
	}, []);

	return (
		<Box ref={ref} xcss={[dropTargetStyles, dropTargetStateStyles[state]]}>
			<div>Drop target</div>
			<div>
				(state: <code>{state}</code>)
			</div>
		</Box>
	);
}

type DraggableState = 'idle' | 'preview' | 'dragging';

const draggableStateStyles: { [Key in DraggableState]: ReturnType<typeof xcss> } = {
	idle: xcss({ backgroundColor: 'color.background.accent.green.subtle', cursor: 'grab' }),
	preview: xcss({ backgroundColor: 'color.background.accent.green.subtler' }),
	dragging: xcss({ backgroundColor: 'color.background.accent.gray.subtle' }),
};

const draggableStyles = xcss({
	padding: 'space.100',
	borderRadius: token('border.radius'),
});

const unmanagedDraggableStyles = xcss({
	padding: 'space.100',
	borderRadius: token('border.radius'),
	backgroundColor: 'color.background.accent.orange.subtle',
});

function Draggable() {
	const ref = useRef<HTMLDivElement | null>(null);
	const [state, setState] = useState<DraggableState>('idle');

	useEffect(() => {
		const element = ref.current;

		invariant(element);

		return draggable({
			element,
			getInitialDataForExternal() {
				return { 'text/plain': 'hello' };
			},
			onGenerateDragPreview() {
				setState('preview');
			},
			onDragStart() {
				setState('dragging');
			},
			onDrop() {
				setState('idle');
			},
		});
	}, []);
	return (
		<Box ref={ref} xcss={[draggableStyles, draggableStateStyles[state]]}>
			Draggable element
		</Box>
	);
}

const labelStyles = xcss({
	display: 'flex',
	flexDirection: 'row',
	gap: 'space.100',
});

const dropTargetContainerStyles = xcss({
	height: '200px',
	display: 'flex',
	flexDirection: 'column',
});

const panelStyles = xcss({
	backgroundColor: 'color.background.accent.blue.subtler',
	borderRadius: token('border.radius'),
	borderWidth: token('border.width.outline'),
	borderColor: 'color.border.accent.blue',
	display: 'flex',
	flexDirection: 'column',
	gap: 'space.100',
	padding: 'space.100',
	width: '300px',
});

const panelOnTopStyles = xcss({
	position: 'absolute',
	boxShadow: 'elevation.shadow.raised',
	insetInlineStart: '200px',
	insetBlockStart: '100px',
});

const parentWindowContainer = xcss({
	display: 'flex',
	flexDirection: 'column',
	gap: 'space.100',
	padding: 'space.100',
	borderWidth: token('border.width.outline'),
	borderStyle: 'dashed',
	borderColor: 'color.border.accent.blue',
});

const relativeParentStyles = xcss({
	position: 'relative',
});

const iframeContainerStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	padding: 'space.100',
	gap: 'space.100',
	borderWidth: token('border.width.outline'),
	borderStyle: 'dashed',
	borderRadius: token('border.radius'),
	borderColor: 'color.border.accent.red',
});

function Parent() {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const [isIframeOnSameOrigin, setIsIframeOnSameOrigin] = useState<boolean>(true);
	const [isOnTop, setIsOnTop] = useState<boolean>(true);
	const [applyFix, setApplyFix] = useState<boolean>(false);

	useEffect(() => {
		if (!applyFix) {
			return;
		}
		return combine(
			disableDraggingToCrossOriginIFramesForElement(),
			disableDraggingToCrossOriginIFramesForExternal(),
			disableDraggingToCrossOriginIFramesForTextSelection(),
		);
	}, [applyFix]);

	return (
		<Box xcss={parentWindowContainer}>
			<Text color="color.text.accent.blue">Parent window</Text>
			<Inline space="space.300" xcss={relativeParentStyles}>
				<Box xcss={iframeContainerStyles}>
					<Text color="color.text.accent.red">iframe</Text>
					<Box
						as="iframe"
						title="child-iframe"
						ref={iframeRef}
						src={isIframeOnSameOrigin ? window.location.href : 'https://atlassian.design'}
						width={600}
						height={600}
					/>
				</Box>
				<Box xcss={[panelStyles, isOnTop ? panelOnTopStyles : undefined]}>
					<span>In parent window</span>
					<Draggable />
					<Box draggable="true" xcss={unmanagedDraggableStyles}>
						Unmanaged draggable element
					</Box>
					<Flex direction="column" xcss={dropTargetContainerStyles}>
						<DropTarget />
					</Flex>
					<Box as="label" xcss={labelStyles}>
						<input
							type="checkbox"
							checked={isIframeOnSameOrigin}
							onChange={() => setIsIframeOnSameOrigin(!isIframeOnSameOrigin)}
						/>
						<code>iframe</code> on same origin?
					</Box>
					<Box as="label" xcss={labelStyles}>
						<input type="checkbox" checked={isOnTop} onChange={() => setIsOnTop(!isOnTop)} />
						Place this panel on top?
					</Box>
					<Box as="label" xcss={labelStyles}>
						<input type="checkbox" checked={applyFix} onChange={() => setApplyFix(!applyFix)} />
						Apply fix?
					</Box>
				</Box>
				{/* Making what the fix is doing visible */}
				<Global
					styles={{
						'iframe[style*="pointer-events: none"]': {
							filter: 'grayscale(100%)',
						},
					}}
				/>
			</Inline>
		</Box>
	);
}

export default function App() {
	const isInIframe = typeof window !== undefined && window.top !== window.self;
	return isInIframe ? <InIframe /> : <Parent />;
}
