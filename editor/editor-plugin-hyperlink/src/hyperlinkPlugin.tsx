import React from 'react';

import { link } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { addLink, tooltip } from '@atlaskit/editor-common/keymaps';
import type { LinkToolbarState } from '@atlaskit/editor-common/link';
import { LinkAction } from '@atlaskit/editor-common/link';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import { IconLink } from '@atlaskit/editor-common/quick-insert';
import type {
	Command,
	CommandDispatch,
	FloatingToolbarButton,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import { canLinkBeCreatedInRange } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import LinkIcon from '@atlaskit/icon/core/migration/link--editor-link';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	hideLinkToolbarSetMeta,
	insertLinkWithAnalytics,
	removeLinkEditorCommand,
	showLinkToolbar,
	updateLink,
	updateLinkEditorCommand,
} from './editor-commands/commands';
import type { HyperlinkPlugin } from './hyperlinkPluginType';
import fakeCursorToolbarPlugin from './pm-plugins/fake-cursor-for-toolbar';
import { createInputRulePlugin } from './pm-plugins/input-rule';
import { createKeymapPlugin } from './pm-plugins/keymap';
import { plugin, stateKey } from './pm-plugins/main';
import { toolbarButtonsPlugin } from './pm-plugins/toolbar-buttons';
import { getToolbarComponents } from './ui/toolbar-components';
import { getToolbarConfig } from './ui/toolbar/Toolbar';

const getPosFromActiveLinkMark = (state: LinkToolbarState) => {
	if (state === undefined) {
		return undefined;
	}
	switch (state.type) {
		case 'EDIT':
		case 'EDIT_INSERTED':
			return state.pos;
		case 'INSERT':
			return undefined;
	}
};

const selectionToolbarLinkButtonTestId = 'ak-editor-selection-toolbar-link-button';

/**
 * Hyperlink plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const hyperlinkPlugin: HyperlinkPlugin = ({ config: options = {}, api }) => {
	let primaryToolbarComponent: ToolbarUIComponentFactory | undefined;
	const isToolbarAIFCEnabled = Boolean(api?.toolbar);

	if (isToolbarAIFCEnabled) {
		api?.toolbar?.actions.registerComponents(getToolbarComponents(api));
	}

	return {
		name: 'hyperlink',

		marks() {
			return [{ name: 'link', mark: link }];
		},

		commands: {
			showLinkToolbar: (inputMethod = INPUT_METHOD.TOOLBAR) =>
				showLinkToolbar(inputMethod, api?.analytics?.actions),
			updateLink: (href: string, text: string) => {
				const linkMark = api?.hyperlink?.sharedState.currentState()?.activeLinkMark;
				const pos = getPosFromActiveLinkMark(linkMark);
				if (pos === undefined) {
					return () => null;
				}
				return updateLinkEditorCommand(href, text, pos);
			},
			removeLink: () => {
				const linkMark = api?.hyperlink?.sharedState.currentState()?.activeLinkMark;
				const pos = getPosFromActiveLinkMark(linkMark);
				if (pos === undefined) {
					return () => null;
				}
				return removeLinkEditorCommand(pos, api?.analytics?.actions);
			},
		},

		actions: {
			hideLinkToolbar: hideLinkToolbarSetMeta,
			insertLink: (
				inputMethod,
				from,
				to,
				href,
				title,
				displayText,
				cardsAvailable = false,
				sourceEvent = undefined,
				appearance,
			) =>
				insertLinkWithAnalytics(
					inputMethod,
					from,
					to,
					href,
					api?.card?.actions,
					api?.analytics?.actions,
					title,
					displayText,
					cardsAvailable,
					sourceEvent,
					appearance,
				),
			updateLink: updateLink,
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return stateKey.getState(editorState);
		},

		pmPlugins() {
			return [
				{
					name: 'hyperlink',
					plugin: ({ dispatch, getIntl }) =>
						plugin(
							dispatch,
							getIntl(),
							options?.editorAppearance,
							api,
							options?.onClickCallback,
							// @ts-ignore Temporary solution to check for Live Page editor.
							options.__livePage,
						),
				},
				{
					name: 'fakeCursorToolbarPlugin',
					plugin: () => fakeCursorToolbarPlugin,
				},
				{
					name: 'hyperlinkInputRule',
					plugin: ({ schema }) =>
						createInputRulePlugin(schema, api?.analytics?.actions, options.autoLinkOnBlur),
				},
				{
					name: 'hyperlinkKeymap',
					plugin: () => createKeymapPlugin(api?.analytics?.actions),
				},

				{
					name: 'hyperlinkToolbarButtons',
					plugin: () => {
						const hasCard = !!api?.card?.actions;
						return toolbarButtonsPlugin(hasCard ? { skipAnalytics: true } : undefined);
					},
				},
			];
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'hyperlink',
					title: formatMessage(messages.link),
					description: formatMessage(messages.linkDescription),
					keywords: ['hyperlink', 'url'],
					priority: 1200,
					keyshortcut: tooltip(addLink),
					icon: () => <IconLink />,
					action(insert, state) {
						const tr = insert(undefined);
						tr.setMeta(stateKey, {
							type: LinkAction.SHOW_INSERT_TOOLBAR,
							inputMethod: INPUT_METHOD.QUICK_INSERT,
						});

						const analyticsAttached = api?.analytics?.actions?.attachAnalyticsEvent?.({
							action: ACTION.INVOKED,
							actionSubject: ACTION_SUBJECT.TYPEAHEAD,
							actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
							attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
							eventType: EVENT_TYPE.UI,
						})(tr);

						return analyticsAttached !== false ? tr : false;
					},
				},
			],

			floatingToolbar: getToolbarConfig(options, api),

			...(!isToolbarAIFCEnabled && {
				selectionToolbar: (state, { formatMessage }) => {
					const toolbarDocking = fg('platform_editor_use_preferences_plugin')
						? api?.userPreferences?.sharedState.currentState()?.preferences.toolbarDockingPosition
						: api?.selectionToolbar?.sharedState?.currentState()?.toolbarDocking;

					if (
						toolbarDocking === 'none' &&
						editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
					) {
						const toolbarButton = () => {
							const { from, to } = state.selection;
							const isEnabled = canLinkBeCreatedInRange(from, to)(state);
							const title = formatMessage(messages.link);

							return {
								type: 'button',
								disabled: !isEnabled,
								testId: `${selectionToolbarLinkButtonTestId}`,
								icon: LinkIcon,
								title: title,
								tooltipContent: tooltip(addLink, title),
								showTitle: false,
								onClick: (state: EditorState, dispatch?: CommandDispatch) => {
									return editorCommandToPMCommand(
										showLinkToolbar(INPUT_METHOD.FLOATING_TB, api?.analytics?.actions),
									)(state, dispatch);
								},
							} as FloatingToolbarButton<Command>;
						};

						return {
							isToolbarAbove: true,
							items: [toolbarButton()],
							rank: 2,
						};
					} else {
						return undefined;
					}
				},
			}),

			...(!isToolbarAIFCEnabled && {
				primaryToolbarComponent:
					!api?.primaryToolbar &&
					editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
						? primaryToolbarComponent
						: undefined,
			}),
		},
	};
};
