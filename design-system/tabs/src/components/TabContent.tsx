/** @jsx jsx */
import { Component } from 'react';

import { jsx } from '@emotion/core';

import { tabPaneStyles } from '../internal/styles';
import { TabContentComponentProvided } from '../types';

export default class TabContent extends Component<TabContentComponentProvided> {
  static defaultProps = {
    data: {},
    elementProps: {},
    isSelected: false,
  };

  render() {
    const { data, elementProps, isSelected } = this.props;
    return (
      <div
        css={tabPaneStyles}
        {...elementProps}
        data-selected={isSelected ? 'true' : undefined}
      >
        {data.content}
      </div>
    );
  }
}
