import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconImages } from '@atlaskit/editor-common/quick-insert';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
export type MediaInsertPlugin = NextEditorPlugin<'mediaInsert', {}>;

export const mediaInsertPlugin: MediaInsertPlugin = () => {
	return {
		name: 'mediaInsert',

		pmPlugins: () => [
			{
				name: 'mediaInsert',
				plugin: () => {
					// eslint-disable-next-line no-console
					console.log('mediaInsert plugin');
					return undefined;
				},
			},
		],
		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'media-insert',
					title: formatMessage(messages.insertMediaFromUrl),
					description: formatMessage(messages.insertMediaFromUrlDescription),
					priority: 400,
					keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video'],
					icon: () => <IconImages />,
					action(insert) {
						return insert({
							type: 'paragraph',
							content: [],
						});
					},
				},
			],
		},
	};
};
