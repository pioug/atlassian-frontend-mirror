import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import {
  ControllablePromiseResult,
  createControllablePromise,
} from '@atlaskit/editor-test-helpers/controllable-promise';

import { useStateFromPromise } from '../index';

const TestComponent = ({
  asyncOperation,
}: {
  asyncOperation: () => Promise<string>;
}) => {
  const [value] = useStateFromPromise(
    function getValue() {
      return asyncOperation();
    },
    [asyncOperation],
  );

  return <div>{value || 'waiting'}</div>;
};

describe('useStateFromPromise', () => {
  let testRenderer: ReactTestRenderer | null = null;
  let asyncOperation: ControllablePromiseResult<string>;

  beforeEach(() => {
    jest.useFakeTimers();
    asyncOperation = createControllablePromise<string>();

    // Test first render and effect
    act(() => {
      testRenderer = create(
        <TestComponent asyncOperation={asyncOperation.getPromise} />,
      );
    });
  });

  it('should set the state when the promise resolves', async () => {
    expect(testRenderer!.toJSON()!.children).toEqual(['waiting']);

    asyncOperation.invokeResolve('hey');

    // wait rerender after state update
    await Promise.resolve();
    act(() => {
      jest.runAllTimers();
    });

    expect(testRenderer!.toJSON()!.children).toEqual(['hey']);

    testRenderer!.unmount();
  });
});
