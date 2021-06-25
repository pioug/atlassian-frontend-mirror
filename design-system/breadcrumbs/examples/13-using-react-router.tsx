import React from 'react';

import { Link, MemoryRouter } from 'react-router-dom';

import { AtlassianIcon } from '@atlaskit/logo';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

interface RouterLinkProps {
  children: Node;
  className: string;
  href: Link;
  onMouseEnter: (e: React.MouseEvent) => any;
  onMouseLeave: (e: React.MouseEvent) => any;
}
class RouterLink extends React.PureComponent<RouterLinkProps, {}> {
  render() {
    const {
      children,
      className,
      href,
      onMouseEnter,
      onMouseLeave,
    } = this.props;

    return (
      <Link
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        to={href}
      >
        {children}
      </Link>
    );
  }
}

const ButtonWithRouter = () => (
  <div>
    <MemoryRouter>
      <Breadcrumbs>
        <BreadcrumbsItem href="/pages" text="Pages" component={RouterLink} />
        <BreadcrumbsItem
          href="/pages/home"
          text="Home"
          component={RouterLink}
        />
        <BreadcrumbsItem
          href="/item"
          iconBefore={<AtlassianIcon label="Test icon" size="small" />}
          text="Icon Before"
          component={RouterLink}
        />
        <BreadcrumbsItem
          href="/item"
          iconAfter={<AtlassianIcon label="Test icon" size="small" />}
          text="Icon After"
          component={RouterLink}
        />
      </Breadcrumbs>
    </MemoryRouter>
  </div>
);

export default ButtonWithRouter;
