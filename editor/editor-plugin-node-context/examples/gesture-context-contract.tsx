/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; the example tsconfig currently provides the Emotion css prop type
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/default/button';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { token } from '@atlaskit/tokens';
import { createDOMGestureTracker } from '@atlassian/gesture-detection/dom-gesture-tracker';
import type { ClassifiedGestureResult } from '@atlassian/gesture-detection/geometric-classifier-types';
import type {
	GestureMetrics,
	GestureTrackerEvents,
} from '@atlassian/gesture-detection/tracker-types';

import { nodeContextPlugin } from '../src/nodeContextPlugin';
import type { EditorNodeContext } from '../src/nodeContextPluginType';

const DEMO_CONTENT_ARI = 'ari:cloud:confluence:demo:page/gesture-context';
const DEMO_CONTENT_VERSION = 1;
const MAX_LINE_SAMPLES = 24;

const exampleDocument: JSONDocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 2, localId: 'gesture-demo-heading' },
			content: [{ type: 'text', text: 'Quarterly planning' }],
		},
		{
			type: 'paragraph',
			attrs: { localId: 'gesture-demo-summary' },
			content: [
				{
					type: 'text',
					text: 'Draw a line toward this summary or circle it to resolve its ADF context.',
				},
			],
		},
		{
			type: 'panel',
			attrs: { panelType: 'info', localId: 'gesture-demo-panel' },
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This panel demonstrates resolution to a meaningful local-ID-bearing ancestor.',
						},
					],
				},
			],
		},
	],
};

const pageStyles = css({
	maxWidth: '1200px',
	marginRight: 'auto',
	marginLeft: 'auto',
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: token('space.300'),
	paddingLeft: token('space.300'),
});

const instructionsStyles = css({
	marginTop: token('space.100'),
	marginBottom: token('space.200'),
	color: token('color.text.subtle'),
});

const controlsStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.150'),
	marginBottom: token('space.300'),
});

const layoutStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	gap: token('space.300'),
	alignItems: 'start',
});

const editorStyles = css({
	minWidth: '320px',
	flexBasis: '600px',
	flexGrow: 3,
	flexShrink: 1,
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border'),
	borderRadius: token('radius.medium'),
	backgroundColor: token('elevation.surface'),
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
});

const inspectorStyles = css({
	position: 'sticky',
	top: token('space.200'),
	minWidth: '320px',
	minHeight: '320px',
	flexBasis: '320px',
	flexGrow: 2,
	flexShrink: 1,
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border'),
	borderRadius: token('radius.medium'),
	backgroundColor: token('elevation.surface.raised'),
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
});

const inspectorHeadingStyles = css({
	marginTop: token('space.0'),
	marginBottom: token('space.150'),
});

const outputStyles = css({
	marginTop: token('space.150'),
	marginBottom: token('space.0'),
	color: token('color.text'),
	font: token('font.code'),
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-word',
});

type GestureTiming = {
	endedAt: string;
	endedAtSessionMs: number;
	startedAtSessionMs: number;
};

type GestureContextEvent = {
	eventId: string;
	gesture:
		| { kind: 'line'; score: number }
		| { closure: 'closed' | 'open'; kind: 'region_like'; score: number };
	schemaVersion: 1;
	source: {
		contentAri: string;
		contentVersion: number;
		product: 'confluence';
		surfaceType: 'main_content';
	};
	targets: Array<{
		format: 'adf';
		fragment: EditorNodeContext['adf'];
		localIds: string[];
		nodeTypes: string[];
		resourceAri: string;
		type: 'structured_content';
	}>;
	timing: GestureTiming;
	type: 'chat.context.gesture';
};

type Inspection = {
	metrics?: GestureMetrics;
	payload?: GestureContextEvent;
	status: string;
};

const getLineSamples = (
	points: GestureTrackerEvents['classified']['points'],
): GestureTrackerEvents['classified']['points'] => {
	if (points.length <= MAX_LINE_SAMPLES) {
		return points;
	}

	const step = Math.ceil(points.length / MAX_LINE_SAMPLES);
	const samples = points.filter((_point, index) => index % step === 0);
	const endpoint = points[points.length - 1];
	if (samples[samples.length - 1] !== endpoint) {
		return [...samples, endpoint];
	}

	return samples;
};

const deduplicateNodeContexts = (contexts: readonly EditorNodeContext[]): EditorNodeContext[] => {
	const contextsByPosition = new Map<number, EditorNodeContext>();
	for (const context of contexts) {
		contextsByPosition.set(context.pos, context);
	}

	return Array.from(contextsByPosition.values());
};

const buildGestureContextEvent = (
	gesture: ClassifiedGestureResult,
	timing: GestureTiming,
	targets: readonly EditorNodeContext[],
): GestureContextEvent => ({
	type: 'chat.context.gesture',
	schemaVersion: 1,
	eventId: crypto.randomUUID(),
	source: {
		product: 'confluence',
		surfaceType: 'main_content',
		contentAri: DEMO_CONTENT_ARI,
		contentVersion: DEMO_CONTENT_VERSION,
	},
	timing,
	gesture:
		gesture.kind === 'region_like'
			? { kind: gesture.kind, closure: gesture.closure, score: gesture.score }
			: { kind: gesture.kind, score: gesture.score },
	targets: targets.map((target) => ({
		type: 'structured_content',
		format: 'adf',
		resourceAri: DEMO_CONTENT_ARI,
		localIds: target.localId ? [target.localId] : [],
		nodeTypes: [target.nodeType],
		fragment: target.adf,
	})),
});

