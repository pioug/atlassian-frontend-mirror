import React from 'react';

import { code, em, strike, strong, subsup, underline } from '@atlaskit/adf-schema';
import type {
	Command,
	FloatingToolbarCustom,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	toggleCodeWithAnalytics,
	toggleEmWithAnalytics,
	toggleStrikeWithAnalytics,
	toggleStrongWithAnalytics,
	toggleSubscriptWithAnalytics,
	toggleSuperscriptWithAnalytics,
	toggleUnderlineWithAnalytics,
} from './editor-commands/toggle-mark';
import {
	plugin as clearFormattingPlugin,
	pluginKey as clearFormattingPluginKey,
} from './pm-plugins/clear-formatting';
import clearFormattingKeymapPlugin from './pm-plugins/clear-formatting-keymap';
import textFormattingCursorPlugin from './pm-plugins/cursor';
import textFormattingInputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import { plugin as pmPlugin } from './pm-plugins/main';
import { pluginKey as textFormattingPluginKey } from './pm-plugins/plugin-key';
import textFormattingSmartInputRulePlugin from './pm-plugins/smart-input-rule';
import type { TextFormattingPlugin } from './textFormattingPluginType';
import { FloatingToolbarTextFormalWithIntl as FloatingToolbarComponent } from './ui/FloatingToolbarComponent';
import {
	PrimaryToolbarComponent,
	PrimaryToolbarComponentMemoized,
} from './ui/PrimaryToolbarComponent';
import { getToolbarComponents } from './ui/toolbar-components';

/**
 * Text formatting plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const textFormattingPlugin: TextFormattingPlugin = ({ config: options, api }) => {
	const isToolbarAIFCEnabled = expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true);
	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		editorView,
		popupsMountPoint,
		popupsScrollableElement,
		isToolbarReducedSpacing,
		toolbarSize,
		disabled,
	}) => {
		if (
			editorExperiment('platform_editor_toolbar_rerender_optimization_exp', true, {
				exposure: true,
			})
		) {
			return (
				<PrimaryToolbarComponentMemoized
					api={api}
					popupsMountPoint={popupsMountPoint}
					popupsScrollableElement={popupsScrollableElement}
					toolbarSize={toolbarSize}
					isReducedSpacing={isToolbarReducedSpacing}
					editorView={editorView}
					disabled={disabled}
					shouldUseResponsiveToolbar={Boolean(options?.responsiveToolbarMenu)}
				/>
			);
		}

		return (
			<PrimaryToolbarComponent
				api={api}
				popupsMountPoint={popupsMountPoint}
				popupsScrollableElement={popupsScrollableElement}
				toolbarSize={toolbarSize}
				isReducedSpacing={isToolbarReducedSpacing}
				editorView={editorView}
				disabled={disabled}
				shouldUseResponsiveToolbar={Boolean(options?.responsiveToolbarMenu)}
			/>
		);
	};

	if (isToolbarAIFCEnabled) {
		api?.toolbar?.actions.registerComponents(getToolbarComponents(api));
	} else {
		api?.primaryToolbar?.actions.registerComponent({
			name: 'textFormatting',
			component: primaryToolbarComponent,
		});
	}

	return {
		name: 'textFormatting',

		marks() {
			return [
				{ name: 'em', mark: em },
				{ name: 'strong', mark: strong },
			]
				.concat(options?.disableStrikethrough ? [] : { name: 'strike', mark: strike })
				.concat(options?.disableCode ? [] : { name: 'code', mark: code })
				.concat(options?.disableSuperscriptAndSubscript ? [] : { name: 'subsup', mark: subsup })
				.concat(options?.disableUnderline ? [] : { name: 'underline', mark: underline });
		},

		pmPlugins() {
			return [
				{
					name: 'textFormatting',
					plugin: ({ dispatch }) => pmPlugin(dispatch, api?.analytics?.actions),
				},
				{
					name: 'textFormattingCursor',
					plugin: () => textFormattingCursorPlugin,
				},
				{
					name: 'textFormattingInputRule',
					plugin: ({ schema }) =>
						textFormattingInputRulePlugin(schema, api?.analytics?.actions, api),
				},
				{
					name: 'textFormattingSmartRule',
					plugin: () =>
						!options?.disableSmartTextCompletion
							? textFormattingSmartInputRulePlugin(api?.analytics?.actions)
							: undefined,
				},
				{
					name: 'textFormattingClear',
					plugin: ({ dispatch }) => clearFormattingPlugin(dispatch),
				},
				{
					name: 'textFormattingClearKeymap',
					plugin: () => clearFormattingKeymapPlugin(api?.analytics?.actions),
				},
				{
					name: 'textFormattingKeymap',
					plugin: ({ schema }) => keymapPlugin(schema, api?.analytics?.actions),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			const textFormattingState = textFormattingPluginKey.getState(editorState);
			return {
				...textFormattingState,
				formattingIsPresent: clearFormattingPluginKey.getState(editorState)?.formattingIsPresent,
				isInitialised: !!textFormattingState?.isInitialised,
			};
		},

		pluginsOptions: isToolbarAIFCEnabled
			? {}
			: {
					selectionToolbar: () => {
						const toolbarDocking = fg('platform_editor_use_preferences_plugin')
							? api?.userPreferences?.sharedState.currentState()?.preferences
									?.toolbarDockingPosition
							: api?.selectionToolbar?.sharedState?.currentState()?.toolbarDocking;

						if (
							toolbarDocking === 'none' &&
							editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
						) {
							const toolbarCustom: FloatingToolbarCustom<Command> = {
								type: 'custom',
								render: (view) => {
									if (!view) {
										return;
									}

									return (
										<FloatingToolbarComponent
											api={api}
											editorView={view}
											editorAnalyticsAPI={api?.analytics?.actions}
										/>
									);
								},
								fallback: [],
							};

							return {
								isToolbarAbove: true,
								items: [toolbarCustom],
								rank: 7,
								pluginName: 'textFormatting',
							};
						} else {
							return undefined;
						}
					},
				},

		primaryToolbarComponent:
			!api?.primaryToolbar && !isToolbarAIFCEnabled ? primaryToolbarComponent : undefined,

		commands: {
			toggleSuperscript: toggleSuperscriptWithAnalytics(api?.analytics?.actions),
			toggleSubscript: toggleSubscriptWithAnalytics(api?.analytics?.actions),
			toggleStrike: toggleStrikeWithAnalytics(api?.analytics?.actions),
			toggleCode: toggleCodeWithAnalytics(api?.analytics?.actions),
			toggleUnderline: toggleUnderlineWithAnalytics(api?.analytics?.actions),
			toggleEm: toggleEmWithAnalytics(api?.analytics?.actions),
			toggleStrong: toggleStrongWithAnalytics(api?.analytics?.actions),
		},
	};
};
