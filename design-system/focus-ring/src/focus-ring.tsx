/** @jsx jsx */
import { Children, cloneElement, FC } from 'react';

import { ClassNames, css, CSSObject, jsx } from '@emotion/core';

import { B100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { FocusRingProps } from './types';

const BORDER_WIDTH = 2;

const focusOutsideStyles: CSSObject = {
  outlineOffset: BORDER_WIDTH,
  outline: `${BORDER_WIDTH}px solid ${token('color.border.focused', B100)}`,
};

const baseInsetStyles = css({
  boxShadow: `inset 0px 0px 0px ${BORDER_WIDTH}px ${token(
    'color.border.focused',
    B100,
  )}`,
  outline: 'none',
});

const focusRingStyles = css({
  '&:focus-visible': focusOutsideStyles,
  '@supports not selector(*:focus-visible)': {
    '&:focus': focusOutsideStyles,
  },
  '@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
    '&:focus-visible': {
      outline: '1px solid',
    },
  },
});

const insetFocusRingStyles = css({
  '&:focus-visible': baseInsetStyles,
  '@supports not selector(*:focus-visible)': {
    '&:focus': baseInsetStyles,
  },
  '@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
    '&:focus-visible': {
      outline: '1px solid',
      outlineOffset: '-1px',
    },
  },
});

/**
 * __Focus ring__
 *
 * A focus ring is used indicate the currently focused item.
 *
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/focus-ring)
 *
 * @example
 * ```jsx
 * import FocusRing from '@atlaskit/focus-ring';
 *
 * const InteractiveComponent = () => (
 *   <FocusRing>
 *     <button type="button">Hello</button>
 *   </FocusRing>
 * )
 * ```
 */
const FocusRing: FC<FocusRingProps> = ({ children, isInset }) => (
  <ClassNames>
    {({ css, cx }) =>
      Children.only(
        // eslint-disable-next-line @repo/internal/react/no-clone-element
        cloneElement(children, {
          className: cx([
            css(isInset ? insetFocusRingStyles : focusRingStyles),
            children && children.props.className,
          ]),
        }),
      )
    }
  </ClassNames>
);

export default FocusRing;
