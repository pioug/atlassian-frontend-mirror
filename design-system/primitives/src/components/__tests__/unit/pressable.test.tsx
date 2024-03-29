import React, { Fragment } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { xcss } from '../../../xcss/xcss';
import Pressable from '../../pressable';

const testId = 'test-pressable';
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

const pressableStyles = xcss({
  textTransform: 'uppercase',
});

describe('Pressable', () => {
  it('should render with a given test id', () => {
    render(<Pressable testId={testId}>Pressable with testid</Pressable>);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should render a <button>', () => {
    render(<Pressable testId={testId}>Pressable</Pressable>);
    expect(screen.getByTestId(testId).nodeName).toEqual('BUTTON');
  });

  it('should be type `button` by default', () => {
    render(<Pressable testId={testId}>Pressable</Pressable>);
    expect(screen.getByTestId(testId)).toHaveAttribute('type', 'button');
  });

  it('should only render a <button> regardless of Box `as` prop override', () => {
    render(
      <Pressable
        // The `as` prop isn't allowed by types, but we should
        // confirm the primitive can't be intentionally misused by
        // forwarding this prop to Box.
        // @ts-expect-error
        as="a"
        href="atlassian.design"
        testId={testId}
      >
        Pressable
      </Pressable>,
    );
    expect(screen.getByTestId(testId).nodeName).toEqual('BUTTON');
  });

  it('should render plain text as children', () => {
    render(<Pressable testId={testId}>Pressable text</Pressable>);
    const element = screen.getByText('Pressable text');
    expect(element).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Pressable testId={testId}>
        <span data-testid="test-pressable-child">Pressable children</span>
      </Pressable>,
    );
    const parent = screen.getByTestId(testId);
    expect(parent).toBeInTheDocument();
    const child = screen.getByTestId('test-pressable-child');
    expect(child).toBeInTheDocument();
  });

  it('should apply aria attributes', () => {
    render(
      <Fragment>
        <Pressable testId="pressed" aria-pressed="true">
          Mute sound
        </Pressable>
        <Pressable testId="haspopup" aria-haspopup="menu">
          Menu
        </Pressable>
      </Fragment>,
    );
    expect(screen.getByTestId('pressed')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByTestId('haspopup')).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );
  });

  it('should disable the button using `isDisabled` prop', () => {
    render(
      <Pressable testId={testId} isDisabled>
        Disabled
      </Pressable>,
    );
    expect(screen.getByTestId(testId)).toBeDisabled();
  });

  it('should call click handler when present', () => {
    const mockOnClick = jest.fn();

    render(
      <Pressable testId={testId} onClick={mockOnClick}>
        Click me
      </Pressable>,
    );

    fireEvent.click(screen.getByTestId(testId));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should apply styles with `xcss`', () => {
    render(
      <Pressable testId={testId} xcss={pressableStyles}>
        Pressable with xcss styles
      </Pressable>,
    );

    const styles = getComputedStyle(screen.getByTestId(testId));
    expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
  });

  test('`xcss` should result in expected css', () => {
    render(
      <Pressable
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
      </Pressable>,
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
              <Pressable
                testId={testId}
                onClick={(event, analyticsEvent) => {
                  analyticsEvent.fire();
                }}
              >
                Pressable
              </Pressable>
            </AnalyticsListener>
          </AnalyticsListener>
        );
      }
      render(<WithBoth />);

      const pressable = screen.getByTestId(testId);

      fireEvent.click(pressable);

      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: 'clicked',
          actionSubject: 'button',
          attributes: {
            componentName: 'Pressable',
            packageName,
            packageVersion,
          },
        },
        context: [
          {
            componentName: 'Pressable',
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
            <Pressable
              testId={testId}
              analyticsContext={analyticsContext}
              onClick={(event, analyticsEvent) => {
                analyticsEvent.fire();
              }}
            >
              Pressable
            </Pressable>
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
      const pressable = screen.getByTestId(testId);

      fireEvent.click(pressable);

      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: 'clicked',
          actionSubject: 'button',
          attributes: {
            componentName: 'Pressable',
            packageName,
            packageVersion,
          },
        },
        context: [
          {
            componentName: 'Pressable',
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
            <Pressable
              testId={testId}
              analyticsContext={analyticsContext}
              onClick={(event, analyticsEvent) => {
                analyticsEvent.fire();
              }}
              componentName="CustomComponent"
            >
              Pressable
            </Pressable>
          </AnalyticsListener>
        );
      }

      const onEvent = jest.fn();
      render(<App onEvent={onEvent} channel="atlaskit" />);
      const pressable = screen.getByTestId(testId);

      fireEvent.click(pressable);

      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: 'clicked',
          actionSubject: 'button',
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
        <Pressable testId={testId} onClick={onClick}>
          Pressable
        </Pressable>,
      );

      const button = screen.getByTestId(testId);
      fireEvent.click(button);

      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });
});
