import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { SpotlightContext } from '../../spotlight-manager';
import useSpotlight from '../../use-spotlight';

describe('#useSpotlight', () => {
  const setup = () => {
    const contextValue: {
      opened: () => void;
      closed: () => void;
      targets: {
        [key: string]: HTMLElement | undefined;
      };
    } = {
      opened: jest.fn(),
      closed: jest.fn(),
      targets: {
        'target-1': document.createElement('div'),
        'target-2': undefined,
      },
    };

    let testWrapper = ({ children }: { children?: React.ReactNode }) => (
      <SpotlightContext.Provider value={contextValue}>
        {children}
      </SpotlightContext.Provider>
    );

    const wrapper = (props: {}) => testWrapper(props);
    const renderHookResult = renderHook(() => useSpotlight(), { wrapper });

    const rerender = (value = contextValue) => {
      testWrapper = ({ children }) => (
        <SpotlightContext.Provider value={value}>
          {children}
        </SpotlightContext.Provider>
      );

      renderHookResult.rerender();
    };

    return {
      renderHookResult,
      rerender,
    };
  };

  it('should check whether target is rendered or not', () => {
    const { renderHookResult } = setup();

    const {
      result: {
        current: { isTargetRendered },
      },
    } = renderHookResult;

    expect(isTargetRendered('target-1')).toBe(true);
    expect(isTargetRendered('target-2')).toBe(false);
  });

  it('should return rerender with same reference even if #targets context value changes', () => {
    const { renderHookResult, rerender } = setup();
    const { current: previousResult } = renderHookResult.result;

    rerender({
      opened: jest.fn(),
      closed: jest.fn(),
      targets: {
        'target-1': document.createElement('div'),
        'target-2': document.createElement('span'),
      },
    });

    const { current: newResult } = renderHookResult.result;

    expect(newResult.isTargetRendered('target-2')).toBe(true);
    expect(previousResult).toBe(newResult);
  });
});
