/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/core';

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
  gap: 4,
});

export default function ButtonGroup({
  appearance,
  children,
}: ButtonGroupProps) {
  return (
    <div css={buttonGroupStyles}>
      {React.Children.map(children, (child, idx) => {
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
