import React from 'react';

import { AIChatIcon, Toolbar, ToolbarButton } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { TOOLBAR_LABEL } from './consts';

export const getToolbarComponents = (): RegisterComponent[] => {
	return [
		{
			type: 'toolbar',
			key: 'inline-text-toolbar',
			component: ({ children }) => {
				return <Toolbar label={TOOLBAR_LABEL}>{children}</Toolbar>;
			},
		},
		// TODO: ED-28684 - clean up AI code and move to AI package
		{
			type: 'section',
			key: 'ai-section',
			parents: [
				{
					type: 'toolbar',
					key: 'inline-text-toolbar',
					rank: 100,
				},
			],
		},
		{
			type: 'group',
			key: 'ai-group',
			parents: [
				{
					type: 'section',
					key: 'ai-section',
					rank: 100,
				},
			],
		},
		{
			type: 'button',
			key: 'ai-button',
			parents: [
				{
					type: 'group',
					key: 'ai-group',
					rank: 100,
				},
			],
			component: ({ groupLocation }) => {
				return (
					<ToolbarButton label="AI" icon={AIChatIcon} groupLocation={groupLocation}>
						AI
					</ToolbarButton>
				);
			},
		},
	];
};
