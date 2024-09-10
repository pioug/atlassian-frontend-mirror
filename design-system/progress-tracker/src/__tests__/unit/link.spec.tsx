import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import ProgressTrackerLink from '../../internal/link';

const item = {
	id: 'visited-1',
	label: 'Visited Step',
	percentageComplete: 100,
	status: 'visited',
	href: '#',
	testId: 'test',
	onClick: jest.fn(),
} as const;

describe('@atlaskit/progress-tracker/link', () => {
	beforeEach(jest.resetAllMocks);

	it('sanity check', () => {
		render(<ProgressTrackerLink {...item} />);
		expect(screen.getByTestId(item.testId)).toBeInTheDocument();
	});

	it('should render the component as per props', () => {
		render(<ProgressTrackerLink {...item} />);
		const element = screen.getByText(item.label);
		expect(element).toHaveStyle(`color: ${token('color.text', colors.N800)}`);
		expect(element).toHaveAttribute('href', item.href);
	});

	it('clicking visited link should trigger onClick', async () => {
		const user = userEvent.setup();

		render(<ProgressTrackerLink {...item} />);
		await user.click(screen.getByText(item.label));
		expect(item.onClick).toHaveBeenCalledTimes(1);
	});
});
