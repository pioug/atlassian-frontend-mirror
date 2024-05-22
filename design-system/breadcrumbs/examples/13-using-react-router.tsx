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
  onMouseUp: (e: React.MouseEvent) => any;
  onClick: (e: React.MouseEvent) => any;
  onMouseDown: (e: React.MouseEvent) => any;
  tabIndex: number;
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  'aria-current'?:
    | boolean
    | 'false'
    | 'true'
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time';
}

const RouterLink = React.memo<RouterLinkProps>((props) => {
  const {
    children,
    href,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    onMouseDown,
    tabIndex,
    className,
    onClick,
    'aria-current': ariaCurrent,
  } = props;

  return (
    <Link
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onClick={onClick}
      to={href}
      tabIndex={tabIndex}
      // eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
      className={className}
      aria-current={ariaCurrent}
    >
      {children}
    </Link>
  );
});

const ButtonWithRouter = () => (
  <div>
    <MemoryRouter>
      <Breadcrumbs maxItems={2}>
        <BreadcrumbsItem href="/pages" text="Pages" component={RouterLink} />
        <BreadcrumbsItem
          href="/pages/home"
          text="Home"
          component={RouterLink}
        />
        <BreadcrumbsItem
          href="/item"
          iconBefore={<AtlassianIcon label="" size="small" />}
          text="Icon Before"
          component={RouterLink}
        />
        <BreadcrumbsItem
          href="/item"
          iconAfter={<AtlassianIcon label="" size="small" />}
          text="Icon After"
          component={RouterLink}
        />
      </Breadcrumbs>
    </MemoryRouter>
  </div>
);

export default ButtonWithRouter;
