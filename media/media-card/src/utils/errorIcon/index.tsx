import React from 'react';
import { Component } from 'react';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';

import { ErrorIconWrapper } from './styled';

export interface ErrorIconProps {
  readonly size: 'small' | 'medium' | 'large' | 'xlarge';
}
export class ErrorIcon extends Component<ErrorIconProps, {}> {
  static defaultProps = {
    size: 'small',
  };

  render() {
    const { size } = this.props;

    return (
      <ErrorIconWrapper>
        <WarningIcon label="Error" size={size} />
      </ErrorIconWrapper>
    );
  }
}
