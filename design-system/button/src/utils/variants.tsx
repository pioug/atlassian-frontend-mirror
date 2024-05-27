import React, { forwardRef } from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '../new-button/variants/default/button';
import LinkButton, {
  type LinkButtonProps,
} from '../new-button/variants/default/link';
import IconButton, {
  type IconButtonProps,
} from '../new-button/variants/icon/button';
import LinkIconButton, {
  type LinkIconButtonProps,
} from '../new-button/variants/icon/link';

import {
  buttonAppearances,
  iconButtonAppearances,
  linkButtonAppearances,
} from './appearances';
import { buttonSpacing, iconButtonSpacing } from './spacing';

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
};
type LinkIconButtonVariant = {
  name: 'LinkIconButton';
  Component: typeof LinkIconButtonRender;
  elementType: typeof HTMLAnchorElement;
  appearances: typeof iconButtonAppearances;
  spacing: typeof iconButtonSpacing;
};

type DefaultButtonVariants = DefaultButtonVariant | LinkButtonVariant;
type LinkButtonVariants = LinkButtonVariant | LinkIconButtonVariant;
type IconButtonVariants = IconButtonVariant | LinkIconButtonVariant;

export type Variant =
  | DefaultButtonVariant
  | LinkButtonVariant
  | IconButtonVariant
  | LinkIconButtonVariant;

// Add required default props to variants
const LinkButtonRender = forwardRef(
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

const IconButtonRender = forwardRef(
  (
    {
      icon = StarFilledIcon,
      label = 'Label',
      ...rest
    }: Omit<IconButtonProps, 'icon' | 'label'> & {
      icon?: IconButtonProps['icon'];
      label?: IconButtonProps['label'];
    },
    ref: React.Ref<HTMLButtonElement>,
  ) => <IconButton ref={ref} icon={icon} label={label} {...rest} />,
);

const LinkIconButtonRender = forwardRef(
  (
    {
      href = 'home',
      icon = StarFilledIcon,
      label = 'Label',
      ...rest
    }: Omit<LinkIconButtonProps, 'href' | 'icon' | 'label'> & {
      href?: LinkIconButtonProps['href'];
      icon?: LinkIconButtonProps['icon'];
      label?: LinkIconButtonProps['label'];
    },
    ref: React.Ref<HTMLAnchorElement>,
  ) => (
    <LinkIconButton ref={ref} href={href} icon={icon} label={label} {...rest} />
  ),
);

const variants: Variant[] = [
  {
    name: 'Button',
    Component: Button,
    elementType: HTMLButtonElement,
    appearances: buttonAppearances,
    spacing: buttonSpacing,
  },
  {
    name: 'LinkButton',
    Component: LinkButtonRender,
    elementType: HTMLAnchorElement,
    appearances: linkButtonAppearances,
    spacing: buttonSpacing,
  },
  {
    name: 'IconButton',
    Component: IconButtonRender,
    elementType: HTMLButtonElement,
    appearances: iconButtonAppearances,
    spacing: iconButtonSpacing,
  },
  {
    name: 'LinkIconButton',
    Component: LinkIconButtonRender,
    elementType: HTMLAnchorElement,
    appearances: iconButtonAppearances,
    spacing: iconButtonSpacing,
  },
];

export const defaultButtonVariants: DefaultButtonVariants[] = variants.filter(
  ({ name }) => name === 'Button' || name === 'LinkButton',
) as DefaultButtonVariants[];

export const linkButtonVariants: LinkButtonVariants[] = variants.filter(
  ({ name }) => name === 'LinkButton' || name === 'LinkIconButton',
) as LinkButtonVariants[];

export const iconButtonVariants: IconButtonVariants[] = variants.filter(
  ({ name }) => name === 'IconButton' || name === 'LinkIconButton',
) as IconButtonVariants[];

export default variants;
