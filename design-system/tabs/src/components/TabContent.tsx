import React, { Component } from 'react';

import { TabPane } from '../styled';
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
      <TabPane {...elementProps} isSelected={isSelected}>
        {data.content}
      </TabPane>
    );
  }
}
