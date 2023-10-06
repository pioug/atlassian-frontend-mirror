/** @jsx jsx */
import React from 'react';
import { components } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';
import { UserPickerProps } from '../types';
import { css, jsx } from '@emotion/react';

export type Props = {
  selectProps: UserPickerProps;
};

const getFooterStyle = () => {
  return css({
    padding: `${token('space.100', '8px')} ${token('space.200', '16px')}`,
  });
};

export class Menu extends React.Component<Props> {
  render() {
    return (
      <components.Menu {...(this.props as any)}>
        {this.props.selectProps.header}
        {this.props.children}
        {this.props.selectProps.footer && (
          <div css={getFooterStyle()}>{this.props.selectProps.footer}</div>
        )}
      </components.Menu>
    );
  }
}
