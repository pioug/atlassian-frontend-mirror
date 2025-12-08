import React, { Profiler } from 'react';

import { createRoot, type Root } from 'react-dom/client';

import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type EditorActions from '../src/actions';
import Editor from '../src/editor';
import type { EditorProps } from '../src/types/editor-props';
import { version } from '../src/version-wrapper';

interface TestExtensionProviders {
	[key: string]: boolean | undefined;
	extensionFrameManifest?: boolean;
	floatingToolbarManifest?: boolean;
}
type MountEditorOptions = {
	/** Api mock configurations */
	datasourceMocks?: {
		initialVisibleColumnKeys?: string[];
		shouldMockAssets?: boolean;
		shouldMockORSBatch?: boolean;
	};
	extensionHandlers?: boolean;
	i18n?: { locale: string };
	invalidAltTextValues?: string[];
	isLivePage?: boolean;
	mode?: 'dark';
	providers?: Record<string, boolean>;
	withCollab?: boolean;
	withConfluenceMacrosExtensionProvider?: boolean;
	withContextPanel?: boolean;
	withLinkCreateJira?: boolean;
	withLinkPickerOptions?: boolean;
	withSidebar?: boolean;
	/** Toggles chosen extension providers */
	withTestExtensionProviders?: TestExtensionProviders;
	withTitleFocusHandler?: boolean;
};

type LibraReactPerformanceEntry = {
	actualDuration: number;
	baseDuration: number;
	commitTime: number;
	id: string;
	phase: string;
	startTime: number;
};
type WindowForTesting = Window & {
	__buildInfo?: { EDITOR_VERSION?: string } | null;
	__editorView?: EditorView | null;
	__mountEditor?: (props: EditorProps, opts: MountEditorOptions) => void;
	__TextSelection?: TextSelection | null;
	__unmountEditor?: () => Array<LibraReactPerformanceEntry>;
};

const RawEditor = (props: EditorProps) => {
	const onEditorReady = React.useCallback((editorActions: EditorActions) => {
		const view = editorActions._privateGetEditorView();
		(window as WindowForTesting).__editorView = view;
		// @ts-ignore
		(window as WindowForTesting).__TextSelection = TextSelection;
	}, []);

	const onDestroy = React.useCallback(() => {
		(window as WindowForTesting).__editorView = null;
		(window as WindowForTesting).__TextSelection = null;
	}, []);

	return <Editor {...props} onEditorReady={onEditorReady} onDestroy={onDestroy} />;
};

function createEditorExampleForTests() {
	const win = window as WindowForTesting;
	if (win.__mountEditor) {
		return;
	}
	let root: Root | null = null;
	const reactPeformanceData: Array<LibraReactPerformanceEntry> = [];
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

		reactPeformanceData.push(entry);
	};
	const mountEditor = (
		props: EditorProps,
		options: MountEditorOptions = {},
		platformFeatureFlags?: Record<string, boolean>,
	) => {
		const target = document.getElementById('editor-container');

		if (!target) {
			return;
		}

		root = createRoot(target);
		root.render(
			<Profiler id="EditorMainComponent" onRender={onRender}>
				<RawEditor {...props} />
			</Profiler>,
		);
	};

	const unmountEditor = () => {
		const target = document.getElementById('editor-container');

		if (!target) {
			return [];
		}

		if (root) {
			root.unmount();
			root = null;
		}

		return reactPeformanceData;
	};

	win.__mountEditor = mountEditor;
	win.__unmountEditor = unmountEditor;
	win.__buildInfo = { EDITOR_VERSION: version };
}

export default function EditorExampleForIntegrationTests(): React.JSX.Element {
	React.useLayoutEffect(() => {
		createEditorExampleForTests();
	}, []);

	const style = React.useMemo(() => ({ height: '100%', width: '100%' }), []);

	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	return <div id="editor-container" style={style} />;
}
