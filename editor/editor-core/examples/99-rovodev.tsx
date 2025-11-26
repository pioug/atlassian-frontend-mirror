/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Profiler, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { createRoot } from 'react-dom/client';

import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

import SidebarContainer from '../example-helpers/SidebarContainer';
import { PresetContextProvider } from '../src/presets/context';
import type { EditorNextProps } from '../src/types/editor-props';
import { version } from '../src/version-wrapper';

import FullPageExample, { getAppearance, LOCALSTORAGE_defaultDocKey } from './5-full-page';

type ReactPerformanceEntry = {
	actualDuration: number;
	baseDuration: number;
	commitTime: number;
	id: string;
	phase: string;
	startTime: number;
};
type EditorOperationalEvent = {
	payload: unknown;
};
type WindowForTesting = Window & {
	__buildInfo?: { EDITOR_VERSION?: string } | null;
	__editorView?: EditorView | null;
	__mountEditor?: (props: EditorNextProps, opts: Record<string, boolean>) => void;
	__TextSelection?: TextSelection | null;
	__unmountEditor?: () => {
		editorOperationalEvents: Array<EditorOperationalEvent>;
		reactPerformanceData: Array<ReactPerformanceEntry>;
	};
};

const disabledBlanket = css({
	position: 'absolute',
	top: '0px',
	left: '0px',
	width: '100%',
	height: '100%',
	background: 'rgba(0, 0, 0, 0.03)',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginTop: '50vh',
		marginLeft: '50vw',
	},
});

/**
 * Example designed to be similar to how the editor is within Confluence's Edit mode
 * Has:
 *  - 64px sidebar on the left
 *  - collab editing enabled
 */
const RawEditor = (props: EditorNextProps) => {
	const [disabled, setDisabled] = useState(true);
	const [appearance, setAppearance] = useState<EditorAppearance>(getAppearance() || 'full-page');

	const collabSessionId = 'quokka';

	useEffect(() => {
		// Simulate async nature of confluence fetching appearance
		const timeout = Math.floor(Math.random() * (1500 - 750 + 1)) + 750;
		console.log(`async delay is ${timeout}`);
		const appearanceTimeoutId = window.setTimeout(() => {
			setDisabled(false);
			setAppearance(getAppearance());
		}, timeout);

		return () => {
			window.clearTimeout(appearanceTimeoutId);
		};
	}, []);

	const defaultDoc =
		(localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) || undefined;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onEditorReady = React.useCallback((editorActions: any) => {
		const view = editorActions._privateGetEditorView();
		(window as WindowForTesting).__editorView = view;
		// @ts-ignore
		(window as WindowForTesting).__TextSelection = TextSelection;
	}, []);

	const onDestroy = React.useCallback(() => {
		(window as WindowForTesting).__editorView = null;
		(window as WindowForTesting).__TextSelection = null;
	}, []);

	return (
		<SidebarContainer>
			{disabled && (
				<div css={disabledBlanket}>
					<Spinner size="large" />
				</div>
			)}
			<PresetContextProvider>
				<FullPageExample
					editorProps={{
						...props,
						collabEdit: {
							provider: createCollabEditProvider({
								userId: collabSessionId,
								defaultDoc,
							}),
						},
						elementBrowser: {
							showModal: true,
							replacePlusMenu: true,
						},
						disabled,
						appearance,
						shouldFocus: true,
						onEditorReady,
						onDestroy,
					}}
				/>
			</PresetContextProvider>
		</SidebarContainer>
	);
};

function createEditorExampleForRovodev() {
	const win = window as WindowForTesting;

	if (win.__mountEditor) {
		return;
	}
	const reactPerformanceData: Array<ReactPerformanceEntry> = [];
	const editorOperationalEvents: Array<EditorOperationalEvent> = [];
	let root: ReturnType<typeof createRoot> | null = null;
	const onRender = (
		id: string,
		phase: string,
		actualDuration: number,
		baseDuration: number,
		startTime: number,
		commitTime: number,
	) => {
		const entry: ReactPerformanceEntry = {
			id,
			phase,
			actualDuration,
			baseDuration,
			startTime,
			commitTime,
		};

		reactPerformanceData.push(entry);
	};
	const onAnalyticsEvent = ({ payload }: UIAnalyticsEvent, channel: string | undefined) => {
		if (channel !== FabricChannel.editor || payload.eventType !== 'operational') {
			return;
		}
		editorOperationalEvents.push({ payload });
	};
	const mountEditor = (
		props: EditorNextProps,
		options: Record<string, boolean> = {},
		platformFeatureFlags?: Record<string, boolean>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		editorExperiments?: Record<string, any>,
	) => {
		const target = document.getElementById('editor-container');

		if (!target) {
			return;
		}

		if (platformFeatureFlags) {
			setBooleanFeatureFlagResolver((ffName) => {
				return platformFeatureFlags[ffName] ?? false;
			});
		}

		setupEditorExperiments('test', editorExperiments || {});

		root = createRoot(target);
		root.render(
			<Profiler id="EditorMainComponent" onRender={onRender}>
				<AnalyticsListener onEvent={onAnalyticsEvent} channel={FabricChannel.editor}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<RawEditor {...props} />
				</AnalyticsListener>
			</Profiler>,
		);
	};

	const unmountEditor = () => {
		if (!root) {
			return { reactPerformanceData: [], editorOperationalEvents: [] };
		}

		root.unmount();
		root = null;
		return { reactPerformanceData, editorOperationalEvents };
	};

	win.__mountEditor = mountEditor;
	win.__unmountEditor = unmountEditor;
	win.__buildInfo = { EDITOR_VERSION: version };
}

/**
 * Editor example component for rovodev with __mountEditor support.
 */
export default function EditorExampleForRovodev() {
	React.useLayoutEffect(() => {
		createEditorExampleForRovodev();
	}, []);

	const style = React.useMemo(() => ({ height: '100%', width: '100%' }), []);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div id="editor-container" style={style}>
			This example is intended for rovodev to load programmatically via window.__mountEditor().
		</div>
	);
}
