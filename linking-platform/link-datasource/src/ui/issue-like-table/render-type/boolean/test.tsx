import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import Boolean, { BOOLEAN_TYPE_TEST_ID } from './index';

describe('Boolean Type', () => {
	const setup = ({ value = false, ...props }: { value: any }) => {
		return render(
			<IntlProvider locale="en">
				<Boolean value={value} {...props} />,
			</IntlProvider>,
		);
	};

	it('renders "Yes" when value is true', async () => {
		const { queryByTestId } = setup({
			value: true,
		});

		const el = queryByTestId(BOOLEAN_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('Yes');
	});

	it('renders "No" when value is false', async () => {
		const { queryByTestId } = setup({
			value: false,
		});

		const el = queryByTestId(BOOLEAN_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('No');
	});

	it('does not render when value is not boolean', async () => {
		const { queryByTestId } = setup({
			value: '',
		});
		expect(queryByTestId(BOOLEAN_TYPE_TEST_ID)).not.toBeInTheDocument();
	});
});
