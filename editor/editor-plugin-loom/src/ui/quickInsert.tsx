import React from 'react';

import { type EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { QuickInsertHandlerFn } from '@atlaskit/editor-common/types';
import VideoIcon from '@atlaskit/icon/core/video';
import { token } from '@atlaskit/tokens';

import { recordVideo, recordVideoFailed } from '../pm-plugins/commands';
import { loomPluginKey } from '../pm-plugins/main';

export const getQuickInsertItem =
	(editorAnalyticsAPI?: EditorAnalyticsAPI): QuickInsertHandlerFn =>
	({ formatMessage }) => [
		{
			id: 'loom',
			title: formatMessage(toolbarInsertBlockMessages.recordVideo),
			description: formatMessage(toolbarInsertBlockMessages.recordVideoDescription),
			keywords: ['loom', 'record', 'video'],
			priority: 800,
			isDisabledOffline: true,
			icon: () => <VideoIcon label="" color={token('color.icon.subtle')} spacing="spacious" />,
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
