import React, { forwardRef } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import AddIcon from '@atlaskit/icon/glyph/add';

import Button from '../new-button/variants/default/button';
import LinkButton, {
  LinkButtonProps,
} from '../new-button/variants/default/link';
// import IconButton, {
//   IconButtonProps,
// } from '../new-button/variants/icon/button';
import LinkIconButton, {
  LinkIconButtonProps,
} from '../new-button/variants/icon/link';
import { buttonAppearances, linkButtonAppearances } from '../utils/appearances';

export type Variant =
  | {
      name: 'Button';
      Component: typeof Button;
      elementType: typeof HTMLButtonElement;
      appearances: typeof buttonAppearances;
    }
  | {
      name: 'LinkButton';
      Component: typeof LinkButtonRender;
      elementType: typeof HTMLAnchorElement;
      appearances: typeof linkButtonAppearances;
    };

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

// TODO: Enable icon button in tests once it's ready
// const IconButtonRender = forwardRef(
//   (
//     {
//       children,
//       icon = <AddIcon label="" />,
//       ...rest
//     }: Omit<IconButtonProps, 'icon'> & {
//       icon?: IconButtonProps['icon'];
//     },
//     ref: React.Ref<HTMLButtonElement>,
//   ) => (
//     <IconButton ref={ref} icon={icon} {...rest}>
//       {children}
//     </IconButton>
//   ),
// );

const LinkIconButtonRender = forwardRef(
  (
    {
      href = '/home',
      children,
      icon = <AddIcon label="" />,
      ...rest
    }: Omit<LinkIconButtonProps, 'href' | 'icon'> & {
      href?: LinkIconButtonProps['href'];
      icon?: LinkIconButtonProps['icon'];
    },
    ref: React.Ref<HTMLAnchorElement>,
  ) => (
    <LinkIconButton ref={ref} icon={icon} href={href} {...rest}>
      {children}
    </LinkIconButton>
  ),
);

export const linkButtonVariants = [
  {
    name: 'LinkButton',
    Component: LinkButtonRender,
    elementType: HTMLAnchorElement,
    appearances: linkButtonAppearances,
  },
  {
    name: 'LinkIconButton',
    Component: LinkIconButtonRender,
    elementType: HTMLAnchorElement,
    // TODO: Make specific to icon button
    appearances: linkButtonAppearances,
  },
];

const variants: Variant[] = [
  {
    name: 'Button',
    Component: Button,
    elementType: HTMLButtonElement,
    appearances: buttonAppearances,
  },
  {
    name: 'LinkButton',
    Component: LinkButtonRender,
    elementType: HTMLAnchorElement,
    appearances: linkButtonAppearances,
  },
  // TODO: Enable icon buttons in tests once it's ready
  // {
  //   name: 'IconButton',
  //   Component: IconButtonRender,
  //   elementType: HTMLButtonElement,
  // },
  // {
  //   name: 'LinkIconButton',
  //   Component: LinkIconButtonRender,
  //   elementType: HTMLAnchorElement,
  // },
];

export default variants;
