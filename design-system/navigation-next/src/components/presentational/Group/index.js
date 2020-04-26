import React, { Component, Fragment } from 'react';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import GroupHeading from '../GroupHeading';
import Separator from '../Separator';

export default class Group extends Component {
  static defaultProps = {
    hasSeparator: false,
  };

  render() {
    const { children, hasSeparator, heading, id } = this.props;

    return React.Children.count(children) ? (
      <NavigationAnalyticsContext
        data={{
          attributes: {
            viewGroup: id,
          },
          componentName: 'Group',
        }}
      >
        <Fragment>
          {heading && <GroupHeading>{heading}</GroupHeading>}
          {children}
          {hasSeparator && <Separator />}
        </Fragment>
      </NavigationAnalyticsContext>
    ) : null;
  }
}
