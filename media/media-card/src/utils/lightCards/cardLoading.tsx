import React from 'react';
import { Component } from 'react';
import { getDimensionsWithDefault } from './getDimensionsWithDefault';
import { Wrapper, AnimatedWrapper } from './styled';
import { StaticCardProps } from './types';
import SpinnerIcon from '@atlaskit/spinner';
import FileIcon from '@atlaskit/icon/glyph/file';
import { getMediaFeatureFlag } from '@atlaskit/media-common';

export class CardLoading extends Component<StaticCardProps, {}> {
  render() {
    const { dimensions: dimensionsProp, testId, featureFlags } = this.props;
    const dimensions = getDimensionsWithDefault(dimensionsProp);

    if (getMediaFeatureFlag('newCardExperience', featureFlags)) {
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

    return (
      <AnimatedWrapper
        data-testid={testId || 'media-card-loading'}
        data-test-loading
        dimensions={dimensions}
      >
        <FileIcon label="loading" size="medium" />
      </AnimatedWrapper>
    );
  }
}
