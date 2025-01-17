import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export enum DIRECTION {
	UP = 'up',
	DOWN = 'down',
	LEFT = 'left',
	RIGHT = 'right',
}

export const maxLayoutColumnSupported = () => {
	return editorExperiment('advanced_layouts', true) ? 5 : 3;
};

export const MIN_LAYOUT_COLUMN = 2;
