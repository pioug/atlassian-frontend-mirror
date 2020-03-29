import React, { Component } from 'react';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import Navigator, { NavigatorPropsType } from './Navigator';

export default class LeftNavigator extends Component<NavigatorPropsType> {
  static defaultProps = {
    'aria-label': 'previous',
    iconBefore: <ChevronLeftLargeIcon label="" />,
    isDisabled: false,
  };

  render() {
    return <Navigator {...this.props} />;
  }
}
