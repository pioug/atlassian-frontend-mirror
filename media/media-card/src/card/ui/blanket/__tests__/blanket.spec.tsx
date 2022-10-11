import React from 'react';
import { shallow } from 'enzyme';
import { blanketClassName } from '../styles';
import { Blanket } from '../blanket';

describe('Styled Blanket', () => {
  it('should render properly with className', () => {
    const styledBlanket = shallow(<Blanket />);
    expect(styledBlanket.hasClass(blanketClassName)).toBe(true);
  });
});
