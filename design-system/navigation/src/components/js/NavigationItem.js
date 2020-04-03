/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import baseItem, { withItemClick, withItemFocus } from '@atlaskit/item';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import NavigationItemAction from '../styled/NavigationItemAction';
import NavigationItemAfter from '../styled/NavigationItemAfter';
import NavigationItemCaption from '../styled/NavigationItemCaption';
import NavigationItemIcon from '../styled/NavigationItemIcon';
import NavigationItemTextAfter from '../styled/NavigationItemTextAfter';
import NavigationItemAfterWrapper from '../styled/NavigationItemAfterWrapper';
import { isInOverflowDropdown } from '../../theme/util';

const Item = withItemClick(withItemFocus(baseItem));

class NavigationItem extends PureComponent {
  static defaultProps = {
    isSelected: false,
    isDropdownTrigger: false,
    autoFocus: false,
  };

  render() {
    const icon = this.props.icon ? (
      <NavigationItemIcon>{this.props.icon}</NavigationItemIcon>
    ) : null;

    const dropIcon =
      this.props.dropIcon && this.props.isDropdownTrigger ? (
        <NavigationItemIcon isDropdownTrigger>
          {this.props.dropIcon}
        </NavigationItemIcon>
      ) : null;

    const textAfter = this.props.textAfter ? (
      <NavigationItemTextAfter>{this.props.textAfter}</NavigationItemTextAfter>
    ) : null;

    const action = this.props.action ? (
      <NavigationItemAction>{this.props.action}</NavigationItemAction>
    ) : null;

    const after = this.props.textAfter ? (
      <NavigationItemAfter
        shouldTakeSpace={this.props.action || this.props.textAfter}
        isDropdownTrigger={this.props.isDropdownTrigger}
      >
        {textAfter}
      </NavigationItemAfter>
    ) : null;

    // There are various 'after' elements which are all optional. If any of them are present we
    // render those inside a shared wrapper.
    const allAfter =
      after || dropIcon || action ? (
        <NavigationItemAfterWrapper>
          {after}
          {dropIcon}
          {action}
        </NavigationItemAfterWrapper>
      ) : null;

    const wrappedCaption = this.props.caption ? (
      <NavigationItemCaption>{this.props.caption}</NavigationItemCaption>
    ) : null;

    const interactiveWrapperProps = {
      onClick: this.props.onClick,
      onKeyDown: this.props.onKeyDown,
      onMouseEnter: this.props.onMouseEnter,
      onMouseLeave: this.props.onMouseLeave,
      href: this.props.href,
      linkComponent: this.props.linkComponent,
    };

    // Theme prop is provided via withTheme(...) and is not public API
    const role = isInOverflowDropdown(this.props.theme) ? 'menuitem' : null;

    return (
      <Item
        elemBefore={icon}
        elemAfter={allAfter}
        description={this.props.subText}
        isSelected={this.props.isSelected}
        isDragging={this.props.isDragging}
        isDropdown={this.props.isDropdownTrigger}
        isCompact={this.props.isCompact}
        dnd={this.props.dnd}
        autoFocus={this.props.autoFocus}
        target={this.props.target}
        role={role}
        {...interactiveWrapperProps}
      >
        {this.props.text}
        {wrappedCaption}
      </Item>
    );
  }
}

export const NavigationItemWithoutAnalytics = withTheme(NavigationItem);
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'navigationItem',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'navigationItem',

      attributes: {
        componentName: 'navigationItem',
        packageName,
        packageVersion,
      },
    }),
  })(NavigationItemWithoutAnalytics),
);
