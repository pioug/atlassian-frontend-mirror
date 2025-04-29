import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageDescriptor } from 'react-intl-next';

import { MoreActions } from './index';

jest.mock('react-intl-next', () => ({
	...jest.requireActual('react-intl-next'),
	useIntl: jest.fn().mockReturnValue({
		formatMessage: ({ defaultMessage }: MessageDescriptor) => defaultMessage,
	}),
}));

describe('MoreActions', () => {
	const actions = [
		{ id: '1', item: <button>Action 1 </button> },
		{ id: '2', item: <button>Action 2 </button> },
	];

	it('should capture and report a11y violations', async () => {
		const { container } = render(<MoreActions actions={actions} />);
		await expect(container).toBeAccessible();
	});

	it('should render the more icon', () => {
		render(<MoreActions actions={actions} />);
		expect(screen.getByRole('button', { name: 'Show more' })).toBeVisible();
	});

	it('should render the actions when the more icon is clicked', async () => {
		render(<MoreActions actions={actions} />);
		await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
		expect(screen.getByText('Action 1')).toBeVisible();
		expect(screen.getByText('Action 2')).toBeVisible();
	});
});
