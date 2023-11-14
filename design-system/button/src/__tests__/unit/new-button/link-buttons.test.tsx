import React, { forwardRef, type Ref } from 'react';

import { render, screen } from '@testing-library/react';

import AppProvider, {
  type RouterLinkComponentProps,
} from '@atlaskit/app-provider';

import { linkButtonVariants } from '../../../utils/variants';

const testId = 'test-link-button';

type MyRouterLinkConfig = {
  to: string;
  customProp?: string;
};

const MyRouterLinkComponent = forwardRef(
  (
    { href, children, ...rest }: RouterLinkComponentProps<MyRouterLinkConfig>,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    const label = <>{children} (Router link)</>;

    if (typeof href === 'string') {
      return (
        <a ref={ref} data-test-link-type="simple" href={href} {...rest}>
          {label}
        </a>
      );
    }

    return (
      <a
        ref={ref}
        data-test-link-type="advanced"
        data-custom-attribute={href.customProp}
        href={href.to}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...rest}
      >
        {label}
      </a>
    );
  },
);

const testCases: Array<{
  value: string;
  type: string;
  id: string;
  shouldRouterLinkComponentBeUsed: {
    whenUndefined: boolean;
    whenDefined: boolean;
  };
}> = [
  {
    value: '/home',
    type: 'Internal link',
    id: 'internal-link',
    shouldRouterLinkComponentBeUsed: {
      whenUndefined: false,
      whenDefined: true,
    },
  },
  {
    value: 'http://atlassian.com',
    type: 'External link (http)',
    id: 'external-link-http',
    shouldRouterLinkComponentBeUsed: {
      whenUndefined: false,
      whenDefined: false,
    },
  },
  {
    value: 'https://atlassian.com',
    type: 'External link (https)',
    id: 'external-link-https',
    shouldRouterLinkComponentBeUsed: {
      whenUndefined: false,
      whenDefined: false,
    },
  },
  {
    value: 'mailto:test@example.com',
    type: 'Email',
    id: 'mailto-link',
    shouldRouterLinkComponentBeUsed: {
      whenUndefined: false,
      whenDefined: false,
    },
  },
  {
    value: 'tel:0400-000-000',
    type: 'Telephone',
    id: 'tel-link',
    shouldRouterLinkComponentBeUsed: {
      whenUndefined: false,
      whenDefined: false,
    },
  },
  {
    value: 'sms:0400-000-000?&body=foo',
    type: 'SMS',
    id: 'sms',
    shouldRouterLinkComponentBeUsed: {
      whenUndefined: false,
      whenDefined: false,
    },
  },
  {
    value: '#hash',
    type: 'Hash link (on current page)',
    id: 'hash-link-current-page',
    shouldRouterLinkComponentBeUsed: {
      whenUndefined: false,
      whenDefined: false,
    },
  },
  {
    value: '/home#hash',
    type: 'Hash link (on internal page)',
    id: 'hash-link-internal',
    shouldRouterLinkComponentBeUsed: {
      whenUndefined: false,
      whenDefined: true,
    },
  },
];

linkButtonVariants.forEach(({ name, Component }) => {
  describe(name, () => {
    describe('external link attributes `target` and `rel`', () => {
      it('should apply if undefined', () => {
        render(
          <Component href="https://atlassian.com" testId={testId}>
            External link
          </Component>,
        );

        const link = screen.getByTestId(testId);

        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
      it('should not override if explicitly defined', () => {
        render(
          <Component
            href="https://atlassian.com"
            testId={testId}
            target="_self"
            rel="license"
          >
            External link
          </Component>,
        );

        const link = screen.getByTestId(testId);

        expect(link).toHaveAttribute('target', '_self');
        expect(link).toHaveAttribute('rel', 'license');
      });
    });

    describe('should conditionally render router links or standard <a> anchors', () => {
      describe('when links are used outside an AppProvider', () => {
        testCases.forEach(
          ({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
            it(type, () => {
              render(
                <Component href={value} testId={id}>
                  Hello world
                </Component>,
              );

              expect(screen.getByTestId(id)).toHaveAttribute(
                'data-is-router-link',
                `${shouldRouterLinkComponentBeUsed.whenUndefined}`,
              );
            });
          },
        );
      });
      describe('when links are used inside an AppProvider, without a routerLinkComponent defined', () => {
        testCases.forEach(
          ({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
            it(type, () => {
              render(
                <AppProvider>
                  <Component href={value} testId={id}>
                    Hello world
                  </Component>
                </AppProvider>,
              );

              expect(screen.getByTestId(id)).toHaveAttribute(
                'data-is-router-link',
                `${shouldRouterLinkComponentBeUsed.whenUndefined}`,
              );
            });
          },
        );
      });
      describe('when links are used outside an AppProvider, with a routerLinkComponent defined', () => {
        testCases.forEach(
          ({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
            it(type, () => {
              render(
                <AppProvider routerLinkComponent={MyRouterLinkComponent}>
                  <Component href={value} testId={id}>
                    Hello world
                  </Component>
                </AppProvider>,
              );

              expect(screen.getByTestId(id)).toHaveAttribute(
                'data-is-router-link',
                `${shouldRouterLinkComponentBeUsed.whenDefined}`,
              );
            });
          },
        );
      });
    });
  });
});
