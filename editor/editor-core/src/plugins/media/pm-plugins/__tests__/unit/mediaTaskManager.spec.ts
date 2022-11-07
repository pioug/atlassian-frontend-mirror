import { MediaTaskManager } from '../../mediaTaskManager';
import { flushPromises } from '@atlaskit/media-test-helpers';

const createPromise = (): [Promise<any>, () => void, () => void] => {
  let extResolve: () => void = () => {};
  let extReject: () => void = () => {};
  const promise = new Promise<void>((resolve, reject) => {
    extResolve = () => {
      resolve();
    };
    extReject = () => {
      reject();
    };
  });
  return [promise, extResolve, extReject];
};

describe('MediaTaskManager', () => {
  it('should wait for an added tasks to resolve when wait is called', async () => {
    const queue = new MediaTaskManager();
    const mockPublish = jest.fn();
    const [promise1, promise1Resolve] = createPromise();
    promise1Resolve();
    queue.addPendingTask(promise1);
    const task = queue.waitForPendingTasks();
    task.then(mockPublish);
    await flushPromises();
    expect(mockPublish).toBeCalled();
  });

  it('should wait for all added tasks to resolve when wait is called', async () => {
    const queue = new MediaTaskManager();
    const mockPublish = jest.fn();

    const [promise1, promise1Resolve] = createPromise();
    const [promise2, promise2Resolve] = createPromise();

    queue.addPendingTask(promise1);
    queue.addPendingTask(promise2);
    const task = queue.waitForPendingTasks();
    task.then(mockPublish);

    promise1Resolve();
    await flushPromises();
    expect(mockPublish).not.toBeCalled();

    promise2Resolve();
    await flushPromises();
    expect(mockPublish).toBeCalled();
  });

  it('should resolve if there are no tasks added', async () => {
    const queue = new MediaTaskManager();
    const mockPublish = jest.fn();

    const task = queue.waitForPendingTasks();
    task.then(mockPublish);
    await flushPromises();
    expect(mockPublish).toBeCalled();
  });

  it('should resolve if some of tasks are resolved and the rest are rejected', async () => {
    const queue = new MediaTaskManager();
    const mockPublish = jest.fn();

    const [promise1, promise1Resolve] = createPromise();
    const [promise2, _promise2Resolve, promise2Reject] = createPromise();

    queue.addPendingTask(promise1);
    queue.addPendingTask(promise2);
    const task = queue.waitForPendingTasks();
    task.then(mockPublish);

    promise1Resolve();
    await flushPromises();
    expect(mockPublish).not.toBeCalled();

    promise2Reject();
    await flushPromises();
    expect(mockPublish).toBeCalled();
  });

  it('should resolve when a cancelableTask is canceled', async () => {
    const queue = new MediaTaskManager();
    const mockPublish = jest.fn();
    const [promise1] = createPromise();
    queue.addPendingTask(promise1, '1');

    const task = queue.waitForPendingTasks();
    task.then(mockPublish);

    queue.cancelPendingTask('1');
    await flushPromises();
    expect(mockPublish).toBeCalled();
  });

  it('should resolve when a cancelableTask is resolved', async () => {
    const queue = new MediaTaskManager();
    const mockPublish = jest.fn();
    const [promise1, promise1Resolve] = createPromise();
    queue.addPendingTask(promise1, '1');

    const task = queue.waitForPendingTasks();
    task.then(mockPublish);

    promise1Resolve();
    await flushPromises();
    expect(mockPublish).toBeCalled();
  });

  it('should resolve if some of tasks are rejected and the rest are cancelled', async () => {
    const queue = new MediaTaskManager();
    const mockPublish = jest.fn();

    const [promise1] = createPromise();
    const [promise2, _promise2Resolve, promise2Reject] = createPromise();

    queue.addPendingTask(promise1, '1');
    queue.addPendingTask(promise2);
    const task = queue.waitForPendingTasks();
    task.then(mockPublish);

    queue.cancelPendingTask('1');
    await flushPromises();
    expect(mockPublish).not.toBeCalled();

    promise2Reject();
    await flushPromises();
    expect(mockPublish).toBeCalled();
  });

  it('should resume the pending task if it is cancelled', async () => {
    const queue = new MediaTaskManager();
    const mockRemoveSpinner = jest.fn();
    const [uploadPromise, uploadPromiseResolve] = createPromise();
    queue.addPendingTask(uploadPromise, '1');

    const task = queue.waitForPendingTasks();
    task.then(mockRemoveSpinner);

    queue.cancelPendingTask('1');
    await flushPromises();
    expect(mockRemoveSpinner).toBeCalledTimes(1);

    queue.resumePendingTask('1');
    const task2 = queue.waitForPendingTasks();

    task2.then(mockRemoveSpinner);
    uploadPromiseResolve();

    await flushPromises();
    expect(mockRemoveSpinner).toBeCalledTimes(2);
  });
});
