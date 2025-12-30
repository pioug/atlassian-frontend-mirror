import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { openHelp, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { HelpDialogPlugin, HelpDialogPluginOptions } from './helpDialogPluginType';
import { closeHelpAction, openHelpAction } from './pm-plugins/actions';
import { openHelpCommand } from './pm-plugins/commands';
import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { HelpDialogLoader } from './ui/HelpDialogLoader';

/**
 * Normalise the caller-supplied config into a single, predictable shape.
 * – Boolean → "image uploads on/off", AI always off
 * – Object  → pick the two feature flags with sane defaults (both false)
 */
function parseFeatureConfig(config: HelpDialogPluginOptions) {
	if (typeof config === 'boolean') {
		return {
			imageUploadProviderExists: config,
			aiEnabled: false,
		};
	}

	// Object path – ensure we never return undefined
	const { imageUploadProviderExists = false, aiEnabled = false } = config ?? {};

	return { imageUploadProviderExists, aiEnabled };
}

export const helpDialogPlugin: HelpDialogPlugin = ({ config, api }) => {
	const { imageUploadProviderExists, aiEnabled } = parseFeatureConfig(config);

	return {
		name: 'helpDialog',

		pmPlugins() {
			return [
				{
					name: 'helpDialog',
					plugin: ({ dispatch }) => createPlugin(dispatch, imageUploadProviderExists, aiEnabled),
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
					icon: () => <QuestionCircleIcon label="" color="currentColor" spacing="spacious" />,
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
			if (
				expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) &&
				(!editorView || isSSR())
			) {
				return null;
			}

			return (
				<HelpDialogLoader
					pluginInjectionApi={api}
					// temp non null assertion until platform_editor_hydratable_ui cleaned up
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					editorView={editorView!}
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
	};
};
