import React from 'react';

import { TOOLBARS, useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI, UserPreferences } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import { ToolbarSection, SeparatorPosition } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentType, ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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

	/**
	 * This check is no longer needed with plugin config changes, the selection toolbar will not be registered and so
	 * no components will render
	 */
	if (!fg('platform_editor_toolbar_aifc_placement_config')) {
		if (disableSelectionToolbar) {
			return true;
		}
	}

	if (toolbar?.key === TOOLBARS.INLINE_TEXT_TOOLBAR && toolbarDocking !== 'top') {
		return true;
	}

	if (toolbar?.key === TOOLBARS.PRIMARY_TOOLBAR && toolbarDocking !== 'none') {
		return true;
	}

	return false;
};

const usePluginState = conditionalHooksFactory(
	() => expValEquals('platform_editor_toolbar_aifc_patch_3', 'isEnabled', true),
	(api?: ExtractInjectionAPI<ToolbarPlugin> | undefined) => {
		const { editorViewMode, editorToolbarDockingPreference, editorAppearance } = useEditorToolbar();

		return {
			editorViewMode,
			editorToolbarDockingPreference,
			editorAppearance,
		};
	},
	(api?: ExtractInjectionAPI<ToolbarPlugin> | undefined) => {
		const editorViewMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
		const editorToolbarDockingPreference = useSharedPluginStateSelector(
			api,
			'userPreferences.preferences.toolbarDockingPosition',
		);
		const { editorAppearance } = useEditorToolbar();

		return {
			editorViewMode,
			editorToolbarDockingPreference,
			editorAppearance,
		};
	},
);

export const Section = ({
	children,
	parents,
	api,
	testId,
	showSeparatorInFullPagePrimaryToolbar,
	isSharedSection = true,
	disableSelectionToolbar,
}: SectionProps) => {
	const { editorViewMode, editorToolbarDockingPreference, editorAppearance } = usePluginState(api);
	const toolbar = parents.find((parent) => parent.type === 'toolbar');

	if (
		isSharedSection &&
		!shouldShowSection(
			editorViewMode,
			toolbar,
			editorToolbarDockingPreference,
			disableSelectionToolbar,
		)
	) {
		return null;
	}

	const isFullPage = editorAppearance === 'full-page';
	const hasSeparator = showSeparatorInFullPagePrimaryToolbar && isFullPage;

	return (
		<ToolbarSection
			testId={testId}
			hasSeparator={
				expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true) && hasSeparator
					? SeparatorPosition.START
					: hasSeparator
			}
		>
			{children}
		</ToolbarSection>
	);
};
