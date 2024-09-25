import React, { Profiler } from 'react';

// @ts-expect-error TS7016: Could not find a declaration file for module 'react-dom/profiling'
import ReactDOM from 'react-dom/profiling';

import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { autoformattingProvider } from '@atlaskit/editor-test-helpers/autoformatting-provider';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { getConfluenceMacrosExtensionProvider } from '@atlaskit/editor-test-helpers/example-helpers';
import {
	ExampleCreateInlineCommentComponent,
	ExampleViewInlineCommentComponent,
	getXProductExtensionProvider,
} from '@atlaskit/editor-test-helpers/example-helpers';
import { MockActivityResource } from '@atlaskit/editor-test-helpers/example-helpers';
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { APIError } from '@atlaskit/linking-common';
import { getData } from '@atlaskit/media-integration-test-helpers/card-client';
import type { ResolveResponse } from '@atlaskit/smart-card/types';
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { createSearchProvider, Scope } from '@atlassian/search-provider';

import type { EditorNextProps, EditorProps } from '../src/types/editor-props';
import { version } from '../src/version-wrapper';

const searchProvider = createSearchProvider(
	'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
	Scope.ConfluencePageBlog,
	'https://api-private.stg.atlassian.com/gateway/api/xpsearch-aggregator',
);

// copied from packages/media/media-integration-test-helpers/src/integration/smart-links-mock-client-utils.ts
class MockedSmartCardClientNoTimeout extends CardClient {
	mockRequest(url: string): Promise<ResolveResponse & { datasources?: Array<any> }> {
		const data = getData(url)!;
		return new Promise((resolve, reject) => {
			const resolution = () => {
				if (url.endsWith('fatal')) {
					reject(new APIError('fatal', 'randomhost', 'It all went wrong'));
				}
				if (url.includes('errored')) {
					reject(new Error('Ohhhh boy'));
				} else {
					resolve(data);
				}
			};

			window.setTimeout(resolution, 0);
		});
	}

	fetchData(url: string): Promise<ResolveResponse> {
		return this.mockRequest(url);
	}

