import React from 'react';
import { mount } from 'enzyme';
import { Section } from '../..';

describe('Section', () => {
  it('should remain empty when all children are falsy', () => {
    const EmptySection = () => (
      <Section sectionId="emptySection" title="Empty Section">
        {null}
        {false}
      </Section>
    );
    const wrapper = mount(<EmptySection />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });
  it('should render the SectionContainer with a title and children when at least one child is truthy', () => {
    const SomeComponent = () => <div>Some component</div>;
    const NonEmptySection = () => (
      <Section sectionId="NonEmptySection" title="Filled Section">
        <SomeComponent />
        {false}
      </Section>
    );
    const wrapper = mount(<NonEmptySection />);
    expect(wrapper.find('SectionContainer')).toHaveLength(1);
    expect(wrapper.find('SectionTitle')).toHaveLength(1);
    expect(wrapper.find(SomeComponent)).toHaveLength(1);
  });
});
