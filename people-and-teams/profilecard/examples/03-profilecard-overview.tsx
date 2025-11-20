import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';
import { avatarImages } from '../src/mocks/profile-data';
import { reportingLinesData } from '../src/mocks/reporting-lines-data';
import { type ProfilecardProps, type ReportingLinesUser } from '../src/types';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';

const styles = cssMap({
	section: {
		marginTop: token('space.200', '16px'),
		marginRight: 0,
		marginBottom: token('space.200', '16px'),
		marginLeft: 0,
	},
});

const Section = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles.section}>{children}</Box>;
};

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
export const LoadingState = (): React.JSX.Element => <ProfileCard isLoading />;
export const ErrorState = (): React.JSX.Element => (
	<ProfileCard hasError clientFetchProfile={clientFetchProfile} />
);
export const ErrorStateNotFound = (): React.JSX.Element => (
	<ProfileCard
		hasError
		errorType={{ reason: 'NotFound' }}
		clientFetchProfile={clientFetchProfile}
	/>
);
export const BestCaseProfile = (): React.JSX.Element => <ProfileCard {...bestCaseProfile} />;
export const WorstCaseProfile = (): React.JSX.Element => <ProfileCard {...worstCaseProfile} />;
export const BotCaseProfile = (): React.JSX.Element => <ProfileCard {...botCaseProfile} />;
export const AlternateActions = (): React.JSX.Element => <ProfileCard {...fakeData({ actions })} />;

export default function Example(): React.JSX.Element {
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
