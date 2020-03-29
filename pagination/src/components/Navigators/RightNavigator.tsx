import React, { Component } from 'react';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import Navigator, { NavigatorPropsType } from './Navigator';

export default class RightNavigator extends Component<NavigatorPropsType> {
  static defaultProps = {
    'aria-label': 'next',
    iconBefore: <ChevronRightLargeIcon label="" />,
    isDisabled: false,
  };

  render() {
    return <Navigator {...this.props} />;
  }
}
