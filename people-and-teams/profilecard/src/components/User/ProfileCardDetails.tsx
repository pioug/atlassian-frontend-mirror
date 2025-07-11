import React from 'react';

import { cssMap, cx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import relativeDate from '../../internal/relative-date';
import messages from '../../messages';
import {
	AppTitleLabel,
	CustomLozengeContainer,
	DetailsGroup,
	DisabledInfo,
	JobTitleLabel,
	LozengeWrapper,
} from '../../styled/Card';
import {
	type AnalyticsWithDurationProps,
	type LozengeProps,
	type ProfilecardProps,
} from '../../types';
import { IconLabel } from '../Icon';

import ReportingLinesDetails from './ReportingLinesDetails';

const styles = cssMap({
	detailedListWrapper: {
		marginTop: token('space.0'),
		marginRight: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
	},
	fullNameLabel: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		font: token('font.body.large'),
	},
	noMetaLabel: {
		// Using `&` twice to increase specificity
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&&': {
			marginTop: token('space.400'),
			marginBottom: token('space.150'),
		},
		marginRight: '0',
		marginLeft: '0',
	},
	noMetaLabelWithHighSpecificity: {
		// Using `&` and id attribute to increase specificity
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&#profilecard-name-label': {
			marginTop: token('space.400'),
			marginBottom: token('space.150'),
		},
	},
	metaLabel: {
		// Using `&` twice to increase specificity
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&&': {
			marginTop: token('space.150'),
		},
		marginRight: '0',
		marginBottom: '0',
		marginLeft: '0',
	},
	metaLabelWithHighSpecificity: {
		// Using `&` and id attribute to increase specificity
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&#profilecard-name-label': {
			marginTop: token('space.150'),
		},
		marginRight: '0',
		marginBottom: '0',
		marginLeft: '0',
	},
	disabledAccount: {
		color: token('color.text'),
	},
	activeAccount: {
		color: token('color.text.inverse'),
	},
});

const renderName = (nickname?: string, fullName?: string, meta?: string) => {
	if (!fullName && !nickname) {
		return null;
	}

	const isNicknameRedundant = !nickname || nickname === fullName;
	const shownNickname = ` (${nickname}) `;

	const displayName = isNicknameRedundant ? fullName : `${fullName}${shownNickname}`;

	return (
		<Box
			as="h2"
			xcss={cx(
				styles.fullNameLabel,
				styles.activeAccount,
				meta
					? fg('platform_editor_profilecard_style_fix')
						? styles.metaLabelWithHighSpecificity
						: styles.metaLabel
					: fg('platform_editor_profilecard_style_fix')
						? styles.noMetaLabelWithHighSpecificity
						: styles.noMetaLabel,
			)}
			testId="profilecard-name"
			id="profilecard-name-label"
		>
			{displayName}
		</Box>
	);
};

const disabledAccountDesc = (
	statusModifiedDate: number | null | undefined,
	disabledAccountMessage: React.ReactNode | undefined,
	status: 'closed' | 'inactive' = 'closed',
) => {
	// consumer does not want to use built-in message
	if (disabledAccountMessage) {
		return disabledAccountMessage;
	}

	const date = statusModifiedDate ? new Date(statusModifiedDate * 1000) : null;
	const relativeDateKey = relativeDate(date);

	const msgKey = (
		relativeDateKey
			? `${status}AccountDescMsgHasDate${relativeDateKey}`
			: `${status}AccountDescMsgNoDate`
	) as keyof typeof messages;

	const secondSentence = <FormattedMessage {...messages[msgKey]} />;

	return (
		<Text as="p" testId="profilecard-disabled-account">
			<FormattedMessage {...messages.generalDescMsgForDisabledUser} /> {secondSentence}
		</Text>
	);
};

const CustomLozenges = ({ lozenges = [] }: { lozenges?: LozengeProps[] }) => {
	if (lozenges.length === 0) {
		return null;
	}

	return (
		<CustomLozengeContainer>
			{lozenges.map(({ text, ...otherProps }, index) => (
				<Lozenge {...otherProps} key={index}>
					{text}
				</Lozenge>
			))}
		</CustomLozengeContainer>
	);
};
const ServiceAccountProfileCardDetails = (props: ProfilecardProps) => {
	const { fullName, nickname } = props;

	return (
		<DetailsGroup>
			{renderName(nickname, fullName)}
			<AppTitleLabel>SERVICE ACCOUNT</AppTitleLabel>
		</DetailsGroup>
	);
};

const BotProfileCardDetails = (props: ProfilecardProps) => {
	const { fullName, nickname } = props;

	return (
		<DetailsGroup>
			{renderName(nickname, fullName)}
			<AppTitleLabel>APP</AppTitleLabel>
		</DetailsGroup>
	);
};

const DisabledProfileCardDetails = (
	props: ProfilecardProps & { status: 'closed' | 'inactive' },
) => {
	const {
		companyName,
		disabledAccountMessage,
		fullName,
		hasDisabledAccountLozenge = true,
		nickname,
		status,
		statusModifiedDate,
	} = props;

	const name =
		status === 'inactive'
			? fullName || nickname
			: nickname || <FormattedMessage {...messages.disabledAccountDefaultName} />;

	return (
		<DetailsGroup>
			<Box
				as="h2"
				xcss={cx(styles.fullNameLabel, styles.noMetaLabel, styles.disabledAccount)}
				testId="profilecard-name"
				id="profilecard-name-label"
			>
				{name}
			</Box>

			{hasDisabledAccountLozenge && (
				<LozengeWrapper>
					<Lozenge appearance="default" isBold>
						{status === 'inactive' ? (
							<FormattedMessage {...messages.inactiveAccountMsg} />
						) : (
							<FormattedMessage {...messages.closedAccountMsg} />
						)}
					</Lozenge>
				</LozengeWrapper>
			)}

			<DisabledInfo>
				{disabledAccountDesc(statusModifiedDate, disabledAccountMessage, status)}
			</DisabledInfo>

			{status === 'inactive' && <IconLabel icon="companyName">{companyName}</IconLabel>}
		</DetailsGroup>
	);
};

export const ProfileCardDetails = (props: ProfilecardProps & AnalyticsWithDurationProps) => {
	const { meta, status } = props;

	if (props.isServiceAccount) {
		return <ServiceAccountProfileCardDetails {...props} />;
	}

	if (props.isBot) {
		return <BotProfileCardDetails {...props} />;
	}

	if (status === 'inactive' || status === 'closed') {
		return <DisabledProfileCardDetails {...props} status={status} />;
	}

	return (
		<DetailsGroup>
			{renderName(props.nickname, props.fullName, meta)}
			{meta && <JobTitleLabel>{meta}</JobTitleLabel>}
			<CustomLozenges lozenges={props.customLozenges} />
			<Box as="dl" xcss={styles.detailedListWrapper}>
				<IconLabel icon="email" extraTopSpace={true}>
					{props.email}
				</IconLabel>
				<IconLabel icon="time">{props.timestring}</IconLabel>
				<IconLabel icon="companyName">{props.companyName}</IconLabel>
				<IconLabel icon="location">{props.location}</IconLabel>
			</Box>

			<ReportingLinesDetails
				reportingLines={props.reportingLines}
				reportingLinesProfileUrl={props.reportingLinesProfileUrl}
				onReportingLinesClick={props.onReportingLinesClick}
				fireAnalyticsWithDuration={props.fireAnalyticsWithDuration}
			/>
		</DetailsGroup>
	);
};
