import type { RegisterComponent, RegisterToolbar } from '@atlaskit/editor-toolbar-model';

export const isToolbar = (component?: RegisterComponent): component is RegisterToolbar => {
	return component?.type === 'toolbar';
};
