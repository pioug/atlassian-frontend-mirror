/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode, type Ref } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../get-style-props';
import { type CoercedMenuPlacement, type CommonPropsAndClassName, type GroupBase } from '../types';

import type { MenuPlacementProps } from './menu-placer';

export interface MenuProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
>
	extends CommonPropsAndClassName<Option, IsMulti, Group>, MenuPlacementProps {
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

const menuStyles = cssMap({
	root: {
		position: 'absolute',
		width: '100%',
		zIndex: 1,
		borderRadius: token('radius.small'),
		marginBlockEnd: token('space.100'),
		marginBlockStart: token('space.100'),
		backgroundColor: token('elevation.surface.overlay', 'white'),
		boxShadow: token(
			'elevation.shadow.overlay',
			'0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
		),
	},
	rootT26Shape: {
		borderRadius: token('radius.large'),
	},
	bottom: {
		insetBlockStart: '100%',
	},
	top: {
		insetBlockEnd: '100%',
	},
});

const Menu: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuProps<Option, IsMulti, Group>,
) => {
	const { children, innerRef, innerProps, placement = 'bottom', xcss } = props;
	const { css, className } = getStyleProps(props, 'menu', { menu: true });

	return (
		<div
			css={[
				menuStyles.root,
				menuStyles[placement],
				fg('platform-dst-shape-theme-default') && menuStyles.rootT26Shape,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(xcss, className as any, '-menu')}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			ref={innerRef}
			{...innerProps}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Menu;
