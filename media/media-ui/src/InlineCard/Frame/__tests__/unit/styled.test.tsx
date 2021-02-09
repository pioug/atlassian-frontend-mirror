import React from 'react';
import { shallow } from 'enzyme';
import { Wrapper } from '../../styled';

describe('Wrapper', () => {
  test('it should set user-select to none for firefox to fix duplicate copy / paste bug', () => {
    // this is required till the firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1600848 is fixed
    const element = shallow(<Wrapper />);
    expect(element).toHaveStyleRule('-moz-user-select', 'none');
  });
});
