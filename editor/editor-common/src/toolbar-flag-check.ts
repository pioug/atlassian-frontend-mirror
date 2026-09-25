import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

export const areToolbarFlagsEnabled = (isNewToolbarEnabled?: boolean): boolean =>
	Boolean(editorExperiment('platform_editor_controls', 'variant1') || isNewToolbarEnabled);
