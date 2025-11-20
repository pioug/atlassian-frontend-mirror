import React from 'react';

import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import { CardClient as Client } from '@atlaskit/link-provider';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { mocks } from '../utils/common';
import VRCardView from '../utils/vr-card-view';

const MockCompetitorPrompt = () => (
	<Box testId="competitor-prompt-vr">
		<LightbulbIcon color={token('color.icon.discovery')} label={'Competitor Prompt'} />
	</Box>
);

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mocks.entityDataSuccess);
	}
}

export const BlockCardCompetitorPrompt = (): React.JSX.Element => (
	<div>
		<VRCardView
			appearance="block"
			client={new CustomClient('staging')}
			url={'https://www.mockurl.com'}
			CompetitorPrompt={MockCompetitorPrompt}
		/>
	</div>
);
