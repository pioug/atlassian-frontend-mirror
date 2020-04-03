/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import Drawer from '../Drawer';
import { drawerIconOffset } from '../../../shared-variables';

/*
NOTE: All drawers mirror each other in design, with the only difference
being the offset.
*/
export default class SearchDrawer extends PureComponent {
  render() {
    return (
      <Drawer
        iconOffset={drawerIconOffset}
        width={this.props.isFullWidth ? 'full' : 'wide'}
        {...this.props}
      />
    );
  }
}
