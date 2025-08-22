import React from 'react';

import { TOOLBARS, useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI, UserPreferences } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import { ToolbarSection } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentType, ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarPlugin } from '../toolbarPluginType';

type SectionProps = {
	api?: ExtractInjectionAPI<ToolbarPlugin>;
	children: React.ReactNode;
	disableSelectionToolbar?: boolean;
	isSharedSection?: boolean;
	parents: ToolbarComponentTypes;
	showSeparatorInFullPagePrimaryToolbar?: boolean;
	testId?: string;
};

const shouldShowSection = (
	editMode: ViewMode | undefined,
	toolbar: ToolbarComponentType | undefined,
	toolbarDocking: UserPreferences['toolbarDockingInitialPosition'],
	disableSelectionToolbar?: boolean,
) => {
	if (editMode === 'view') {
		return false;
	}

	if (disableSelectionToolbar) {
		return true;
	}

	if (toolbar?.key === TOOLBARS.INLINE_TEXT_TOOLBAR && toolbarDocking !== 'top') {
		return true;
	}

	if (toolbar?.key === TOOLBARS.PRIMARY_TOOLBAR && toolbarDocking !== 'none') {
		return true;
	}

	return false;
};

export const Section = ({
	children,
	parents,
	api,
	testId,
	showSeparatorInFullPagePrimaryToolbar,
	isSharedSection = true,
	disableSelectionToolbar,
}: SectionProps) => {
	const editMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
	const toolbarDocking = useSharedPluginStateSelector(
		api,
		'userPreferences.preferences.toolbarDockingPosition',
	);
	const toolbar = parents.find((parent) => parent.type === 'toolbar');
	const { editorAppearance } = useEditorToolbar();

	if (
		isSharedSection &&
		!shouldShowSection(editMode, toolbar, toolbarDocking, disableSelectionToolbar)
	) {
		return null;
	}

	const isFullPage = editorAppearance === 'full-page';

	return (
		<ToolbarSection
			testId={testId}
			hasSeparator={showSeparatorInFullPagePrimaryToolbar && isFullPage}
		>
			{children}
		</ToolbarSection>
	);
};
