import React, { forwardRef } from 'react';

import StarStarredIcon from '@atlaskit/icon/core/star-starred';

import Button from '../new-button/variants/default/button';
import LinkButton, { type LinkButtonProps } from '../new-button/variants/default/link';
import IconButton, { type IconButtonProps } from '../new-button/variants/icon/button';
import LinkIconButton, { type LinkIconButtonProps } from '../new-button/variants/icon/link';

import { buttonAppearances } from './button-appearances';
import { buttonSpacing } from './button-spacing';
import { iconButtonAppearances } from './icon-button-appearances';
import { iconButtonShapes } from './icon-button-shapes';
import { iconButtonSpacing } from './icon-button-spacing';
import { linkButtonAppearances } from './link-button-appearances';

type DefaultButtonVariant = {
	name: 'Button';
	Component: typeof Button;
	elementType: typeof HTMLButtonElement;
	appearances: typeof buttonAppearances;
	spacing: typeof buttonSpacing;
};
type LinkButtonVariant = {
	name: 'LinkButton';
	Component: typeof LinkButtonRender;
	elementType: typeof HTMLAnchorElement;
	appearances: typeof linkButtonAppearances;
	spacing: typeof buttonSpacing;
};
type IconButtonVariant = {
	name: 'IconButton';
	Component: typeof IconButtonRender;
	elementType: typeof HTMLButtonElement;
	appearances: typeof iconButtonAppearances;
	spacing: typeof iconButtonSpacing;
	shape: typeof iconButtonShapes;
};
type LinkIconButtonVariant = {
	name: 'LinkIconButton';
	Component: typeof LinkIconButtonRender;
	elementType: typeof HTMLAnchorElement;
	appearances: typeof iconButtonAppearances;
	spacing: typeof iconButtonSpacing;
	shape: typeof iconButtonShapes;
};

export type Variant = {
	Button: DefaultButtonVariant;
	LinkButton: LinkButtonVariant;
	IconButton: IconButtonVariant;
	LinkIconButton: LinkIconButtonVariant;
};

// Add required default props to variants
const LinkButtonRender: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<Omit<LinkButtonProps, 'href'> & { href?: LinkButtonProps['href'] }> &
		React.RefAttributes<HTMLAnchorElement>
> = forwardRef(
	(
		{
			href = 'home',
			children,
			...rest
		}: Omit<LinkButtonProps, 'href'> & {
			href?: LinkButtonProps['href'];
		},
		ref: React.Ref<HTMLAnchorElement>,
	) => (
		<LinkButton ref={ref} href={href} {...rest}>
			{children}
		</LinkButton>
	),
);

const IconButtonRender: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<
		Omit<IconButtonProps, 'icon' | 'label'> & {
			icon?: IconButtonProps['icon'];
			label?: IconButtonProps['label'];
		}
	> &
		React.RefAttributes<HTMLButtonElement>
> = forwardRef(
	(
		{
			icon = StarStarredIcon,
			label = 'Label',
			...rest
		}: Omit<IconButtonProps, 'icon' | 'label'> & {
			icon?: IconButtonProps['icon'];
			label?: IconButtonProps['label'];
		},
		ref: React.Ref<HTMLButtonElement>,
	) => <IconButton ref={ref} icon={icon} label={label} {...rest} />,
);

const LinkIconButtonRender: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<
		Omit<LinkIconButtonProps, 'href' | 'icon' | 'label'> & {
			href?: LinkIconButtonProps['href'];
			icon?: LinkIconButtonProps['icon'];
			label?: LinkIconButtonProps['label'];
		}
	> &
		React.RefAttributes<HTMLAnchorElement>
> = forwardRef(
	(
		{
			href = 'home',
			icon = StarStarredIcon,
			label = 'Label',
			...rest
		}: Omit<LinkIconButtonProps, 'href' | 'icon' | 'label'> & {
			href?: LinkIconButtonProps['href'];
			icon?: LinkIconButtonProps['icon'];
			label?: LinkIconButtonProps['label'];
		},
		ref: React.Ref<HTMLAnchorElement>,
	) => <LinkIconButton ref={ref} href={href} icon={icon} label={label} {...rest} />,
);

const variants: Variant = {
	Button: {
		name: 'Button',
		Component: Button,
		elementType: HTMLButtonElement,
		appearances: buttonAppearances,
		spacing: buttonSpacing,
	},
	LinkButton: {
		name: 'LinkButton',
		Component: LinkButtonRender,
		elementType: HTMLAnchorElement,
		appearances: linkButtonAppearances,
		spacing: buttonSpacing,
	},
	IconButton: {
		name: 'IconButton',
		Component: IconButtonRender,
		elementType: HTMLButtonElement,
		appearances: iconButtonAppearances,
		spacing: iconButtonSpacing,
		shape: iconButtonShapes,
	},
	LinkIconButton: {
		name: 'LinkIconButton',
		Component: LinkIconButtonRender,
		elementType: HTMLAnchorElement,
		appearances: iconButtonAppearances,
		spacing: iconButtonSpacing,
		shape: iconButtonShapes,
	},
};

export default variants;
