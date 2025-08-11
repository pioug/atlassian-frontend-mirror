import React from 'react';

import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI, UserPreferences } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import { ToolbarSection } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentType, ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { HyperlinkPlugin } from '../../hyperlinkPluginType';

type LinkSectionProps = {
	children: React.ReactNode;
	parents: ToolbarComponentTypes;
	api?: ExtractInjectionAPI<HyperlinkPlugin>;
};

const shouldShowLinkSection = (
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

export const LinkSection = ({ children, parents, api }: LinkSectionProps) => {
	const editMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
	const toolbarDocking = useSharedPluginStateSelector(
		api,
		'userPreferences.preferences.toolbarDockingPosition',
	);
	const toolbar = parents.find((parent) => parent.type === 'toolbar');

	if (!shouldShowLinkSection(editMode, toolbar, toolbarDocking)) {
		return null;
	}

	return <ToolbarSection>{children}</ToolbarSection>;
};
