import React from 'react';

import { Box, Inline, Text, xcss } from '@atlaskit/primitives';

import AgentProfileCard from '../src/components/Agent/AgentProfileCard';
import ProfileCardTrigger from '../src/components/common/ProfileCardTrigger';
import { type RovoAgentProfileCardInfo } from '../src/types';

import ExampleWrapper from './helper/example-wrapper';

const styles = xcss({ marginBlock: 'space.200' });
const Section = ({ children }: { children: React.ReactNode }) => {
	return (
		<Box padding="space.200" xcss={styles}>
			<Inline space="space.100">{children}</Inline>
		</Box>
	);
};

export default function Example() {
	const agent: RovoAgentProfileCardInfo = {
		id: 'agentId',
		name: 'Profile card agent',
		description: 'this is a agent to use in profile card',
		favourite: true,
		favourite_count: 1234,
		creatorInfo: {
			type: 'CUSTOMER',
			name: 'Creator Name',
			profileLink: 'https://example.com',
		},
		named_id: '',
		creator_type: 'CUSTOMER',
		is_default: false,
		actor_type: 'AGENT',
		user_defined_conversation_starters: [],
		deactivated: false,
	};
	return (
		<ExampleWrapper>
			<div>
				<Section>
					<AgentProfileCard agent={agent} />
				</Section>
				<Section>
					<Text>Agent profile card loading state</Text>
					<AgentProfileCard agent={agent} isLoading={true} />
				</Section>
				<Section>
					<Text>Profilecard triggered by hover</Text>
					<span>
						<ProfileCardTrigger
							trigger={'hover'}
							renderProfileCard={() => <AgentProfileCard agent={agent} />}
						>
							<Text as="strong">hover over me</Text>
						</ProfileCardTrigger>{' '}
					</span>
				</Section>
				<Section>
					<Text>Profilecard triggered by click</Text>
					<span>
						<ProfileCardTrigger
							trigger={'click'}
							renderProfileCard={() => <AgentProfileCard agent={agent} />}
						>
							<Text as="strong">Click me</Text>
						</ProfileCardTrigger>
					</span>
				</Section>
			</div>
		</ExampleWrapper>
	);
}
