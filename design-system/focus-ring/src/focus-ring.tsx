/** @jsx jsx */
import { Children, cloneElement } from 'react';

import { ClassNames, css, jsx } from '@emotion/core';

import { B100 } from '@atlaskit/theme/colors';

import type { FocusRingProps } from './types';

const baseFocusStyles = {
  boxShadow: `0 0 0 2px white, 0 0 0 4px ${B100}`,
  outline: 'none',
};

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
const FocusRing = (props: FocusRingProps) => (
  <ClassNames>
    {({ css }) =>
      Children.only(
        // eslint-disable-next-line @repo/internal/react/no-clone-element
        cloneElement(props.children, {
          className: css([focusRingStyles, (props.children as any).className]),
        }),
      )
    }
  </ClassNames>
);

export default FocusRing;
