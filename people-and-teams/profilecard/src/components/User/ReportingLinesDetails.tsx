import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import Avatar from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import Button from '@atlaskit/button';
import { Box, xcss } from '@atlaskit/primitives';

import messages from '../../messages';
import {
	ManagerName,
	ManagerSection,
	OffsetWrapper,
	ReportingLinesSection,
} from '../../styled/ReportingLines';
import {
	type AnalyticsWithDurationProps,
	type ProfilecardProps,
	type ReportingLinesUser,
} from '../../types';
import { reportingLinesClicked } from '../../util/analytics';

export type ReportingLinesDetailsProps = Pick<
	ProfilecardProps,
	'reportingLines' | 'reportingLinesProfileUrl' | 'onReportingLinesClick'
> &
	AnalyticsWithDurationProps;

function getProfileHref(userId: string, profileUrl?: string) {
	return profileUrl ? profileUrl + userId : undefined;
}

const reportingLinesHeadingDefaultStyles = xcss({
	color: 'color.text',
	font: 'font.heading.xxsmall',
	fontWeight: 'font.weight.semibold',
	marginBottom: 'space.100',
});
const reportingLinesHeadingStyles = xcss({
	marginBottom: '0',
});

const ReportingLinesDetails = (props: ReportingLinesDetailsProps) => {
	const {
		fireAnalyticsWithDuration,
		reportingLines = {},
		reportingLinesProfileUrl,
		onReportingLinesClick,
	} = props;
	const { managers = [], reports = [] } = reportingLines;

	const manager = managers.length >= 1 ? managers[0] : undefined;
	const hasReports = reports.length > 0;

	const getReportingLinesOnClick = (
		user: ReportingLinesUser,
		userType: 'manager' | 'direct-report',
	) =>
		onReportingLinesClick
			? () => {
					fireAnalyticsWithDuration((duration) =>
						reportingLinesClicked({
							duration,
							userType,
						}),
					);

					onReportingLinesClick(user);
				}
			: undefined;

	return (
		<>
			{manager && (
				<ReportingLinesSection>
					<Box xcss={[reportingLinesHeadingDefaultStyles, reportingLinesHeadingStyles]}>
						<FormattedMessage {...messages.managerSectionHeading} />
					</Box>
					<OffsetWrapper>
						<Button
							appearance="subtle"
							spacing="none"
							href={getProfileHref(manager.accountIdentifier, reportingLinesProfileUrl)}
							onClick={getReportingLinesOnClick(manager, 'manager')}
							isDisabled={!onReportingLinesClick}
						>
							<ManagerSection>
								<Avatar size="xsmall" src={manager.pii?.picture} />
								<ManagerName>{manager.pii?.name}</ManagerName>
							</ManagerSection>
						</Button>
					</OffsetWrapper>
				</ReportingLinesSection>
			)}
			{hasReports && (
				<ReportingLinesSection>
					<Box xcss={reportingLinesHeadingDefaultStyles}>
						<FormattedMessage {...messages.directReportsSectionHeading} />
					</Box>
					<AvatarGroup
						appearance="stack"
						size="small"
						data={reports.map((member: ReportingLinesUser) => {
							return {
								key: member.accountIdentifier,
								name: member.pii?.name || '',
								src: member.pii?.picture,
								href: getProfileHref(member.accountIdentifier, reportingLinesProfileUrl),
								onClick: getReportingLinesOnClick(member, 'direct-report'),
							};
						})}
						maxCount={5}
						testId="profilecard-reports-avatar-group"
					/>
				</ReportingLinesSection>
			)}
		</>
	);
};

export default ReportingLinesDetails;
