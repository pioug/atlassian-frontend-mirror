import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';

// Wrapper over mount use effect to assure the component is unmounted after each test
export function createMountUseEffect() {
  let testRenderer: ReactTestRenderer | null = null;
  afterEach(() => {
    if (testRenderer && typeof testRenderer.unmount === 'function') {
      testRenderer.unmount();
    }
  });

  return (setupUseEffect: () => void): ReactTestRenderer | null => {
    let testRenderer: ReactTestRenderer | null = null;

    function App() {
      setupUseEffect();
      return null;
    }

    act(() => {
      testRenderer = create(<App />);
    });

    return testRenderer;
  };
}
