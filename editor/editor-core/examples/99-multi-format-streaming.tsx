/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- example file
import { css, jsx } from '@emotion/react';

import { FullPageBase } from '@af/editor-examples-helpers/example-presets';
import type { EditorAPI } from '@af/editor-examples-helpers/example-presets';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { token } from '@atlaskit/tokens';
import {
	InitAction,
	StreamAction,
	FinishAction,
} from '@atlassian/editor-rovo-bridge/stream-processors/partial-stream-parser';
import { DocumentUpdateCommandProcessor } from '@atlassian/editor-rovo-bridge/stream-processors/update-command-processor';

// ---------------------------------------------------------------------------
// Feature flags and experiments must be set at module scope so they are
// configured BEFORE the editor plugins initialize (plugin creation checks
// these flags synchronously; useEffect runs too late).
// ---------------------------------------------------------------------------

// eslint-disable-next-line @atlaskit/platform/no-module-level-eval
setBooleanFeatureFlagResolver((flag) => {
	const enabled: Record<string, boolean> = {
		platform_editor_ai_aifc_streaming: true,
	};
	return enabled[flag] ?? false;
});
setupEditorExperiments('test', {
	platform_editor_ai_xstate_migration: true,
	platform_editor_ai_multi_format_streaming: true,
});

// ---------------------------------------------------------------------------
// Wire-format mock data — simulates the raw string chunks from the backend.
//
// The backend streams concatenated JSON objects in this shape:
// {"name":"replaceNode","arguments":{"localId":"...","contentType":"...","value":"..."}}
//
// For ADF the value is a JSON-encoded document string.
// For markdown / HTML the value is raw text.
// The contentType field is only present when multi-format streaming is enabled.
// ---------------------------------------------------------------------------

type MockStreamDef = {
	chunkDelayMs: number;
	chunkSize: number;
	description: string;
	label: string;
	wireJson: string;
};

const escapeJsonValue = (v: string) => JSON.stringify(v).slice(1, -1);

const buildWireJson = (name: string, args: Record<string, string>): string => {
	const argEntries = Object.entries(args)
		.map(([k, v]) => `"${k}":"${escapeJsonValue(v)}"`)
		.join(',');
	return `{"name":"${name}","arguments":{${argEntries}}}`;
};

const ADF_VALUE = JSON.stringify({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is ADF streaming. The existing path accumulates partial JSON and repairs it.',
				},
			],
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bullet one' }] }],
				},
				{
					type: 'listItem',
					content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bullet two' }] }],
				},
			],
		},
	],
});

const MARKDOWN_VALUE =
	'## Q1 Results\n\nRevenue grew by **23%** year-over-year.\n\n- Record signups\n- Churn at 2.1%\n- NPS: **72**';

const HTML_VALUE =
	'<table><tr><th colspan="2">Regional Performance</th></tr><tr><td>APAC</td><td>+31%</td></tr><tr><td>EMEA</td><td>+18%</td></tr><tr><td>Americas</td><td>+27%</td></tr></table><p>\u00a0</p>';

const MARKDOWN_TABLE_VALUE =
	'| Region | Growth |\n| --- | --- |\n| APAC | +31% |\n| EMEA | +18% |\n| Americas | +27% |\n\n\u00a0';

const HTML_LIST_VALUE =
	'<ul><li>Record signups</li><li>Churn at 2.1%</li><li>NPS: <strong>72</strong></li></ul>';

