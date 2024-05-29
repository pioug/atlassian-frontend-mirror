/** @jsx jsx */
import React from 'react';

import { css, jsx, keyframes } from '@emotion/react';

import { R100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const pulseBackground = keyframes({
  '50%': {
    backgroundColor: token('color.blanket.danger', R100),
  },
});

const pulseBackgroundReverse = keyframes({
  '0%': {
    backgroundColor: token('color.blanket.danger', R100),
  },
  '50%': {
    backgroundColor: 'auto',
  },
  '100%': {
    backgroundColor: token('color.blanket.danger', R100),
  },
});

const flashWrapper = css({
  '&.-flash > div': {
    animation: `0.25s ease-in-out ${pulseBackgroundReverse}`,
  },
  '& > div': {
    animation: "'none'",
  },
});

const flashWrapperAnimated = css({
  [`${flashWrapper} & > div`]: {
    animation: `0.25s ease-in-out ${pulseBackground}`,
  },
});

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
      // eslint-disable-next-line @atlaskit/design-system/prefer-primitives
      <div
        css={animate ? flashWrapperAnimated : flashWrapper}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className={this.toggle ? '-flash' : ''}
      >
        {children}
      </div>
    );
  }
}
