import React from 'react';
import type {
  ReactTestRenderer,
  ReactTestRendererJSON,
} from 'react-test-renderer';
import { create, act } from 'react-test-renderer';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { ControllablePromiseResult } from '@atlaskit/editor-test-helpers/controllable-promise';
import { createControllablePromise } from '@atlaskit/editor-test-helpers/controllable-promise';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

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
    expect((testRenderer!.toJSON() as ReactTestRendererJSON)!.children).toEqual(
      ['waiting'],
    );

    asyncOperation.invokeResolve('hey');

    // wait rerender after state update
    await Promise.resolve();
    act(() => {
      jest.runAllTimers();
    });

    expect((testRenderer!.toJSON() as ReactTestRendererJSON)!.children).toEqual(
      ['hey'],
    );

    testRenderer!.unmount();
  });
});
