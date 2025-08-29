import React from 'react';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type {
	EditorAppearance,
	OptionalPlugin,
	PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { isToolbar } from '../../../utils/toolbar';
import { ToolbarNext } from '../../Toolbar/Toolbar';

type ToolbarEditorPlugins = [OptionalPlugin<ToolbarPlugin>];

type CommentToolbarProps = {
	editorAPI?: PublicPluginAPI<ToolbarEditorPlugins>;
	editorAppearance: EditorAppearance;
	editorView?: EditorView;
};

/**
 * Primary toolbar driven by components registered by `editor-plugin-toolbar`, introduced in `platform_editor_toolbar_aifc`.
 */
export const CommentToolbar = ({
	editorAPI,
	editorView,
	editorAppearance,
}: CommentToolbarProps) => {
	const components = editorAPI?.toolbar?.actions.getComponents();
	const toolbar = components?.find((component) => component.key === TOOLBARS.PRIMARY_TOOLBAR);

	if (!components || !isToolbar(toolbar)) {
		return null;
	}

	return (
		<ToolbarNext
			toolbar={toolbar}
			components={components}
			editorView={editorView}
			editorAPI={editorAPI}
			editorAppearance={editorAppearance}
		/>
	);
};
