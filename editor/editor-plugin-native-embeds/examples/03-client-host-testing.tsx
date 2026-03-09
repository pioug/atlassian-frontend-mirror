/**
 * Native Embed — Client / Host Communication Testing
 *
 * This example lets you test the bidirectional communication between a native
 * embed host (this editor page) and a child iframe (the 02-native-embed-child
 * example).
 *
 * HOW TO USE:
 * 1. Open example "02-native-embed-child" in a separate browser tab to find its URL.
 * 2. Copy that URL and paste it into the "Child Frame URL" input below.
 * 3. The embed in the editor will load the child frame in its iframe.
 * 4. Interact with the child frame buttons to test host↔child communication.
 * 5. Click inside the embed to test click-event forwarding (selection).
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import { IntlProvider } from 'react-intl-next';

import {
	getExamplesProviders,
	useConfluenceFullPagePreset,
} from '@af/editor-examples-helpers/example-presets';
import { DevTools } from '@af/editor-examples-helpers/utils';
import type { DocNode } from '@atlaskit/adf-schema';
import Button from '@atlaskit/button/standard-button';
import {
	DefaultExtensionProvider,
	type ExtensionManifest,
	type ExtensionModuleNode,
	NATIVE_EMBED_EXTENSION_KEY,
	NATIVE_EMBED_EXTENSION_TYPE,
} from '@atlaskit/editor-common/extensions';
import type { EditorActions } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import WhiteboardIcon from '@atlaskit/icon/core/whiteboard';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { NATIVE_EMBED_PARAMETER_DEFAULTS, setParameters } from '@atlaskit/native-embeds-common';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import {
	allNativeEmbedCoreFeatures,
	getNativeEmbedFacade,
	type NativeEmbedFeature,
} from '@atlassian/native-embeds-core';
import {
	type Experience,
	type ExperienceManifest,
	experienceManifestId,
	type NativeEmbedChildCommand,
} from '@atlassian/native-embeds-core/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { default as nativeEmbedExtensionManifest } from '@atlassian/native-embeds-editor-extension';

setupEditorExperiments('test', {
	platform_editor_controls: 'variant1',
});

// ─── Constants ──────────────────────────────────────────────────────────────

/**
 * Placeholder URL used for the test embed node in the document.
 * The experience manifest's transformUrl replaces this with the real child frame URL.
 */
const TEST_EMBED_URL = 'https://native-embed-test.local/child';

const CHILD_FRAME_URL_STORAGE_KEY = 'native-embed-child-frame-url';

const TEST_EXPERIENCE_ID = 'test-local';

// ─── Styles ─────────────────────────────────────────────────────────────────

const hostLogContainerStyles = css({
	margin: '8px 0',
	padding: '12px',
	border: '1px solid #DFE1E6',
	borderRadius: '4px',
	background: '#FAFBFC',
	maxHeight: '150px',
	overflowY: 'auto',
	fontFamily: 'monospace',
	fontSize: '11px',
});

const hostLogHeaderStyles = css({
	fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	fontSize: '12px',
	fontWeight: 600,
	color: '#6B778C',
	marginBottom: '8px',
});

const hostLogEmptyStyles = css({
	color: '#A5ADBA',
	fontStyle: 'italic',
});

const hostLogEntryStyles = css({
	padding: '2px 0',
	borderBottom: '1px solid #F4F5F7',
});

const hostLogTimestampStyles = css({
	color: '#6B778C',
});

const hostLogRecvStyles = css({
	color: '#00875A',
});

const pageContainerStyles = css({
	padding: '16px',
});

const setupContainerStyles = css({
	marginBottom: '16px',
	padding: '16px',
	border: '1px solid #DFE1E6',
	borderRadius: '8px',
	background: '#F4F5F7',
});

const setupTitleStyles = css({
	fontWeight: 600,
	marginBottom: '8px',
	fontSize: '14px',
});

const setupDescriptionStyles = css({
	fontSize: '13px',
	color: '#6B778C',
	marginBottom: '12px',
});

const setupInputRowStyles = css({
	display: 'flex',
	gap: '8px',
	alignItems: 'center',
});

const inputStyles = css({
	flex: 1,
	padding: '8px 12px',
	border: '1px solid #DFE1E6',
	borderRadius: '4px',
	fontSize: '13px',
	fontFamily: 'monospace',
});

const applyButtonBaseStyles = css({
	padding: '8px 16px',
	borderRadius: '4px',
	border: 'none',
	fontSize: '13px',
	fontWeight: 600,
});

const applyButtonEnabledStyles = css({
	backgroundColor: '#0052CC',
	color: '#FFFFFF',
	cursor: 'pointer',
});