	async prefetchData(url: string): Promise<ResolveResponse | undefined> {
		return this.mockRequest(url);
	}
}
const cardClient = new MockedSmartCardClientNoTimeout('staging');
const editorProps: EditorProps = {
	appearance: 'full-page',
	shouldFocus: false,
	disabled: false,
	placeholder:
		"Type /ai for Atlassian Intelligence, / to add elements, or @ to mention someone (we'll let them know).",
	//defaultValue: '{"type":"doc","content":[{"type":"paragraph"}],"version":1}',
	trackValidTransactions: {
		samplingRate: 300,
	},
	featureFlags: {
		'add-column-custom-step': false,
		'ai-feedback-collector_49l2q': true,
		'all-pages': false,
		'allow-windowed-code-block': false,
		'allow.synchrony.recovery': true,
		'analytics-instance-name-attribute': 'Hello',
		'blank.blogpost': true,
		'blank.page': true,
		'collab-disconnect-tracking': true,
		'collapsed-breadcrumbs': 'collapse-and-remove-people',
		'custom-panel': true,
		'disable-spellcheck-by-browser': '{}',
		disableChromeSpellchecking: false,
		'editor-plugin-ai': true,
		'enable-stage0-for-ncs': false,
		'enable-sticky-table-headers': true,
		'enable.editing.for.single.user': false,
		'expanded-chart-colors': false,
		'floating-toolbar-copy-button': true,
		'hidden-save-indicator': false,
		'hide-table-expand': false,
		'indentation-buttons-in-the-toolbar': true,
		'initial.preload': true,
		'inline-edit': false,
		intercom: true,
		'lp-link-picker': true,
		'macro.adf.frontend.render': true,
		'media.inline': true,
		'only-fetch-draft-content': false,
		'performance-tracking':
			'{"pasteTracking":{"enabled":true},"bFreezeTracking":{"trackInteractionType":true,"trackSeverity":true},"contentRetrievalTracking":{"successSamplingRate":5,"failureSamplingRate":1,"reportErrorStack":false,"enabled":true},"onEditorReadyCallbackTracking":{"enabled":true},"inputTracking":{"trackSeverity":true,"severityDegradedThreshold":273,"samplingRate":100,"countNodes":true,"severityNormalThreshold":143,"enabled":true},"renderTracking":{"editor":{"useShallow":false,"enabled":true},"reactEditorView":{"useShallow":true,"enabled":true}},"uiTracking":{"samplingRate":100,"enabled":true},"ttiTracking":{"trackSeverity":true,"ttiSeverityNormalThreshold":8000,"ttiSeverityDegradedThreshold":10000,"ttiFromInvocationSeverityDegradedThreshold":7813,"ttiFromInvocationSeverityNormalThreshold":4804,"enabled":true},"transactionTracking":{"usePerformanceMarks":true,"samplingRate":100,"enabled":true},"onChangeCallbackTracking":{"enabled":true},"catchAllTracking":{"enabled":false}}',
		'preload.timeout': '0',
		'renderer-render-tracking': '{}',
		'renderer-tti-tracking': true,
		'replace-extensions-entry-point': true,
		'restart-numbered-lists': true,
		'satisfaction.survey': true,
		showAvatarGroupAsPlugin: true,
		'slash.placeholder.hint': false,
		'smartcards.macro-override':
			'jira,jiraroadmap,google-drive-sheets,google-drive-docs,OneDrive,google-drive-slides',
		'synchrony.track-performance': true,
		'synchrony.unique.user.max.participants': true,
		'tti-tracking': '{"enabled":true}',
		twoLineEditorToolbar: true,
		ufo: true,
		'use-pubsub-publish-events': false,
		'user.internet.connection.indicator': true,
		'valid-transactions-tracking': '{"samplingRate":300}',
		'sticky-scrollbar': false,
	},
	performanceTracking: {
		pasteTracking: {
			enabled: true,
		},
		bFreezeTracking: {
			trackInteractionType: true,
			trackSeverity: true,
		},
		contentRetrievalTracking: {
			successSamplingRate: 5,
			failureSamplingRate: 1,
			reportErrorStack: false,
			enabled: true,
		},
		onEditorReadyCallbackTracking: {
			enabled: true,
		},
		inputTracking: {
			trackSeverity: true,
			severityDegradedThreshold: 273,
			samplingRate: 100,
			countNodes: true,
			severityNormalThreshold: 143,
			enabled: true,
		},
		renderTracking: {
			editor: {
				useShallow: false,
				enabled: true,
			},
			reactEditorView: {
				useShallow: true,
				enabled: true,
			},
		},
		uiTracking: {
			samplingRate: 100,
			enabled: true,
		},
		ttiTracking: {
			trackSeverity: true,
			ttiIdleThreshold: 0,
			ttiSeverityNormalThreshold: 8000,
			ttiSeverityDegradedThreshold: 10000,
			ttiFromInvocationSeverityDegradedThreshold: 7813,
			ttiFromInvocationSeverityNormalThreshold: 4804,
			enabled: true,
		},
		transactionTracking: {
			usePerformanceMarks: true,
			samplingRate: 100,
			enabled: true,
		},
		onChangeCallbackTracking: {
			enabled: true,
		},
		catchAllTracking: {
			enabled: false,
		},
	},
	sanitizePrivateContent: true,
	media: {
		allowMediaSingle: true,
		allowResizing: true,
		allowResizingInTables: true,
		allowLinking: true,
		allowAltTextOnImages: true,
		allowCaptions: true,
		featureFlags: {
			folderUploads: false,
			mediaInline: true,
		},
	},
	allowUndoRedoButtons: true,
	linking: {
		smartLinks: {
			provider: Promise.resolve(cardProviderStaging),
			resolveBeforeMacros: [
				'jira',
				'jiraroadmap',
				'google-drive-sheets',
				'google-drive-docs',
				'OneDrive',
				'google-drive-slides',
			],
			allowBlockCards: true,
			allowEmbeds: true,
			allowDatasource: true,
		},
		linkPicker: {
			plugins: [
				{
					resolve: () => {
						return Promise.resolve({ data: [] });
					},
				},
			],
		},
	},
	// Cleanup: `platform_editor_remove_hide_avatar_group_prop`
	// Remove `hideAvatarGroup` prop
	hideAvatarGroup: true,
	allowExpand: {
		allowInsertion: true,
		allowInteractiveExpand: true,
	},
	allowNestedTasks: true,
	allowTasksAndDecisions: true,
	allowBreakout: true,
	allowRule: true,
	allowHelpDialog: true,
	allowPanel: {
		allowCustomPanel: true,
		allowCustomPanelEdit: true,
	},
	allowExtension: {
		allowBreakout: true,
		allowExtendFloatingToolbars: true,
	},
	allowConfluenceInlineComment: true,
	allowTemplatePlaceholders: true,
	allowDate: true,
	allowLayouts: {
		allowBreakout: true,
		UNSAFE_addSidebarLayouts: true,
	},
	allowStatus: {
		menuDisabled: false,
	},
	allowTextAlignment: true,
	allowIndentation: true,
	showIndentationButtons: true,
	allowFindReplace: {
		allowMatchCase: true,
	},
	allowBorderMark: true,
	allowFragmentMark: true,
	elementBrowser: {
		showModal: true,
		replacePlusMenu: true,
	},
	mentionInsertDisplayName: true,
	waitForMediaUpload: true,
	allowTextColor: true,
	allowTables: {
		allowBackgroundColor: true,
		allowColumnResizing: true,
		allowColumnSorting: true,
		allowDistributeColumns: true,
		allowHeaderColumn: true,
		allowHeaderRow: true,
		allowMergeCells: true,
		allowNumberColumn: true,
		allowControls: true,
		permittedLayouts: 'all',
		stickyHeaders: true,
		allowAddColumnWithCustomStep: false,
		allowCollapse: false,
	},
	allowAnalyticsGASV3: true,
	codeBlock: {
		allowCopyToClipboard: true,
	},

	emojiProvider: getEmojiProvider({
		uploadSupported: true,
		currentUser,
	}),
	mentionProvider: Promise.resolve(mentionResourceProvider),
	taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
	contextIdentifierProvider: storyContextIdentifierProviderFactory(),
	activityProvider: Promise.resolve(new MockActivityResource()),
	searchProvider: Promise.resolve(searchProvider),
	macroProvider: Promise.resolve(macroProvider),
	autoformattingProvider: Promise.resolve(autoformattingProvider),

	annotationProviders: {
		inlineComment: {
			createComponent: ExampleCreateInlineCommentComponent,
			viewComponent: ExampleViewInlineCommentComponent,
			updateSubscriber: new AnnotationUpdateEmitter(),
			getState: () => {
				return Promise.resolve([]);
			},
			disallowOnWhitespace: true,
		},
	},
	extensionProviders: [
		getXProductExtensionProvider(),
		getConfluenceMacrosExtensionProvider(undefined, undefined),
	],
};

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

const RawEditor = ({ defaultValue }: Pick<EditorNextProps, 'defaultValue'>) => {
	const props = editorProps;
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
	const preset = useUniversalPreset({ props });

	return (
		<ComposableEditor
			{...props}
			defaultValue={defaultValue}
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

		ReactDOM.render(
			<Profiler id="EditorMainComponent" onRender={onRender}>
				<AnalyticsListener onEvent={onAnalyticsEvent} channel={FabricChannel.editor}>
					<SmartCardProvider client={cardClient}>
						<RawEditor defaultValue={props.defaultValue} />
					</SmartCardProvider>
				</AnalyticsListener>
			</Profiler>,
			target,
		);
	};

	const unmountEditor = () => {
		const target = document.getElementById('editor-container');

		if (!target) {
			return {
				reactPerformanceData: [],
				editorOperationalEvents: [],
			};
		}

		ReactDOM.unmountComponentAtNode(target);
		return {
			reactPerformanceData,
			editorOperationalEvents,
		};
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
