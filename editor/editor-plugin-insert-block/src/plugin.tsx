import React, { useLayoutEffect } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
	contentAllowedInCodeBlock,
	shouldSplitSelectedNodeOnNodeInsertion,
} from '@atlaskit/editor-common/insert';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import type {
	Command,
	DropdownOptions,
	ExtractInjectionAPI,
	NextEditorPlugin,
	ToolbarUIComponentFactory,
	ToolbarUiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { getWrappingOptions } from '@atlaskit/editor-common/utils';
import type { InputMethod as BlockTypeInputMethod } from '@atlaskit/editor-plugin-block-type';
import { BLOCK_QUOTE, CODE_BLOCK, PANEL } from '@atlaskit/editor-plugin-block-type/consts';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import SwitchIcon from './assets/switch';
import { elementBrowserPmKey, elementBrowserPmPlugin } from './pm-plugins/elementBrowser';
import type { InsertBlockPluginDependencies } from './types';
import { InsertMenuRail } from './ui/ElementRail';
import { templateOptions } from './ui/templateOptions';
import ToolbarInsertBlock from './ui/ToolbarInsertBlock';
import { transformationOptions } from './ui/transformOptions';

const toolbarSizeToButtons = (toolbarSize: ToolbarSize) => {
	switch (toolbarSize) {
		case ToolbarSize.XXL:
		case ToolbarSize.XL:
		case ToolbarSize.L:
		case ToolbarSize.M:
			return 7;

		case ToolbarSize.S:
			return 2;

		default:
			return 0;
	}
};

export interface InsertBlockOptions {
	allowTables?: boolean;
	allowExpand?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	insertMenuItems?: any;
	horizontalRuleEnabled?: boolean;
	nativeStatusSupported?: boolean;
	replacePlusMenuWithElementBrowser?: boolean;
	showElementBrowserLink?: boolean;
	tableSelectorSupported?: boolean;
}

/**
 * Wrapper over insertBlockTypeWithAnalytics to autobind toolbar input method
 * @param name Block name
 */
function handleInsertBlockType(
	insertCodeBlock?: (input_method: INPUT_METHOD) => Command,
	insertPanel?: (input_method: INPUT_METHOD) => Command,
	insertBlockQuote?: (input_method: BlockTypeInputMethod) => Command,
) {
	return (name: string) => {
		if (name === CODE_BLOCK.name && insertCodeBlock) {
			return insertCodeBlock(INPUT_METHOD.TOOLBAR);
		}
		if (name === PANEL.name && insertPanel) {
			return insertPanel(INPUT_METHOD.TOOLBAR);
		}
		if (name === BLOCK_QUOTE.name && insertBlockQuote) {
			return insertBlockQuote(INPUT_METHOD.TOOLBAR);
		}
		return () => false;
	};
}

export type InsertBlockPlugin = NextEditorPlugin<
	'insertBlock',
	{
		pluginConfiguration: InsertBlockOptions | undefined;
		dependencies: InsertBlockPluginDependencies;
		actions: {
			toggleAdditionalMenu: () => void;
		};
	}
>;

export const insertBlockPlugin: InsertBlockPlugin = ({ config: options = {}, api }) => {
	const toggleDropdownMenuOptionsRef: Record<'current', null | (() => void)> = {
		current: null,
	};
	const editorViewRef: Record<'current', EditorView | null> = { current: null };

	const registerToggleDropdownMenuOptions = (cb: () => void) => {
		toggleDropdownMenuOptionsRef.current = cb;

		return () => {
			toggleDropdownMenuOptionsRef.current = null;
		};
	};
	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		editorView,
		editorActions,
		dispatchAnalyticsEvent,
		providerFactory,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		toolbarSize,
		disabled,
		isToolbarReducedSpacing,
		isLastItem,
	}) => {
		const renderNode = (providers: Providers) => {
			return (
				<ToolbarInsertBlockWithInjectionApi
					pluginInjectionApi={api}
					editorView={editorView}
					editorActions={editorActions}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					providerFactory={providerFactory}
					popupsMountPoint={popupsMountPoint}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsScrollableElement={popupsScrollableElement}
					toolbarSize={toolbarSize}
					disabled={disabled}
					isToolbarReducedSpacing={isToolbarReducedSpacing}
					isLastItem={isLastItem}
					providers={providers}
					options={options}
					registerToggleDropdownMenuOptions={registerToggleDropdownMenuOptions}
				/>
			);
		};

		return (
			<WithProviders
				providerFactory={providerFactory}
				providers={['emojiProvider']}
				renderNode={renderNode}
			/>
		);
	};
	api?.primaryToolbar?.actions.registerComponent({
		name: 'insertBlock',
		component: primaryToolbarComponent,
	});

	const plugin: ReturnType<InsertBlockPlugin> = {
		name: 'insertBlock',

		actions: {
			toggleAdditionalMenu: () => {
				const toggle = toggleDropdownMenuOptionsRef.current;

				if (!toggle) {
					return;
				}

				toggle();
			},
		},

		pmPlugins: () => {
			if (!editorExperiment('insert-menu-in-right-rail', true)) {
				[];
			}

			return [
				{
					name: 'elementBrowserPmPlugin',
					plugin: () => elementBrowserPmPlugin(),
				},
				{
					name: 'elementBrowserEditorViewRef',
					plugin: () => {
						return new SafePlugin({
							view: (editorView) => {
								// Workaround - need reference to editorView for contextPanel component
								editorViewRef.current = editorView;
								return {};
							},
						});
					},
				},
			];
		},

		pluginsOptions: {
			// This is added for basic text transformations experiment.
			// This may not be the most ideal plugin to add this to, but it is suitable for experiment purpose
			// as relevant plugin dependencies are already set up.
			// If we decide to ship the feature, we will consider a separate plugin if needed.
			// Experiment one-pager: https://hello.atlassian.net/wiki/spaces/ETM/pages/3931754727/Experiment+Elements+Basic+Text+Transformations
			selectionToolbar: (state, intl) => {
				const isEligible =
					// basicTextTransformations is used to present AI enablement status to avoid adding editor props
					api?.featureFlags?.sharedState.currentState()?.basicTextTransformations;

				if (!isEligible) {
					return;
				}

				if (editorExperiment('basic-text-transformations', true, { exposure: true })) {
					const { formatMessage } = intl;
					const options: DropdownOptions<Command> = transformationOptions(api, state.schema).map(
						(option) => {
							let canWrap;
							if (option.type.name === 'codeBlock') {
								const { $from } = state.selection;
								const grandParentNodeType = $from.node(-1)?.type;
								const parentNodeType = $from.parent.type;
								canWrap =
									shouldSplitSelectedNodeOnNodeInsertion({
										parentNodeType,
										grandParentNodeType,
										content: option.type.createAndFill() as PMNode,
									}) && contentAllowedInCodeBlock(state);
							} else {
								canWrap = !!getWrappingOptions(state, option.type).wrapping;
							}

							const IconBefore = option.icon;
							return {
								title: formatMessage(option.title),
								icon: <IconBefore label="" disabled={!canWrap} />,
								disabled: !canWrap,
								onClick: (state, dispatch) => {
									option.command?.(INPUT_METHOD.FLOATING_TB)(state, dispatch);
									return true;
								},
							};
						},
					);

					return {
						items: [
							{
								type: 'dropdown',
								title: formatMessage(messages.turnInto),
								iconBefore: SwitchIcon,
								options,
							},
						],
						rank: -9,
					};
				}
			},
			// This is temporarily added for element level templates experiment.
			// This is not the most ideal plugin to add this to, but it is suitable for experiment purpose
			// If we decide to ship the feature, we will consider a separate plugin if needed.
			// Experiment one-pager: https://hello.atlassian.net/wiki/spaces/ETM/pages/3983684902/Experiment+Drive+element+usage+via+element+templates
			quickInsert: () => {
				if (
					// @ts-ignore
					['full-page', 'full-width'].includes(options.UNSAFE_editorAppearance ?? '') &&
					editorExperiment('element-level-templates', true, { exposure: true })
				) {
					return templateOptions(api);
				}
				return [];
			},
		},

		usePluginHook: () => {
			useLayoutEffect(() => {
				return () => {
					toggleDropdownMenuOptionsRef.current = null;
				};
			}, []);
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};

	if (editorExperiment('insert-menu-in-right-rail', true)) {
		plugin.pluginsOptions!.contextPanel = (state) => {
			// api.getSharedState() will have an outdated reference to editorState on first mount of this component
			// so instead just rely on plugin key as we don't need to be reactive to changes here
			const pluginState = elementBrowserPmKey.getState(state);
			if (pluginState?.menuBrowserOpen && editorViewRef.current) {
				return <InsertMenuRail editorView={editorViewRef.current} options={options} api={api} />;
			}
			return;
		};
	}

	return plugin;
};

