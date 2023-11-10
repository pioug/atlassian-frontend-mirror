// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { FC, MouseEventHandler, ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import {
  AnalyticsEventPayload,
  AnalyticsListener,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import Avatar from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Avatar', () => {
  it('should render a span when neither onClick or href are supplied', () => {
    render(<Avatar testId={'avatar'} />);

    expect(screen.getByTestId('avatar--inner').tagName).toEqual('SPAN');
  });

  it('should render a button when onClick is supplied', () => {
    render(
      <Avatar testId={'avatar'} onClick={(event, analyticsEvent) => null} />,
    );

    expect(screen.getByTestId('avatar--inner').tagName).toEqual('BUTTON');
  });

  it('should render a disabled button when using onClick', () => {
    render(
      <Avatar
        testId={'avatar'}
        isDisabled
        onClick={(event, analyticsEvent) => null}
      />,
    );
    const element = screen.getByTestId('avatar--inner');

    expect(element.tagName).toEqual('BUTTON');
    expect(element).toBeDisabled();
  });

  it('should render a disabled button when using href', () => {
    render(
      <Avatar
        testId={'avatar'}
        isDisabled
        href={'https://atlaskit.atlassian.com/'}
      />,
    );
    const element = screen.getByTestId('avatar--inner');

    expect(element.tagName).toEqual('BUTTON');
    expect(element).toBeDisabled();
  });

  it('should render an anchor when href is supplied', () => {
    render(
      <Avatar testId={'avatar'} href={'https://atlaskit.atlassian.com/'} />,
    );
    expect(screen.getByTestId('avatar--inner').tagName).toEqual('A');
  });

  it('should render an anchor with appropriate rel attribute if target blank is supplied', () => {
    render(
      <Avatar
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        target="_blank"
      />,
    );
    const element = screen.getByTestId('avatar--inner');

    expect(element.tagName).toEqual('A');
    expect(element).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render an anchor without rel attribute if target blank is not supplied', () => {
    render(
      <Avatar testId={'avatar'} href={'https://atlaskit.atlassian.com/'} />,
    );
    const element = screen.getByTestId('avatar--inner');

    expect(element.tagName).toEqual('A');
    expect(element).not.toHaveAttribute('rel');
  });

  it('should render a custom component if supplied', () => {
    const MyComponent: FC<{ children: ReactNode; testId?: string }> = ({
      testId,
      children,
    }) => <div data-testid={testId}>{children}</div>;

    render(
      <Avatar testId={'avatar'} href={'https://atlaskit.atlassian.com/'}>
        {({ ref, ...props }) => <MyComponent {...props} />}
      </Avatar>,
    );
    expect(screen.getByTestId('avatar--inner').tagName).toEqual('DIV');
  });

  it('should call onClick with analytics event when clicked', () => {
    const onEvent = jest.fn();

    render(
      <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
        <Avatar
          testId={'avatar'}
          onClick={(_, analyticsEvent) =>
            analyticsEvent && analyticsEvent.fire()
          }
        />
        ,
      </AnalyticsListener>,
    );
    const element = screen.getByTestId('avatar--inner');

    fireEvent.click(element);

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          action: 'clicked',
          actionSubject: 'avatar',
          attributes: {
            componentName: 'avatar',
            packageName,
            packageVersion,
          },
        },
      }),
      'atlaskit',
    );
  });

  it('should call onClick when clicked on an anchor component', () => {
    const onClick = jest.fn();

    render(
      <Avatar
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        onClick={(event) => onClick(event)}
      />,
    );

    const element = screen.getByTestId('avatar--inner');
    fireEvent.click(element);

    expect(onClick).toHaveBeenCalled();
  });

  it('should call onClick with analytics event when a custom component is clicked', () => {
    const onEvent = jest.fn();

    const MyComponent: FC<{
      children: ReactNode;
      testId?: string;
      onClick?: MouseEventHandler;
    }> = ({ testId, onClick, children }) => (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div
        onClick={(e) => typeof onClick === 'function' && onClick(e)}
        data-testid={testId}
      >
        {children}
      </div>
    );

    render(
      <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
        <Avatar
          testId={'avatar'}
          onClick={(_, analyticsEvent) =>
            analyticsEvent && analyticsEvent.fire()
          }
        >
          {(props) => <MyComponent {...props} />}
        </Avatar>
      </AnalyticsListener>,
    );

    const element = screen.getByTestId('avatar--inner');

    fireEvent.click(element);

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          action: 'clicked',
          actionSubject: 'avatar',
          attributes: {
            componentName: 'avatar',
            packageName,
            packageVersion,
          },
        },
      }),
      'atlaskit',
    );
  });

  it('should fire an event on the atlaskit channel', () => {
    const onEvent = jest.fn();
    const extraContext = { hello: 'world' };
    render(
      <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
        <Avatar
          testId={'avatar'}
          onClick={(_, analyticsEvent) =>
            analyticsEvent && analyticsEvent.fire()
          }
          analyticsContext={extraContext}
        />
      </AnalyticsListener>,
    );
    const avatar: HTMLElement = screen.getByTestId('avatar--inner');

    fireEvent.click(avatar);

    const expected = new UIAnalyticsEvent({
      payload: {
        action: 'clicked',
        actionSubject: 'avatar',
        attributes: {
          componentName: 'avatar',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'avatar',
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

  it('should fire an event', () => {
    const onEvent = jest.fn();
    render(
      <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
        <Avatar
          testId={'avatar'}
          onClick={(_, analyticsEvent) =>
            analyticsEvent && analyticsEvent.fire()
          }
        />
      </AnalyticsListener>,
    );
    const avatar: HTMLElement = screen.getByTestId('avatar--inner');

    fireEvent.click(avatar);

    const expected: AnalyticsEventPayload = {
      action: 'clicked',
      actionSubject: 'avatar',
      attributes: {
        componentName: 'avatar',
        packageName,
        packageVersion,
      },
    };
    expect(onEvent).toHaveBeenCalledTimes(1);
    expect(onEvent.mock.calls[0][0].payload).toEqual(expected);
  });

  it('should fire an event on the public channel and the internal channel', () => {
    const onPublicEvent = jest.fn();
    const onAtlaskitEvent = jest.fn();
    function WithBoth() {
      return (
        <AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
          <AnalyticsListener onEvent={onPublicEvent}>
            <Avatar
              testId={'avatar'}
              onClick={(_, analyticsEvent) =>
                analyticsEvent && analyticsEvent.fire()
              }
            />
          </AnalyticsListener>
        </AnalyticsListener>
      );
    }
    render(<WithBoth />);
    const avatar: HTMLElement = screen.getByTestId('avatar--inner');

    fireEvent.click(avatar);

    const expected: AnalyticsEventPayload = {
      action: 'clicked',
      actionSubject: 'avatar',
      attributes: {
        componentName: 'avatar',
        packageName,
        packageVersion,
      },
    };
    expect(onPublicEvent).toHaveBeenCalledTimes(1);
    expect(onPublicEvent.mock.calls[0][0].payload).toEqual(expected);
    expect(onAtlaskitEvent).toHaveBeenCalledTimes(1);
    expect(onAtlaskitEvent.mock.calls[0][0].payload).toEqual(expected);
  });

  it('should not error if there is no analytics provider', () => {
    const error = jest.spyOn(console, 'error');
    const onClick = jest.fn();
    render(<Avatar testId="avatar" onClick={onClick} />);

    const avatar: HTMLElement = screen.getByTestId('avatar--inner');
    fireEvent.click(avatar);

    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('should not call onclick if disabled', () => {
    const onClick = jest.fn();

    render(<Avatar testId={'avatar'} onClick={onClick} isDisabled />);
    const element = screen.getByTestId('avatar--inner');

    fireEvent.click(element);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should not show a presence indicator not provided', () => {
    render(<Avatar testId={'avatar'} />);

    expect(screen.queryByTestId('avatar--presence')).not.toBeInTheDocument();
  });

  it('should show a presence indicator if provided', () => {
    render(<Avatar testId={'avatar'} presence="busy" />);

    expect(screen.queryByTestId('avatar--presence')).toBeInTheDocument();
  });

  it('should keep presence out of the accessibility tree', () => {
    render(<Avatar testId={'avatar'} presence="offline" />);

    expect(screen.queryByTestId('avatar--presence')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('should show a custom presence indicator if provided', () => {
    const MyComponent: FC = () => <div data-testid="custom-presence">yo</div>;

    render(<Avatar testId={'avatar'} presence={<MyComponent />} />);
    const element = screen.getByTestId('custom-presence');

    expect(element.tagName).toEqual('DIV');
  });

  it('should not show a status indicator not provided', () => {
    render(<Avatar testId={'avatar'} />);

    expect(screen.queryByTestId('avatar--status')).not.toBeInTheDocument();
  });

  it('should show a status indicator if provided', () => {
    render(<Avatar testId={'avatar'} status="approved" />);

    expect(screen.queryByTestId('avatar--status')).toBeInTheDocument();
  });

  it('should keep status out of the accessibility tree', () => {
    render(<Avatar testId={'avatar'} status="declined" />);

    expect(screen.queryByTestId('avatar--status')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('should show a custom status indicator if provided', () => {
    const MyComponent: FC = () => <div data-testid="custom-status">yo</div>;

    render(<Avatar testId={'avatar'} status={<MyComponent />} />);
    const element = screen.getByTestId('custom-status');

    expect(element.tagName).toEqual('DIV');
  });

  it('should show only a status indicator if both presence and status are provided', () => {
    render(<Avatar testId={'avatar'} presence="busy" status="declined" />);

    expect(screen.queryByTestId('avatar--status')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar--presence')).not.toBeInTheDocument();
  });

  it('should NOT output an aria-label on SPAN tag', () => {
    render(<Avatar testId={'avatar'} label="Test avatar" />);
    const element = screen.getByTestId('avatar--inner');

    expect(element.tagName).toEqual('SPAN');
    expect(element).not.toHaveAttribute('aria-label');
  });

  it('should output an aria-label on A tag', () => {
    render(
      <Avatar
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        label="Test avatar"
      />,
    );
    const element = screen.getByTestId('avatar--inner');

    expect(element.tagName).toEqual('A');
    expect(element).toHaveAttribute('aria-label', 'Test avatar');
  });

  it('should output an aria-label on BUTTON tag', () => {
    render(<Avatar testId={'avatar'} onClick={__noop} label="Test avatar" />);
    const element = screen.getByTestId('avatar--inner');

    expect(element.tagName).toEqual('BUTTON');
    expect(element).toHaveAttribute('aria-label', 'Test avatar');
  });

  it('should render a wrapping div element by default', () => {
    render(<Avatar testId={'avatar'} onClick={__noop} />);
    const avatar = screen.getByTestId('avatar');

    expect(avatar.tagName).toEqual('DIV');
  });

  it('should render a wrapping span element if supplied by the as prop', () => {
    // TODO: Remove onClick from non-interactive `span` (DSP-14029)
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    render(<Avatar testId={'avatar'} onClick={__noop} as="span" />);
    const avatar = screen.getByTestId('avatar');

    expect(avatar.tagName).toEqual('SPAN');
  });
});
