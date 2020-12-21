/** @jsx jsx */
import { Component } from 'react';

import { jsx } from '@emotion/core';

import { getNavItemStyles } from '../internal/styles';
import { TabItemComponentProvided } from '../types';

import NavLine from './NavLine';

const noop = () => {};

export default class TabItem extends Component<TabItemComponentProvided> {
  static defaultProps: TabItemComponentProvided = {
    data: {},
    elementProps: {},
    innerRef: noop,
    isSelected: false,
    mode: 'light',
  };
  render() {
    const { data, elementProps, innerRef, isSelected, mode } = this.props;
    return (
      <div
        css={getNavItemStyles(mode)}
        {...elementProps}
        ref={innerRef}
        data-selected={isSelected ? true : undefined}
      >
        {data.label}
        {isSelected && <NavLine status="selected" mode={mode} />}
      </div>
    );
  }
}
