import React from 'react';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import { Toolbar } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { TOOLBAR_LABEL } from './consts';

export const getToolbarComponents = (): RegisterComponent[] => {
	return [
		{
			type: 'toolbar',
			key: TOOLBARS.INLINE_TEXT_TOOLBAR,
			component: ({ children }) => {
				return <Toolbar label={TOOLBAR_LABEL}>{children}</Toolbar>;
			},
		},
		{
			type: 'section',
			key: 'text-section',
			parents: [{ type: 'toolbar', key: 'inline-text-toolbar', rank: 200 }],
		},
	];
};
