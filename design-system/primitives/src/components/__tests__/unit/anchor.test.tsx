import React, { forwardRef, type Ref } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import AppProvider, {
  type RouterLinkComponentProps,
} from '@atlaskit/app-provider';

import { xcss } from '../../../xcss/xcss';
import UNSAFE_ANCHOR from '../../anchor';

const testId = 'test-anchor';
const styles = xcss({
  backgroundColor: 'color.background.brand.bold',
  padding: 'space.100',
  paddingBlock: 'space.100',
  paddingBlockStart: 'space.100',
  paddingBlockEnd: 'space.100',
  paddingInline: 'space.100',
  paddingInlineStart: 'space.100',
  paddingInlineEnd: 'space.100',
});

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

const anchorStyles = xcss({
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

describe('Anchor', () => {
  it('should render with a given test id', () => {
    render(
      <UNSAFE_ANCHOR href="/home" testId={testId}>
        Anchor with testid
      </UNSAFE_ANCHOR>,
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should render an <a>', () => {
    render(
      <UNSAFE_ANCHOR href="/home" testId={testId}>
        Anchor
      </UNSAFE_ANCHOR>,
    );
    expect(screen.getByTestId(testId).nodeName).toEqual('A');
  });

  it('should only render an <a> regardless of Box `as` prop override', () => {
    render(
      <UNSAFE_ANCHOR
        href="/home"
        // The `as` prop isn't allowed by types, but we should
        // confirm the primitive can't be intentionally misused by
        // forwarding this prop to Box.
        // @ts-expect-error
        as="button"
        testId={testId}
      >
        Anchor
      </UNSAFE_ANCHOR>,
    );
    expect(screen.getByTestId(testId).nodeName).toEqual('A');
  });

  it('should render plain text as children', () => {
    render(
      <UNSAFE_ANCHOR href="/home" testId={testId}>
        Anchor text
      </UNSAFE_ANCHOR>,
    );
    const element = screen.getByText('Anchor text');
    expect(element).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <UNSAFE_ANCHOR href="/home" testId={testId}>
        <span data-testid="test-anchor-child">Anchor children</span>
      </UNSAFE_ANCHOR>,
    );
    const parent = screen.getByTestId(testId);
    expect(parent).toBeInTheDocument();
    const child = screen.getByTestId('test-anchor-child');
    expect(child).toBeInTheDocument();
  });

  it('should apply aria attributes', () => {
    render(
      <UNSAFE_ANCHOR
        href="https://atlassian.design/"
        testId={testId}
        aria-label="Read the Atlassian Design System documentation"
      >
        Mute sound
      </UNSAFE_ANCHOR>,
    );
    expect(screen.getByTestId(testId)).toHaveAttribute(
      'aria-label',
      'Read the Atlassian Design System documentation',
    );
  });

  it('should call click handler when present', () => {
    const mockOnClick = jest.fn();

    render(
      <UNSAFE_ANCHOR href="/home" testId={testId} onClick={mockOnClick}>
        Click me
      </UNSAFE_ANCHOR>,
    );

    fireEvent.click(screen.getByTestId(testId));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should apply styles with `xcss`', () => {
    render(
      <UNSAFE_ANCHOR href="/home" testId={testId} xcss={anchorStyles}>
        Anchor with xcss styles
      </UNSAFE_ANCHOR>,
    );

    const styles = getComputedStyle(screen.getByTestId(testId));
    expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
  });

  test('`xcss` should result in expected css', () => {
    render(
      <UNSAFE_ANCHOR
        href="/required"
        testId={testId}
        backgroundColor="elevation.surface"
        padding="space.0"
        paddingBlock="space.0"
        paddingBlockStart="space.0"
        paddingBlockEnd="space.0"
        paddingInline="space.0"
        paddingInlineStart="space.0"
        paddingInlineEnd="space.0"
        xcss={styles}
      >
        child
      </UNSAFE_ANCHOR>,
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();

    expect(element).toHaveCompiledCss({
      // Every value in here overrides the props values
      // eg. `props.padding="space.0"` is overridden by `xcss.padding: 'space.100'`
      backgroundColor: 'var(--ds-surface, #FFFFFF)',
      padding: 'var(--ds-space-100, 8px)',
      paddingBlock: 'var(--ds-space-100, 8px)',
      paddingBlockStart: 'var(--ds-space-100, 8px)',
      paddingBlockEnd: 'var(--ds-space-100, 8px)',
      paddingInline: 'var(--ds-space-100, 8px)',
      paddingInlineStart: 'var(--ds-space-100, 8px)',
      paddingInlineEnd: 'var(--ds-space-100, 8px)',
    });
  });

  describe('should conditionally render router links or standard <a> anchors', () => {
    describe('when links are used outside an AppProvider', () => {
      testCases.forEach(
        ({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
          it(type, () => {
            render(
              <UNSAFE_ANCHOR href={value} testId={id}>
                Hello world
              </UNSAFE_ANCHOR>,
            );

            expect(screen.getByTestId(id)).toHaveAttribute(
              'data-is-router-link',
              `${shouldRouterLinkComponentBeUsed.whenUndefined}`,
            );
          });
        },
      );
    });
    describe('when anchors are used inside an AppProvider, without a routerLinkComponent defined', () => {
      testCases.forEach(
        ({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
          it(type, () => {
            render(
              <AppProvider>
                <UNSAFE_ANCHOR href={value} testId={id}>
                  Hello world
                </UNSAFE_ANCHOR>
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
    describe('when anchors are used outside an AppProvider, with a routerLinkComponent defined', () => {
      testCases.forEach(
        ({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
          it(type, () => {
            render(
              <AppProvider routerLinkComponent={MyRouterLinkComponent}>
                <UNSAFE_ANCHOR href={value} testId={id}>
                  Hello world
                </UNSAFE_ANCHOR>
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

  describe('Custom router link objects passed to the `href` prop', () => {
    it('throws an error when anchors are used outside an AppProvider', () => {
      expect(() =>
        render(
          <AppProvider>
            <UNSAFE_ANCHOR<MyRouterLinkConfig>
              href={{
                to: 'foo',
                customProp: 'bar',
              }}
              testId={testId}
            >
              Hello world
            </UNSAFE_ANCHOR>
          </AppProvider>,
        ),
      ).toThrow(
        new Error(
          `Invariant failed: @atlaskit/primitives: Anchor primitive cannot pass an object to 'href' unless a router link is configured in the AppProvider`,
        ),
      );
    });
    it('throws an error when anchors are used inside an AppProvider, without a routerLinkComponent defined', () => {
      expect(() =>
        render(
          <AppProvider>
            <UNSAFE_ANCHOR<MyRouterLinkConfig>
              href={{
                to: 'foo',
                customProp: 'bar',
              }}
              testId={testId}
            >
              Hello world
            </UNSAFE_ANCHOR>
          </AppProvider>,
        ),
      ).toThrow(
        new Error(
          `Invariant failed: @atlaskit/primitives: Anchor primitive cannot pass an object to 'href' unless a router link is configured in the AppProvider`,
        ),
      );
    });
    it('are interpreted when anchors are used inside an AppProvider, with a routerLinkComponent defined', () => {
      render(
        <AppProvider routerLinkComponent={MyRouterLinkComponent}>
          <UNSAFE_ANCHOR<MyRouterLinkConfig>
            href={{
              to: 'foo',
              customProp: 'bar',
            }}
            testId={testId}
          >
            Hello world
          </UNSAFE_ANCHOR>
        </AppProvider>,
      );

      expect(screen.getByTestId(testId)).toHaveAttribute('href', 'foo');
      expect(screen.getByTestId(testId)).toHaveAttribute(
        'data-custom-attribute',
        'bar',
      );
    });
  });

  describe('analytics', () => {
    const packageName = process.env._PACKAGE_NAME_ as string;
    const packageVersion = process.env._PACKAGE_VERSION_ as string;

    it('should fire an event on the public channel and the internal channel', () => {
      const onPublicEvent = jest.fn();
      const onAtlaskitEvent = jest.fn();
      function WithBoth() {
        return (
          <AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
            <AnalyticsListener onEvent={onPublicEvent}>
              <UNSAFE_ANCHOR
                href="https://atlassian.com"
                testId={testId}
                onClick={(event, analyticsEvent) => {
                  analyticsEvent.fire();
                }}
              >
                Anchor
              </UNSAFE_ANCHOR>
            </AnalyticsListener>
          </AnalyticsListener>
        );
      }
      render(<WithBoth />);

      const anchor = screen.getByTestId(testId);

      fireEvent.click(anchor);

      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: 'clicked',
          actionSubject: 'link',
          attributes: {
            componentName: 'Anchor',
            packageName,
            packageVersion,
          },
        },
        context: [
          {
            componentName: 'Anchor',
            packageName,
            packageVersion,
          },
        ],
      });

      function assert(eventMock: jest.Mock<any, any>) {
        expect(eventMock).toHaveBeenCalledTimes(1);
        expect(eventMock.mock.calls[0][0].payload).toEqual(expected.payload);
        expect(eventMock.mock.calls[0][0].context).toEqual(expected.context);
      }
      assert(onPublicEvent);
      assert(onAtlaskitEvent);
    });

    it('should allow the addition of additional context', () => {
      function App({
        onEvent,
        channel,
        analyticsContext,
      }: {
        onEvent: (...args: any[]) => void;
        channel: string | undefined;
        analyticsContext?: Record<string, any>;
      }) {
        return (
          <AnalyticsListener onEvent={onEvent} channel={channel}>
            <UNSAFE_ANCHOR
              href="https://atlassian.com"
              testId={testId}
              analyticsContext={analyticsContext}
              onClick={(event, analyticsEvent) => {
                analyticsEvent.fire();
              }}
            >
              Anchor
            </UNSAFE_ANCHOR>
          </AnalyticsListener>
        );
      }

      const onEvent = jest.fn();
      const extraContext = { hello: 'world' };
      render(
        <App
          onEvent={onEvent}
          channel="atlaskit"
          analyticsContext={extraContext}
        />,
      );
      const anchor = screen.getByTestId(testId);

      fireEvent.click(anchor);

      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: 'clicked',
          actionSubject: 'link',
          attributes: {
            componentName: 'Anchor',
            packageName,
            packageVersion,
          },
        },
        context: [
          {
            componentName: 'Anchor',
            packageName,
            packageVersion,
            ...extraContext,
          },
        ],
      });
      expect(onEvent).toHaveBeenCalledTimes(1);
      expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
      expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
    });

    it('should allow componentName to be overridden', () => {
      function App({
        onEvent,
        channel,
        analyticsContext,
      }: {
        onEvent: (...args: any[]) => void;
        channel: string | undefined;
        analyticsContext?: Record<string, any>;
      }) {
        return (
          <AnalyticsListener onEvent={onEvent} channel={channel}>
            <UNSAFE_ANCHOR
              href="https://atlassian.com"
              testId={testId}
              analyticsContext={analyticsContext}
              onClick={(event, analyticsEvent) => {
                analyticsEvent.fire();
              }}
              componentName="CustomComponent"
            >
              Anchor
            </UNSAFE_ANCHOR>
          </AnalyticsListener>
        );
      }

      const onEvent = jest.fn();
      render(<App onEvent={onEvent} channel="atlaskit" />);
      const anchor = screen.getByTestId(testId);

      fireEvent.click(anchor);

      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: 'clicked',
          actionSubject: 'link',
          attributes: {
            componentName: 'CustomComponent',
            packageName,
            packageVersion,
          },
        },
        context: [
          {
            componentName: 'CustomComponent',
            packageName,
            packageVersion,
          },
        ],
      });
      expect(onEvent).toHaveBeenCalledTimes(1);
      expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
      expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
    });

    it('should not error if there is no analytics provider', () => {
      const error = jest.spyOn(console, 'error');
      const onClick = jest.fn();
      render(
        <UNSAFE_ANCHOR
          href="https://atlassian.com"
          testId={testId}
          onClick={onClick}
        >
          Anchor
        </UNSAFE_ANCHOR>,
      );

      const button = screen.getByTestId(testId);
      fireEvent.click(button);

      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });
});
