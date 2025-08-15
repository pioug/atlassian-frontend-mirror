import React from 'react';

import { createComponentRegistry } from '@atlaskit/editor-toolbar-model';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { ToolbarPlugin } from './toolbarPluginType';
import { SelectionToolbar } from './ui/SelectionToolbar';
import { getToolbarComponents } from './ui/toolbar-components';

export const toolbarPlugin: ToolbarPlugin = ({ api }) => {
	const registry = createComponentRegistry();

	registry.register(getToolbarComponents(api));

	return {
		name: 'toolbar',

		actions: {
			registerComponents: (toolbarComponents: RegisterComponent[]) => {
				registry.register(toolbarComponents);
			},

			getComponents: () => {
				return registry.components;
			},
		},

		contentComponent: ({ editorView, popupsMountPoint }) => {
			return <SelectionToolbar api={api} editorView={editorView} mountPoint={popupsMountPoint} />;
		},
	};
};
