/** @jsx jsx */
import { Children, cloneElement, FC } from 'react';

import { ClassNames, css, jsx } from '@emotion/core';

import { B100, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { FocusRingProps } from './types';

const baseFocusStyles = css({
  boxShadow: `0 0 0 2px ${token(
    'color.background.default',
    N0,
  )}, 0 0 0 4px ${token('color.border.focus', B100)}`,
  outline: 'none',
});

const baseInsetStyles = css({
  boxShadow: `inset 0px 0px 0px 2px ${token('color.border.focus', B100)}`,
  outline: 'none',
});

const focusRingStyles = css({
  '&:focus-visible': baseFocusStyles,
  '@supports not selector(*:focus-visible)': {
    '&:focus': baseFocusStyles,
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
 * A focus ring is used to apply accessibile styles to a focusable element.
 *
 * @example
 * ```jsx
 * import FocusRing from '@atlaskit/focus-ring';
 *
 * const MyFocusableInput = () => (
 *  <FocusRing>
 *    <Input />
 *  </FocusRing>
 * );
 * ```
 */
const FocusRing: FC<FocusRingProps> = ({ children, isInset }) => (
  <ClassNames>
    {({ css }) =>
      Children.only(
        // eslint-disable-next-line @repo/internal/react/no-clone-element
        cloneElement(children, {
          className: css([
            isInset ? insetFocusRingStyles : focusRingStyles,
            (children as any).className,
          ]),
        }),
      )
    }
  </ClassNames>
);

export default FocusRing;
