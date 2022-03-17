/** @jsx jsx */
import React from 'react';
import { css, jsx, keyframes } from '@emotion/react';
import { R100 } from '@atlaskit/theme/colors';

const pulseBackground = keyframes`
  50% {
    background-color: ${R100};
  }
`;

const pulseBackgroundReverse = keyframes`
  0% {
    background-color: ${R100};
  }
  50% {
    background-color: auto;
  }
  100% {
    background-color: ${R100};
  }
`;

const flashWrapper = css`
  &.-flash > div {
    animation: 0.25s ease-in-out ${pulseBackgroundReverse};
  }

  & > div {
    animation: 'none';
  }
`;

const flashWrapperAnimated = css`
  ${flashWrapper}

  & > div {
    animation: 0.25s ease-in-out ${pulseBackground};
  }
`;

export interface Props {
  animate: boolean;
  children?: any;
}

export default class WithFlash extends React.Component<Props> {
  private toggle = false;

  render() {
    const { animate, children } = this.props;
    this.toggle = animate && !this.toggle;

    return (
      <div
        css={animate ? flashWrapperAnimated : flashWrapper}
        className={this.toggle ? '-flash' : ''}
      >
        {children}
      </div>
    );
  }
}
