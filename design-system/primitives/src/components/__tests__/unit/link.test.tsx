import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import AppProvider, {
  type RouterLinkComponentProps,
} from '@atlaskit/app-provider';

import { xcss } from '../../../xcss/xcss';
import UNSAFE_LINK from '../../link';

const testId = 'test-link';

type MyLinkConfig = {
  to: string;
  customProp?: string;
};

const MyLinkComponent = ({
  href,
  children,
  ...rest
}: RouterLinkComponentProps<MyLinkConfig>) => {
  const label = <>{children} (Router link)</>;

  if (typeof href === 'string') {
    return (
      <a data-test-link-type="simple" href={href} {...rest}>
        {label}
      </a>
    );
  }

  return (
    <a
      data-test-link-type="advanced"
      data-custom-attribute={href.customProp}
      href={href.to}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...rest}
    >
      {label}
    </a>
  );
};

const linkStyles = xcss({
  textTransform: 'uppercase',
});

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

describe('Link', () => {
  it('should render with a given test id', () => {
    render(
      <UNSAFE_LINK href="/home" testId={testId}>
        Link with testid
      </UNSAFE_LINK>,
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should render an <a>', () => {
    render(
      <UNSAFE_LINK href="/home" testId={testId}>
        Link
      </UNSAFE_LINK>,
    );
    expect(screen.getByTestId(testId).nodeName).toEqual('A');
  });

  it('should only render an <a> regardless of Box `as` prop override', () => {
    render(
      <UNSAFE_LINK
        href="/home"
        // The `as` prop isn't allowed by types, but we should
        // confirm the primitive can't be intentionally misused by
        // forwarding this prop to Box.
        // @ts-expect-error
        as="button"
        testId={testId}
      >
        Link
      </UNSAFE_LINK>,
    );
    expect(screen.getByTestId(testId).nodeName).toEqual('A');
  });

  it('should render plain text as children', () => {
    render(
      <UNSAFE_LINK href="/home" testId={testId}>
        Link text
      </UNSAFE_LINK>,
    );
    const element = screen.getByText('Link text');
    expect(element).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <UNSAFE_LINK href="/home" testId={testId}>
        <span data-testid="test-link-child">Link children</span>
      </UNSAFE_LINK>,
    );
    const parent = screen.getByTestId(testId);
    expect(parent).toBeInTheDocument();
    const child = screen.getByTestId('test-link-child');
    expect(child).toBeInTheDocument();
  });

  it('should apply aria attributes', () => {
    render(
      <UNSAFE_LINK
        href="https://atlassian.design/"
        testId={testId}
        aria-label="Read the Atlassian Design System documentation"
      >
        Mute sound
      </UNSAFE_LINK>,
    );
    expect(screen.getByTestId(testId)).toHaveAttribute(
      'aria-label',
      'Read the Atlassian Design System documentation',
    );
  });

  it('should call click handler when present', () => {
    const mockOnClick = jest.fn();

    render(
      <UNSAFE_LINK href="/home" testId={testId} onClick={mockOnClick}>
        Click me
      </UNSAFE_LINK>,
    );

    fireEvent.click(screen.getByTestId(testId));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should apply styles with `xcss`', () => {
    render(
      <UNSAFE_LINK href="/home" testId={testId} xcss={linkStyles}>
        Link with xcss styles
      </UNSAFE_LINK>,
    );

    const styles = getComputedStyle(screen.getByTestId(testId));
    expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
  });

  describe('external link attributes `target` and `rel`', () => {
    it('should apply if undefined', () => {
      render(
        <UNSAFE_LINK href="https://atlassian.com" testId={testId}>
          External link
        </UNSAFE_LINK>,
      );

      const link = screen.getByTestId(testId);

      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    it('should not override if explicitly defined', () => {
      render(
        <UNSAFE_LINK
          href="https://atlassian.com"
          testId={testId}
          target="_self"
          rel="license"
        >
          External link
        </UNSAFE_LINK>,
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
              <UNSAFE_LINK href={value} testId={id}>
                Hello world
              </UNSAFE_LINK>,
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
                <UNSAFE_LINK href={value} testId={id}>
                  Hello world
                </UNSAFE_LINK>
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
              <AppProvider routerLinkComponent={MyLinkComponent}>
                <UNSAFE_LINK href={value} testId={id}>
                  Hello world
                </UNSAFE_LINK>
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
