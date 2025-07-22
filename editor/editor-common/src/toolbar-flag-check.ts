import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

export const areToolbarFlagsEnabled = () =>
	expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') ||
	expValEqualsNoExposure('platform_editor_toolbar_aifc', 'isEnabled', true);
