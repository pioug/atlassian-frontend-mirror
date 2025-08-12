import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import { INPUT_METHOD } from '../analytics';

import { TOOLBARS } from './keys';

export const getInputMethodFromParentKeys = (parents: ToolbarComponentTypes) =>
	parents.at(0)?.key === TOOLBARS.INLINE_TEXT_TOOLBAR
		? INPUT_METHOD.FLOATING_TB
		: INPUT_METHOD.TOOLBAR;
