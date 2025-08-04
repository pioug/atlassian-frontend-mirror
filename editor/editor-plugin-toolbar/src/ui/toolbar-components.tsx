import React from 'react';

import { Toolbar } from '@atlaskit/editor-toolbar';
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
	];
};
