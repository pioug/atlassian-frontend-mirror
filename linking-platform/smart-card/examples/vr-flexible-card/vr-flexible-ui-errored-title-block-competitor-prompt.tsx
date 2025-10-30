/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import UnresolvedView from '../../src/view/BlockCard/views/unresolved-view';
import { getCardState } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const MockCompetitorPrompt = ({
	sourceUrl,
	linkType,
}: {
	linkType?: string;
	sourceUrl: string;
}) => (
	<Box testId="competitor-prompt-errored-vr">
		<LightbulbIcon color={token('color.text.accent.purple')} label={'Competitor Prompt'} />
	</Box>
);

const renderErroredViewWithCompetitorPrompt = () => {
	const cardState = getCardState({
		data: { url: 'https://example.com/errored-url' },
		status: 'errored',
	});

	return (
		<UnresolvedView
			cardState={cardState}
			url="https://example.com/errored-url"
			onAuthorize={() => {}}
			CompetitorPrompt={MockCompetitorPrompt}
		/>
	);
};

export default () => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>{renderErroredViewWithCompetitorPrompt()}</SmartCardProvider>
		</VRTestWrapper>
	);
};
