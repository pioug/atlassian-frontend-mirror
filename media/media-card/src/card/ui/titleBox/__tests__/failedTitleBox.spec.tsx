import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';
import { FailedTitleBox } from '../failedTitleBox';
import { Breakpoint } from '../../common';

describe('FailedTitleBox', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<FailedTitleBox breakpoint={Breakpoint.SMALL} />
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('should render FailedTitleBox properly', () => {
		render(
			<IntlProvider locale="en">
				<FailedTitleBox breakpoint={Breakpoint.SMALL} />
			</IntlProvider>,
		);
		const wrapper = screen.getByTestId('media-title-box');
		const warningIcon = screen.getByLabelText('Warning');
		const errorMessage = screen.getByText('Failed to load');

		expect(wrapper).toBeInTheDocument();
		expect(warningIcon).toBeInTheDocument();
		expect(errorMessage).toBeInTheDocument();
		// Structure: icon + message rendered inside TitleBoxWrapper (proves the
		// wrapper actually wraps them — replaces the old shallow find/prop check).
		expect(wrapper).toContainElement(warningIcon);
		expect(wrapper).toContainElement(errorMessage);
	});
});
