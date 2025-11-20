import React from 'react';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';

const avatarImage = profiles[4].User.avatarUrl;

export default function Example(): React.JSX.Element {
	return (
		<ExampleWrapper>
			<>
				<MainStage>
					<ProfileCard
						avatarUrl={avatarImage}
						fullName="Link card"
						meta="With callback"
						actions={[
							{
								label: 'View website',
								id: 'view-website',
								callback: () => {
									alert('Click action performed');
								},
								link: 'https://www.atlassian.com',
							},
						]}
					/>
				</MainStage>
				<MainStage>
					<ProfileCard
						avatarUrl={avatarImage}
						fullName="Link card"
						meta="Without callback"
						actions={[
							{
								label: 'View website',
								id: 'view-website',
								link: 'https://www.atlassian.com',
							},
						]}
					/>
				</MainStage>
			</>
		</ExampleWrapper>
	);
}