const applyButtonDisabledStyles = css({
	backgroundColor: '#F4F5F7',
	color: '#A5ADBA',
	cursor: 'not-allowed',
});

const activeUrlStyles = css({
	marginTop: '8px',
	fontSize: '12px',
	color: '#00875A',
});

const emptyEditorStyles = css({
	padding: '48px',
	textAlign: 'center',
	color: '#6B778C',
	border: '2px dashed #DFE1E6',
	borderRadius: '8px',
	fontSize: '14px',
});

// ─── Host event log (shared via window events) ─────────────────────────────

type HostLogEntry = {
	message: string;
	timestamp: string;
};

const getTimestamp = (): string => new Date().toLocaleTimeString('en-US', { hour12: false });

function dispatchHostLog(message: string) {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent('native-embed-host-log', { detail: { message } }));
	}
}

// ─── Experience manifest factory ────────────────────────────────────────────

function createTestExperienceManifest(childFrameUrl: string): ExperienceManifest {
	return {
		id: experienceManifestId(TEST_EXPERIENCE_ID),
		isUrlMatch: (url: string) => url.includes('native-embed-test.local'),
		isActive: () => true,
		handleChildCommands: (_experience: Experience, cmd: NativeEmbedChildCommand) => {
			dispatchHostLog(`Child command: ${JSON.stringify(cmd)}`);
		},
		supportedFeatures: new Set<NativeEmbedFeature>(allNativeEmbedCoreFeatures),
		// Skip Smart Card URL resolution — our test URL isn't a real link
		resolveViaLinkingPlatform: false,
		// Redirect the iframe to the child frame example page
		transformUrl: () => childFrameUrl,
		uiConfig: {
			appearance: 'overlay',
			titleIcon: WhiteboardIcon,
		},
	};
}

// ─── Extension manifest ─────────────────────────────────────────────────────

/**
 * Extend the standard native-embeds extension manifest with our test-local
 * node. The render function from `default` already knows how to render any
 * experience registered with the facade.
 */
function createTestExtensionManifest(): ExtensionManifest {
	const defaultNode = nativeEmbedExtensionManifest.modules.nodes?.default;
	return {
		...nativeEmbedExtensionManifest,
		modules: {
			...nativeEmbedExtensionManifest.modules,
			nodes: {
				...nativeEmbedExtensionManifest.modules.nodes,
				// Add the test-local node using the same render as default
				[TEST_EXPERIENCE_ID]: (defaultNode ?? {
					type: 'extension' as const,
					render: () =>
						// eslint-disable-next-line import/dynamic-import-chunkname
						import('@atlassian/native-embeds-editor-extension').then((m) => m),
				}) as ExtensionModuleNode,
			},
		},
	};
}

// ─── Host Event Log UI ─────────────────────────────────────────────────────

const HostEventLog = (): React.JSX.Element => {
	const [entries, setEntries] = useState<HostLogEntry[]>([]);
	const logEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			setEntries((prev) => [
				...prev,
				{ timestamp: getTimestamp(), message: detail?.message ?? JSON.stringify(detail) },
			]);
		};
		return bind(window, {
			type: 'native-embed-host-log',
			listener: handler,
		});
	}, []);

	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [entries]);

	return (
		<div css={hostLogContainerStyles}>
			<div css={hostLogHeaderStyles}>Host Event Log ({entries.length})</div>
			{entries.length === 0 && (
				<span css={hostLogEmptyStyles}>
					No events yet — interact with the embed to see host-side events…
				</span>
			)}
			{entries.map((entry) => (
				<div key={`${entry.timestamp}-${entry.message}`} css={hostLogEntryStyles}>
					<span css={hostLogTimestampStyles}>{entry.timestamp}</span>{' '}
					<span css={hostLogRecvStyles}>↓ RECV</span> {entry.message}
				</div>
			))}
			<div ref={logEndRef} />
		</div>
	);
};

// ─── Test document ──────────────────────────────────────────────────────────

const testDoc: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: 'Native Embed — Client / Host Testing' }],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'The embed below loads a local child frame that communicates with the host via the native embed bridge. Click inside the embed to test click-event forwarding. Use the child frame buttons to send commands back to the host.',
				},
			],
		},
		{
			type: 'extension',
			attrs: {
				extensionKey: `${NATIVE_EMBED_EXTENSION_KEY}:${TEST_EXPERIENCE_ID}`,
				extensionType: NATIVE_EMBED_EXTENSION_TYPE,
				parameters: setParameters(
					{},
					{
						...NATIVE_EMBED_PARAMETER_DEFAULTS,
						url: TEST_EMBED_URL,
						height: 400,
					},
				),
			},
		},
	],
};

