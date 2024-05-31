import React, { Profiler } from 'react';

//import ReactDOM from 'react-dom';
// @ts-expect-error TS7016: Could not find a declaration file for module 'react-dom/profiling'
import ReactDOM from 'react-dom/profiling';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorNextProps } from '../src/types/editor-props';
import { version } from '../src/version-wrapper';

type LibraReactPerformanceEntry = {
	id: string;
	phase: string;
	actualDuration: number;
	baseDuration: number;
	startTime: number;
	commitTime: number;
};
type EditorOperationalEvent = {
	payload: unknown;
};
type WindowForTesting = Window & {
	__mountEditor?: (props: EditorNextProps, opts: Record<string, boolean>) => void;
	__unmountEditor?: () => {
		reactPerformanceData: Array<LibraReactPerformanceEntry>;
		editorOperationalEvents: Array<EditorOperationalEvent>;
	};
	__editorView?: EditorView | null;
	__TextSelection?: TextSelection | null;
	__buildInfo?: { EDITOR_VERSION?: string } | null;
};

const RawEditor = (props: EditorNextProps) => {
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
	const preset = useUniversalPreset({ props });

	return (
		<ComposableEditor
			{...props}
			preset={preset}
			onEditorReady={onEditorReady}
			onDestroy={onDestroy}
		/>
	);
};

function createEditorExampleForTests() {
	const win = window as WindowForTesting;

	if (win.__mountEditor) {
		return;
	}
	const reactPerformanceData: Array<LibraReactPerformanceEntry> = [];
	const editorOperationalEvents: Array<EditorOperationalEvent> = [];
	const onRender = (
		id: string,
		phase: string,
		actualDuration: number,
		baseDuration: number,
		startTime: number,
		commitTime: number,
	) => {
		const entry: LibraReactPerformanceEntry = {
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
	) => {
		const target = document.getElementById('editor-container');

		if (!target) {
			return;
		}

		if (props.performanceTracking) {
			ReactDOM.render(
				<Profiler id="EditorMainComponent" onRender={onRender}>
					<AnalyticsListener onEvent={onAnalyticsEvent} channel={FabricChannel.editor}>
						<RawEditor {...props} />
					</AnalyticsListener>
				</Profiler>,
				target,
			);
		} else {
			ReactDOM.render(
				<Profiler id="EditorMainComponent" onRender={onRender}>
					<RawEditor {...props} />
				</Profiler>,
				target,
			);
		}
	};

	const unmountEditor = () => {
		const target = document.getElementById('editor-container');

		if (!target) {
			return { reactPerformanceData: [], editorOperationalEvents: [] };
		}

		ReactDOM.unmountComponentAtNode(target);
		return { reactPerformanceData, editorOperationalEvents };
	};

	win.__mountEditor = mountEditor;
	win.__unmountEditor = unmountEditor;
	win.__buildInfo = { EDITOR_VERSION: version };
}

export default function EditorExampleForIntegrationTests() {
	React.useLayoutEffect(() => {
		createEditorExampleForTests();
	}, []);

	const style = React.useMemo(() => ({ height: '100%', width: '100%' }), []);

	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	return <div id="editor-container" style={style} />;
}
