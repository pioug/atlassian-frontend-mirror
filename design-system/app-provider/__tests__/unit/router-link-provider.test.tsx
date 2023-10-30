import React, { forwardRef, type Ref } from 'react';

import { render, screen } from '@testing-library/react';

import RouterLinkProvider, {
  type RouterLinkComponentProps,
} from '../../src/router-link-provider';
import useRouterLink from '../../src/router-link-provider/hooks/use-router-link';

type MyRouterLinkConfig = {
  to: string;
  customProp?: string;
};

const MyRouterLinkComponent = forwardRef(
  (
    { href, children, ...rest }: RouterLinkComponentProps<MyRouterLinkConfig>,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    // A simple link by passing a string as the `href` prop
    if (typeof href === 'string') {
      return (
        <a ref={ref} data-test-link-type="simple" href={href} {...rest}>
          {children}
        </a>
      );
    }

    // A configured link by passing an object as the `href` prop
    return (
      <a
        ref={ref}
        data-test-link-type="advanced"
        data-custom-attribute={href.customProp}
        href={href.to}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...rest}
      >
        {children}
      </a>
    );
  },
);

const testId = 'my-link';

const ComponentWithRouterLink = ({
  href,
  children,
}: {
  href: string | MyRouterLinkConfig;
  children: React.ReactNode;
}) => {
  const RouterLink = useRouterLink<MyRouterLinkConfig>();

  if (!RouterLink) {
    return null;
  }

  return (
    <RouterLink href={href} data-testid={testId}>
      {children}
    </RouterLink>
  );
};

describe('RouterLinkProvider', () => {
  it('does not return a router link component when the AppProvider `routerLinkComponent` is undefined', () => {
    render(
      <RouterLinkProvider>
        <ComponentWithRouterLink href="/home">A link</ComponentWithRouterLink>
      </RouterLinkProvider>,
    );

    const link = screen.queryByTestId(testId);

    expect(link).not.toBeInTheDocument();
  });

  it('does not return a router link component when `useRouterLink()` is used without an AppProvider', () => {
    render(
      <ComponentWithRouterLink href="/home">A link</ComponentWithRouterLink>,
    );

    const link = screen.queryByTestId(testId);

    expect(link).not.toBeInTheDocument();
  });

  it('renders simple configured links by passing a string to the `href` prop', () => {
    render(
      <RouterLinkProvider routerLinkComponent={MyRouterLinkComponent}>
        <ComponentWithRouterLink href="/home">A link</ComponentWithRouterLink>,
      </RouterLinkProvider>,
    );

    const link = screen.getByTestId(testId);

    expect(link).toHaveAttribute('data-test-link-type', 'simple');
  });

  it('renders advanced links by passing an object to the `href` prop', () => {
    render(
      <RouterLinkProvider routerLinkComponent={MyRouterLinkComponent}>
        <ComponentWithRouterLink
          href={{
            to: '/home',
            customProp: 'foo',
          }}
        >
          A link
        </ComponentWithRouterLink>
        ,
      </RouterLinkProvider>,
    );

    const link = screen.getByTestId(testId);

    expect(link).toHaveAttribute('data-test-link-type', 'advanced');
    expect(link).toHaveAttribute('data-custom-attribute', 'foo');
  });
});
