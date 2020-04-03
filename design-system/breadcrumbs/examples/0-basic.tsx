import React from 'react';
import { AtlassianIcon } from '@atlaskit/logo';
import { BreadcrumbsStateless, BreadcrumbsItem } from '../src';

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
      <BreadcrumbsStateless
        isExpanded={this.state.isExpanded}
        onExpand={e => this.expand(e)}
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
      </BreadcrumbsStateless>
    );
  }
}
