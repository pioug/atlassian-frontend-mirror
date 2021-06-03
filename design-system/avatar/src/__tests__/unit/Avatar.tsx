// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { FC, MouseEventHandler, ReactNode } from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  AnalyticsEventPayload,
  AnalyticsListener,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import Avatar from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Avatar', () => {
  it('should render a span when neither onClick or href are supplied', () => {
    const { getByTestId } = render(<Avatar testId={'avatar'} />);

    expect(getByTestId('avatar--inner').tagName).toEqual('SPAN');
  });

  it('should render a button when onClick is supplied', () => {
    const { getByTestId } = render(
      <Avatar testId={'avatar'} onClick={(event, analyticsEvent) => null} />,
    );

    expect(getByTestId('avatar--inner').tagName).toEqual('BUTTON');
  });

  it('should render a disabled button when using onClick', () => {
    const { getByTestId } = render(
      <Avatar
        testId={'avatar'}
        isDisabled
        onClick={(event, analyticsEvent) => null}
      />,
    );
    const element = getByTestId('avatar--inner');

    expect(element.tagName).toEqual('BUTTON');
    expect(element.hasAttribute('disabled')).toBeTruthy();
  });

  it('should render a disabled button when using href', () => {
    const { getByTestId } = render(
      <Avatar
        testId={'avatar'}
        isDisabled
        href={'https://atlaskit.atlassian.com/'}
      />,
    );
    const element = getByTestId('avatar--inner');

    expect(element.tagName).toEqual('BUTTON');
    expect(element.hasAttribute('disabled')).toBeTruthy();
  });

  it('should render an anchor when href is supplied', () => {
    const { getByTestId } = render(
      <Avatar testId={'avatar'} href={'https://atlaskit.atlassian.com/'} />,
    );
    expect(getByTestId('avatar--inner').tagName).toEqual('A');
  });

  it('should render an anchor with appropriate rel attribute if target blank is supplied', () => {
    const { getByTestId } = render(
      <Avatar
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        target="_blank"
      />,
    );
    const element = getByTestId('avatar--inner');

    expect(element.tagName).toEqual('A');
    expect(element.getAttribute('rel')).toEqual('noopener noreferrer');
  });

  it('should render an anchor without rel attribute if target blank is not supplied', () => {
    const { getByTestId } = render(
      <Avatar testId={'avatar'} href={'https://atlaskit.atlassian.com/'} />,
    );
    const element = getByTestId('avatar--inner');

    expect(element.tagName).toEqual('A');
    expect(element.hasAttribute('rel')).toBeFalsy();
  });

  it('should render a custom component if supplied', () => {
    const MyComponent: FC<{ children: ReactNode; testId?: string }> = ({
      testId,
      children,
    }) => <div data-testid={testId}>{children}</div>;

    const { getByTestId } = render(
      <Avatar testId={'avatar'} href={'https://atlaskit.atlassian.com/'}>
        {({ ref, ...props }) => <MyComponent {...props} />}
      </Avatar>,
    );
    expect(getByTestId('avatar--inner').tagName).toEqual('DIV');
  });

  it('should call onClick with analytics event when clicked', () => {
    const onEvent = jest.fn();

    const { getByTestId } = render(
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
    const element = getByTestId('avatar--inner');

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

    const { getByTestId } = render(
      <Avatar
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        onClick={(event) => onClick(event)}
      />,
    );

    const element = getByTestId('avatar--inner');
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

    const { getByTestId } = render(
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

    const element = getByTestId('avatar--inner');

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
    const { getByTestId } = render(
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
    const avatar: HTMLElement = getByTestId('avatar--inner');

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
    const { getByTestId } = render(
      <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
        <Avatar
          testId={'avatar'}
          onClick={(_, analyticsEvent) =>
            analyticsEvent && analyticsEvent.fire()
          }
        />
      </AnalyticsListener>,
    );
    const avatar: HTMLElement = getByTestId('avatar--inner');

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
    const { getByTestId } = render(<WithBoth />);
    const avatar: HTMLElement = getByTestId('avatar--inner');

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
    const { getByTestId } = render(
      <Avatar testId="avatar" onClick={onClick} />,
    );

    const avatar: HTMLElement = getByTestId('avatar--inner');
    fireEvent.click(avatar);

    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('should not call onclick if disabled', () => {
    const onClick = jest.fn();

    const { getByTestId } = render(
      <Avatar testId={'avatar'} onClick={onClick} isDisabled />,
    );
    const element = getByTestId('avatar--inner');

    fireEvent.click(element);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should not show a presence indicator not provided', () => {
    const { queryByTestId } = render(<Avatar testId={'avatar'} />);

    expect(queryByTestId('avatar--presence')).toBeFalsy();
  });

  it('should show a presence indicator if provided', () => {
    const { queryByTestId } = render(<Avatar testId={'avatar'} presence />);

    expect(queryByTestId('avatar--presence')).toBeTruthy();
  });

  it('should show a custom presence indicator if provided', () => {
    const MyComponent: FC = () => <div data-testid="custom-presence">yo</div>;

    const { getByTestId } = render(
      <Avatar testId={'avatar'} presence={<MyComponent />} />,
    );
    const element = getByTestId('custom-presence');

    expect(element.tagName).toEqual('DIV');
  });

  it('should not show a status indicator not provided', () => {
    const { queryByTestId } = render(<Avatar testId={'avatar'} />);

    expect(queryByTestId('avatar--status')).toBeFalsy();
  });

  it('should show a status indicator if provided', () => {
    const { queryByTestId } = render(<Avatar testId={'avatar'} status />);

    expect(queryByTestId('avatar--status')).toBeTruthy();
  });

  it('should show a custom status indicator if provided', () => {
    const MyComponent: FC = () => <div data-testid="custom-status">yo</div>;

    const { getByTestId } = render(
      <Avatar testId={'avatar'} status={<MyComponent />} />,
    );
    const element = getByTestId('custom-status');

    expect(element.tagName).toEqual('DIV');
  });

  it('should show only a status indicator if both presence and status are provided', () => {
    const { queryByTestId } = render(
      <Avatar testId={'avatar'} presence status />,
    );

    expect(queryByTestId('avatar--status')).toBeTruthy();
    expect(queryByTestId('avatar--presence')).toBeFalsy();
  });

  it('should NOT output an aria-label on SPAN tag', () => {
    const { getByTestId } = render(
      <Avatar testId={'avatar'} label="Test avatar" />,
    );
    const element = getByTestId('avatar--inner');

    expect(element.tagName).toEqual('SPAN');
    expect(element.getAttribute('aria-label')).toBe(null);
  });

  it('should output an aria-label on A tag', () => {
    const { getByTestId } = render(
      <Avatar
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        label="Test avatar"
      />,
    );
    const element = getByTestId('avatar--inner');

    expect(element.tagName).toEqual('A');
    expect(element.getAttribute('aria-label')).toBe('Test avatar');
  });

  it('should output an aria-label on BUTTON tag', () => {
    const { getByTestId } = render(
      <Avatar testId={'avatar'} onClick={() => {}} label="Test avatar" />,
    );
    const element = getByTestId('avatar--inner');

    expect(element.tagName).toEqual('BUTTON');
    expect(element.getAttribute('aria-label')).toBe('Test avatar');
  });
});
