/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	createNativeEmbedChildClient,
	maybeParseNativeEmbedParams,
	NativeEmbedCoreFeature,
	type NativeEmbedFeature,
} from '@atlassian/native-embeds-core/child-client';

type LogEntry = {
	direction: 'received' | 'sent';
	message: string;
	timestamp: string;
};

const getTimestamp = (): string => new Date().toLocaleTimeString('en-US', { hour12: false });

const containerStyles = css({
	fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	padding: '16px',
	fontSize: '13px',
	height: '100%',
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	background: '#FAFBFC',
});

const headerStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
	marginBottom: '12px',
	paddingBottom: '8px',
	borderBottom: '1px solid #DFE1E6',
});

const statusDotStyles = css({
	width: '10px',
	height: '10px',
	borderRadius: '50%',
	flexShrink: 0,
});

const headerTitleStyles = css({
	fontSize: '14px',
});

const headerStatusStyles = css({
	color: '#6B778C',
	marginLeft: 'auto',
});

const errorMessageStyles = css({
	padding: '8px 12px',
	backgroundColor: '#FFEBE6',
	borderRadius: '4px',
	color: '#BF2600',
	marginBottom: '12px',
});

const connectionInfoStyles = css({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr',
	gap: '4px 12px',
	marginBottom: '12px',
	fontSize: '12px',
});

const labelStyles = css({
	color: '#6B778C',
});

const codeValueStyles = css({
	fontSize: '11px',
	wordBreak: 'break-all',
});

const buttonContainerStyles = css({
	display: 'flex',
	gap: '8px',
	marginBottom: '12px',
	flexWrap: 'wrap',
});

const buttonBaseStyles = css({
	padding: '6px 12px',
	borderRadius: '4px',
	border: '1px solid #DFE1E6',
	fontSize: '12px',
});

const buttonEnabledStyles = css({
	backgroundColor: '#0052CC',
	color: '#FFFFFF',
	cursor: 'pointer',
});

const buttonDisabledStyles = css({
	backgroundColor: '#F4F5F7',
	color: '#A5ADBA',
	cursor: 'not-allowed',
});

const logHeaderStyles = css({
	fontSize: '12px',
	color: '#6B778C',
	marginBottom: '4px',
});

const logContainerStyles = css({
	flex: 1,
	minHeight: '100px',
	maxHeight: '200px',
	overflowY: 'auto',
	border: '1px solid #DFE1E6',
	borderRadius: '4px',
	backgroundColor: '#FFFFFF',
	padding: '8px',
	fontSize: '11px',
	fontFamily: 'monospace',
});

const logEmptyStyles = css({
	color: '#A5ADBA',
	fontStyle: 'italic',
});

const logEntryBaseStyles = css({
	padding: '2px 0',
	borderBottom: '1px solid #F4F5F7',
});

const logEntrySentStyles = css({
	color: '#0052CC',
});

const logEntryReceivedStyles = css({
	color: '#00875A',
});

const logTimestampStyles = css({
	color: '#6B778C',
});

const logDirectionStyles = css({
	fontWeight: 600,
});

/**
 * A standalone child iframe component that simulates a native embed child.
 *
 * This component:
 * - Parses nativeEmbedChildId and nativeEmbedParentId from URL query params
 * - Initializes the Rovo content bridge and creates a NativeEmbedChildClient
 * - Performs the feature handshake with the host
 * - Displays connection status, agreed features, and a command log
 * - Provides buttons to send commands back to the host
 */
