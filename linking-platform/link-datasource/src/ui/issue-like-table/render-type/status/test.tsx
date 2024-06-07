import React from 'react';

import { render } from '@testing-library/react';

import Status, { STATUS_TYPE_TEST_ID } from './index';

describe('Status Type', () => {
	const setup = ({ text = '', ...props }) => {
		return render(<Status text={text} {...props} />);
	};

	it('renders with the text passed', async () => {
		const { queryByTestId } = setup({
			text: 'DONE',
		});

		const el = queryByTestId(STATUS_TYPE_TEST_ID);

		expect(el).toBeInTheDocument();
		expect(el).toHaveTextContent('DONE');
	});

	it('does not render when the text is empty', async () => {
		const { queryByTestId } = setup({
			text: '',
		});
		expect(queryByTestId(STATUS_TYPE_TEST_ID)).not.toBeInTheDocument();
	});
});
