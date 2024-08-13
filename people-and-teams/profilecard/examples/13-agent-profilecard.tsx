import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import AgentProfileCard from '../src/components/Agent/AgentProfileCard';
import ProfileCardTrigger from '../src/components/common/ProfileCardTrigger';

import ExampleWrapper from './helper/example-wrapper';
import { CardWrapper } from './helper/wrapper';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MainStage = styled.div({
	margin: token('space.200', '16px'),
});

export default function Example() {
	return (
		<ExampleWrapper>
			<div>
				<MainStage>
					<CardWrapper>
						<AgentProfileCard agent={undefined} />
					</CardWrapper>
				</MainStage>
				<MainStage>
					<CardWrapper>
						<h4>Profilecard triggered by hover</h4>
						<span>
							<ProfileCardTrigger
								trigger={'hover'}
								renderProfileCard={() => <AgentProfileCard agent={undefined} />}
							>
								<strong>hover over me</strong>
							</ProfileCardTrigger>{' '}
						</span>
					</CardWrapper>
					<CardWrapper>
						<h4>Profilecard triggered by clivk</h4>
						<span>
							<ProfileCardTrigger
								trigger={'click'}
								renderProfileCard={() => <AgentProfileCard agent={undefined} />}
							>
								<strong>hover over me</strong>
							</ProfileCardTrigger>{' '}
						</span>
					</CardWrapper>
				</MainStage>
			</div>
		</ExampleWrapper>
	);
}
