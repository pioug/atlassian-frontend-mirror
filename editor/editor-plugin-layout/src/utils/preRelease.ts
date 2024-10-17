import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const isPreRelease2 = () =>
	editorExperiment('advanced_layouts', true) ||
	fg('platform_editor_advanced_layouts_pre_release_2');