// ─── Main example component ─────────────────────────────────────────────────

const NativeEmbedsClientHostTestingExample = (): React.JSX.Element => {
	const [childFrameUrl, setChildFrameUrl] = useState<string>(
		() =>
			(typeof localStorage !== 'undefined' && localStorage.getItem(CHILD_FRAME_URL_STORAGE_KEY)) ||
			'',
	);
	const [activeUrl, setActiveUrl] = useState<string>('');
	const [editorKey, setEditorKey] = useState(0);
	const [editorView, setEditorView] = useState<EditorView | undefined>();

	const smartCardClient = useMemo(() => new CardClient('staging'), []);
	const providers = useMemo(() => getExamplesProviders({ sanitizePrivateContent: true }), []);

	const collabEditProvider = useMemo(
		() =>
			createCollabEditProvider({
				userId: 'quokka',
				defaultDoc: JSON.stringify(testDoc),
			}),
		[],
	);

	const appearance = 'full-page';
	const { preset } = useConfluenceFullPagePreset({
		editorAppearance: appearance,
		overridedFullPagePresetProps: { providers },
	});

	// Register the test experience and build the extension provider when the
	// child frame URL changes.
	const extensionProvider = useMemo(() => {
		if (!activeUrl) {
			return undefined;
		}

		const experienceManifest = createTestExperienceManifest(activeUrl);

		// Use registerExperienceManifest() instead of setup() because the
		// native-embeds-editor-extension import already calls setup() at module
		// level (which sets the one-shot guard). The low-level method lets us
		// add our test experience alongside the existing ones.
		getNativeEmbedFacade().registerExperienceManifest(experienceManifest);

		return new DefaultExtensionProvider([createTestExtensionManifest()]);
	}, [activeUrl]);

	const handleApplyUrl = useCallback(() => {
		if (childFrameUrl.trim()) {
			localStorage.setItem(CHILD_FRAME_URL_STORAGE_KEY, childFrameUrl.trim());
			setActiveUrl(childFrameUrl.trim());
			// Force editor re-mount to pick up new extension provider
			setEditorKey((k) => k + 1);
		}
	}, [childFrameUrl]);

	const onEditorReady = useCallback((editorActions: EditorActions) => {
		const view = editorActions._privateGetEditorView();
		setEditorView(view);
	}, []);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={smartCardClient}>
				{/* eslint-disable-next-line @atlaskit/design-system/use-primitives -- cannot use Box with Emotion css prop */}
				<div css={pageContainerStyles}>
					{/* Child frame URL configuration */}
					<div css={setupContainerStyles}>
						<div css={setupTitleStyles}>Setup: Child Frame URL</div>
						<div css={setupDescriptionStyles}>
							Open example <strong>"02-native-embed-child"</strong> in a new tab, copy its URL, and
							paste it below. The embed will load that page as its iframe content.
						</div>
						<div css={setupInputRowStyles}>
							<input
								type="text"
								value={childFrameUrl}
								onChange={(e) => setChildFrameUrl(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
								placeholder="http://localhost:9000/examples/..."
								css={inputStyles}
							/>
							<button
								type="button"
								onClick={handleApplyUrl}
								disabled={!childFrameUrl.trim()}
								css={[
									applyButtonBaseStyles,
									childFrameUrl.trim() ? applyButtonEnabledStyles : applyButtonDisabledStyles,
								]}
							>
								Apply &amp; Load
							</button>
						</div>
						{activeUrl && (
							<div css={activeUrlStyles}>
								✅ Active child frame: <code>{activeUrl}</code>
							</div>
						)}
					</div>

					{/* Host event log */}
					<HostEventLog />

					{/* Editor */}
					{activeUrl ? (
						<div key={editorKey}>
							<DevTools editorView={editorView} />
							<ComposableEditor
								preset={preset}
								appearance={appearance}
								defaultValue={testDoc}
								collabEdit={{ provider: collabEditProvider }}
								disabled={false}
								primaryToolbarIconBefore={
									<Button
										iconBefore={<AtlassianIcon />}
										appearance="subtle"
										shouldFitContainer
									></Button>
								}
								extensionProviders={extensionProvider ? [extensionProvider] : []}
								onEditorReady={onEditorReady}
								{...providers}
							/>
						</div>
					) : (
						<div css={emptyEditorStyles}>
							Enter the child frame URL above and click "Apply &amp; Load" to start testing.
						</div>
					)}
				</div>
			</SmartCardProvider>
		</IntlProvider>
	);
};

export default NativeEmbedsClientHostTestingExample;
