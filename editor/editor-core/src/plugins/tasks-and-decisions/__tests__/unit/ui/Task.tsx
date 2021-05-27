import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ResourcedTaskItem, TaskItem } from '@atlaskit/task-decision';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';

import Task from '../../../../../plugins/tasks-and-decisions/ui/Task';
// avoid polluting test logs with error message in console
// please ensure you fix it if you expect console.error to be thrown
// eslint-disable-next-line no-console
let consoleError = console.error;

const taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());
const contextIdentifierProvider = Promise.resolve({
  objectId: 'abc',
  containerId: 'def',
});

describe('tasks and decisions task', () => {
  let providerFactory: ProviderFactory;

  beforeEach(() => {
    providerFactory = new ProviderFactory();
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });

  afterEach(() => {
    providerFactory.destroy();
    // eslint-disable-next-line no-console
    console.error = consoleError;
  });

  it('should render resourced task item', () => {
    const task = mountWithIntl(<Task taskId="abcd-abcd-abcd" isDone />);
    const resourcedTask = task.find(ResourcedTaskItem);

    expect(resourcedTask.prop('taskId')).toEqual('abcd-abcd-abcd');
    expect(resourcedTask.prop('isDone')).toEqual(true);
    task.unmount();
  });

  it('should pass TaskDecisionProvider into resourced task item', () => {
    providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);

    const task = mountWithIntl(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );
    const resourcedTaskItem = task.find(ResourcedTaskItem);

    expect(resourcedTaskItem.prop('taskDecisionProvider')).toEqual(
      taskDecisionProvider,
    );
    task.unmount();
  });

  it('should pass ContextIdentifierProvider into resourced task item', async () => {
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    const task = mountWithIntl(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    await contextIdentifierProvider;
    task.update();
    const resourcedTaskItem = task.find(ResourcedTaskItem);
    expect(resourcedTaskItem.prop('objectAri')).toEqual('abc');
    task.unmount();
  });

  it('should change state of task if onChange is triggered and all providers are passed in', async () => {
    providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    const task = mountWithIntl(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    await contextIdentifierProvider;
    task.find(TaskItem).find('input').simulate('change');
    expect(task.find(TaskItem).prop('isDone')).toBe(false);
    task.unmount();
  });

  it('should not change state of task if no taskDecisionProvider', () => {
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    const task = mountWithIntl(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    const taskItem = task.find(TaskItem);
    taskItem.find('input').simulate('change');
    expect(taskItem.prop('isDone')).toBe(true);
    task.unmount();
  });

  it('should not change state of task if no contextIdentifierProvider', () => {
    providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);
    const task = mountWithIntl(
      <Task taskId="abcd-abcd-abcd" isDone providers={providerFactory} />,
    );

    const taskItem = task.find(TaskItem);
    taskItem.find('input').simulate('change');
    expect(taskItem.prop('isDone')).toBe(true);
    task.unmount();
  });
});
