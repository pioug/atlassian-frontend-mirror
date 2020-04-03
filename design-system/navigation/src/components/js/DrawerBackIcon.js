import React, { PureComponent } from 'react';
import DrawerBackIconInner from '../styled/DrawerBackIconInner';
import DrawerBackIconOuter from '../styled/DrawerBackIconOuter';

export default class DrawerBackIcon extends PureComponent {
  static defaultProps = {
    isVisible: false,
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const { children, isVisible } = this.props;
    return (
      <DrawerBackIconOuter>
        <DrawerBackIconInner isVisible={isVisible}>
          {children}
        </DrawerBackIconInner>
      </DrawerBackIconOuter>
    );
  }
}
