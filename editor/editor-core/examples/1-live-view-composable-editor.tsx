import React from 'react';

import { IntlProvider } from 'react-intl-next';

import {
	EditorExampleControls,
	getExamplesProviders,
	useEditorAndRendererAnnotationProviders,
} from '@af/editor-examples-helpers/utils';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { codeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
// Commented out - see below
import { selectionExtensionPlugin } from '@atlaskit/editor-plugin-selection-extension';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import AppIcon from '@atlaskit/icon/core/app';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { simpleMockProfilecardClient } from '@atlaskit/util-data-test/get-mock-profilecard-client';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { ExampleForgeApp } from '../example-helpers/ExampleForgeApp';
import enMessages from '../src/i18n/en';

const smartLinksProvider = new ConfluenceCardProvider('staging');
const smartCardClient = new ConfluenceCardClient('staging');

const EXAMPLE_NAME = 'live-view-composable-editor';

// @ts-ignore @typescript-eslint/no-explicit-any
const MockProfileClient: any = simpleMockProfilecardClient();

function getDefaultValue() {
	const doc = localStorage.getItem(`${EXAMPLE_NAME}-doc`);
	return doc ? JSON.parse(doc) : '';
}

function ComposableEditorPage() {
	const [appearance, setAppearance] = React.useState<EditorAppearance>('full-page');
	const providers = getExamplesProviders({});

	const editorAndRendererAnnotationProviders = useEditorAndRendererAnnotationProviders();
	const universalPreset = useUniversalPreset({
		props: {
			appearance,
			mentionProvider: Promise.resolve(mentionResourceProvider),
			mention: {
				profilecardProvider: Promise.resolve({
					cloudId: 'DUMMY-CLOUDID',
					resourceClient: MockProfileClient,
					getActions: (id: string) => {
						const actions = [
							{
								label: 'Mention',
								callback: () => {},
							},
							{
								label: 'Message',
								callback: () => {},
							},
						];

						return id === '1' ? actions : actions.slice(0, 1);
					},
				}),
			},
			allowBorderMark: true,
			allowStatus: true,
			allowTasksAndDecisions: true,
			allowAnalyticsGASV3: true,
			allowExpand: {
				allowInsertion: true,
				allowInteractiveExpand: true,
			},
			allowFragmentMark: true,
			allowExtension: {
				allowExtendFloatingToolbars: true,
			},
			allowBreakout: true,
			allowLayouts: { allowBreakout: true },
			allowTables: {
				advanced: true,
				stickyHeaders: true,
				allowTableAlignment: true,
				allowTableResizing: true,
				allowNestedTables: true,
			},
			allowDate: true,
			allowRule: true,
			allowPanel: { allowCustomPanel: true, allowCustomPanelEdit: true },
			allowFindReplace: true,
			annotationProviders: {
				inlineComment: editorAndRendererAnnotationProviders.editorAnnotationProviders.inlineComment,
			},
			media: {
				provider: providers.mediaProvider,
				allowMediaSingle: true,
				enableDownloadButton: true,
				allowResizing: true,
				allowLinking: true,
				allowResizingInTables: true,
				allowAltTextOnImages: true,
				allowCaptions: true,
				allowMediaInlineImages: true,
				allowImagePreview: true,
				featureFlags: {
					...exampleMediaFeatureFlags,
					mediaInline: true,
				},
			},
			elementBrowser: {
				showModal: true,
				replacePlusMenu: true,
			},
			linking: {
				smartLinks: {
					allowBlockCards: true,
					allowEmbeds: true,
					allowResizing: true,
					provider: Promise.resolve(smartLinksProvider),
				},
			},
			__livePage: true,
			defaultValue: getDefaultValue(),
			featureFlags: {
				'nested-expand-in-expand-ex': true,
				'table-drag-and-drop': true,
			},
			allowTemplatePlaceholders: true,
		},
	});

	// Memoise the preset otherwise we will re-render the editor too often
	const { preset, editorApi } = usePreset(() => {
		return universalPreset
			.add([
				editorViewModePlugin,
				editorExperiment('live_pages_graceful_edit', 'control')
					? { mode: 'edit' }
					: { initialContentMode: 'live-edit' },
			])
			.add(selectionMarkerPlugin)
			.add(codeBlockAdvancedPlugin)
			.add([
				selectionExtensionPlugin,
				{
					pageModes: ['view', 'live-view', 'edit', 'live-edit'],
					extensions: {
						firstParty: [
							{
								name: 'Create Jira Issue',
								onClick: (params) => {
									console.log(JSON.stringify(params));
								},
							},
							{
								name: 'Component Example',
								component: ({ closeExtension, selection }) => {
									return <ExampleForgeApp closeExtension={closeExtension} selection={selection} />;
								},
							},
						],
						external: [
							{
								name: 'App 1',
								icon: AppIcon,
								onClick: (params) => {
									console.log(JSON.stringify(params));
								},
							},
							{
								name: 'App 2',
								icon: AppIcon,
								component: ({ closeExtension, selection }) => {
									return <ExampleForgeApp closeExtension={closeExtension} selection={selection} />;
								},
							},
						],
					},
				},
			]);

		// The only things that cause a re-creation of the preset is something in the
		// universal preset to be consistent with current behaviour (ie. this could
		// be a page width change via the `appearance` prop).
	}, [universalPreset]);

	// @typescript-eslint/no-explicit-any
	const onDocumentChanged = (adf: any) => {
		if (adf?.state?.doc) {
			localStorage.setItem(`${EXAMPLE_NAME}-doc`, JSON.stringify(adf?.state?.doc));
		}
	};

	return (
		<SmartCardProvider client={smartCardClient}>
			<EditorExampleControls
				appearance={appearance}
				onFullWidthChange={() => {
					if (appearance === 'full-page') {
						setAppearance('full-width');
					} else if (appearance === 'full-width') {
						setAppearance('full-page');
					}
				}}
				onViewMode={() => {
					editorApi?.core?.actions.execute(
						editorApi?.editorViewMode?.commands.updateViewMode(
							editorApi?.editorViewMode.sharedState.currentState()?.mode === 'edit'
								? 'view'
								: 'edit',
						),
					);
					editorApi?.core?.actions.execute(
						editorApi?.editorViewMode?.commands.updateContentMode({
							type: 'switch-content-mode',
							contentMode:
								editorApi?.editorViewMode.sharedState.currentState()?.contentMode === 'live-edit'
									? 'live-view'
									: 'live-edit',
						}),
					);
				}}
			/>
			<StateMonitor getState={editorApi?.editorViewMode.sharedState.currentState} />
			<IntlProvider locale={'en'} messages={enMessages}>
				<ComposableEditor
					appearance={appearance}
					preset={preset}
					defaultValue={getDefaultValue()}
					onChange={(adf) => onDocumentChanged(adf)}
					mentionProvider={Promise.resolve(mentionResourceProvider)}
					__livePage={true}
				/>
			</IntlProvider>
		</SmartCardProvider>
	);
}

export default function ComposableEditorPageWrapper() {
	return (
		<>
			<EditorContext>
				<ComposableEditorPage />
			</EditorContext>
		</>
	);
}

/**
 * React component that re renders to monitor non React state changes
 */
// @typescript-eslint/no-explicit-any
function StateMonitor({ getState, delay = 500 }: { getState?: () => any; delay?: number }) {
	const [state, setState] = React.useState<string>();

	React.useEffect(() => {
		if (getState === undefined) {
			return;
		}
		const interval = setInterval(() => {
			setState(JSON.stringify(getState()));
		}, delay);

		return () => clearInterval(interval);
	}, [getState, delay]);

	return <>non react state: {state}</>;
}
