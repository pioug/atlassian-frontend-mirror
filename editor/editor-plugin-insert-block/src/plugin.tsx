import React, { useLayoutEffect } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import type {
	Command,
	ExtractInjectionAPI,
	NextEditorPlugin,
	ToolbarUIComponentFactory,
	ToolbarUiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import type { InputMethod as BlockTypeInputMethod } from '@atlaskit/editor-plugin-block-type';
import { BLOCK_QUOTE, CODE_BLOCK, PANEL } from '@atlaskit/editor-plugin-block-type/consts';

import type { InsertBlockPluginDependencies } from './types';
import ToolbarInsertBlock from './ui/ToolbarInsertBlock';

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

	return {
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

		usePluginHook: () => {
			useLayoutEffect(() => {
				return () => {
					toggleDropdownMenuOptionsRef.current = null;
				};
			}, []);
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
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
			emojiDisabled={!emojiState || !providers.emojiProvider}
			emojiProvider={providers.emojiProvider}
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
