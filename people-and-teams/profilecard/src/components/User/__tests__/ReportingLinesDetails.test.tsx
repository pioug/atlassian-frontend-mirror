import React from 'react';

import { render, screen, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ReportingLinesDetails from '../ReportingLinesDetails';

describe('ReportingLinesDetails', () => {
	const mockFireAnalyticsWithDuration = jest.fn();

	const createReports = (count: number) => {
		return Array.from({ length: count }, (_, i) => ({
			accountIdentifier: String(i),
			identifierType: 'ATLASSIAN_ID' as const,
			pii: { name: `user-${i}`, picture: `user-${i}.jpg` },
		}));
	};

	test('displays direct reports', () => {
		const reports = createReports(2);

		render(
			<IntlProvider locale="en">
				<ReportingLinesDetails
					fireAnalyticsWithDuration={mockFireAnalyticsWithDuration}
					reportingLines={{ reports }}
				/>
			</IntlProvider>,
		);

		expect(screen.getByText(/direct reports/i)).toBeInTheDocument();
		reports.forEach((report, index) => {
			const testId = `profilecard-reports-avatar-group--tooltip-${index}--container`;
			const avatar = screen.getByTestId(testId);
			expect(avatar.querySelector('img')).toHaveAttribute('src', report.pii.picture);
			expect(within(avatar).getByText(report.pii.name)).toBeInTheDocument();
		});
	});

	test('displays a more indicator when there are more than 6 reports', () => {
		const reports = createReports(6);
		render(
			<IntlProvider locale="en">
				<ReportingLinesDetails
					fireAnalyticsWithDuration={mockFireAnalyticsWithDuration}
					reportingLines={{ reports }}
				/>
			</IntlProvider>,
		);
		const moreIndicator = screen.getByText('+2', { selector: 'button' });
		expect(moreIndicator).toBeInTheDocument();
		expect(moreIndicator).toHaveAttribute('aria-label', '+2 more profiles');
	});

	test('should capture and report a11y violations', async () => {
		const reports = createReports(6);
		const { container } = render(
			<IntlProvider locale="en">
				<ReportingLinesDetails
					fireAnalyticsWithDuration={mockFireAnalyticsWithDuration}
					reportingLines={{ reports }}
				/>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
