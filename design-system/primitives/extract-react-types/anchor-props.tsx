// TODO: Switch from ERT to ts-morph when this is completed and has reasonable adoption: https://product-fabric.atlassian.net/browse/DSP-10364
import React, { ReactNode } from 'react';

import { BasePrimitiveProps, StyleProp } from '../src/components/types';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Token {
  // BoxProps['backgroundColor'] uses keyof, which ERT does not understand
  export type BackgroundColor = 'BackgroundColor';
}

type Space =
  | 'space.0'
  | 'space.025'
  | 'space.050'
  | 'space.075'
  | 'space.100'
  | 'space.150'
  | 'space.200'
  | 'space.250'
  | 'space.300'
  | 'space.400'
  | 'space.500'
  | 'space.600'
  | 'space.800'
  | 'space.1000';

export default function Anchor<
  RouterLinkConfig extends Record<string, any> = never,
>(
  _: {
    /**
     * A link can be provided as a string. If a router link configuration is set
     * it can be mapped to the underlying router link component,
     * or optionally a custom object defined in the generic type for advanced use.
     */
    href: string | RouterLinkConfig;

    /**
     * The `target` attribute of the anchor HTML element. Defaults to `_blank` for external links.
     */
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];

    /**
     * The `rel` attribute of the anchor HTML element. Defaults to `noopener noreferrer` for external links.
     */
    rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>['rel'];

    /**
     * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
     */
    padding?: Space;

    /**
     * Tokens representing CSS shorthand `paddingBlock`.
     */
    paddingBlock?: Space;

    /**
     * Tokens representing CSS `paddingBlockStart`.
     */
    paddingBlockStart?: Space;

    /**
     * Tokens representing CSS `paddingBlockEnd`.
     */
    paddingBlockEnd?: Space;

    /**
     * Tokens representing CSS shorthand `paddingInline`.
     */
    paddingInline?: Space;

    /**
     * Tokens representing CSS `paddingInlineStart`.
     */
    paddingInlineStart?: Space;

    /**
     * Tokens representing CSS `paddingInlineEnd`.
     */
    paddingInlineEnd?: Space;

    /**
     * A token alias for background color. See:<br>
     * [https://atlassian.design/components/tokens/all-tokens#color-background](https://atlassian.design/components/tokens/all-tokens#color-background)<br>
     * When the background color is set to a [surface token](/components/tokens/all-tokens#elevation-surface),
     * the [current surface](/components/tokens/code#current-surface-color) CSS variable will also be set to this value in the Box styles.
     */
    backgroundColor?: Token.BackgroundColor;

    /**
     * Elements to be rendered inside the primitive.
     */
    children: ReactNode;

    /**
     * Forwarded ref element.
     */
    ref?: React.ComponentPropsWithRef<'a'>['ref'];
  } & BasePrimitiveProps &
    StyleProp,
) {}
