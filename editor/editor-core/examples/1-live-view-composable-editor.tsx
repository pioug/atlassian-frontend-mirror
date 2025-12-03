import React, { useRef, useState } from 'react';

import type { BlockMenuItemConfiguration } from 'packages/editor/editor-plugin-selection-extension/src/types';
import { IntlProvider } from 'react-intl-next';

import {
	EditorExampleControls,
	getExamplesProviders,
	localStorageFetchProvider,
	localStorageWriteProvider,
} from '@af/editor-examples-helpers/utils';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { blockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import { blockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import { codeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
// Commented out - see below
import {
	type ExtensionConfiguration,
	selectionExtensionPlugin,
} from '@atlaskit/editor-plugin-selection-extension';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import type { SyncedBlockPluginOptions } from '@atlaskit/editor-plugin-synced-block';
import { SyncedBlockProvider } from '@atlaskit/editor-synced-block-provider';
import { getSyncedBlockRenderer } from '@atlaskit/editor-synced-block-renderer';
import { useEditorAnnotationProviders } from '@atlaskit/editor-test-helpers/annotation-example';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import { AddIcon } from '@atlaskit/editor-toolbar';
import AppIcon from '@atlaskit/icon/core/app';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled - go/akcss
import { xcss, Pressable } from '@atlaskit/primitives';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { simpleMockProfilecardClient } from '@atlaskit/util-data-test/get-mock-profilecard-client';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { addLinksToTable, addLinksToTaskList } from '../example-helpers/add-links-mock';
import { ExampleForgeApp } from '../example-helpers/ExampleForgeApp';
import { useNoteSelectionExtension } from '../example-helpers/useNoteSelectionExtension';
import enMessages from '../src/i18n/en';

const buttonStyles = xcss({
	position: 'fixed',
	bottom: 'space.0',
	right: 'space.0',
});

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

	const editorApiRef: any = useRef<typeof editorApi | null>(null);

	const [createButton, showCreateButton] = useState<string | null>(null);
	const selectedNodeAdfRef = React.useRef<any>(null);
	const selectionRangesRef = React.useRef<any>(null);
	const editorAnnotationProviders = useEditorAnnotationProviders();

	const syncedBlock: SyncedBlockPluginOptions = {
		syncedBlockRenderer: getSyncedBlockRenderer({
			syncBlockRendererOptions: undefined,
		}),
		syncBlockDataProvider: new SyncedBlockProvider(
			localStorageFetchProvider,
			localStorageWriteProvider,
			'sourceId',
			{
				parentDataProviders: {
					mentionProvider: undefined,
					profilecardProvider: undefined,
					taskDecisionProvider: undefined,
				},
				providerCreator: {
					createEmojiProvider: undefined,
					createMediaProvider: undefined,
				},
			},
		),
	};

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
				inlineComment: editorAnnotationProviders.inlineComment,
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
			syncBlock: syncedBlock,
		},

		initialPluginConfiguration: {
			tasksAndDecisionsPlugin: {
				hasEditPermission: false,
			},
		},
	});
	const noteSelectionExtension = useNoteSelectionExtension(editorApiRef.current);

	const getCreateJiraIssueMenuItem = () => {
		const selectionResult = editorApiRef?.current.selectionExtension?.actions.getSelectionAdf();

		// Determine if multiple rows are selected
		const multipleRowsSelected =
			selectionResult?.selectedNodeAdf.type === 'table' &&
			selectionResult?.selectionRanges &&
			selectionResult?.selectionRanges.length > 1;

		if (multipleRowsSelected) {
			return {
				label: 'Multiple Issues',
				icon: AddIcon,
				onClick: () => {
					showCreateButton('multiple');
					selectedNodeAdfRef.current = selectionResult?.selectedNodeAdf;
					selectionRangesRef.current = selectionResult?.selectionRanges;
				},
			};
		} else {
			return {
				label: 'Single Issue',
				icon: AddIcon,
				onClick: () => {
					showCreateButton('single');
					selectedNodeAdfRef.current = selectionResult?.selectedNodeAdf;
					selectionRangesRef.current = selectionResult?.selectionRanges;
				},
			};
		}
	};
	const nestedBlockMenuExtension: ExtensionConfiguration = {
		key: 'mock-extension-w-nested-menu',
		source: 'first-party',
		blockMenu: {
			getMenuItem: () => ({
				label: 'Apps',
				icon: AddIcon,
			}),
			getNestedMenuItems: () =>
				[
					{
						label: 'App 1',
						icon: AppIcon,
						onClick: () => {
							console.log('<<<click 1');
						},
					},
					{
						label: 'App 2',
						icon: AppIcon,
						onClick: () => {
							console.log('<<<click 2');
						},
					},
				] as BlockMenuItemConfiguration[],
		},
	};

	const createJiraIssueExtension: ExtensionConfiguration = {
		key: 'create-jira-issue-extension',
		source: 'first-party',
		inlineToolbar: {
			getMenuItems: () => [getCreateJiraIssueMenuItem()],
		},
		blockMenu: {
			getMenuItem: getCreateJiraIssueMenuItem,
		},
	};

	// Memoise the preset otherwise we will re-render the editor too often
	const { preset, editorApi } = usePreset(() => {
		return universalPreset
			.add(blockControlsPlugin)
			.maybeAdd(
				[blockMenuPlugin, {}],
				expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true),
			)
			.add([editorViewModePlugin, { mode: 'edit' }])
			.add(selectionMarkerPlugin)
			.add(codeBlockAdvancedPlugin)
			.add([
				selectionExtensionPlugin,
				{
					pageModes: ['view', 'edit'],
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
					extensionList: [
						...noteSelectionExtension.extensionList,
						createJiraIssueExtension,
						nestedBlockMenuExtension,
					],
				},
			]);

		// The only things that cause a re-creation of the preset is something in the
		// universal preset to be consistent with current behaviour (ie. this could
		// be a page width change via the `appearance` prop).
	}, [universalPreset]);
	editorApiRef.current = editorApi;

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
				{createButton && (
					<Pressable
						xcss={buttonStyles}
						onClick={() => {
							const modifiedNodeAdf = JSON.parse(JSON.stringify(selectedNodeAdfRef.current));

							if (modifiedNodeAdf.type === 'table') {
								addLinksToTable(modifiedNodeAdf);
							} else if (modifiedNodeAdf.type === 'taskList') {
								addLinksToTaskList(modifiedNodeAdf);
							} else if (modifiedNodeAdf.type === 'doc') {
								if (!modifiedNodeAdf.content) {
									modifiedNodeAdf.content = [];
								}
								modifiedNodeAdf.content.push({
									type: 'panel',
									attrs: {
										panelType: 'warning',
									},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'ADF is replaced',
												},
											],
										},
									],
								});
							}

							const result = editorApi?.selectionExtension.actions.replaceWithAdf(modifiedNodeAdf);
							if (result?.status === 'document-changed') {
								const fallbackADF = {
									type: 'panel',
									attrs: {
										panelType: 'info',
									},
									content: [
										{
											type: 'paragraph',
											content: [{ type: 'text', text: 'fallback to insert at page bottom' }],
										},
										{
											type: 'paragraph',
											content: [
												{
													type: 'inlineCard',
													attrs: { url: 'https://example.atlassian.net/browse/TEST-123' },
												},
											],
										},
										{
											type: 'paragraph',
											content: [
												{
													type: 'inlineCard',
													attrs: { url: 'https://example.atlassian.net/browse/TEST-456' },
												},
											],
										},
									],
								};
								editorApi?.selectionExtension.actions.insertAdfAtEndOfDoc(fallbackADF);
							}
							showCreateButton(null);
						}}
					>
						Create {createButton} link(s)
					</Pressable>
				)}
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
function StateMonitor({ getState, delay = 500 }: { delay?: number; getState?: () => any }) {
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
