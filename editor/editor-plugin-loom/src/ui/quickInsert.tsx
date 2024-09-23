import React from 'react';

import { type EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { QuickInsertHandlerFn } from '@atlaskit/editor-common/types';
import { LoomIcon } from '@atlaskit/logo';

import { recordVideo, recordVideoFailed } from '../commands';
import { loomPluginKey } from '../pm-plugin';

export const getQuickInsertItem =
	(editorAnalyticsAPI?: EditorAnalyticsAPI): QuickInsertHandlerFn =>
	({ formatMessage }) => [
		{
			id: 'loom',
			title: formatMessage(toolbarInsertBlockMessages.recordVideo),
			description: formatMessage(toolbarInsertBlockMessages.recordVideoDescription),
			keywords: ['loom', 'record', 'video'],
			priority: 800,
			icon: () => <LoomIcon appearance="brand" />,
			action(insert, editorState) {
				const tr = insert(undefined);

				const loomState = loomPluginKey.getState(editorState);
				if (!loomState?.isEnabled) {
					const errorMessage = loomState?.error;
					logException(new Error(errorMessage), {
						location: 'editor-plugin-loom/quick-insert-record-video',
					});
					return (
						recordVideoFailed({
							inputMethod: INPUT_METHOD.QUICK_INSERT,
							error: errorMessage,
							editorAnalyticsAPI,
						})({
							tr,
						}) ?? false
					);
				}

				return (
					recordVideo({
						inputMethod: INPUT_METHOD.QUICK_INSERT,
						editorAnalyticsAPI,
					})({
						tr,
					}) ?? false
				);
			},
		},
	];
