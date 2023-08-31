/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { forwardRef } from 'react';

import Button from '../new-button/variants/default/button';
import LinkButton, {
  LinkButtonProps,
} from '../new-button/variants/default/link';

export type Variant = {
  name: string;
  Component: typeof Button | typeof LinkButtonRender;
  /**
   * Expected element rendered as underlying button
   */
  elementType: typeof HTMLButtonElement | typeof HTMLAnchorElement;
};

// Add required default props to variants
const LinkButtonRender = forwardRef(
  (props: LinkButtonProps, ref: React.Ref<HTMLAnchorElement>) => (
    <LinkButton ref={ref} href="#" {...props}>
      {props.children}
    </LinkButton>
  ),
);

export const variants: Variant[] = [
  {
    name: 'Button',
    Component: Button,
    elementType: HTMLButtonElement,
  },
  {
    name: 'LinkButton',
    Component: LinkButtonRender,
    elementType: HTMLAnchorElement,
  },
];

export default variants;
