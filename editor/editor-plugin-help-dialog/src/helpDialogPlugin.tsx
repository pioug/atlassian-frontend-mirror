import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { openHelp, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';

import { type HelpDialogPlugin } from './helpDialogPluginType';
import { closeHelpAction, openHelpAction } from './pm-plugins/actions';
import { openHelpCommand } from './pm-plugins/commands';
import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { HelpDialogLoader } from './ui/HelpDialogLoader';

export const helpDialogPlugin: HelpDialogPlugin = ({
	config: imageUploadProviderExists = false,
	api,
}) => ({
	name: 'helpDialog',

	pmPlugins() {
		return [
			{
				name: 'helpDialog',
				plugin: ({ dispatch }) => createPlugin(dispatch, imageUploadProviderExists),
			},
			{
				name: 'helpDialogKeymap',
				plugin: () => keymapPlugin(api?.analytics?.actions),
			},
		];
	},

	pluginsOptions: {
		quickInsert: ({ formatMessage }) => [
			{
				id: 'helpdialog',
				title: formatMessage(messages.help),
				description: formatMessage(messages.helpDescription),
				keywords: ['?'],
				priority: 4000,
				keyshortcut: tooltip(openHelp),
				icon: () => <QuestionCircleIcon label="" color="currentColor" />,
				action(insert) {
					const tr = insert('');
					openHelpCommand(tr);
					api?.analytics?.actions.attachAnalyticsEvent({
						action: ACTION.HELP_OPENED,
						actionSubject: ACTION_SUBJECT.HELP,
						actionSubjectId: ACTION_SUBJECT_ID.HELP_QUICK_INSERT,
						attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
						eventType: EVENT_TYPE.UI,
					})(tr);
					return tr;
				},
			},
		],
	},

	contentComponent({ editorView }) {
		return (
			<HelpDialogLoader
				pluginInjectionApi={api}
				editorView={editorView}
				quickInsertEnabled={!!api?.quickInsert}
			/>
		);
	},

	getSharedState(editorState) {
		if (!editorState) {
			return null;
		}
		return pluginKey.getState(editorState) || null;
	},

	actions: {
		openHelp: () => {
			return api?.core.actions.execute(({ tr }) => openHelpAction(tr));
		},
		closeHelp: () => {
			return api?.core.actions.execute(({ tr }) => closeHelpAction(tr));
		},
	},
});
