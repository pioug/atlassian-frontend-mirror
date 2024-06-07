import React from 'react';
import { mount } from 'enzyme';
import { matchers } from 'jest-emotion';
import { Wrapper } from '../../styled';

expect.extend(matchers);

describe('Wrapper', () => {
	it('should set user-select to none for firefox to fix duplicate copy / paste bug', () => {
		// this is required till the firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1600848 is fixed
		const element = mount(<Wrapper />);
		expect(element).toHaveStyleRule('-moz-user-select', 'none');
	});
});
