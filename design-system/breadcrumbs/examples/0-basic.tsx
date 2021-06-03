import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default class BreadcrumbsExpand extends React.Component<
  {},
  { isExpanded: boolean }
> {
  state = {
    isExpanded: false,
  };

  expand(e: React.MouseEvent) {
    e.preventDefault();
    this.setState({ isExpanded: true });
  }

  render() {
    return (
      <Breadcrumbs
        isExpanded={this.state.isExpanded}
        onExpand={(e) => this.expand(e)}
        testId="MyBreadcrumbsTestId"
      >
        <BreadcrumbsItem href="/pages" text="Pages" />
        <BreadcrumbsItem href="/pages/home" text="Home" />
        <BreadcrumbsItem
          href="/item"
          iconBefore={<AtlassianIcon label="Test icon" size="small" />}
          text="Icon Before"
        />
        <BreadcrumbsItem
          href="/item"
          iconAfter={<AtlassianIcon label="Test icon" size="small" />}
          text="Icon After"
        />
      </Breadcrumbs>
    );
  }
}
