import React, { useRef, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import {
	EditorExampleControls,
	getExamplesProviders,
	localStorageFetchProvider,
	localStorageWriteProvider,
} from '@af/editor-examples-helpers/utils';
import { BLOCK_ACTIONS_MENU_SECTION } from '@atlaskit/editor-common/block-menu';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { blockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import { blockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import { codeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import {
	type ExtensionConfiguration,
	type ExtensionMenuItemConfiguration,
	selectionExtensionPlugin,
} from '@atlaskit/editor-plugin-selection-extension';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import type { SyncedBlockPluginOptions } from '@atlaskit/editor-plugin-synced-block';
import { useMemoizedSyncedBlockProvider } from '@atlaskit/editor-synced-block-provider';
import { getSyncedBlockRenderer } from '@atlaskit/editor-synced-block-renderer';
import { useEditorAnnotationProviders } from '@atlaskit/editor-test-helpers/annotation-example';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import {
	AddIcon,
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import AppIcon from '@atlaskit/icon/core/app';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled - go/akcss
import { Pressable, xcss } from '@atlaskit/primitives';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockProfileClient: any = simpleMockProfilecardClient();

function getDefaultValue() {
	const doc = localStorage.getItem(`${EXAMPLE_NAME}-doc`);
	return doc ? JSON.parse(doc) : '';
}

function ComposableEditorPage() {
	const [appearance, setAppearance] = React.useState<EditorAppearance>('full-page');
	const providers = getExamplesProviders({});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const editorApiRef: any = useRef<typeof editorApi | null>(null);

	const [createButton, showCreateButton] = useState<string | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const selectedNodeAdfRef = React.useRef<any>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const selectionRangesRef = React.useRef<any>(null);
	const editorAnnotationProviders = useEditorAnnotationProviders();

	const syncBlockProvider = useMemoizedSyncedBlockProvider({
		fetchProvider: localStorageFetchProvider,
		writeProvider: localStorageWriteProvider,
		providerOptions: {
			parentDataProviders: {
				mentionProvider: undefined,
				profilecardProvider: undefined,
				taskDecisionProvider: undefined,
			},
			providerCreator: {
				createEmojiProvider: undefined,
				createMediaProvider: undefined,
				createSmartLinkProvider: undefined,
			},
		},
	});

	const syncedBlock: SyncedBlockPluginOptions = {
		enableSourceCreation: true,
		syncedBlockRenderer: getSyncedBlockRenderer({
			syncBlockRendererOptions: undefined,
		}),
		syncBlockDataProvider: syncBlockProvider,
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
			toolbarPlugin: {
				enableNewToolbarExperience: true,
				contextualFormattingEnabled: 'controlled',
			},
		},
	});
	const noteSelectionExtension = useNoteSelectionExtension(editorApiRef.current);

	const getCreateJiraIssueMenuItem = () => {
		const selectionResult = editorApiRef?.current?.selectionExtension?.actions.getSelectionAdf();

		// Determine if multiple rows are selected
		const multipleRowsSelected =
			selectionResult?.selectedNodeAdf.type === 'table' &&
			selectionResult?.selectionRanges &&
			selectionResult?.selectionRanges.length > 1;

		if (multipleRowsSelected) {
			return {
				key: 'multiple-jira-issues',
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
				key: 'single-jira-issue',
				label: 'Single Issue',
				lozenge: {
					label: 'TRY',
				},
				icon: AddIcon,
				onClick: () => {
					showCreateButton('single');
					selectedNodeAdfRef.current = selectionResult?.selectedNodeAdf;
					selectionRangesRef.current = selectionResult?.selectionRanges;
				},
			};
		}
	};

	const nestedMenuItemsGetMenuItem: () => Array<ExtensionMenuItemConfiguration> = () => {
		return [
			{
				label: 'Leaf extension item',
				icon: AppIcon,
				onClick: () => {
					console.log('<<<click 1');
				},
			},
			{
				label: 'This is a very long label that should be truncated',
				icon: AppIcon,
				lozenge: {
					label: 'NEW',
				},
				onClick: () => {
					console.log('<<<click create template');
				},
			},
			{
				label: 'Dropdown extension item with a very long label that should be truncated',
				icon: AppIcon,
				getMenuItems: () => {
					return [
						{
							label: 'Nested Leaf extension item',
							icon: AppIcon,
							onClick: () => {
								console.log('<<<click 2');
							},
						},
					];
				},
			},
		];
	};

	const extensionWithNestedMenuItems: ExtensionConfiguration = {
		key: 'mock-extension-with-nested-menu-items',
		source: 'first-party',
		blockMenu: {
			getMenuItems: nestedMenuItemsGetMenuItem,
			placement: 'featured',
		},
		inlineToolbar: {
			getMenuItems: nestedMenuItemsGetMenuItem,
		},
		primaryToolbar: {
			getMenuItems: nestedMenuItemsGetMenuItem,
		},
	};

	const createJiraIssueExtension: ExtensionConfiguration = {
		key: 'create-jira-issue-extension',
		source: 'first-party',
		inlineToolbar: {
			getMenuItems: () => [getCreateJiraIssueMenuItem()],
		},
		blockMenu: {
			getMenuItems: () => [getCreateJiraIssueMenuItem()],
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
						extensionWithNestedMenuItems,
					],
				},
			]);

		// The only things that cause a re-creation of the preset is something in the
		// universal preset to be consistent with current behaviour (ie. this could
		// be a page width change via the `appearance` prop).
	}, [universalPreset]);
	editorApiRef.current = editorApi;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onDocumentChanged = (adf: any) => {
		if (adf?.state?.doc) {
			localStorage.setItem(`${EXAMPLE_NAME}-doc`, JSON.stringify(adf?.state?.doc));
		}
	};

	const existingComponents = editorApi?.blockMenu?.actions.getBlockMenuComponents();
	const alreadyRegistered = existingComponents?.some(
		(component) => component.key === 'deeply-nested-menu-1',
	);
	if (!alreadyRegistered) {
		editorApi?.blockMenu?.actions.registerBlockMenuComponents([
			// first menu
			{
				type: 'block-menu-nested' as const,
				key: 'deeply-nested-menu-1',
				parent: {
					type: 'block-menu-section' as const,
					key: BLOCK_ACTIONS_MENU_SECTION.key,
					rank: 100,
				},
				component: ({ children }) => (
					<ToolbarNestedDropdownMenu
						text="First Level Menu"
						elemBefore={<AddIcon label="" />}
						elemAfter={<ChevronRightIcon label="" />}
						shouldFitContainer
						enableMaxHeight
					>
						{children}
					</ToolbarNestedDropdownMenu>
				),
			},
			// first section inside first menu
			{
				type: 'block-menu-section' as const,
				key: 'deeply-nested-section-1',
				parent: {
					type: 'block-menu-nested' as const,
					key: 'deeply-nested-menu-1',
					rank: 0,
				},
				component: ({ children }) => (
					<ToolbarDropdownItemSection title="First Section">{children}</ToolbarDropdownItemSection>
				),
			},
			// second menu inside first section
			{
				type: 'block-menu-nested' as const,
				key: 'deeply-nested-menu-2',
				parent: {
					type: 'block-menu-section' as const,
					key: 'deeply-nested-section-1',
					rank: 0,
				},
				component: ({ children }) => (
					<ToolbarNestedDropdownMenu
						text="Second Level Menu"
						elemBefore={<AppIcon label="" />}
						elemAfter={<ChevronRightIcon label="" />}
					>
						{children}
					</ToolbarNestedDropdownMenu>
				),
			},
			// second section inside second menu
			{
				type: 'block-menu-section' as const,
				key: 'deeply-nested-section-3',
				parent: {
					type: 'block-menu-nested' as const,
					key: 'deeply-nested-menu-2',
					rank: 0,
				},
				component: ({ children }) => (
					<ToolbarDropdownItemSection title="Second Section" hasSeparator>
						{children}
					</ToolbarDropdownItemSection>
				),
			},
			// second section inside second menu
			// this section won't render because its only child is a menu item that returns null
			{
				type: 'block-menu-section' as const,
				key: 'deeply-nested-section-3-2',
				parent: {
					type: 'block-menu-nested' as const,
					key: 'deeply-nested-menu-2',
					rank: 0,
				},
				component: ({ children }) => (
					<ToolbarDropdownItemSection title="Third Section" hasSeparator>
						{children}
					</ToolbarDropdownItemSection>
				),
			},
			// finally the item inside the second section
			{
				type: 'block-menu-item' as const,
				key: 'deeply-nested-item',
				parent: {
					type: 'block-menu-section' as const,
					key: 'deeply-nested-section-3',
					rank: 0,
				},
				component: () => (
					<ToolbarDropdownItem elemBefore={<AddIcon label="" />}>
						Deeply nested item
					</ToolbarDropdownItem>
				),
			},
			// This won't render because the component returns null
			{
				type: 'block-menu-item' as const,
				key: 'deeply-nested-item-2',
				parent: {
					type: 'block-menu-section' as const,
					key: 'deeply-nested-section-3-2',
					rank: 0,
				},
				component: () => null,
			},
		]);
	}

	console.log('createButton', createButton, selectedNodeAdfRef.current);

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

/**
 * This example renders an example live view composable editor inside an EditorContext
 *
 * @returns A React component
 */
export default function ComposableEditorPageWrapper(): React.JSX.Element {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
