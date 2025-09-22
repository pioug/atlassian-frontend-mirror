import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';
import { avatarImages } from '../src/mocks/profile-data';
import { reportingLinesData } from '../src/mocks/reporting-lines-data';
import { type ProfilecardProps, type ReportingLinesUser } from '../src/types';

import ExampleWrapper from './helper/example-wrapper';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MainStage = styled.div({
	margin: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Section = styled.div({
	margin: `${token('space.200', '16px')} 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h4: {
		margin: `${token('space.100', '8px')} 0`,
	},
});

const fakeProfileData = {
	avatarUrl: avatarImages[4],
	fullName: profiles[4].User.fullName,
	nickname: profiles[4].User.nickname,
	email: profiles[4].User.email,
	location: 'Sydney, Australia',
	timestring: '9:00am',
	meta: profiles[4].User.meta,
	actions: [
		{
			label: 'View profile',
			id: 'view-profile',
			callback: () => {},
		},
	],
};

const fakeData = (data = {}): ProfilecardProps => {
	const newData = {
		...fakeProfileData,
		...data,
	};

	// filter out null values from fake data object
	return (
		Object.keys(newData)
			// @ts-ignore
			.filter((key) => Boolean(newData[key]))
			.reduce((result, item) => {
				return {
					...result,
					// @ts-ignore
					[item]: newData[item],
				};
			}, {})
	);
};

const bestCaseProfile = fakeData({
	reportingLines: reportingLinesData,
	reportingLinesProfileUrl: '/',
	onReportingLinesClick: (user: ReportingLinesUser) => {
		console.log('Clicked on ' + user.pii?.name);
	},
});

const worstCaseProfile = fakeData({
	avatarUrl: null,
	meta: null,
	timestring: null,
	location: null,
});

const botCaseProfile = fakeData({
	fullName: 'Awesome Thing Bot',
	nickname: 'awesomebot',
	isBot: true,
});

const actions = [
	{
		label: 'Foobar',
		id: 'action-foo',
		callback: () => {},
	},
	{
		label: 'Barfoo',
		id: 'action-barfoo',
		callback: () => {},
	},
	{
		label: 'Foobar2',
		id: 'action-footwo',
		callback: () => {},
	},
];

const clientFetchProfile = () => null;

/**
 * We snapshot all these.
 */
export const LoadingState = () => <ProfileCard isLoading />;
export const ErrorState = () => <ProfileCard hasError clientFetchProfile={clientFetchProfile} />;
export const ErrorStateNotFound = () => (
	<ProfileCard
		hasError
		errorType={{ reason: 'NotFound' }}
		clientFetchProfile={clientFetchProfile}
	/>
);
export const BestCaseProfile = () => <ProfileCard {...bestCaseProfile} />;
export const WorstCaseProfile = () => <ProfileCard {...worstCaseProfile} />;
export const BotCaseProfile = () => <ProfileCard {...botCaseProfile} />;
export const AlternateActions = () => <ProfileCard {...fakeData({ actions })} />;

export default function Example() {
	return (
		<ExampleWrapper>
			<MainStage>
				<Section>
					<h4>Loading State</h4>
					<LoadingState />
				</Section>
				<Section>
					<h4>Error State</h4>
					<ErrorState />
				</Section>
				<Section>
					<h4>Error State (Not Found Error)</h4>
					<ErrorStateNotFound />
				</Section>
				<Section>
					<h4>Worst case</h4>
					<WorstCaseProfile />
				</Section>
				<Section>
					<h4>Best case</h4>
					<BestCaseProfile />
				</Section>
				<Section>
					<h4>Bot case</h4>
					<BotCaseProfile />
				</Section>
				<Section>
					<h4>Alternate actions</h4>
					<AlternateActions />
				</Section>
			</MainStage>
		</ExampleWrapper>
	);
}
