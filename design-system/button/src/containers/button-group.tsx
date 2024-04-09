/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { Appearance } from '../old-button/types';

export type ButtonGroupProps = {
  /**
   * The appearance to apply to all buttons.
   */
  appearance?: Appearance;
  /**
   * The buttons to render inside the button group.
   */
  children?: React.ReactNode;
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * Refers to an `aria-label` attribute. Sets an accessible name for the button group wrapper to announce it to users of assistive technology.
   * Usage of either this, or the `titleId` attribute is strongly recommended.
   */
  label?: string;
  /**
   * ID referenced by the button group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group-button title element.
   * Usage of either this, or the `label` attribute is strongly recommended.
   */
  titleId?: string;
};

const buttonGroupStyles = css({
  display: 'inline-flex',
  gap: token('space.050', '4px'),
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '> *': {
    flex: '1 0 auto',
  },
});

export default function ButtonGroup({
  appearance,
  children,
  testId,
  label,
  titleId,
}: ButtonGroupProps) {
  return (
    <div
      css={buttonGroupStyles}
      data-testid={testId}
      role="group"
      aria-label={label}
      aria-labelledby={titleId}
    >
      {/* flatten children to apply correct styles in the case where a child is an array of elements */}
      {React.Children.map(React.Children.toArray(children), (child, idx) => {
        if (!child) {
          return null;
        }
        return (
          <Fragment key={idx}>
            {appearance
              ? // eslint-disable-next-line @repo/internal/react/no-clone-element
                React.cloneElement(child as JSX.Element, { appearance })
              : child}
          </Fragment>
        );
      })}
    </div>
  );
}
