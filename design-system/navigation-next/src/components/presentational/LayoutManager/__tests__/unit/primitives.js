import React from 'react';

import { mount } from 'enzyme';

import { HorizontalNavigationContainer } from '../../primitives';

describe('HorizontalNavigationContainer', () => {
  it('applies the correct positioning to the container', () => {
    const wrapper = mount(
      <HorizontalNavigationContainer topOffset={50}>
        children
      </HorizontalNavigationContainer>,
    );
    expect(wrapper).toHaveStyleDeclaration('position', 'fixed');
    expect(wrapper).toHaveStyleDeclaration('top', '50px');
  });
});
