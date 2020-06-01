import React, { FC, MouseEventHandler, ReactNode } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import Avatar from '../../index';

describe('Avatar', () => {
  it('should render a span when neither onClick or href us supplied', () => {
    const { getByTestId } = render(<Avatar testId={'avatar'} />);

    expect(getByTestId('avatar--inner').tagName).toEqual('SPAN');
  });

  it('should render a button when onClick us supplied', () => {
    const { getByTestId } = render(
      <Avatar testId={'avatar'} onClick={(event, analyticsEvent) => null} />,
    );

    expect(getByTestId('avatar--inner').tagName).toEqual('BUTTON');
  });

  it('should render disabled button', () => {
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

  it('should render an anchor when href us supplied', () => {
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
      <Avatar
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        component={MyComponent}
      />,
    );
    expect(getByTestId('avatar--inner').tagName).toEqual('DIV');
  });

  it('should call onClick with analytics event when clicked', () => {
    const onEvent = jest.fn();

    const { getByTestId } = render(
      <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
        <Avatar testId={'avatar'} onClick={(event, analyticsEvent) => null} />,
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
            packageName: '@atlaskit/avatar',
            packageVersion: '999.9.9',
          },
        },
      }),
      'atlaskit',
    );
  });

  it('should call onClick with analytics event when a custom component is clicked', () => {
    const onEvent = jest.fn();

    const MyComponent: FC<{
      children: ReactNode;
      testId?: string;
      onClick?: MouseEventHandler;
    }> = ({ testId, onClick, children }) => (
      <div
        onClick={e => typeof onClick === 'function' && onClick(e)}
        data-testid={testId}
      >
        {children}
      </div>
    );

    const { getByTestId } = render(
      <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
        <Avatar
          testId={'avatar'}
          onClick={(event, analyticsEvent) => null}
          component={MyComponent}
        />
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
            packageName: '@atlaskit/avatar',
            packageVersion: '999.9.9',
          },
        },
      }),
      'atlaskit',
    );
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
});
