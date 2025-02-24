import React from 'react';
import { mount } from 'enzyme';
import { blanketClassName } from '../styles';
import { Blanket } from '../blanket';

describe('Styled Blanket', () => {
	it('should render properly with className', () => {
		const styledBlanket = mount(<Blanket />);
		expect(styledBlanket.find(`div.${blanketClassName}`)).toHaveLength(1);
	});
});
