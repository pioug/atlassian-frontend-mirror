import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import LozengeAction from '../index';
import {
  InvokeActionError,
  InvokeActionName,
} from '../../../../../../state/hooks/use-invoke/types';
import * as useInvoke from '../../../../../../state/hooks/use-invoke';

describe('LozengeAction', () => {
  const testId = 'test-smart-element-lozenge-dropdown';
  const triggerTestId = `${testId}--trigger`;
  const text = 'In Progress';
  const appearance = 'inprogress';
  const action = { name: InvokeActionName.UpdateAction };

  it('renders element', async () => {
    const { findByTestId } = render(
      <LozengeAction appearance={appearance} testId={testId} text={text} />,
    );

    const element = await findByTestId(triggerTestId);

    expect(element).toBeTruthy();
    expect(element.textContent?.trim()).toBe(text);
  });

  it('renders loading indicator on click', async () => {
    const { findByTestId, findByRole } = render(
      <LozengeAction
        action={action}
        appearance={appearance}
        testId={testId}
        text={text}
      />,
    );

    const element = await findByTestId(triggerTestId);
    fireEvent.click(element);

    const spinner = await findByRole('status');
    expect(spinner).toBeTruthy();
  });

  it('invokes action', async () => {
    const mockInvoke = jest.fn();
    jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);

    const { findByTestId } = render(
      <LozengeAction
        action={action}
        appearance={appearance}
        testId={testId}
        text={text}
      />,
    );

    const element = await findByTestId(triggerTestId);
    fireEvent.click(element);

    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(mockInvoke).toHaveBeenNthCalledWith(1, action);
  });

  it('renders action items', async () => {
    const mockInvoke = jest
      .fn()
      .mockResolvedValue([{ text: 'In Progress' }, { text: 'Moved' }]);
    jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);

    const { findByTestId } = render(
      <LozengeAction
        action={action}
        appearance={appearance}
        testId={testId}
        text={text}
      />,
    );

    const element = await findByTestId(triggerTestId);
    fireEvent.click(element);

    const item1 = await findByTestId(`${testId}-item-0`);
    expect(item1).toBeTruthy();
    expect(item1.textContent).toBe('In Progress');

    const item2 = await findByTestId(`${testId}-item-1`);
    expect(item2).toBeTruthy();
    expect(item2.textContent).toBe('Moved');
  });

  it('invokes load action only once', async () => {
    const mockInvoke = jest.fn().mockResolvedValue([{ text: 'In Progress' }]);
    jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);

    const { findByTestId } = render(
      <LozengeAction
        action={action}
        appearance={appearance}
        testId={testId}
        text={text}
      />,
    );

    const element = await findByTestId(triggerTestId);

    // First open (load)
    fireEvent.click(element); // Open
    await findByTestId(`${testId}-item-0`);
    fireEvent.click(element); // Close

    // Second open
    fireEvent.click(element); // Open
    await findByTestId(`${testId}-item-0`);

    expect(mockInvoke).toHaveBeenCalledTimes(1);
  });

  it('renders error view when there is no action items', async () => {
    jest
      .spyOn(useInvoke, 'default')
      .mockReturnValue(jest.fn().mockResolvedValue([]));

    const { findByTestId } = render(
      <LozengeAction
        action={action}
        appearance={appearance}
        testId={testId}
        text={text}
      />,
    );

    const element = await findByTestId(triggerTestId);
    fireEvent.click(element);

    const error = await findByTestId(`${testId}-error`);
    expect(error).toBeTruthy();
    expect(error.textContent).toBe(InvokeActionError.NoData);
  });

  it('renders error view when there is no action items', async () => {
    const mockInvoke = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    jest.spyOn(useInvoke, 'default').mockReturnValue(mockInvoke);

    const { findByTestId } = render(
      <LozengeAction
        action={action}
        appearance={appearance}
        testId={testId}
        text={text}
      />,
    );

    const element = await findByTestId(triggerTestId);
    fireEvent.click(element);

    const error = await findByTestId(`${testId}-error`);
    expect(error).toBeTruthy();
    expect(error.textContent).toBe(InvokeActionError.Unknown);
  });

  it('renders fallback component on unexpected error', async () => {
    jest.spyOn(useInvoke, 'default').mockImplementationOnce(() => {
      throw new Error();
    });

    const { findByTestId } = render(
      <LozengeAction appearance={appearance} testId={testId} text={text} />,
    );

    const element = await findByTestId(`${testId}-fallback`);
    expect(element).toBeTruthy();
    expect(element.textContent?.trim()).toBe(text);
  });
});
