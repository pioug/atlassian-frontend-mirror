import React from 'react';
import { mount } from 'enzyme';
import SmartCardProvider from '../../provider';
import { useFeatureFlag } from '../../ff';

describe('useFeatureFlag()', () => {
  const Component = () => {
    const showHoverPreview = useFeatureFlag('showHoverPreview');

    return <div>{`${showHoverPreview}`}</div>;
  };

  it('should return undefined if provider.featureFlags are not provided', () => {
    const component = mount(
      <SmartCardProvider>
        <Component />
      </SmartCardProvider>,
    );
    expect(component.text()).toEqual('undefined');
  });

  it('should return undefined if showHoverPreview is not provided', () => {
    const component = mount(
      <SmartCardProvider featureFlags={{}}>
        <Component />
      </SmartCardProvider>,
    );
    expect(component.text()).toEqual('undefined');
  });

  it('should return ff when value is true', () => {
    const component = mount(
      <SmartCardProvider featureFlags={{ showHoverPreview: true }}>
        <Component />
      </SmartCardProvider>,
    );
    expect(component.text()).toEqual('true');
  });

  it('should return ff when value is false', () => {
    const component = mount(
      <SmartCardProvider featureFlags={{ showHoverPreview: false }}>
        <Component />
      </SmartCardProvider>,
    );
    expect(component.text()).toEqual('false');
  });

  it('should be able to access not defined ff', () => {
    const Component = () => {
      const showHoverPreview = useFeatureFlag('showHoverPreview');

      return <div>{`${showHoverPreview}`}</div>;
    };

    const component = mount(
      <SmartCardProvider
        featureFlags={{
          newFeatureNotYetAdopted: true,
          showHoverPreview: false,
        }}
      >
        <Component />
      </SmartCardProvider>,
    );
    expect(component.text()).toEqual('false');
  });
});
