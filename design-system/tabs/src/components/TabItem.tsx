import React, { Component } from 'react';
import { NavItem, NavLine } from '../styled';
import { TabItemComponentProvided } from '../types';

const noop = () => {};

export default class TabItem extends Component<TabItemComponentProvided> {
  static defaultProps = {
    data: {},
    elementProps: {},
    innerRef: noop,
    isSelected: false,
  };

  render() {
    const { data, elementProps, innerRef, isSelected } = this.props;
    return (
      <NavItem
        {...elementProps}
        innerRef={innerRef}
        status={isSelected ? 'selected' : 'normal'}
      >
        {data.label}
        {isSelected && <NavLine status="selected" />}
      </NavItem>
    );
  }
}
