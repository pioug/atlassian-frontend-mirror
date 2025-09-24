import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Avatar from '@atlaskit/avatar';
import AvatarGroup, { type AvatarGroupProps } from '@atlaskit/avatar-group';
import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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
import { PACKAGE_META_DATA, reportingLinesClicked } from '../../util/analytics';
import { getPageTime } from '../../util/performance';

import { default as ReportingLinesDetailsCompiled } from './ReportingLinesDetailsCompiled';

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

const styles = cssMap({
	reportingLinesButton: {
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		backgroundColor: token('color.background.neutral.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
	},
});

const avatarGroupMaxCount = 5;

const ReportingLinesDetails = (props: ReportingLinesDetailsProps) => {
	const { formatMessage } = useIntl();
	const {
		fireAnalyticsWithDuration,
		fireAnalyticsWithDurationNext,
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
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						fireAnalyticsWithDurationNext('ui.profilecard.clicked.reportingLines', (duration) => ({
							duration,
							userType,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						}));
					} else {
						fireAnalyticsWithDuration((duration) =>
							reportingLinesClicked({
								duration,
								userType,
							}),
						);
					}
					onReportingLinesClick(user);
				}
			: undefined;

	const onReportingLinksClick = (
		user: ReportingLinesUser,
		userType: 'manager' | 'direct-report',
		href: string | undefined,
	) => {
		let shouldPreventDefault = false;
		if (onReportingLinesClick) {
			shouldPreventDefault = onReportingLinesClick(user) === false;
		}

		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			fireAnalyticsWithDurationNext('ui.profilecard.clicked.reportingLines', (duration) => ({
				duration,
				userType,
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			}));
		} else {
			fireAnalyticsWithDuration((duration) =>
				reportingLinesClicked({
					duration,
					userType,
				}),
			);
		}
		if (shouldPreventDefault) {
			return;
		}

		if (href) {
			window.location.href = href;
		}
	};

	const showMoreButtonProps: AvatarGroupProps['showMoreButtonProps'] = {
		'aria-label': formatMessage(messages.profileCardMoreReportingLinesLabel, {
			count: reports.length - avatarGroupMaxCount + 1,
		}),
	};

	return (
		<>
			{manager && (
				<ReportingLinesSection>
					<Box xcss={[reportingLinesHeadingDefaultStyles, reportingLinesHeadingStyles]}>
						<FormattedMessage {...messages.managerSectionHeading} />
					</Box>
					<OffsetWrapper>
						<Pressable
							onClick={() =>
								onReportingLinksClick(
									manager,
									'manager',
									getProfileHref(manager.accountIdentifier, reportingLinesProfileUrl),
								)
							}
							isDisabled={!onReportingLinesClick}
							xcss={styles.reportingLinesButton}
						>
							<ManagerSection>
								<Avatar size="xsmall" src={manager.pii?.picture} />
								<ManagerName>{manager.pii?.name}</ManagerName>
							</ManagerSection>
						</Pressable>
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
						maxCount={avatarGroupMaxCount}
						testId="profilecard-reports-avatar-group"
						showMoreButtonProps={showMoreButtonProps}
					/>
				</ReportingLinesSection>
			)}
		</>
	);
};

const ReportingLinesDetailsExport = componentWithFG(
	'profilecard_primitives_compiled',
	ReportingLinesDetailsCompiled,
	ReportingLinesDetails,
)
export default ReportingLinesDetailsExport;
