import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ReportingLinesDetails, {
	type ReportingLinesDetailsProps,
} from '../../components/User/ReportingLinesDetails';
import { type ReportingLinesUser } from '../../types';

const exampleReportingLineUser: ReportingLinesUser = {
	accountIdentifier: 'abcd',
	identifierType: 'ATLASSIAN_ID',
	pii: {
		name: 'manager name',
		picture: 'picture',
	},
};
const exampleReportingLineUser2: ReportingLinesUser = {
	accountIdentifier: 'abcd2',
	identifierType: 'ATLASSIAN_ID',
	pii: {
		name: 'name2',
		picture: 'picture2',
	},
};
const exampleReportingLineUser3: ReportingLinesUser = {
	accountIdentifier: 'abcd3',
	identifierType: 'ATLASSIAN_ID',
	pii: {
		name: 'name3',
		picture: 'picture3',
	},
};
describe('ReportingLinesDetails', () => {
	const defaultProps: ReportingLinesDetailsProps = {
		reportingLines: {
			managers: [exampleReportingLineUser],
			reports: [exampleReportingLineUser2, exampleReportingLineUser3],
		},
		reportingLinesProfileUrl: 'profile-url',
		fireAnalyticsWithDuration: () => {},
		fireAnalyticsWithDurationNext: () => {},
	};

	const renderComponent = (props = {}) =>
		render(
			<IntlProvider locale="en">
				<ReportingLinesDetails {...defaultProps} {...props} />
			</IntlProvider>,
		);

	it('should render mangaer & reports when specified', async () => {
		renderComponent({ onReportingLinesClick: () => null });
		expect(screen.getByText('Manager')).toBeInTheDocument();
		expect(screen.getByText('manager name')).toBeInTheDocument();
		expect(screen.getByText('Direct reports')).toBeInTheDocument();
		// img alts
		expect(screen.getByAltText('name2')).toBeInTheDocument();
		expect(screen.getByAltText('name3')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should not render mangaer & reports when NOT specified', async () => {
		renderComponent({ reportingLines: {} });
		expect(screen.queryByText('Manager')).not.toBeInTheDocument();
		expect(screen.queryByText('Direct reports')).not.toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});
});
