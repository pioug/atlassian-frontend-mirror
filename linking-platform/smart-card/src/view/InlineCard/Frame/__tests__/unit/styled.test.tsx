import React from 'react';

import { render, screen } from '@testing-library/react';
import { matchers } from 'jest-emotion';

import { WrapperSpan } from '../../styled';
import { WrapperSpan as WrapperSpanOld } from '../../styled-emotion';

expect.extend(matchers);

describe('Wrapper', () => {
	it('should set user-select to none for firefox to fix duplicate copy / paste bug', async () => {
		// this is required till the firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1600848 is fixed
		render(<WrapperSpan data-testid="wrapper-span" />);
		const wrapper = await screen.findByTestId('wrapper-span');
		expect(wrapper).toHaveCompiledCss('-moz-user-select', 'none');
	});

	// Remove on FF clean up of bandicoots-compiled-migration-smartcard
	it('old: should set user-select to none for firefox to fix duplicate copy / paste bug', async () => {
		// this is required till the firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1600848 is fixed
		render(<WrapperSpanOld data-testid="wrapper-span" />);
		const wrapper = await screen.findByTestId('wrapper-span');
		expect(wrapper).toHaveStyleRule('-moz-user-select', 'none');
	});
});
