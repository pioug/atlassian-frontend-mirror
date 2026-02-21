import React from 'react';

import {
	TOOLBARS,
	useEditorToolbar,
	type ContextualFormattingEnabledOptions,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI, UserPreferences } from '@atlaskit/editor-common/types';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import { ToolbarSection, SeparatorPosition } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentType, ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ToolbarPlugin } from '../toolbarPluginType';

type SectionProps = {
	api?: ExtractInjectionAPI<ToolbarPlugin>;
	children: React.ReactNode;
	isSharedSection?: boolean;
	parents: ToolbarComponentTypes;
	showSeparatorInFullPagePrimaryToolbar?: boolean;
	testId?: string;
};

const shouldShowSection = (
	editMode: ViewMode | undefined,
	toolbar: ToolbarComponentType | undefined,
	toolbarDocking: UserPreferences['toolbarDockingInitialPosition'],
	contextualFormattingEnabled: ContextualFormattingEnabledOptions,
) => {
	if (editMode === 'view') {
		return false;
	}

	if (fg('platform_editor_toolbar_aifc_placement_overridden')) {
		if (toolbar?.key === TOOLBARS.INLINE_TEXT_TOOLBAR) {
			return toolbarDocking !== 'top' || contextualFormattingEnabled === 'always-inline';
		}

		if (toolbar?.key === TOOLBARS.PRIMARY_TOOLBAR) {
			return toolbarDocking !== 'none' || contextualFormattingEnabled === 'always-pinned';
		}
	} else {
		if (toolbar?.key === TOOLBARS.INLINE_TEXT_TOOLBAR && toolbarDocking !== 'top') {
			return true;
		}

		if (toolbar?.key === TOOLBARS.PRIMARY_TOOLBAR && toolbarDocking !== 'none') {
			return true;
		}
	}

	return false;
};

const usePluginState = (_api?: ExtractInjectionAPI<ToolbarPlugin> | undefined) => {
	const { editorViewMode, editorToolbarDockingPreference, editorAppearance } = useEditorToolbar();

	return {
		editorViewMode,
		editorToolbarDockingPreference,
		editorAppearance,
	};
};

export const Section = ({
	children,
	parents,
	api,
	testId,
	showSeparatorInFullPagePrimaryToolbar,
	isSharedSection = true,
}: SectionProps): React.JSX.Element | null => {
	const { editorViewMode, editorToolbarDockingPreference, editorAppearance } = usePluginState(api);
	const toolbar = parents.find((parent) => parent.type === 'toolbar');
	const contextualFormattingEnabled =
		api?.toolbar?.actions.contextualFormattingMode() ?? 'always-pinned';

	if (
		isSharedSection &&
		!shouldShowSection(
			editorViewMode,
			toolbar,
			editorToolbarDockingPreference,
			contextualFormattingEnabled,
		)
	) {
		return null;
	}

	const isFullPage = editorAppearance === 'full-page';
	const hasSeparator = showSeparatorInFullPagePrimaryToolbar && isFullPage;

	return (
		<ToolbarSection
			testId={testId}
			hasSeparator={hasSeparator ? SeparatorPosition.START : hasSeparator}
		>
			{children}
		</ToolbarSection>
	);
};
