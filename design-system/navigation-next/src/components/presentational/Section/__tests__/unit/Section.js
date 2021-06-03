import React from 'react';

import { mount } from 'enzyme';

import { transitionDurationMs } from '../../../../../common/constants';
import Section from '../../Section';

const styles = jest.fn((a) => a);
const section = jest.fn(() => ({ exited: {} }));
const props = {
  theme: {
    context: 'exited',
    mode: { section },
  },
  styles,
  alwaysShowScrollHint: false,
  shouldGrow: false,
};

describe('Section', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not trigger animations on first-page load', () => {
    const wrapper = mount(
      <Section {...props}>{() => <div>Hello world</div>}</Section>,
    );

    expect(wrapper.find('Transition').props().timeout).toBe(0);

    wrapper.setProps({ shouldGrow: true });

    expect(wrapper.find('Transition').props().timeout).toBe(
      transitionDurationMs,
    );
  });
});
