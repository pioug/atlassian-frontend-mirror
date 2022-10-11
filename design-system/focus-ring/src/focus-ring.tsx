/** @jsx jsx */
import { Children, cloneElement, FC } from 'react';

import { ClassNames, css, jsx } from '@emotion/react';

import { B100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { FocusRingProps } from './types';

const BORDER_WIDTH = 2;

const baseFocusOutsideStyles = css({
  outline: `${BORDER_WIDTH}px solid ${token('color.border.focused', B100)}`,
  outlineOffset: BORDER_WIDTH,
});

const baseInsetStyles = css({
  boxShadow: `inset 0px 0px 0px ${BORDER_WIDTH}px ${token(
    'color.border.focused',
    B100,
  )}`,
  outline: 'none',
});

const focusRingStyles = css({
  '&:focus-visible': baseFocusOutsideStyles,
  '@supports not selector(*:focus-visible)': {
    '&:focus': baseFocusOutsideStyles,
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
const FocusRing: FC<FocusRingProps> = ({ children, isInset, focus }) => {
  const controlledStyles = isInset ? baseInsetStyles : baseFocusOutsideStyles;
  const uncontrolledStyles = isInset ? insetFocusRingStyles : focusRingStyles;
  const focusCls =
    typeof focus === 'undefined'
      ? uncontrolledStyles
      : focus === 'on' && controlledStyles;

  return (
    <ClassNames>
      {({ css, cx }) =>
        Children.only(
          // This may look unwieldy but means we skip applying styles / cloning if no className is applicable
          focusCls
            ? // eslint-disable-next-line @repo/internal/react/no-clone-element
              cloneElement(children, {
                className: cx([css(focusCls), children.props.className]),
              })
            : children,
        )
      }
    </ClassNames>
  );
};

export default FocusRing;
