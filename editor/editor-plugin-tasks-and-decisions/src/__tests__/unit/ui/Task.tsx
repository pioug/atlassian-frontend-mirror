import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import type { TaskDecisionProvider } from '@atlaskit/task-decision';

import Task from '../../../ui/Task';

const contextIdentifierProvider = Promise.resolve({
  objectId: 'abc',
  containerId: 'def',
});

describe('tasks and decisions task', () => {
  let providerFactory: ProviderFactory;

  const subscribe = jest.fn();
  const toggleTask = jest.fn();
  const unsubscribe = jest.fn();
  const actualProvider = {
    subscribe,
    toggleTask,
    unsubscribe,
  } as unknown as TaskDecisionProvider;

  const mockTaskDecisionProvider = Promise.resolve(actualProvider);

  beforeEach(() => {
    jest.clearAllMocks();
    providerFactory = new ProviderFactory();
  });

  afterEach(() => {
    providerFactory.destroy();
  });

  it('should check the box, and toggle the state on the provider ', async () => {
    providerFactory.setProvider(
      'taskDecisionProvider',
      mockTaskDecisionProvider,
    );
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    const { getByRole } = renderWithIntl(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    await contextIdentifierProvider;
    const checkbox = getByRole('checkbox') as HTMLInputElement;

    await checkbox.click();

    expect(checkbox.checked).toEqual(false);
    expect(toggleTask).toHaveBeenCalledWith(
      { localId: 'abcd-abcd-abcd', objectAri: 'abc' },
      'TODO',
    );
  });

  it('should uncheck the box, and toggle the state on the provider ', async () => {
    providerFactory.setProvider(
      'taskDecisionProvider',
      mockTaskDecisionProvider,
    );
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    const { getByRole } = renderWithIntl(
      <Task
        taskId="abcd-abcd-abcd"
        isDone={false}
        providers={providerFactory}
      />,
    );

    await contextIdentifierProvider;
    const checkbox = getByRole('checkbox') as HTMLInputElement;

    await checkbox.click();

    expect(checkbox.checked).toEqual(true);
    expect(toggleTask).toHaveBeenCalledWith(
      { localId: 'abcd-abcd-abcd', objectAri: 'abc' },
      'DONE',
    );
  });

  it('should not toggle if there is no context identifier provider', async () => {
    providerFactory.setProvider(
      'taskDecisionProvider',
      mockTaskDecisionProvider,
    );

    const { getByRole } = renderWithIntl(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    await contextIdentifierProvider;
    const checkbox = getByRole('checkbox');

    await checkbox.click();

    expect(toggleTask).not.toHaveBeenCalled();
    expect(subscribe).not.toHaveBeenCalled();
  });
});
