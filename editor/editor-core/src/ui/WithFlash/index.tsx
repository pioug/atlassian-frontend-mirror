import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '@atlaskit/theme';

const pulseBackground = keyframes`
  50% {
    background-color: ${colors.R100};
  }
`;

const pulseBackgroundReverse = keyframes`
  0% {
    background-color: ${colors.R100};
  }
  50% {
    background-color: auto;
  }
  100% {
    background-color: ${colors.R100};
  }
`;

const Wrapper: any = styled.div`
  &.-flash > div {
    animation: 0.25s ease-in-out ${pulseBackgroundReverse};
  }

  & > div {
    animation: ${(props: Props) =>
      props.animate ? `.25s ease-in-out ${pulseBackground}` : 'none'};
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
      <Wrapper className={this.toggle ? '-flash' : ''} animate={animate}>
        {children}
      </Wrapper>
    );
  }
}