interface ToolbarInsertBlockWithInjectionApiProps
	extends Omit<
		ToolbarUiComponentFactoryParams,
		'eventDispatcher' | 'appearance' | 'containerElement' | 'wrapperElement'
	> {
	providers: Providers;
	pluginInjectionApi: ExtractInjectionAPI<typeof insertBlockPlugin> | undefined;
	options: InsertBlockOptions;
	registerToggleDropdownMenuOptions: (cb: () => void) => () => void;
}

function ToolbarInsertBlockWithInjectionApi({
	editorView,
	editorActions,
	dispatchAnalyticsEvent,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	toolbarSize,
	disabled,
	isToolbarReducedSpacing,
	isLastItem,
	providers,
	pluginInjectionApi,
	options,
	registerToggleDropdownMenuOptions,
}: ToolbarInsertBlockWithInjectionApiProps) {
	const buttons = toolbarSizeToButtons(toolbarSize);
	const {
		dateState,
		hyperlinkState,
		imageUploadState,
		mentionState,
		emojiState,
		blockTypeState,
		mediaState,
		typeAheadState,
		placeholderTextState,
	} = useSharedPluginState(pluginInjectionApi, [
		'hyperlink',
		'date',
		'imageUpload',
		'mention',
		'emoji',
		'blockType',
		'media',
		'typeAhead',
		'placeholderText',
	]);

	const getEmojiProvider = () => {
		if (fg('platform_editor_get_emoji_provider_from_config')) {
			if (emojiState?.emojiProvider) {
				return Promise.resolve(emojiState?.emojiProvider);
			}
		} else {
			return providers.emojiProvider;
		}
	};

	const emojiProvider = getEmojiProvider();

	return (
		<ToolbarInsertBlock
			pluginInjectionApi={pluginInjectionApi}
			buttons={buttons}
			isReducedSpacing={isToolbarReducedSpacing}
			isDisabled={disabled}
			isTypeAheadAllowed={Boolean(typeAheadState?.isAllowed)}
			editorView={editorView}
			tableSupported={!!editorView.state.schema.nodes.table}
			tableSelectorSupported={
				options.tableSelectorSupported && !!editorView.state.schema.nodes.table
			}
			actionSupported={!!editorView.state.schema.nodes.taskItem}
			mentionsSupported={!!(mentionState && mentionState.mentionProvider)}
			mentionsDisabled={!!(mentionState && !mentionState.canInsertMention)}
			decisionSupported={!!editorView.state.schema.nodes.decisionItem}
			dateEnabled={!!dateState}
			placeholderTextEnabled={placeholderTextState && placeholderTextState.allowInserting}
			layoutSectionEnabled={Boolean(pluginInjectionApi?.layout)}
			expandEnabled={!!options.allowExpand}
			mediaUploadsEnabled={(mediaState && mediaState.allowsUploads) ?? undefined}
			onShowMediaPicker={(mediaState && mediaState.showMediaPicker) ?? undefined}
			mediaSupported={!!mediaState}
			imageUploadSupported={!!pluginInjectionApi?.imageUpload}
			imageUploadEnabled={imageUploadState?.enabled}
			handleImageUpload={pluginInjectionApi?.imageUpload?.actions.startUpload}
			availableWrapperBlockTypes={blockTypeState && blockTypeState.availableWrapperBlockTypes}
			linkSupported={!!hyperlinkState}
			linkDisabled={
				!hyperlinkState || !hyperlinkState.canInsertLink || !!hyperlinkState.activeLinkMark
			}
			emojiDisabled={!emojiState || !emojiProvider}
			emojiProvider={emojiProvider}
			nativeStatusSupported={options.nativeStatusSupported}
			horizontalRuleEnabled={options.horizontalRuleEnabled}
			onInsertBlockType={handleInsertBlockType(
				pluginInjectionApi?.codeBlock?.actions.insertCodeBlock,
				pluginInjectionApi?.panel?.actions.insertPanel,
				pluginInjectionApi?.blockType?.actions.insertBlockQuote,
			)}
			onInsertMacroFromMacroBrowser={
				pluginInjectionApi?.extension?.actions.insertMacroFromMacroBrowser
			}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			insertMenuItems={options.insertMenuItems}
			editorActions={editorActions}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			replacePlusMenuWithElementBrowser={options.replacePlusMenuWithElementBrowser}
			showElementBrowserLink={options.showElementBrowserLink}
			showSeparator={!isLastItem && toolbarSize <= ToolbarSize.S}
			registerToggleDropdownMenuOptions={registerToggleDropdownMenuOptions}
		/>
	);
}
