import React from 'react';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';
import { reportingLinesData } from '../src/mocks/reporting-lines-data';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';

const avatarImage = profiles[4].User.avatarUrl;

export default function Example() {
	return (
		<ExampleWrapper>
			<MainStage>
				<ProfileCard
					avatarUrl={avatarImage}
					fullName="Rosalyn Franklin"
					meta="Manager"
					nickname="rfranklin"
					email="rfranklin@acme.com"
					timestring="18:45"
					location="Somewhere, World"
					actions={[
						{
							label: 'View profile',
							id: 'view-profile',
							callback: () => { },
						},
					]}
					reportingLines={reportingLinesData}
					reportingLinesProfileUrl="/"
					onReportingLinesClick={(user) => {
						console.log('Clicked on ' + user.pii?.name);
					}}
				/>
			</MainStage>
		</ExampleWrapper>
	);
}
