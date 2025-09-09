import React, { useEffect, useRef, useState } from 'react';

// Using Global for helpful debugging in an example.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled
import { Global } from '@emotion/react';
import { bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import { cssMap, cx } from '@atlaskit/css';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { dropTargetForTextSelection } from '@atlaskit/pragmatic-drag-and-drop/text-selection/adapter';
import { Box, Flex, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { disableDraggingToCrossOriginIFramesForElement } from '../src/internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { disableDraggingToCrossOriginIFramesForExternal } from '../src/internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/external';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { disableDraggingToCrossOriginIFramesForTextSelection } from '../src/internal/pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';

const inIframeStyles = cssMap({
	root: {
		borderWidth: token('border.width.selected'),
		borderRadius: token('radius.small'),
		borderColor: token('color.border.accent.red'),
		display: 'flex',
		flexDirection: 'column',
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		gap: token('space.100'),
		height: '100%',
	},
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
		<Box xcss={inIframeStyles.root} backgroundColor="color.background.accent.red.subtler">
			<span>
				<code>iframe</code> on same <code>origin</code>
			</span>
			<Draggable />
			<DropTarget />
		</Box>
	);
}

type DropTargetState = 'idle' | 'over-with-element' | 'over-with-external' | 'over-with-text';
type DropTargetTokens =
	| 'color.background.accent.purple.subtle'
	| 'color.background.accent.purple.bolder.hovered';

const dropTargetBackgroundColorMap: { [Key in DropTargetState]: DropTargetTokens } = {
	idle: 'color.background.accent.purple.subtle',
	'over-with-element': 'color.background.accent.purple.bolder.hovered',
	'over-with-external': 'color.background.accent.purple.bolder.hovered',
	'over-with-text': 'color.background.accent.purple.bolder.hovered',
};

const dropTargetStyles = cssMap({
	root: {
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		display: 'flex',
		flexDirection: 'column',
		flexGrow: '1',
		borderRadius: token('radius.small'),
	},
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
		<Box
			ref={ref}
			xcss={dropTargetStyles.root}
			backgroundColor={dropTargetBackgroundColorMap[state]}
		>
			<div>Drop target</div>
			<div>
				(state: <code>{state}</code>)
			</div>
		</Box>
	);
}

type DraggableState = 'idle' | 'preview' | 'dragging';
type DraggableBackgroundToken =
	| 'color.background.accent.green.subtle'
	| 'color.background.accent.green.subtler'
	| 'color.background.accent.gray.subtle';
const backgroundColorMap: { [Key in DraggableState]: DraggableBackgroundToken } = {
	idle: 'color.background.accent.green.subtle',
	preview: 'color.background.accent.green.subtler',
	dragging: 'color.background.accent.gray.subtle',
};

const draggableStateStyles = cssMap({
	idle: {
		cursor: 'grab',
	},
	preview: {},
	dragging: {},
});

const draggableStyles = cssMap({
	root: {
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		borderRadius: token('radius.small'),
	},
});

const unmanagedDraggableStyles = cssMap({
	root: {
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		borderRadius: token('radius.small'),
	},
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
		<Box
			ref={ref}
			xcss={cx(draggableStyles.root, draggableStateStyles[state])}
			backgroundColor={backgroundColorMap[state]}
		>
			Draggable element
		</Box>
	);
}

const parentStyles = cssMap({
	label: {
		display: 'flex',
		flexDirection: 'row',
		gap: token('space.100'),
	},
	dropTargetContainer: {
		height: '200px',
		display: 'flex',
		flexDirection: 'column',
	},
	panel: {
		borderRadius: token('radius.small'),
		borderWidth: token('border.width.selected'),
		borderColor: token('color.border.accent.blue'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		width: '300px',
	},
	panelOnTop: {
		position: 'absolute',
		boxShadow: token('elevation.shadow.raised'),
		insetInlineStart: token('space.100'),
		insetBlockStart: token('space.250'),
	},
	parentWindowContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		borderWidth: token('border.width.selected'),
		borderStyle: 'dashed',
		borderColor: token('color.border.accent.blue'),
	},
	relativeParent: {
		position: 'relative',
	},
	iframeContainer: {
		display: 'flex',
		flexDirection: 'column',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		gap: token('space.100'),
		borderWidth: token('border.width.selected'),
		borderStyle: 'dashed',
		borderRadius: token('radius.small'),
		borderColor: token('color.border.accent.red'),
	},
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
		<Box xcss={parentStyles.parentWindowContainer}>
			<Text color="color.text.accent.blue">Parent window</Text>
			<Inline space="space.300" xcss={parentStyles.relativeParent}>
				<Box xcss={parentStyles.iframeContainer}>
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
				<Box
					xcss={cx(parentStyles.panel, isOnTop ? parentStyles.panelOnTop : undefined)}
					backgroundColor="color.background.accent.blue.subtler"
				>
					<span>In parent window</span>
					<Draggable />
					<Box
						draggable="true"
						xcss={unmanagedDraggableStyles.root}
						backgroundColor="color.background.accent.orange.subtle"
					>
						Unmanaged draggable element
					</Box>
					<Flex direction="column" xcss={parentStyles.dropTargetContainer}>
						<DropTarget />
					</Flex>
					<Box as="label" xcss={parentStyles.label}>
						<input
							type="checkbox"
							checked={isIframeOnSameOrigin}
							onChange={() => setIsIframeOnSameOrigin(!isIframeOnSameOrigin)}
						/>
						<code>iframe</code> on same origin?
					</Box>
					<Box as="label" xcss={parentStyles.label}>
						<input type="checkbox" checked={isOnTop} onChange={() => setIsOnTop(!isOnTop)} />
						Place this panel on top?
					</Box>
					<Box as="label" xcss={parentStyles.label}>
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
