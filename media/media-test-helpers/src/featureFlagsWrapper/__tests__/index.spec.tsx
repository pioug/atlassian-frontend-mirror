import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import FeatureFlagsWrapper from '..';
jest.mock('../dropdown');
import FeatureFlagsDropdown from '../dropdown';

const originalLocalStorage = window.localStorage;
const mockErrorLocalStorage = () => {
  const someErrorFn = () => {
    throw new Error('test error');
  };
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: {
      setItem: someErrorFn,
      getItem: someErrorFn,
      removeItem: someErrorFn,
    },
  });
};

describe('FeatureFlagsWrapper', () => {
  afterEach(() => {
    (window as any).localStorage = originalLocalStorage;
  });

  beforeEach(() => {
    (FeatureFlagsDropdown as jest.Mock).mockImplementation(() => {
      return 'Im a dropdown';
    });
  });

  it('should render FeatureFlagsDropdown alongside the children', () => {
    const component = mount(
      <FeatureFlagsWrapper>
        <span id="a-child">This is a child</span>
        <p id="another-child">This is another child</p>
      </FeatureFlagsWrapper>,
    );

    expect(component.find('span#a-child')).toHaveLength(1);
    expect(component.find('p#another-child')).toHaveLength(1);
    expect(component.find(FeatureFlagsDropdown)).toHaveLength(1);
  });

  it('should not render FeatureFlagsDropdown if local storage is not available', () => {
    mockErrorLocalStorage();
    const component = mount(
      <FeatureFlagsWrapper>
        <span id="a-child">This is a child</span>
        <p id="another-child">This is another child</p>
      </FeatureFlagsWrapper>,
    );
    expect(component.find('span#a-child')).toHaveLength(1);
    expect(component.find('p#another-child')).toHaveLength(1);
    expect(component.find(FeatureFlagsDropdown)).toHaveLength(0);
  });

  it('should rerender the children as many times as a feature flag is changed', async () => {
    let onFFChanged: () => void = () => {};
    let renderCounter = 0;
    const Child = () => {
      renderCounter++;
      return <span>I'm a child</span>;
    };

    // FeatureFlagsDropdown will receive onFlagChanged function as a property. We store it to call later in the test
    (FeatureFlagsDropdown as jest.Mock).mockImplementation(
      ({ onFlagChanged }: { onFlagChanged: () => void }) => {
        onFFChanged = () => {
          onFlagChanged();
        };
        return 'Im a dropdown';
      },
    );
    // First render
    mount(
      <FeatureFlagsWrapper>
        <Child />
      </FeatureFlagsWrapper>,
    );

    // Second render
    act(onFFChanged);
    // Third render
    act(onFFChanged);

    // 3 renders expected
    expect(renderCounter).toBe(3);
  });
});
