import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const areToolbarFlagsEnabled = () =>
	expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') ||
	editorExperiment('platform_editor_toolbar_aifc', true);