const NativeEmbedChildFrame = (): React.JSX.Element => {
	const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>(
		'connecting',
	);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [childId, setChildId] = useState<string>('');
	const [parentId, setParentId] = useState<string>('');
	const [agreedFeatures, setAgreedFeatures] = useState<string[]>([]);
	const [viewMode, setViewMode] = useState<string>('regular');
	const [isSelected, setIsSelected] = useState<boolean>(false);
	const [log, setLog] = useState<LogEntry[]>([]);
	const clientRef = useRef<ReturnType<typeof createNativeEmbedChildClient> | null>(null);
	const logEndRef = useRef<HTMLDivElement>(null);

	const addLog = useCallback((direction: LogEntry['direction'], message: string) => {
		setLog((prev) => [...prev, { timestamp: getTimestamp(), direction, message }]);
	}, []);

	useEffect(() => {
		const params = maybeParseNativeEmbedParams(new URLSearchParams(window.location.search));

		if (!params) {
			setConnectionStatus('error');
			setErrorMessage(
				'Missing query params: nativeEmbedChildId and nativeEmbedParentId are required. ' +
					'This page should be loaded as an iframe child from the host example.',
			);
			return;
		}

		const { childClientId, parentClientId } = params;
		setChildId(childClientId);
		setParentId(parentClientId);

		try {
			// Get the bridge singleton — same bridge instance shared across parent and child windows
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const { getBrowserBridgeAPI } = require('@atlassian/rovo-content-bridge-api/singleton');
			const bridge = getBrowserBridgeAPI();

			// Create the child client with all core features supported
			const supportedFeatures = new Set<NativeEmbedFeature>([
				NativeEmbedCoreFeature.NotifyHostClick,
				NativeEmbedCoreFeature.SelectedChange,
				NativeEmbedCoreFeature.ViewModeChange,
				NativeEmbedCoreFeature.OpenFullScreen,
			]);

			const childClient = createNativeEmbedChildClient(
				bridge,
				childClientId,
				parentClientId,
				supportedFeatures,
			);

			clientRef.current = childClient;
			addLog('sent', 'Feature handshake sent to host');

			// Wait for the feature handshake to complete
			childClient.nativeEmbedFeatures().then((features) => {
				setAgreedFeatures(Array.from(features));
				setConnectionStatus('connected');
				addLog(
					'received',
					`Feature handshake complete. Agreed features: ${Array.from(features).join(', ') || 'none'}`,
				);
			});

			// Listen for commands from the host
			childClient.onNativeEmbedCommand((params) => {
				addLog('received', `Host command: ${JSON.stringify(params)}`);
			});

			// Listen for selected state changes
			childClient.onSelectedChange(({ selected }) => {
				setIsSelected(selected);
				addLog('received', `Selected change: ${selected}`);
			});

			// Listen for view mode changes
			childClient.onViewModeChange(({ viewMode: mode }) => {
				setViewMode(mode);
				addLog('received', `View mode change: ${mode}`);
			});
		} catch (err) {
			setConnectionStatus('error');
			setErrorMessage(
				`Failed to initialize bridge: ${err instanceof Error ? err.message : String(err)}`,
			);
		}

		return () => {
			clientRef.current?.destroy();
		};
	}, [addLog]);

	// Auto-scroll log to bottom
	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [log]);

	const handleSendChildCommand = useCallback(() => {
		if (!clientRef.current) {
			return;
		}
		clientRef.current.sendChildCommand({ type: 'test-child-command' });
		addLog('sent', 'Child command: { type: "test-child-command" }');
	}, [addLog]);

	const handleSendOpenFullScreen = useCallback(() => {
		if (!clientRef.current) {
			return;
		}
		clientRef.current.sendOpenFullScreen();
		addLog('sent', 'Open full-screen request');
	}, [addLog]);

	const statusColor =
		connectionStatus === 'connected'
			? '#36B37E'
			: connectionStatus === 'error'
				? '#FF5630'
				: '#FFAB00';

	return (
		<div css={containerStyles}>
			{/* Header */}
			<div css={headerStyles}>
				<div
					css={statusDotStyles}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic backgroundColor based on connection status
					style={{ backgroundColor: statusColor }}
				/>
				<strong css={headerTitleStyles}>Native Embed Child Frame</strong>
				<span css={headerStatusStyles}>{connectionStatus}</span>
			</div>

			{/* Error message */}
			{connectionStatus === 'error' && <div css={errorMessageStyles}>{errorMessage}</div>}

			{/* Connection info */}
			<div css={connectionInfoStyles}>
				<span css={labelStyles}>Child ID:</span>
				<code css={codeValueStyles}>{childId || '—'}</code>
				<span css={labelStyles}>Parent ID:</span>
				<code css={codeValueStyles}>{parentId || '—'}</code>
				<span css={labelStyles}>View Mode:</span>
				<span>{viewMode}</span>
				<span css={labelStyles}>Selected:</span>
				<span>{isSelected ? '✅ Yes' : '❌ No'}</span>
				<span css={labelStyles}>Features:</span>
				<span>{agreedFeatures.length > 0 ? agreedFeatures.join(', ') : '—'}</span>
			</div>

			{/* Action buttons */}
			<div css={buttonContainerStyles}>
				<button
					type="button"
					onClick={handleSendChildCommand}
					disabled={connectionStatus !== 'connected'}
					css={[
						buttonBaseStyles,
						connectionStatus === 'connected' ? buttonEnabledStyles : buttonDisabledStyles,
					]}
				>
					Send Child Command
				</button>
				<button
					type="button"
					onClick={handleSendOpenFullScreen}
					disabled={connectionStatus !== 'connected'}
					css={[
						buttonBaseStyles,
						connectionStatus === 'connected' ? buttonEnabledStyles : buttonDisabledStyles,
					]}
				>
					Request Full Screen
				</button>
			</div>

			{/* Command log */}
			<div css={logHeaderStyles}>Command Log ({log.length})</div>
			<div css={logContainerStyles}>
				{log.length === 0 && <div css={logEmptyStyles}>No commands yet…</div>}
				{log.map((entry) => (
					<div
						key={`${entry.timestamp}-${entry.direction}-${entry.message}`}
						css={[
							logEntryBaseStyles,
							entry.direction === 'sent' ? logEntrySentStyles : logEntryReceivedStyles,
						]}
					>
						<span css={logTimestampStyles}>{entry.timestamp}</span>{' '}
						<span css={logDirectionStyles}>{entry.direction === 'sent' ? '↑ SENT' : '↓ RECV'}</span>{' '}
						{entry.message}
					</div>
				))}
				<div ref={logEndRef} />
			</div>
		</div>
	);
};

export default NativeEmbedChildFrame;
