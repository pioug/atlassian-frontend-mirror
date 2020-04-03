import React from 'react';
import { shallow } from 'enzyme';
import { Wrapper } from '../../styled';

describe('Wrapper', () => {
  test('it should have interactive styles', () => {
    const element = shallow(<Wrapper isInteractive={true} />);
    expect(element).toMatchSnapshot();
  });

  test('it should have selected styles', () => {
    const element = shallow(<Wrapper isSelected={true} />);
    expect(element).toMatchSnapshot();
  });

  test('it should not have interactive or selected styles', () => {
    const element = shallow(<Wrapper />);
    expect(element).toMatchSnapshot();
  });
});
