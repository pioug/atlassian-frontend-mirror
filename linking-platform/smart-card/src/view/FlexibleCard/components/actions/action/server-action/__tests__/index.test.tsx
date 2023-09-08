import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { act, fireEvent, render } from '@testing-library/react';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';

import * as useInvoke from '../../../../../../../state/hooks/use-invoke';
import * as useResolve from '../../../../../../../state/hooks/use-resolve';
import ServerAction from '../index';
import { ServerActionProps } from '../types';

describe('ServerAction', () => {
  const testId = 'server-action-test-id';

  const getAction = () => ({
    action: {
      actionType: SmartLinkActionType.FollowEntityAction,
      resourceIdentifiers: {
        prop1: 'prop-1',
        prop2: 'prop-2',
      },
    },
    providerKey: 'object-provider',
    reload: {
      id: 'some-id',
      url: 'https://my.url.com',
    },
  });

  const renderComponent = (
    props?: Partial<ServerActionProps>,
    mockInvoke = jest.fn(),
    mockResolve = jest.fn(),
  ) => {
    jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);
    jest.spyOn(useResolve, 'default').mockReturnValue(mockResolve);

    const component = (
      <IntlProvider locale="en">
        <ServerAction
          action={props?.action || getAction()}
          content="button text"
          testId={testId}
          {...props}
        />
      </IntlProvider>
    );

    const result = render(component);

    return { ...result, component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders server action', async () => {
    const { findByTestId } = renderComponent();

    const element = await findByTestId(testId);

    expect(element).toBeInTheDocument();
  });

  it('invokes server action', async () => {
    const action = getAction();
    const expectedRequest = {
      action: action.action,
      providerKey: action.providerKey,
    };
    const mockInvoke = jest.fn();
    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(testId);
    act(() => {
      fireEvent.click(element);
    });

    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(mockInvoke).toHaveBeenNthCalledWith(1, expectedRequest);
  });

  it('reloads the url after invoke success', async () => {
    const action = getAction();
    const mockInvoke = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve());
    const mockResolve = jest.fn();

    const { findByTestId } = renderComponent(
      { action },
      mockInvoke,
      mockResolve,
    );

    const element = await findByTestId(testId);
    act(() => {
      fireEvent.click(element);
    });

    await flushPromises();

    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledWith(
      action.reload.url,
      true,
      undefined,
      action.reload.id,
    );
  });

  it('does not reloads the url after invoke fails', async () => {
    const action = getAction();
    const mockInvoke = jest.fn().mockImplementationOnce(() => Promise.reject());

    const mockResolve = jest.fn();

    const { findByTestId } = renderComponent(
      { action },
      mockInvoke,
      mockResolve,
    );

    const element = await findByTestId(testId);
    act(() => {
      fireEvent.click(element);
    });

    await flushPromises();

    expect(mockResolve).not.toHaveBeenCalled();
  });
});
