import React from 'react';
import { mount } from 'enzyme';
import { injectFeatures } from '../../FeaturesProvider';
import FeaturesProvider from '../../FeaturesProvider';
import { DEFAULT_FEATURES } from '../../../util/features';

describe('FeaturesProvider', () => {
  const DUMMY_FEATURES = DEFAULT_FEATURES;
  const DummyComponent = (props: any) => (
    //@ts-ignore
    <div {...props} />
  );

  it('generates and passes features prop to children', () => {
    const InjectedDummyComponent = injectFeatures(DummyComponent);

    const wrapper = mount(
      <FeaturesProvider features={DUMMY_FEATURES}>
        <InjectedDummyComponent />
      </FeaturesProvider>,
    );

    const features = wrapper.find(DummyComponent).prop('features');
    expect(features).toEqual(DUMMY_FEATURES);
  });

  it('passes the same features prop to all its children', () => {
    const InjectedDummyComponent = injectFeatures(DummyComponent);

    const wrapper = mount(
      <FeaturesProvider features={DUMMY_FEATURES}>
        <InjectedDummyComponent />
        <InjectedDummyComponent />
        <div>
          <InjectedDummyComponent />
        </div>
      </FeaturesProvider>,
    );

    const children = wrapper.find(DummyComponent);
    const features = children.first().prop('features');

    expect(children).toHaveLength(3);
    children.forEach(child => {
      expect(child.prop('features')).toEqual(features);
    });
  });
});
