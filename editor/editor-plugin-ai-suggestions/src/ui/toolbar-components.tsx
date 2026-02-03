import React from 'react';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { AiSuggestionsPlugin } from '../aiSuggestionsPluginType';

import { SuggestionsToolbarButton } from './SuggestionsToolbarButton';

const AI_SUGGESTIONS_SECTION = {
	type: 'section' as const,
	key: 'ai-suggestions-section',
};

const AI_SUGGESTIONS_GROUP = {
	type: 'group' as const,
	key: 'ai-suggestions-group',
};

const AI_SUGGESTIONS_BUTTON = {
	type: 'button' as const,
	key: 'ai-suggestions-button',
};

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<AiSuggestionsPlugin>,
): RegisterComponent[] => {
	return [
		{
			type: AI_SUGGESTIONS_SECTION.type,
			key: AI_SUGGESTIONS_SECTION.key,
			parents: [
				{
					type: 'toolbar' as const,
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: 1000,
				},
			],
			component: ({ children }) => <>{children}</>,
		},
		{
			type: AI_SUGGESTIONS_GROUP.type,
			key: AI_SUGGESTIONS_GROUP.key,
			parents: [
				{
					type: AI_SUGGESTIONS_SECTION.type,
					key: AI_SUGGESTIONS_SECTION.key,
					rank: 1,
				},
			],
		},
		{
			type: AI_SUGGESTIONS_BUTTON.type,
			key: AI_SUGGESTIONS_BUTTON.key,
			parents: [
				{
					type: AI_SUGGESTIONS_GROUP.type,
					key: AI_SUGGESTIONS_GROUP.key,
					rank: 1,
				},
			],
			component: () => <SuggestionsToolbarButton api={api} />,
		},
	];
};
