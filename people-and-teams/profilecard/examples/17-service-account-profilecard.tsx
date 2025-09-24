import React from 'react';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';

const avatarImage = profiles[4].User.avatarUrl;

export default function Example() {
	return (
		<ExampleWrapper>
			<MainStage>
				<ProfileCard
					avatarUrl={avatarImage}
					fullName="Service account"
					meta="Service"
					nickname="sa"
					email="service@serviceaccount.atlassian.com"
					timestring="18:45"
					location="AWS"
					isServiceAccount={true}
					actions={[
						{
							label: 'View profile',
							id: 'view-profile',
							callback: () => { },
						},
					]}
					reportingLinesProfileUrl="/"
					onReportingLinesClick={(user) => {
						console.log('Clicked on ' + user.pii?.name);
					}}
				/>
			</MainStage>
		</ExampleWrapper>
	);
}
