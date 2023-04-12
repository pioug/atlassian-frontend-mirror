import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import LozengeAction from '../index';
import { InvokeActionError } from '../../../../../../state/hooks/use-invoke/types';
import * as useInvoke from '../../../../../../state/hooks/use-invoke';
import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';
import { LozengeActionProps } from '../types';
import extractLozengeActionItems from '../../../../../../extractors/action/extract-lozenge-action-items';

describe('LozengeAction', () => {
  const testId = 'test-smart-element-lozenge-dropdown';
  const triggerTestId = `${testId}--trigger`;
  const text = 'In Progress';
  const appearance = 'inprogress';
  const action = {
    read: {
      action: {
        actionType: SmartLinkActionType.GetStatusTransitionsAction,
        resourceIdentifiers: {
          issueId: 'issue-id',
          hostname: 'some-hostname',
        },
      },
      providerKey: 'object-provider',
    },
    update: {
      action: {
        actionType: SmartLinkActionType.StatusUpdateAction,
        resourceIdentifiers: {
          issueId: 'issue-id',
          hostname: 'some-hostname',
        },
      },
      providerKey: 'object-provider',
    },
  };

  const renderComponent = (
    props?: Partial<LozengeActionProps>,
    mockInvoke = jest.fn(),
  ) => {
    jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);

    return render(
      <LozengeAction
        appearance={appearance}
        testId={testId}
        text={text}
        {...props}
      />,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders element', async () => {
    const { findByTestId } = renderComponent();

    const element = await findByTestId(triggerTestId);

    expect(element).toBeTruthy();
    expect(element.textContent?.trim()).toBe(text);
  });

  it('renders loading indicator on click', async () => {
    const { findByTestId, findByRole } = renderComponent({ action });

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const spinner = await findByRole('status');
    expect(spinner).toBeTruthy();
  });

  it('invokes read action', async () => {
    const mockInvoke = jest.fn();
    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(mockInvoke).toHaveBeenNthCalledWith(
      1,
      action.read,
      extractLozengeActionItems,
    );
  });

  it('renders action items', async () => {
    const mockInvoke = jest
      .fn()
      .mockResolvedValue([{ text: 'Done' }, { text: 'Moved' }]);

    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const item1 = await findByTestId(`${testId}-item-0`);
    expect(item1).toBeTruthy();
    expect(item1.textContent).toBe('Done');

    const item2 = await findByTestId(`${testId}-item-1`);
    expect(item2).toBeTruthy();
    expect(item2.textContent).toBe('Moved');
  });

  it('does not render active item', async () => {
    const mockInvoke = jest
      .fn()
      .mockResolvedValue([{ text: 'Done' }, { text }]);

    const { findByTestId, queryByTestId } = renderComponent(
      { action },
      mockInvoke,
    );

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const item1 = await findByTestId(`${testId}-item-0`);
    expect(item1).toBeTruthy();
    expect(item1.textContent).toBe('Done');

    const item2 = queryByTestId(`${testId}-item-1`);
    expect(item2).not.toBeInTheDocument();
  });

  it('invokes load action only once', async () => {
    const mockInvoke = jest.fn().mockResolvedValue([{ text: 'Done' }]);

    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);

    // First open (load)
    act(() => {
      fireEvent.click(element);
    });
    await findByTestId(`${testId}-item-0`);
    act(() => {
      fireEvent.click(element);
    });
    // Second open
    act(() => {
      fireEvent.click(element);
    });
    await findByTestId(`${testId}-item-0`);

    expect(mockInvoke).toHaveBeenCalledTimes(1);
  });

  it('renders error view when there is no action items', async () => {
    const mockInvoke = jest.fn().mockResolvedValue([]);

    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const error = await findByTestId(`${testId}-error`);
    expect(error).toBeTruthy();
    expect(error.textContent).toBe(InvokeActionError.NoData);
  });

  it('renders error view when invoke return error', async () => {
    const mockInvoke = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const error = await findByTestId(`${testId}-error`);
    expect(error).toBeTruthy();
    expect(error.textContent).toBe(InvokeActionError.Unknown);
  });

  it('renders fallback component on unexpected error', async () => {
    jest.spyOn(useInvoke, 'default').mockImplementationOnce(() => {
      throw new Error();
    });

    const { findByTestId } = render(
      <LozengeAction
        action={action}
        appearance={appearance}
        testId={testId}
        text={text}
      />,
    );

    const element = await findByTestId(`${testId}-fallback`);
    expect(element).toBeTruthy();
    expect(element.textContent?.trim()).toBe(text);
  });

  it('invokes load action again if the previous load fails', async () => {
    const mockInvoke = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error();
      })
      .mockResolvedValueOnce([{ text: 'Done' }]);
    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    await findByTestId(`${testId}-error`);

    // Close dropdown
    act(() => {
      fireEvent.click(element);
    });
    // Open dropdownagain
    act(() => {
      fireEvent.click(element);
    });
    const item = await findByTestId(`${testId}-item-0`);

    expect(mockInvoke).toHaveBeenCalledTimes(2);
    expect(item).toBeTruthy();
  });

  it('invokes update action', async () => {
    const mockInvoke = jest
      .fn()
      .mockResolvedValueOnce([
        { id: '1', text: 'Done' },
        { id: '2', text: 'Moved' },
      ])
      .mockResolvedValueOnce(undefined);
    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const item = await findByTestId(`${testId}-item-0`);
    act(() => {
      fireEvent.click(item);
    });
    expect(mockInvoke).toHaveBeenNthCalledWith(2, {
      action: expect.objectContaining({
        actionType: SmartLinkActionType.StatusUpdateAction,
        resourceIdentifiers: expect.any(Object),
        payload: expect.any(Object),
      }),
      providerKey: expect.any(String),
    });
  });

  it('renders loading indicator on updating status', async () => {
    const mockInvoke = jest
      .fn()
      .mockResolvedValueOnce([{ id: '1', text: 'Done' }])
      .mockResolvedValueOnce(undefined);
    const { findByRole, findByTestId } = renderComponent(
      { action },
      mockInvoke,
    );

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const item = await findByTestId(`${testId}-item-0`);
    act(() => {
      fireEvent.click(item);
    });
    const spinner = await findByRole('status');
    expect(spinner).toBeTruthy();
  });

  it('closes dropdown menu after update complete successfully', async () => {
    const mockInvoke = jest
      .fn()
      .mockResolvedValueOnce([{ id: '1', text: 'Done' }])
      .mockResolvedValueOnce(undefined);
    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const itemTestId = `${testId}-item-0`;
    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const item = await findByTestId(itemTestId);
    act(() => {
      fireEvent.click(item);
    });

    expect(item).not.toBeInTheDocument();
  });

  it('renders error view when update fails', async () => {
    const mockInvoke = jest
      .fn()
      .mockResolvedValueOnce([{ id: '1', text: 'Done' }])
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const item = await findByTestId(`${testId}-item-0`);
    act(() => {
      fireEvent.click(item);
    });

    const error = await findByTestId(`${testId}-error`);
    expect(error).toBeTruthy();
    expect(error.textContent).toBe(InvokeActionError.Unknown);
  });

  it('render action items after update fails and use open dropdown again', async () => {
    const mockInvoke = jest
      .fn()
      .mockResolvedValueOnce([{ id: '1', text: 'Done' }])
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const { findByTestId } = renderComponent({ action }, mockInvoke);

    const element = await findByTestId(triggerTestId);
    act(() => {
      fireEvent.click(element);
    });
    const item = await findByTestId(`${testId}-item-0`);
    act(() => {
      fireEvent.click(item);
    });
    await findByTestId(`${testId}-error`);
    // Close dropdown
    act(() => {
      fireEvent.click(element);
    });
    // Open dropdown again
    act(() => {
      fireEvent.click(element);
    });

    expect(await findByTestId(`${testId}-item-0`)).toBeInTheDocument();
  });
});
