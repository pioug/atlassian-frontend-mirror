import React, { useCallback, useState } from 'react';

import fetchMock from 'fetch-mock';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import AgentProfileCard from '../src/components/Agent/AgentProfileCard';
import { type RovoAgentProfileCardInfo } from '../src/types';

import ExampleWrapper from './helper/example-wrapper';
import { getMockProfileClient } from './helper/util';

const styles = cssMap({
	controls: {
		marginTop: token('space.300'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	list: {
		marginTop: token('space.0'),
		marginRight: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		listStyle: 'none',
	},
	label: {
		marginRight: token('space.100'),
	},
	cardWrapper: {
		height: '480px',
	},
	wrapperBox: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

const mockClient = getMockProfileClient(10, 0, {}, { cloudId: 'test-cloud-id' });

fetchMock.mock(
	'end:/assist/api/rovo/v2/permissions/agents/965df475-d134-43ac-8ec4-f4aafd0025c6',
	{
		status: 200,
		body: JSON.stringify({
			permissions: {
				AGENT_CREATE: { permitted: true },
				AGENT_UPDATE: { permitted: true },
				AGENT_DEACTIVATE: { permitted: true },
			},
		}),
	},
	{ overwriteRoutes: true },
);

const defaultAgent: RovoAgentProfileCardInfo = {
	id: '965df475-d134-43ac-8ec4-f4aafd0025c6',
	name: "Arezoo's Agent",
	description:
		'Get help writing a user manual page that you can use to share your preferred ways of working with your team.',
	system_prompt_template: '',
	visibility: 'PUBLIC',
	user_defined_conversation_starters: [
		'Help me make my first User Manual.',
		'Help with my goals',
		'This is a very long conversation starter to test the overflow',
	],
	named_id: '965df475-d134-43ac-8ec4-f4aafd0025c6',
	creator: 'ari:cloud:identity::user/62321fb55b6d710070a1ce85',
	creator_type: 'CUSTOMER',
	favourite: true,
	is_default: false,
	deactivated: false,
	identity_account_id: 'ari:cloud:identity::user/712020:b719aaa1-2485-4dad-93d3-abc3c93862c6',
	creatorInfo: {
		type: 'CUSTOMER',
		name: 'John Doe',
		profileLink: 'https://example.com/profile',
	},
	actor_type: 'AGENT',
	favourite_count: 42,
};

type BooleanFlags = {
	isLoading: boolean;
	hasError: boolean;
	hideMoreActions: boolean;
	hideAiDisclaimer: boolean;
	isFavourite: boolean;
	isDeactivated: boolean;
	isDefault: boolean;
	isPrivate: boolean;
	isRovoDev: boolean;
	hideConversationStarters: boolean;
};

const Checkbox = ({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: () => void;
}) => (
	<li>
		<Box as="label" xcss={styles.label}>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
			<input type="checkbox" checked={checked} onChange={onChange} />
			{label}
		</Box>
	</li>
);

export default function Example(): React.JSX.Element {
	const [flags, setFlags] = useState<BooleanFlags>({
		isLoading: false,
		hasError: false,
		hideMoreActions: false,
		hideAiDisclaimer: false,
		isFavourite: true,
		isDeactivated: false,
		isPrivate: false,
		isDefault: false,
		hideConversationStarters: false,
		isRovoDev: false,
	});

	const toggle = useCallback((key: keyof BooleanFlags) => {
		setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
	}, []);

	const agent: RovoAgentProfileCardInfo = {
		...defaultAgent,
		favourite: flags.isFavourite,
		deactivated: flags.isDeactivated,
		visibility: flags.isPrivate ? 'PRIVATE' : 'PUBLIC',
		is_default: flags.isDefault,
		creator_type: flags.isRovoDev ? 'ROVO_DEV' : defaultAgent.creator_type,
	};

	return (
		<ExampleWrapper>
			<Box xcss={styles.wrapperBox}>
				<Inline space="space.200" alignBlock="start">
					<Box xcss={styles.cardWrapper}>
						<AgentProfileCard
							agent={agent}
							resourceClient={mockClient}
							cloudId="test-cloud-id"
							isLoading={flags.isLoading}
							hasError={flags.hasError}
							hideMoreActions={flags.hideMoreActions}
							hideAiDisclaimer={flags.hideAiDisclaimer}
							hideConversationStarters={flags.hideConversationStarters}
							onChatClick={() => console.log('Chat clicked')}
							onConversationStartersClick={(starter) =>
								console.log('Conversation starter:', starter.message)
							}
						/>
					</Box>

					<Box xcss={styles.controls}>
						<Stack space="space.200">
							<Box>
								<strong>Card state</strong>
								<Box as="ul" xcss={styles.list}>
									<Checkbox
										label="isLoading"
										checked={flags.isLoading}
										onChange={() => toggle('isLoading')}
									/>
									<Checkbox
										label="hasError"
										checked={flags.hasError}
										onChange={() => toggle('hasError')}
									/>
								</Box>
							</Box>

							<Box>
								<strong>Visibility</strong>
								<Box as="ul" xcss={styles.list}>
									<Checkbox
										label="hideMoreActions"
										checked={flags.hideMoreActions}
										onChange={() => toggle('hideMoreActions')}
									/>
									<Checkbox
										label="hideAiDisclaimer"
										checked={flags.hideAiDisclaimer}
										onChange={() => toggle('hideAiDisclaimer')}
									/>
									<Checkbox
										label="hideConversationStarters"
										checked={flags.hideConversationStarters}
										onChange={() => toggle('hideConversationStarters')}
									/>
								</Box>
							</Box>

							<Box>
								<strong>Agent properties</strong>
								<Box as="ul" xcss={styles.list}>
									<Checkbox
										label="isRovoDev"
										checked={flags.isRovoDev}
										onChange={() => toggle('isRovoDev')}
									/>
									<Checkbox
										label="isFavourite"
										checked={flags.isFavourite}
										onChange={() => toggle('isFavourite')}
									/>
									<Checkbox
										label="isDeactivated"
										checked={flags.isDeactivated}
										onChange={() => toggle('isDeactivated')}
									/>
									<Checkbox
										label="isPrivate"
										checked={flags.isPrivate}
										onChange={() => toggle('isPrivate')}
									/>
									<Checkbox
										label="isDefault"
										checked={flags.isDefault}
										onChange={() => toggle('isDefault')}
									/>
								</Box>
							</Box>
						</Stack>
					</Box>
				</Inline>
			</Box>
		</ExampleWrapper>
	);
}
