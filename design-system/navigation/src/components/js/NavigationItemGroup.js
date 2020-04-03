/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { ItemGroup } from '@atlaskit/item';
import NavigationItemGroupTitle from '../styled/NavigationItemGroupTitle';
import NavigationItemGroupSeparator from '../styled/NavigationItemGroupSeparator';
import NavigationItemGroupHeader from '../styled/NavigationItemGroupHeader';
import NavigationItemGroupAction from '../styled/NavigationItemGroupAction';

export default class NavigationItemGroup extends Component {
  static defaultProps = {
    isCompact: false,
    hasSeparator: false,
  };

  render() {
    const {
      title,
      action,
      isCompact,
      hasSeparator,
      children,
      innerRef,
    } = this.props;

    const wrappedTitle = title ? (
      <NavigationItemGroupTitle>{title}</NavigationItemGroupTitle>
    ) : null;

    const wrappedAction = action ? (
      <NavigationItemGroupAction>{action}</NavigationItemGroupAction>
    ) : null;

    const separator = hasSeparator ? <NavigationItemGroupSeparator /> : null;

    const header =
      title || action ? (
        <NavigationItemGroupHeader>{wrappedTitle}</NavigationItemGroupHeader>
      ) : null;

    const groupHeading =
      separator || header ? (
        <div>
          {separator}
          {header}
        </div>
      ) : null;

    return (
      <ItemGroup
        title={groupHeading}
        elemAfter={wrappedAction}
        isCompact={isCompact}
        innerRef={innerRef}
      >
        {children}
      </ItemGroup>
    );
  }
}
