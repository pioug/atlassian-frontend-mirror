import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import { TOOLBARS } from '@atlaskit/editor-common/toolbar/keys';
import type { ContextualFormattingEnabledOptions } from '@atlaskit/editor-common/toolbar/types';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { UserPreferences } from '@atlaskit/editor-common/types/user-preferences';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type {
	ToolbarComponentType,
	ToolbarComponentTypes,
} from '@atlaskit/editor-toolbar-model/types';
import { ToolbarSection, SeparatorPosition } from '@atlaskit/editor-toolbar/toolbar-section';

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

	if (toolbar?.key === TOOLBARS.INLINE_TEXT_TOOLBAR) {
		return toolbarDocking !== 'top' || contextualFormattingEnabled === 'always-inline';
	}

	if (toolbar?.key === TOOLBARS.PRIMARY_TOOLBAR) {
		return toolbarDocking !== 'none' || contextualFormattingEnabled === 'always-pinned';
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
	const runtimeOverride = useSharedPluginStateWithSelector(
		api,
		['toolbar'],
		(states) => states.toolbarState?.contextualFormattingModeOverride,
	);
	const toolbar = parents.find((parent) => parent.type === 'toolbar');
	const contextualFormattingEnabled =
		runtimeOverride ?? api?.toolbar?.actions.contextualFormattingMode() ?? 'always-pinned';

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
