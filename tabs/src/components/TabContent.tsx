import React, { Component } from 'react';
import { TabPane } from '../styled';
import { TabContentComponentProvided } from '../types';

export default class TabContent extends Component<TabContentComponentProvided> {
  static defaultProps = {
    data: {},
    elementProps: {},
  };

  render() {
    const { data, elementProps } = this.props;
    return <TabPane {...elementProps}>{data.content}</TabPane>;
  }
}
