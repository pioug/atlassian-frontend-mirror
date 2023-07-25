import React from 'react';
import { render, screen } from '@testing-library/react';
import { matchers } from 'jest-emotion';
import { WrapperSpan } from '../../styled';

expect.extend(matchers);

describe('Wrapper', () => {
  it('should set user-select to none for firefox to fix duplicate copy / paste bug', async () => {
    // this is required till the firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1600848 is fixed
    render(<WrapperSpan data-testid="wrapper-span" />);
    const wrapper = await screen.findByTestId('wrapper-span');
    expect(wrapper).toHaveStyleRule('-moz-user-select', 'none');
  });
});
