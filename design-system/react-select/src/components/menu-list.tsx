/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type LegacyRef, type ReactNode } from 'react';

import { css, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../get-style-props';
import type { CommonPropsAndClassName, GroupBase } from '../types';

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

const menuListStyles = css({
	position: 'relative',
	overflowY: 'auto',
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	WebkitOverflowScrolling: 'touch',
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MenuList: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuListProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuListProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps, innerRef, isMulti, maxHeight, xcss } = props;
	const { css, className } = getStyleProps(props, 'menuList', {
		'menu-list': true,
		'menu-list--is-multi': isMulti,
	});
	return (
		<div
			css={menuListStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-MenuList')}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ ...(css as CSSProperties), maxHeight: maxHeight }}
			ref={innerRef}
			{...innerProps}
			tabIndex={-1}
		>
			{children}
		</div>
	);
};
