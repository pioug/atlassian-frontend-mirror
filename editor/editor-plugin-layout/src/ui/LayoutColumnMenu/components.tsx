import React, { useContext } from 'react';

import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { OutsideClickTargetRefContext } from '@atlaskit/editor-common/ui-react';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { ToolbarMenuContainer } from '@atlaskit/editor-toolbar/toolbar-menu-container';
import type { RegisterComponent, SurfaceFallbacks } from '@atlaskit/editor-ui-control-model';

import type { LayoutPlugin } from '../../layoutPluginType';

import { DeleteColumnDropdownItem } from './DeleteColumnDropdownItem';
import { DistributeColumnsDropdownItem } from './DistributeColumnsDropdownItem';
import { InsertColumnDropdownItem } from './InsertColumnDropdownItem';
import {
	DELETE_COLUMN_MENU_ITEM,
	DISTRIBUTE_COLUMNS_MENU_ITEM,
	INSERT_COLUMN_LEFT_MENU_ITEM,
	INSERT_COLUMN_RIGHT_MENU_ITEM,
	LAYOUT_COLUMN_MENU,
	LAYOUT_COLUMN_MENU_RANK,
	LAYOUT_COLUMN_MENU_SECTION,
	LAYOUT_COLUMN_MENU_SECTION_RANK,
	LAYOUT_COLUMN_VERTICAL_ALIGN_MENU_SECTION,
	VERTICAL_ALIGN_BOTTOM_MENU_ITEM,
	VERTICAL_ALIGN_MENU,
	VERTICAL_ALIGN_MENU_RANK,
	VERTICAL_ALIGN_MENU_SECTION_RANK,
	VERTICAL_ALIGN_MIDDLE_MENU_ITEM,
	VERTICAL_ALIGN_TOP_MENU_ITEM,
} from './keys';
import { VerticalAlignDropdownItem } from './VerticalAlignDropdownItem';
import { VerticalAlignNestedMenu } from './VerticalAlignNestedMenu';

type MenuSectionFallbackProps = {
	children?: React.ReactNode;
};

const LayoutColumnMenuContainer = ({ children }: { children?: React.ReactNode }): React.JSX.Element => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);

	return <ToolbarMenuContainer ref={setOutsideClickTargetRef}>{children}</ToolbarMenuContainer>;
};

export const LAYOUT_COLUMN_MENU_FALLBACKS: SurfaceFallbacks = {
	'menu-section': ({ children }: MenuSectionFallbackProps) => (
		<ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>
	),
};

export const getLayoutColumnMenuComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
}): RegisterComponent[] => {
	return [
		{
			...LAYOUT_COLUMN_MENU,
			component: LayoutColumnMenuContainer,
		},
		{
			...LAYOUT_COLUMN_MENU_SECTION,
			parents: [
				{
					...LAYOUT_COLUMN_MENU,
					rank: LAYOUT_COLUMN_MENU_RANK[LAYOUT_COLUMN_MENU_SECTION.key],
				},
			],
		},
		{
			...INSERT_COLUMN_LEFT_MENU_ITEM,
			component: () => <InsertColumnDropdownItem api={api} side="left" />,
			parents: [
				{
					...LAYOUT_COLUMN_MENU_SECTION,
					rank: LAYOUT_COLUMN_MENU_SECTION_RANK[INSERT_COLUMN_LEFT_MENU_ITEM.key],
				},
			],
		},
		{
			...INSERT_COLUMN_RIGHT_MENU_ITEM,
			component: () => <InsertColumnDropdownItem api={api} side="right" />,
			parents: [
				{
					...LAYOUT_COLUMN_MENU_SECTION,
					rank: LAYOUT_COLUMN_MENU_SECTION_RANK[INSERT_COLUMN_RIGHT_MENU_ITEM.key],
				},
			],
		},
		{
			...DISTRIBUTE_COLUMNS_MENU_ITEM,
			component: () => <DistributeColumnsDropdownItem api={api} />,
			parents: [
				{
					...LAYOUT_COLUMN_MENU_SECTION,
					rank: LAYOUT_COLUMN_MENU_SECTION_RANK[DISTRIBUTE_COLUMNS_MENU_ITEM.key],
				},
			],
		},
		{
			...DELETE_COLUMN_MENU_ITEM,
			component: () => <DeleteColumnDropdownItem api={api} />,
			parents: [
				{
					...LAYOUT_COLUMN_MENU_SECTION,
					rank: LAYOUT_COLUMN_MENU_SECTION_RANK[DELETE_COLUMN_MENU_ITEM.key],
				},
			],
		},
		{
			...VERTICAL_ALIGN_MENU,
			component: ({ children }: { children?: React.ReactNode }) => (
				<VerticalAlignNestedMenu api={api}>{children}</VerticalAlignNestedMenu>
			),
			parents: [
				{
					...LAYOUT_COLUMN_MENU_SECTION,
					rank: LAYOUT_COLUMN_MENU_SECTION_RANK[VERTICAL_ALIGN_MENU.key],
				},
			],
		},
		{
			...LAYOUT_COLUMN_VERTICAL_ALIGN_MENU_SECTION,
			parents: [
				{
					...VERTICAL_ALIGN_MENU,
					rank: VERTICAL_ALIGN_MENU_RANK[LAYOUT_COLUMN_VERTICAL_ALIGN_MENU_SECTION.key],
				},
			],
		},
		{
			...VERTICAL_ALIGN_TOP_MENU_ITEM,
			component: () => (
				<VerticalAlignDropdownItem api={api} label={layoutMessages.alignColumnTop} value="top" />
			),
			parents: [
				{
					...LAYOUT_COLUMN_VERTICAL_ALIGN_MENU_SECTION,
					rank: VERTICAL_ALIGN_MENU_SECTION_RANK[VERTICAL_ALIGN_TOP_MENU_ITEM.key],
				},
			],
		},
		{
			...VERTICAL_ALIGN_MIDDLE_MENU_ITEM,
			component: () => (
				<VerticalAlignDropdownItem
					api={api}
					label={layoutMessages.alignColumnMiddle}
					value="middle"
				/>
			),
			parents: [
				{
					...LAYOUT_COLUMN_VERTICAL_ALIGN_MENU_SECTION,
					rank: VERTICAL_ALIGN_MENU_SECTION_RANK[VERTICAL_ALIGN_MIDDLE_MENU_ITEM.key],
				},
			],
		},
		{
			...VERTICAL_ALIGN_BOTTOM_MENU_ITEM,
			component: () => (
				<VerticalAlignDropdownItem
					api={api}
					label={layoutMessages.alignColumnBottom}
					value="bottom"
				/>
			),
			parents: [
				{
					...LAYOUT_COLUMN_VERTICAL_ALIGN_MENU_SECTION,
					rank: VERTICAL_ALIGN_MENU_SECTION_RANK[VERTICAL_ALIGN_BOTTOM_MENU_ITEM.key],
				},
			],
		},
	];
};
