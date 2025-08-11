import React from 'react';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI, UserPreferences } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import { ToolbarSection } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentType, ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarPlugin } from '../toolbarPluginType';

type TextSectionProps = {
	children: React.ReactNode;
	parents: ToolbarComponentTypes;
	api?: ExtractInjectionAPI<ToolbarPlugin>;
};

const shouldShowTextSection = (
	editMode: ViewMode | undefined,
	toolbar: ToolbarComponentType | undefined,
	toolbarDocking: UserPreferences['toolbarDockingInitialPosition'],
) => {
	if (editMode === 'view') {
		return false;
	}

	if (toolbar?.key === TOOLBARS.INLINE_TEXT_TOOLBAR && toolbarDocking !== 'top') {
		return true;
	}

	if (toolbar?.key === TOOLBARS.PRIMARY_TOOLBAR && toolbarDocking !== 'none') {
		return true;
	}

	return false;
};

export const TextSection = ({ children, parents, api }: TextSectionProps) => {
	const editMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
	const toolbarDocking = useSharedPluginStateSelector(
		api,
		'userPreferences.preferences.toolbarDockingPosition',
	);
	const toolbar = parents.find((parent) => parent.type === 'toolbar');

	if (!shouldShowTextSection(editMode, toolbar, toolbarDocking)) {
		return null;
	}

	return <ToolbarSection testId="text-section">{children}</ToolbarSection>;
};
