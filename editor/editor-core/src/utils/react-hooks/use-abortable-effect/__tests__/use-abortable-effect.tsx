import React, { useState } from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import {
  ControllablePromiseResult,
  createControllablePromise,
} from '@atlaskit/editor-test-helpers/controllable-promise';

import { useAbortableEffect } from '../index';

const TestComponent = ({
  asyncOperation,
  onEffectComplete,
  onEffectAbort,
  onEffectCleanup,
}: {
  asyncOperation: () => Promise<string>;
  onEffectComplete: (value: string) => void;
  onEffectAbort: () => void;
  onEffectCleanup: () => void;
}) => {
  const [value, setValue] = useState<string | undefined>();

  useAbortableEffect(
    (signal) => {
      async function getValue() {
        const value = await asyncOperation();

        if (signal.aborted) {
          onEffectAbort();
        } else {
          onEffectComplete(value);
          setValue(value);
        }
      }

      getValue();

      return () => {
        onEffectCleanup();
      };
    },
    [asyncOperation, onEffectComplete, onEffectAbort, onEffectCleanup],
  );

  return <div>{value || 'waiting'}</div>;
};

describe('useAbortableEffect', () => {
  let testRenderer: ReactTestRenderer | null = null;
  const onComplete = jest.fn();
  const onAbort = jest.fn();
  const onCleanup = jest.fn();

  let asyncOperation: ControllablePromiseResult<string>;

  beforeEach(() => {
    asyncOperation = createControllablePromise<string>();

    // Test first render and effect
    act(() => {
      testRenderer = create(
        <TestComponent
          asyncOperation={asyncOperation.getPromise}
          onEffectComplete={onComplete}
          onEffectAbort={onAbort}
          onEffectCleanup={onCleanup}
        />,
      );
    });
  });

  afterEach(() => {
    onComplete.mockReset();
    onAbort.mockReset();
    onCleanup.mockReset();
  });

  it('should be able to run an effect', async () => {
    expect(testRenderer!.toJSON()!.children).toEqual(['waiting']);

    asyncOperation.invokeResolve('hey');

    // wait rerender after state update
    await Promise.resolve();

    expect(onComplete).toBeCalledWith('hey');
    expect(testRenderer!.toJSON()!.children).toEqual(['hey']);

    act(() => {
      testRenderer!.unmount();
    });
  });

  it('should be able to clean up an effect', async () => {
    expect(testRenderer!.toJSON()!.children).toEqual(['waiting']);

    testRenderer!.unmount();

    expect(onCleanup).toBeCalledTimes(1);
  });

  it('should pass the signal down so effects can decide what to do when the component unmounts', async () => {
    expect(testRenderer!.toJSON()!.children).toEqual(['waiting']);

    testRenderer!.unmount();

    asyncOperation.invokeResolve('hey');
    // wait rerender after state update
    await Promise.resolve();

    expect(onComplete).toBeCalledTimes(0);
    expect(onAbort).toBeCalledTimes(1);
  });
});
