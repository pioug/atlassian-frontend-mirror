import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

export const areToolbarFlagsEnabled = (isNewToolbarEnabled?: boolean): boolean =>
	Boolean(
		expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') || isNewToolbarEnabled,
	);
