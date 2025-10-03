import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { type TextFormattingPlugin } from '../textFormattingPluginType';

import { boldButtonGroup } from './Toolbar/components/BoldButtonGroup';
import { textFormattingGroupForInlineToolbar } from './Toolbar/components/TextFormattingGroupForInlineToolbar';
import { textFormattingGroupForPrimaryToolbar } from './Toolbar/components/TextFormattingGroups';
import { textFormattingMenuGroup } from './Toolbar/components/TextFormattingMenuGroup';
import { underlineButtonGroup } from './Toolbar/components/UnderlineButtonGroup';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): RegisterComponent[] => {
	return [
		...textFormattingGroupForPrimaryToolbar(api),
		...textFormattingGroupForInlineToolbar(api),
		...boldButtonGroup(api),
		...underlineButtonGroup(api),
		...textFormattingMenuGroup(api),
	];
};
