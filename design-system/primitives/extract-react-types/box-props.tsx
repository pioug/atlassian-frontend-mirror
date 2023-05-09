// TODO: Switch from ERT to ts-morph when this is completed and has reasonable adoption: https://product-fabric.atlassian.net/browse/DSP-10364
import React, { ReactNode } from 'react';

import { As } from '../src/components/internal/base-box';
import {
  BasePrimitiveProps,
  PublicBoxPropsBase,
} from '../src/components/types';
import type {
  Padding,
  PaddingBlock,
  PaddingBlockEnd,
  PaddingBlockStart,
  PaddingInline,
  PaddingInlineEnd,
  PaddingInlineStart,
} from '../src/xcss/style-maps.partial';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Token {
  // BoxProps['backgroundColor'] uses keyof, which ERT does not understand
  export type BackgroundColor = 'BackgroundColor';
}

export default function Box(
  _: {
    /**
     * The DOM element to render as the Box. Defaults to `div`.
     */
    as?: As;

    /**
     * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
     */
    padding?: Padding;

    /**
     * Tokens representing CSS shorthand `paddingBlock`.
     */
    paddingBlock?: PaddingBlock;

    /**
     * Tokens representing CSS `paddingBlockStart`.
     */
    paddingBlockStart?: PaddingBlockStart;

    /**
     * Tokens representing CSS `paddingBlockEnd`.
     */
    paddingBlockEnd?: PaddingBlockEnd;

    /**
     * Tokens representing CSS shorthand `paddingInline`.
     */
    paddingInline?: PaddingInline;

    /**
     * Tokens representing CSS `paddingInlineStart`.
     */
    paddingInlineStart?: PaddingInlineStart;

    /**
     * Tokens representing CSS `paddingInlineEnd`.
     */
    paddingInlineEnd?: PaddingInlineEnd;

    /**
     * A token alias for background color. See:<br>
     * [https://atlassian.design/components/tokens/all-tokens#color-background](https://atlassian.design/components/tokens/all-tokens#color-background)
     */
    backgroundColor?: Token.BackgroundColor;

    /**
     * Elements to be rendered inside the primitive.
     */
    children?: ReactNode;

    /**
     * Apply a subset of permitted styles, powered by Atlassian Design System tokens.
     */
    xcss?: PublicBoxPropsBase['xcss'];

    /**
     * Forwarded ref element.
     */
    ref?: React.ComponentPropsWithRef<As>['ref'];
  } & BasePrimitiveProps,
) {}