const MOCK_STREAMS: MockStreamDef[] = [
	{
		label: 'Stream ADF',
		description: 'application/adf+json — existing ADFStreamer path',
		wireJson: buildWireJson('replaceNode', {
			localId: 'adf-target',
			contentType: 'application/adf+json',
			value: ADF_VALUE,
		}),
		chunkSize: 80,
		chunkDelayMs: 60,
	},
	{
		label: 'Stream Markdown list',
		description: 'text/markdown — converted to ADF client-side',
		wireJson: buildWireJson('replaceNode', {
			localId: 'md-target',
			contentType: 'text/markdown',
			value: MARKDOWN_VALUE,
		}),
		chunkSize: 40,
		chunkDelayMs: 80,
	},
	{
		label: 'Stream Markdown Table',
		description: 'text/markdown — table converted to ADF client-side',
		wireJson: buildWireJson('replaceNode', {
			localId: 'md-table-target',
			contentType: 'text/markdown',
			value: MARKDOWN_TABLE_VALUE,
		}),
		chunkSize: 40,
		chunkDelayMs: 80,
	},
	{
		label: 'Stream HTML List',
		description: 'text/html — bullet list',
		wireJson: buildWireJson('replaceNode', {
			localId: 'html-list-target',
			contentType: 'text/html',
			value: HTML_LIST_VALUE,
		}),
		chunkSize: 50,
		chunkDelayMs: 80,
	},
	{
		label: 'Stream HTML table',
		description: 'text/html — tables with colspan',
		wireJson: buildWireJson('replaceNode', {
			localId: 'html-target',
			contentType: 'text/html',
			value: HTML_VALUE,
		}),
		chunkSize: 50,
		chunkDelayMs: 80,
	},
];

// ---------------------------------------------------------------------------
// Wire-format stream processor
//
// This example now uses the real DocumentUpdateCommandProcessor, which in turn
// uses the real PartialStreamParser. The only mocked part is the backend stream
// itself: we slice the raw wire-format JSON into chunks and feed those chunks
// through the same processor path used in production.
// ---------------------------------------------------------------------------

type AIExperienceSharedState = {
	currentState?: () => {
		aiDecorationExperiencePluginState?: { isRunning?: boolean };
		chunkNumber?: number;
		isStreaming?: boolean;
	};
	onChange?: (
		callback: (args: {
			nextSharedState: {
				aiDecorationExperiencePluginState?: { isRunning?: boolean };
				chunkNumber?: number;
				isStreaming?: boolean;
			};
			prevSharedState: {
				aiDecorationExperiencePluginState?: { isRunning?: boolean };
				chunkNumber?: number;
				isStreaming?: boolean;
			};
		}) => void,
	) => () => void;
};

const instrumentParser = (
	processor: DocumentUpdateCommandProcessor,
	addLog: (msg: string) => void,
) => {
	const parser = (processor as any).parser;
	const originalParse = parser.parse.bind(parser);
	parser.parse = (input: string) => {
		const results = originalParse(input);
		for (const result of results) {
			if (result instanceof InitAction) {
				addLog(
					`  [parser] InitAction: ${result.name}` +
						(result.localId ? ` localId=${result.localId}` : '') +
						(result.contentType ? ` contentType=${result.contentType}` : ''),
				);
			} else if (result instanceof StreamAction) {
				const preview =
					result.partialValue.length > 40
						? result.partialValue.slice(0, 40) + '...'
						: result.partialValue;
				addLog(`  [parser] StreamAction: "${preview}" (${result.partialValue.length} chars)`);
			} else if (result instanceof FinishAction) {
				addLog('  [parser] FinishAction');
			}
		}
		return results;
	};
};

const endPreviousOrchestratorSessionIfAny = (editorApi: EditorAPI) => {
	// Use abortSession to dismiss any open accept/reject modal from a previous run before starting fresh.
	// endSession() only resets metadata; abortSession() actually calls endAIExperience() to close the modal.
	const abort = (editorApi as any)?.aiStreamingOrchestrator?.actions?.abortSession as
		| (() => void)
		| undefined;
	if (abort) {
		try {
			abort();
		} catch {
			// abortSession may throw if no session active (first run)
		}
	}
};

