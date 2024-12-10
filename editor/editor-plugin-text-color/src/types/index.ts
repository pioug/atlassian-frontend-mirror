import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

export type TextColorInputMethod = INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;

export enum ToolbarType {
	PRIMARY = 'primaryToolbar',
	FLOATING = 'floatingToolbar',
}
