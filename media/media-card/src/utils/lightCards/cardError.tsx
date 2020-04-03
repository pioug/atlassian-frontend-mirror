import React from 'react';
import { Component } from 'react';
import { ErrorIcon } from '../errorIcon';
import { Wrapper } from './styled';
import { StaticCardProps } from './types';
import { getDimensionsWithDefault } from './getDimensionsWithDefault';

export interface ErrorCardProps extends StaticCardProps {
  readonly size: 'small' | 'medium' | 'large' | 'xlarge';
}

export class CardError extends Component<ErrorCardProps, {}> {
  static defaultProps = {
    size: 'medium',
  };

  render() {
    const dimensions = getDimensionsWithDefault(this.props.dimensions);
    return <Wrapper dimensions={dimensions}>{this.icon}</Wrapper>;
  }

  get icon() {
    const { size } = this.props;

    return <ErrorIcon size={size} />;
  }
}
