import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../toolbarListsIndentationPluginType';

import { getBulletedListButtonGroup } from './toolbar-components/BulletedListButtonGroup';
import { getListsIndentationGroupForInlineToolbar } from './toolbar-components/ListsIndentationGroupForInlineToolbar';
import { getListsIndentationGroupForPrimaryToolbar } from './toolbar-components/ListsIndentationGroupForPrimaryToolbar';
import { getListsIndentationHeroButton } from './toolbar-components/ListsIndentationHeroButtonGroup';
import { getListsIndentationMenu } from './toolbar-components/ListsIndentationMenuGroup';

type GetToolbarComponentsProps = {
	allowHeadingAndParagraphIndentation: boolean;
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	showIndentationButtons: boolean;
};

export const getToolbarComponents = ({
	api,
	showIndentationButtons,
	allowHeadingAndParagraphIndentation,
}: GetToolbarComponentsProps): RegisterComponent[] => {
	return [
		...getListsIndentationGroupForPrimaryToolbar(),
		...getListsIndentationGroupForInlineToolbar(),
		...getListsIndentationHeroButton(api),
		...getBulletedListButtonGroup(api),
		...getListsIndentationMenu(allowHeadingAndParagraphIndentation, showIndentationButtons, api),
	];
};
