import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const areToolbarFlagsEnabled = (isNewToolbarEnabled?: boolean): boolean =>
	Boolean(
		expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') ||
			(isNewToolbarEnabled && editorExperiment('platform_editor_toolbar_aifc', true)),
	);
