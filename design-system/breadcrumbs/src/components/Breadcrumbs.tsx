import React from 'react';

import BreadcrumbsStateless from './BreadcrumbsStateless';

interface IState {
  isExpanded?: boolean;
}

interface IProps {
  /** Set the maximum number of breadcrumbs to display. When there are more
  than the maximum number, only the first and last will be shown, with an
  ellipsis in between. */
  maxItems?: number;
  /** The items to be included inside the Breadcrumbs wrapper */
  children?: React.ReactNode;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

export default class Breadcrumbs extends React.Component<IProps, IState> {
  state = { isExpanded: false };

  expand = () => this.setState({ isExpanded: true });

  render() {
    return (
      <BreadcrumbsStateless
        {...this.props}
        isExpanded={this.state.isExpanded}
        onExpand={this.expand}
      />
    );
  }
}
