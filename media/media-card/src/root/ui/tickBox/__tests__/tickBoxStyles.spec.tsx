import React from 'react';
import { mount } from 'enzyme';
import { TickBoxWrapper } from '../tickBoxWrapper';

describe('Tick Box Styles', () => {
  it('should apply background-color and color if it is selected', () => {
    const component = mount(<TickBoxWrapper selected={true} />);

    const wrapper = component.find('div#tickBoxWrapper');
    const styles = getComputedStyle(wrapper.getDOMNode());

    expect(styles.backgroundColor).toBe('rgb(38, 132, 255)');
    expect(styles.color).toBe('white');
  });
});
