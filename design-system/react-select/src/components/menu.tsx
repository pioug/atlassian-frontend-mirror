/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type LegacyRef, type ReactElement, type ReactNode, type Ref } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import Compiled, {
	LoadingMessage as CompiledLoadingMessage,
	menuCSS as compiledMenuCSS,
	MenuList as CompiledMenuList,
	menuListCSS as compiledMenuListCSS,
	MenuPlacer as CompiledMenuPlacer,
	MenuPortal as CompiledMenuPortal,
	menuPortalCSS as compiledMenuPortalCSS,
	NoOptionsMessage as CompiledNoOptionsMessage,
} from '../compiled/components/menu';
import Emotion, {
	LoadingMessage as EmotionLoadingMessage,
	menuCSS as emotionMenuCSS,
	MenuList as EmotionMenuList,
	menuListCSS as emotionMenuListCSS,
	MenuPlacer as EmotionMenuPlacer,
	MenuPortal as EmotionMenuPortal,
	menuPortalCSS as emotionMenuPortalCSS,
	NoOptionsMessage as EmotionNoOptionsMessage,
} from '../emotion/components/menu';
import {
	type CoercedMenuPlacement,
	type CommonProps,
	type CommonPropsAndClassName,
	type CSSObjectWithLabel,
	type GroupBase,
	type MenuPlacement,
	type MenuPosition,
} from '../types';

// Menu Component
// ------------------------------

interface MenuPlacementProps {
	/**
	 * Set the minimum height of the menu.
	 */
	minMenuHeight: number;
	/**
	 * Set the maximum height of the menu.
	 */
	maxMenuHeight: number;
	/**
	 * Set whether the menu should be at the top, at the bottom. The auto options sets it to bottom.
	 */
	menuPlacement: MenuPlacement;
	/**
	 * The CSS position value of the menu, when "fixed" extra layout management is required
	 */
	menuPosition: MenuPosition;
	/**
	 * Set whether the page should scroll to show the menu.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	menuShouldScrollIntoView: boolean;
}

export interface MenuProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group>,
		MenuPlacementProps {
	/**
	 * Reference to the internal element, consumed by the MenuPlacer component
	 */
	innerRef: Ref<HTMLDivElement>;
	innerProps: JSX.IntrinsicElements['div'];
	isLoading: boolean;
	placement: CoercedMenuPlacement;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
}

interface PlacerProps {
	placement: CoercedMenuPlacement;
	maxHeight: number;
}

interface ChildrenProps {
	ref: Ref<HTMLDivElement>;
	placerProps: PlacerProps;
}

interface MenuPlacerProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>>
	extends CommonProps<Option, IsMulti, Group>,
		MenuPlacementProps {
	/**
	 * The children to be rendered.
	 */
	children: (childrenProps: ChildrenProps) => ReactElement;
}

export const menuCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuProps<Option, IsMulti, Group>,
): CSSObjectWithLabel => (fg('compiled-react-select') ? compiledMenuCSS() : emotionMenuCSS(props));

// NOTE: internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MenuPlacer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuPlacerProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledMenuPlacer {...props} />
	) : (
		<EmotionMenuPlacer {...props} />
	);

const Menu = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuProps<Option, IsMulti, Group>,
) => (fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Menu;

// ==============================
// Menu List
// ==============================

export interface MenuListProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Set the max height of the Menu component
	 */
	maxHeight: number;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Inner ref to DOM ReactNode
	 */
	innerRef: LegacyRef<HTMLDivElement>;
	/**
	 * The currently focused option
	 */
	focusedOption: Option;
	/**
	 * Props to be passed to the menu-list wrapper.
	 */
	innerProps: JSX.IntrinsicElements['div'];
}
export const menuListCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuListProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledMenuListCSS() : emotionMenuListCSS(props);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MenuList = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuListProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? <CompiledMenuList {...props} /> : <EmotionMenuList {...props} />;

// ==============================
// Menu Notices
// ==============================

const noticeCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({}: NoticeProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	textAlign: 'center',
	padding: `${token('space.100')} ${token('space.150')}`,
});
export const noOptionsMessageCSS = noticeCSS;
export const loadingMessageCSS = noticeCSS;

export interface NoticeProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Props to be passed on to the wrapper.
	 */
	innerProps: JSX.IntrinsicElements['div'];
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const NoOptionsMessage = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: NoticeProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledNoOptionsMessage {...props} />
	) : (
		<EmotionNoOptionsMessage {...props} />
	);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const LoadingMessage = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: NoticeProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledLoadingMessage {...props} />
	) : (
		<EmotionLoadingMessage {...props} />
	);

// ==============================
// Menu Portal
// ==============================

export interface MenuPortalProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>>
	extends CommonPropsAndClassName<Option, IsMulti, Group> {
	appendTo: HTMLElement | undefined;
	children: ReactNode; // ideally Menu<MenuProps>
	controlElement: HTMLDivElement | null;
	innerProps: JSX.IntrinsicElements['div'];
	menuPlacement: MenuPlacement;
	menuPosition: MenuPosition;
}

export interface PortalStyleArgs {
	offset: number;
	position: MenuPosition;
	rect: { left: number; width: number };
}

export const menuPortalCSS = (props: PortalStyleArgs): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledMenuPortalCSS() : emotionMenuPortalCSS(props);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MenuPortal = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuPortalProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledMenuPortal {...props} />
	) : (
		<EmotionMenuPortal {...props} />
	);
