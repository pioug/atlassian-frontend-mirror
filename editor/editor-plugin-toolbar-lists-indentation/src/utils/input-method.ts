import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

import type { ListsIndentationInputMethod } from '../types';
import { ToolbarType } from '../types';

type ToolbarTypeToInputMethodMap = Record<ToolbarType, ListsIndentationInputMethod>;

const toolbarTypeToInputMethod: ToolbarTypeToInputMethodMap = {
	[ToolbarType.PRIMARY]: INPUT_METHOD.TOOLBAR,
	[ToolbarType.FLOATING]: INPUT_METHOD.FLOATING_TB,
};

export const getInputMethod = (toolbarType: ToolbarType): ListsIndentationInputMethod =>
	toolbarTypeToInputMethod[toolbarType];
