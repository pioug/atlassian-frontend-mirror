import React from 'react';
import { Component } from 'react';
import { getDimensionsWithDefault } from './getDimensionsWithDefault';
import { Wrapper } from './lightCardWrappers';
import { StaticCardProps } from './types';
import SpinnerIcon from '@atlaskit/spinner';

export class CardLoading extends Component<StaticCardProps, {}> {
  render() {
    const { dimensions: dimensionsProp, testId } = this.props;
    const dimensions = getDimensionsWithDefault(dimensionsProp);

    return (
      <Wrapper
        data-testid={testId || 'media-card-loading'}
        data-test-loading
        dimensions={dimensions}
      >
        <SpinnerIcon />
      </Wrapper>
    );
  }
}
