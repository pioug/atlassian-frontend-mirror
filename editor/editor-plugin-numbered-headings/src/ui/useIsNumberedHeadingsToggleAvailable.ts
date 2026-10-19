// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { InternalNumberedHeadingsPlugin } from '../numberedHeadingsPluginType';

export const useIsNumberedHeadingsToggleAvailable = (
	api?: ExtractInjectionAPI<InternalNumberedHeadingsPlugin>,
): boolean => {
	const { editorViewMode } = useEditorToolbar();
	const editorDisabled = useSharedPluginStateWithSelector(
		api,
		['editorDisabled'],
		(states) => states.editorDisabledState?.editorDisabled ?? false,
	);

	return (
		isExperimentEnabled('platform_editor_numbered_headings') &&
		editorViewMode !== 'view' &&
		!editorDisabled
	);
};
