/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { Appearance } from '../old-button/types';

export type ButtonGroupProps = {
  /**
   * The appearance to apply to all buttons
   */
  appearance?: Appearance;
  /**
   * The buttons to render inside the Button Group
   */
  children?: React.ReactNode;
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
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
}: ButtonGroupProps) {
  return (
    <div css={buttonGroupStyles} data-testid={testId}>
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
