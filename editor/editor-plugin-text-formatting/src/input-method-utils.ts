import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { InputMethodToolbar } from '@atlaskit/editor-common/types';

import { ToolbarType } from './ui/Toolbar/types';

type ToolbarTypeToInputMethodMap = Record<ToolbarType, InputMethodToolbar>;

export const toolbarTypeToInputMethod: ToolbarTypeToInputMethodMap = {
	[ToolbarType.PRIMARY]: INPUT_METHOD.TOOLBAR,
	[ToolbarType.FLOATING]: INPUT_METHOD.FLOATING_TB,
};

export const getInputMethod = (toolbarType: ToolbarType): InputMethodToolbar =>
	toolbarTypeToInputMethod[toolbarType];
