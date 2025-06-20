import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';

import ExampleWrapper from './helper/example-wrapper';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MainStage = styled.div({
	margin: token('space.200', '16px'),
});

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
							callback: () => {},
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
