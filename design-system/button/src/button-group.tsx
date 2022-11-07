/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { Appearance } from './types';

export type ButtonGroupProps = {
  /**
   * The appearance to apply to all buttons.
   */
  appearance?: Appearance;
  children?: React.ReactNode;
};

const buttonGroupStyles = css({
  display: 'inline-flex',
  // TODO Delete this comment after verifying spacing token -> previous value `4`
  gap: token('spacing.scale.050', '4px'),
  '> *': {
    flex: '1 0 auto',
  },
});

export default function ButtonGroup({
  appearance,
  children,
}: ButtonGroupProps) {
  return (
    <div css={buttonGroupStyles}>
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