function GestureContextContractDemo(): React.JSX.Element {
	const [isCapturing, setIsCapturing] = useState(false);
	const [inspection, setInspection] = useState<Inspection>({
		status: 'Start capture, then draw over the editor.',
	});
	const editorContainerRef = useRef<HTMLDivElement>(null);
	const { editorApi, preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add([analyticsPlugin, {}])
			.add(blockTypePlugin)
			.add(decorationsPlugin)
			.add(typeAheadPlugin)
			.add(emojiPlugin)
			.add(panelPlugin)
			.add(nodeContextPlugin),
	);

	useEffect(() => {
		if (!isCapturing) {
			return;
		}

		const editorContainer = editorContainerRef.current;
		if (!editorContainer) {
			return;
		}

		const sessionStartedAt = performance.now();
		let gestureStartedAt: number | undefined;
		let gestureEndedAt: number | undefined;
		let gestureEndedAtWallClock: string | undefined;
		const resetTiming = (): void => {
			gestureStartedAt = undefined;
			gestureEndedAt = undefined;
			gestureEndedAtWallClock = undefined;
		};

		const { tracker, cleanup } = createDOMGestureTracker({
			target: editorContainer,
			dwellTimeMs: 500,
		});
		const unsubscribePointAdded = tracker.on('pointAdded', () => {
			const now = performance.now();
			gestureStartedAt ??= now;
			gestureEndedAt = now;
			gestureEndedAtWallClock = new Date().toISOString();
		});
		const unsubscribeClassified = tracker.on('classified', ({ result, metrics, points }) => {
			const startedAt = gestureStartedAt;
			const endedAt = gestureEndedAt;
			const endedAtWallClock = gestureEndedAtWallClock;
			resetTiming();

			if (startedAt === undefined || endedAt === undefined || !endedAtWallClock) {
				setInspection({ status: 'Gesture timing was unavailable.' });

				return;
			}

			const targets =
				result.kind === 'region_like'
					? (editorApi?.nodeContext?.actions.getNodeContextsInViewportRect(metrics.boundingBox) ??
						[])
					: deduplicateNodeContexts(
							getLineSamples(points).flatMap((point) => {
								const context = editorApi?.nodeContext?.actions.getNodeContextAtCoords(point);

								return context ? [context] : [];
							}),
						);
			if (targets.length === 0) {
				setInspection({
					metrics,
					status: 'Gesture classified, but its geometry did not resolve to ADF.',
				});

				return;
			}

			setInspection({
				metrics,
				payload: buildGestureContextEvent(
					result,
					{
						startedAtSessionMs: Math.round(startedAt - sessionStartedAt),
						endedAtSessionMs: Math.round(endedAt - sessionStartedAt),
						endedAt: endedAtWallClock,
					},
					targets,
				),
				status: `${targets.length} target${targets.length === 1 ? '' : 's'} resolved. This payload is displayed locally and is not sent.`,
			});
		});
		const unsubscribeUnclassified = tracker.on('unclassified', () => {
			resetTiming();
			setInspection({ status: 'Movement completed, but it was not classified as a gesture.' });
		});
		const unsubscribeDiscarded = tracker.on('discarded', () => {
			resetTiming();
			setInspection({ status: 'Gesture discarded because it exceeded the point limit.' });
		});

		setInspection({ status: 'Capture is active. Draw a line or region over the editor.' });

		return () => {
			unsubscribePointAdded();
			unsubscribeClassified();
			unsubscribeUnclassified();
			unsubscribeDiscarded();
			cleanup();
		};
	}, [editorApi, isCapturing]);

	return (
		<>
			<div css={controlsStyles}>
				<Button
					appearance={isCapturing ? 'default' : 'primary'}
					isSelected={isCapturing}
					onClick={() => setIsCapturing((current) => !current)}
				>
					{isCapturing ? 'Stop capture' : 'Start capture'}
				</Button>
				<span>{isCapturing ? 'Listening inside the editor' : 'Capture is off'}</span>
			</div>
			<div css={layoutStyles}>
				<div css={editorStyles} ref={editorContainerRef}>
					<ComposableEditor preset={preset} defaultValue={exampleDocument} />
				</div>
				<aside css={inspectorStyles}>
					<h2 css={inspectorHeadingStyles}>Frontend contract preview</h2>
					<p>{inspection.status}</p>
					{inspection.payload ? (
						<pre css={outputStyles}>{JSON.stringify(inspection, null, 2)}</pre>
					) : null}
				</aside>
			</div>
		</>
	);
}

/** Demonstrates gesture classification, editor resolution, and FE contract mapping without networking. */
export default function Example(): React.JSX.Element {
	return (
		<main css={pageStyles}>
			<h1>Gesture context contract</h1>
			<p css={instructionsStyles}>
				This frontend-only example resolves nodes along a line or intersecting a region bounding
				box, then displays the proposed WebSocket payload. It does not send any data.
			</p>
			<GestureContextContractDemo />
		</main>
	);
}
