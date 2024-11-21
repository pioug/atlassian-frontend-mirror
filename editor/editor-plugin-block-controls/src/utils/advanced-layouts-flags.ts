import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

// When we turn on re-release 2, will also turn on pre-release 1
// but not vice-versa
export const isPreRelease1 = () => {
	return (
		editorExperiment('advanced_layouts', true) ||
		fg('platform_editor_advanced_layouts_pre_release_1') ||
		fg('platform_editor_advanced_layouts_pre_release_2')
	);
};

export const isPreRelease2 = () => {
	return (
		editorExperiment('advanced_layouts', true) ||
		fg('platform_editor_advanced_layouts_pre_release_2')
	);
};

export const showResponsiveLayout = () => {
	return (
		editorExperiment('advanced_layouts', true) &&
		fg('platform_editor_advanced_layouts_breakout_resizing')
	);
};
