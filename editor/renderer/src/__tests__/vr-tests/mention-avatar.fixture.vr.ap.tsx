import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import type { MentionNodeDataProvider } from '@atlaskit/editor-common/mention';
import type { MentionNodeData } from '@atlaskit/mention/types';
// eslint-disable-next-line no-restricted-imports -- The AP-headless VR fixture must apply the experiment override from the same bundle graph as the component under test.
import { UNSAFE_overrideExperiment } from '@atlaskit/platform-feature-experiments/dev-override';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

const createUserAvatarDataUrl = (background: string, foregroundPath: string) =>
	`data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="${background}"/><path d="${foregroundPath}" fill="white"/></svg>`,
	)}`;

const agentAvatarDataUrl = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><polygon points="8,0.5 14.5,4.25 14.5,11.75 8,15.5 1.5,11.75 1.5,4.25" fill="#79B800"/><circle cx="8" cy="7" r="4" fill="white"/><path d="M3.5 10.5 6 13l6-6" fill="none" stroke="#1D2125" stroke-width="2"/></svg>',
)}`;

const mentionNodeData: Record<string, MentionNodeData> = {
	'user-mention': {
		appType: 'user',
		avatarUrl: createUserAvatarDataUrl(
			'#0C66E4',
			'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0Z',
		),
	},
	'agent-mention': {
		appType: 'agent',
		avatarUrl: agentAvatarDataUrl,
		isAvatarImagePreShaped: true,
	},
	'failed-avatar-mention': {
		appType: 'user',
		avatarUrl: 'data:image/png;base64,invalid',
	},
};

const mentionNodeDataProvider: MentionNodeDataProvider = {
	getMentionData: ({ id }, callback) => {
		const data = mentionNodeData[id];
		if (data) {
			callback({ data });
		}
	},
	getMentionDataFromCache: ({ id }) => mentionNodeData[id],
};

const mentionAvatarAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [
				{ type: 'text', text: 'Heading: ' },
				{
					type: 'mention',
					attrs: {
						id: 'user-mention',
						text: '@Example User',
						userType: 'DEFAULT',
					},
				},
				{ type: 'text', text: ' aligned with heading text' },
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'User: ' },
				{
					type: 'mention',
					attrs: {
						id: 'user-mention',
						text: '@Example User',
						userType: 'DEFAULT',
					},
				},
				{ type: 'text', text: ' aligned with surrounding text' },
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'Agent: ' },
				{
					type: 'mention',
					attrs: {
						id: 'agent-mention',
						text: '@Always reply Poem',
						userType: 'APP',
					},
				},
				{ type: 'text', text: ' aligned with surrounding text' },
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'Failed image: ' },
				{
					type: 'mention',
					attrs: {
						id: 'failed-avatar-mention',
						text: '@Unavailable User',
						userType: 'DEFAULT',
					},
				},
				{ type: 'text', text: ' keeps its reserved avatar space' },
			],
		},
	],
};

const RendererMentionAvatarContent = generateRendererComponent({
	appearance: 'full-page',
	document: mentionAvatarAdf,
	mentionNodeDataProvider,
});

/** Renders user and agent mentions with the avatar experiment enabled in the component bundle. */
export function RendererMentionAvatar(): React.JSX.Element {
	UNSAFE_overrideExperiment('platform_editor_mention_node_avatar', { isEnabled: true });

	return <RendererMentionAvatarContent />;
}
