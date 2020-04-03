import React from 'react';
import { Component, ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface TruncatedWrapperProps {
  height?: number;
  fadeHeight?: number;
  backgroundColor?: string;
}

interface FadeOutProps {
  height: number;
  fadeHeight: number;
  backgroundColor: string;
}

const FadeOut: ComponentClass<FadeOutProps & HTMLAttributes<{}>> = styled.div`
  position: relative;
  overflow-y: hidden;
  max-height: ${({ height }: FadeOutProps) => height}px;
  &::after {
    content: '';
    position: absolute;
    top: ${({ height, fadeHeight }: FadeOutProps) => height - fadeHeight}px;
    bottom: 0;
    left: 0;
    right: 0;
    /* Using 'rgba(255, 255, 255, 0)' because 'transparent' breaks the gradient in Safari 11 */
    background-image: ${({ backgroundColor }: FadeOutProps) =>
      `linear-gradient(rgba(255, 255, 255, 0),  ${backgroundColor})`};
  }
`;

export class TruncatedWrapper extends Component<TruncatedWrapperProps, {}> {
  constructor(props: TruncatedWrapperProps) {
    super(props);
  }

  render() {
    const {
      height = 95,
      fadeHeight = 24,
      backgroundColor = 'white',
      children,
    } = this.props;
    return (
      <FadeOut
        height={height}
        fadeHeight={fadeHeight}
        backgroundColor={backgroundColor}
      >
        {children}
      </FadeOut>
    );
  }
}
