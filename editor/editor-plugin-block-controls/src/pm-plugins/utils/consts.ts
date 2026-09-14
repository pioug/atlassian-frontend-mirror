import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

export const maxLayoutColumnSupported = (): 3 | 5 => {
	return editorExperiment('advanced_layouts', true) ? 5 : 3;
};

export const MIN_LAYOUT_COLUMN = 2;
