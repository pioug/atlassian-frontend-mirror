import React from 'react';
import { Component } from 'react';
import FileIcon from '@atlaskit/icon/glyph/file';
import { getDimensionsWithDefault } from './getDimensionsWithDefault';
import { Wrapper } from './styled';
import { StaticCardProps } from './types';

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
        {this.icon}
      </Wrapper>
    );
  }

  get icon() {
    return <FileIcon label="loading" size="medium" />;
  }
}
