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
		id: '965df475-d134-43ac-8ec4-f4aafd0025c6',
		name: "Arezoo' agent ",
		description:
			'Get help writing a user manual page that you can use to share your preferred ways of working with your team. This fun and friendly Agent can show you how.',
		system_prompt_template: '',
		visibility: 'PUBLIC',

		user_defined_conversation_starters: [
			'Help me make my first User Manual.',
			'Help with my goals',
		],
		named_id: '965df475-d134-43ac-8ec4-f4aafd0025c6',
		creator: 'ari:cloud:identity::user/62321fb55b6d710070a1ce85',
		creator_type: 'CUSTOMER',
		favourite: true,
		is_default: false,
		deactivated: false,
		identity_account_id: 'ari:cloud:identity::user/712020:b719aaa1-2485-4dad-93d3-abc3c93862c6',
		creatorInfo: undefined,
		actor_type: 'AGENT',
		favourite_count: 0,
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
							profileCardType={'agent'}
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
							profileCardType={'agent'}
						>
							<Text as="strong">Click me</Text>
						</ProfileCardTrigger>
					</span>
				</Section>
			</div>
		</ExampleWrapper>
	);
}
