// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import type React from 'react';

import Loadable from 'react-loadable';

import type { IconProps } from '../types';

export { PanelInfoIcon } from './shared/PanelInfoIcon';
export { PanelWarningIcon } from './shared/PanelWarningIcon';
export { PanelErrorIcon } from './shared/PanelErrorIcon';
export { PanelSuccessIcon } from './shared/PanelSuccessIcon';
export { PanelNoteIcon } from './shared/PanelNoteIcon';
export { BorderIcon } from './shared/BorderIcon';
export {
	SteppedRainbowIconDecoration,
	rainbow,
	disabledRainbow,
} from './shared/SteppedRainbowIconDecoration';
export { DynamicStrokeIconDecoration } from './shared/DynamicStrokeIconDecoration';

export const IconTable = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-table" */ '../icons/shared/table'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});
