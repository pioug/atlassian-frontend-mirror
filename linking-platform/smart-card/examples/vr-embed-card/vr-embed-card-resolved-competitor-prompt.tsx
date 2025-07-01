import React from 'react';

import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import { ResolvedClient } from '@atlaskit/link-test-helpers';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import VRCardView from '../utils/vr-card-view';

const MockCompetitorPrompt = () => (
	<Box testId="competitor-prompt-vr">
		<LightbulbIcon color={token('color.icon.discovery')} label={'Competitor Prompt'} />
	</Box>
);

export default () => (
	<VRCardView
		appearance="embed"
		client={new ResolvedClient()}
		frameStyle="show"
		CompetitorPrompt={MockCompetitorPrompt}
	/>
);