const processWireStream = async (
	wireJson: string,
	chunkSize: number,
	chunkDelayMs: number,
	editorApi: EditorAPI,
	addLog: (msg: string) => void,
) => {
	if (!(editorApi as any)?.aiStreamingOrchestrator?.actions) {
		throw new Error('aiStreamingOrchestrator API not available');
	}

	endPreviousOrchestratorSessionIfAny(editorApi);

	addLog('  processor: DocumentUpdateCommandProcessor');

	const processor = new DocumentUpdateCommandProcessor(
		editorApi as any,
		'staging-area',
		'multi-format-streaming-example' as any,
		{
			send: () => undefined,
		} as any,
	);

	instrumentParser(processor, addLog);

	const chunks: string[] = [];
	for (let i = 0; i < wireJson.length; i += chunkSize) {
		chunks.push(wireJson.slice(i, i + chunkSize));
	}

	for (const chunk of chunks) {
		addLog(`  chunk(${chunk.length}): ${chunk.slice(0, 50)}${chunk.length > 50 ? '...' : ''}`);
		const previousChunkNumber = (editorApi as any)?.aiExperience?.sharedState?.currentState?.()
			?.chunkNumber;
		processor.streamChunk(chunk, false);
		await waitForChunkToRender(editorApi, previousChunkNumber);

		if (chunkDelayMs > 0) {
			await wait(chunkDelayMs);
		}
	}

	// Call finish() to trigger endSession() which completes the streaming and shows the accept/reject screen.
	// endPreviousOrchestratorSessionIfAny() handles cleanup of any prior session before each new demo run.
	await processor.finish();
	addLog('done');
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEFAULT_DOC = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Multi-Format Streaming Demo' }],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Use the buttons on the right to stream content into the placeholder blocks below.',
				},
			],
		},
		{ type: 'rule' },
		{
			type: 'heading',
			attrs: { level: 3 },
			content: [{ type: 'text', text: 'ADF Target' }],
		},
		{
			type: 'paragraph',
			attrs: { localId: 'adf-target' },
			content: [{ type: 'text', text: '[ ADF stream will replace this block ]' }],
		},
		{
			type: 'heading',
			attrs: { level: 3 },
			content: [{ type: 'text', text: 'Markdown Target' }],
		},
		{
			type: 'paragraph',
			attrs: { localId: 'md-target' },
			content: [{ type: 'text', text: '[ Markdown stream will replace this block ]' }],
		},
		{
			type: 'heading',
			attrs: { level: 3 },
			content: [{ type: 'text', text: 'Markdown Table Target' }],
		},
		{
			type: 'paragraph',
			attrs: { localId: 'md-table-target' },
			content: [{ type: 'text', text: '[ Markdown table stream will replace this block ]' }],
		},
		{
			type: 'heading',
			attrs: { level: 3 },
			content: [{ type: 'text', text: 'HTML List Target' }],
		},
		{
			type: 'paragraph',
			attrs: { localId: 'html-list-target' },
			content: [{ type: 'text', text: '[ HTML list stream will replace this block ]' }],
		},
		{
			type: 'heading',
			attrs: { level: 3 },
			content: [{ type: 'text', text: 'HTML Target' }],
		},
		{
			type: 'paragraph',
			attrs: { localId: 'html-target' },
			content: [{ type: 'text', text: '[ HTML stream will replace this block ]' }],
		},
	],
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const waitForChunkToRender = async (
	editorApi: EditorAPI,
	previousChunkNumber: number | undefined,
): Promise<void> => {
	const sharedState = (editorApi as any)?.aiExperience?.sharedState as
		| AIExperienceSharedState
		| undefined;

	if (!sharedState?.currentState || !sharedState?.onChange) {
		await wait(50);
		return;
	}

	if (sharedState.currentState()?.chunkNumber !== previousChunkNumber) {
		return;
	}

	await new Promise<void>((resolve) => {
		const timeoutId = window.setTimeout(() => {
			unsubscribe?.();
			resolve();
		}, 1000);

		const unsubscribe = sharedState.onChange?.(({ nextSharedState, prevSharedState }) => {
			if (nextSharedState?.chunkNumber !== prevSharedState?.chunkNumber) {
				window.clearTimeout(timeoutId);
				unsubscribe?.();
				resolve();
			}
		});
	});
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const layoutStyles = css({
	display: 'flex',
	height: '100vh',
});

const editorPanelStyles = css({
	flex: 1,
	overflow: 'auto',
});

const sidePanelStyles = css({
	width: 360,
	borderLeft: `1px solid ${token('color.border')}`,
	display: 'flex',
	flexDirection: 'column',
	background: token('elevation.surface'),
});

const sidePanelHeaderStyles = css({
	padding: `${token('space.100')} ${token('space.200')}`,
	borderBottom: `1px solid ${token('color.border')}`,
	fontWeight: 600,
	fontSize: 13,
});

const buttonGroupStyles = css({
	padding: token('space.200'),
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.150'),
});

const streamButtonStyles = css({
	padding: `${token('space.100')} ${token('space.200')}`,
	borderRadius: 4,
	border: 'none',
	cursor: 'pointer',
	fontWeight: 600,
	fontSize: 13,
	textAlign: 'start',
	color: token('color.text.inverse'),
	background: token('color.background.brand.bold'),
	'&:disabled': {
		cursor: 'not-allowed',
		opacity: 0.5,
	},
});

const streamButtonActiveStyles = css({
	background: token('color.background.success.bold'),
});

const descStyles = css({
	fontSize: 11,
	color: token('color.text.subtlest'),
	marginTop: token('space.050'),
	paddingLeft: token('space.050'),
});

const logPanelStyles = css({
	flex: 1,
	borderTop: `1px solid ${token('color.border')}`,
	padding: `${token('space.100')} ${token('space.150')}`,
	overflow: 'auto',
	background: token('elevation.surface.sunken'),
	fontFamily: 'monospace',
});

const logLineStyles = css({
	fontSize: 11,
	lineHeight: '1.6',
	color: token('color.text.subtle'),
});

const wirePreviewStyles = css({
	fontSize: 10,
	color: token('color.text.subtlest'),
	marginTop: token('space.050'),
	paddingLeft: token('space.050'),
	fontFamily: 'monospace',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	maxWidth: 320,
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type LogEntry = { id: string; line: string };

const MultiFormatStreamingExample = () => {
	const editorApiRef = useRef<EditorAPI>(undefined);
	const logIdRef = useRef(0);
	const [activeStream, setActiveStream] = useState<string | null>(null);
	const [log, setLog] = useState<LogEntry[]>([]);

	const addLog = useCallback((msg: string) => {
		setLog((prev) => [...prev.slice(-80), { id: `log-${++logIdRef.current}`, line: msg }]);
	}, []);

	const runStream = useCallback(
		async (stream: MockStreamDef) => {
			const editorApi = editorApiRef.current;
			if (!editorApi) {
				addLog('ERROR: no editor API');
				return;
			}

			setActiveStream(stream.label);
			logIdRef.current = 0;
			setLog([]);
			addLog(`> ${stream.label} (wire format, ${stream.wireJson.length} bytes)`);

			try {
				await processWireStream(
					stream.wireJson,
					stream.chunkSize,
					stream.chunkDelayMs,
					editorApi,
					addLog,
				);
			} catch (err) {
				addLog(`ERROR: ${err}`);
			}

			setActiveStream(null);
		},
		[addLog],
	);

	const setEditorApi = useCallback((api: EditorAPI) => {
		editorApiRef.current = api;
	}, []);

	return (
		<div css={layoutStyles}>
			<div css={editorPanelStyles}>
				<FullPageBase
					editorProps={{ defaultValue: DEFAULT_DOC }}
					setEditorApi={setEditorApi}
					overridedFullPagePresetProps={{
						enabledOptionalPlugins: {
							aiStreamingOrchestrator: true,
							aiExperience: true,
							localId: true,
						},
						pluginOptions: {
							// Without this, StreamFlowPacer can buffer `complete` until "backlog" drains.
							// Table ADF often never satisfies that check, so the UI stays on the last
							// `stream` frame (getLastDocWithoutLastLeafNode → missing last table row).
							aiStreamingOrchestrator: { streamFlowPacerEnabled: false },
						},
					}}
				/>
			</div>

			<div css={sidePanelStyles}>
				<div css={sidePanelHeaderStyles}>Multi-Format Streaming (Wire Format)</div>

				<div css={buttonGroupStyles}>
					{MOCK_STREAMS.map((stream) => (
						<div key={stream.label}>
							<button
								css={[
									streamButtonStyles,
									activeStream === stream.label && streamButtonActiveStyles,
								]}
								disabled={activeStream !== null}
								onClick={() => runStream(stream)}
							>
								{activeStream === stream.label ? 'streaming... ' : '> '}
								{stream.label}
							</button>
							<div css={descStyles}>{stream.description}</div>
							<div css={wirePreviewStyles} title={stream.wireJson}>
								{stream.wireJson}
							</div>
						</div>
					))}
				</div>

				<div css={logPanelStyles}>
					<strong css={logLineStyles}>Stream Log</strong>
					{log.length === 0 ? (
						<div css={logLineStyles}>Click a button to start...</div>
					) : (
						log.map((entry) => (
							<div key={entry.id} css={logLineStyles}>
								{entry.line}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default MultiFormatStreamingExample;
