import React, { forwardRef } from 'react';

import Button from '../new-button/variants/default/button';
import LinkButton, {
  LinkButtonProps,
} from '../new-button/variants/default/link';

import { buttonAppearances, linkButtonAppearances } from './appearances';

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

export const linkButtonVariants = [
  {
    name: 'LinkButton',
    Component: LinkButtonRender,
    elementType: HTMLAnchorElement,
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
];

export default variants;
