import type { RegisterComponent, RegisterToolbar } from '@atlaskit/editor-toolbar-model/types';

export const isToolbar = (component?: RegisterComponent): component is RegisterToolbar => {
	return component?.type === 'toolbar';
};
