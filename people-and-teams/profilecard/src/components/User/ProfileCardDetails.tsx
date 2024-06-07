import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import Lozenge from '@atlaskit/lozenge';

import relativeDate from '../../internal/relative-date';
import messages from '../../messages';
import {
	AppTitleLabel,
	CustomLozengeContainer,
	DetailsGroup,
	DisabledInfo,
	FullNameLabel,
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

const renderName = (nickname?: string, fullName?: string, meta?: string) => {
	if (!fullName && !nickname) {
		return null;
	}

	const isNicknameRedundant = !nickname || nickname === fullName;
	const shownNickname = ` (${nickname}) `;

	const displayName = isNicknameRedundant ? fullName : `${fullName}${shownNickname}`;

	return (
		<FullNameLabel noMeta={!meta} data-testid="profilecard-name" id="profilecard-name-label">
			{displayName}
		</FullNameLabel>
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
		<p data-testid="profilecard-disabled-account">
			<FormattedMessage {...messages.generalDescMsgForDisabledUser} /> {secondSentence}
		</p>
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

const BotProfileCardDetails = (props: ProfilecardProps) => {
	const { fullName, nickname } = props;

	return (
		<DetailsGroup>
			{renderName(nickname, fullName)}
			<AppTitleLabel>App</AppTitleLabel>
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
			<FullNameLabel
				noMeta
				isDisabledAccount
				data-testid="profilecard-name"
				id="profilecard-name-label"
			>
				{name}
			</FullNameLabel>

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
			<IconLabel icon="email">{props.email}</IconLabel>
			<IconLabel icon="time">{props.timestring}</IconLabel>
			<IconLabel icon="companyName">{props.companyName}</IconLabel>
			<IconLabel icon="location">{props.location}</IconLabel>
			<ReportingLinesDetails
				reportingLines={props.reportingLines}
				reportingLinesProfileUrl={props.reportingLinesProfileUrl}
				onReportingLinesClick={props.onReportingLinesClick}
				fireAnalyticsWithDuration={props.fireAnalyticsWithDuration}
			/>
		</DetailsGroup>
	);
};
