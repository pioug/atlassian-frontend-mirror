import React from 'react';
import BreadcrumbsStateless from './BreadcrumbsStateless';

interface IState {
  isExpanded?: boolean;
}

interface IProps {
  maxItems?: number;
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
