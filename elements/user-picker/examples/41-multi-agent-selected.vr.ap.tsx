import React, { useEffect, useState } from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client/types';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';

import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { UserPicker } from '../src/components/UserPicker';
import type { User } from '../src/types';

const agentAvatar = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="#242528"/><path d="M64 18l11 35 35 11-35 11-11 35-11-35-35-11 35-11z" fill="white"/></svg>',
)}`;
const personAvatar = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="#2564a8"/><circle cx="64" cy="49" r="22" fill="white"/><path d="M24 120c0-23 18-40 40-40s40 17 40 40" fill="white"/></svg>',
)}`;

const selected: User[] = [
	{ id: 'agent', name: 'Agent', type: 'user', appType: 'agent', avatarUrl: agentAvatar },
	{ id: 'person', name: 'Person', type: 'user', avatarUrl: personAvatar },
];

const createExample = (experimentEnabled: boolean, tagUpliftEnabled: boolean) => {
	const Example = (): JSX.Element | null => {
		const [ready, setReady] = useState(false);

		useEffect(() => {
			let mounted = true;
			const setup = async () => {
				if (!FeatureGates.initializeCalled()) {
					await FeatureGates.initializeFromValues(
						{
							environment: FeatureGateEnvironment.Development,
							localMode: true,
							targetApp: '',
						},
						{},
					);
				}
				FeatureGates.overrideConfig('platform_user_picker_agent_avatar_hexagon', {
					isEnabled: experimentEnabled,
				});
				FeatureGates.overrideGate(
					'platform-dst-lozenge-tag-badge-visual-uplifts',
					tagUpliftEnabled,
				);
				FeatureGates.overrideGate('platform-dst-avatar-updated-geometry', true);
				setBooleanFeatureFlagResolver((key) => FeatureGates.checkGate(key));
				if (mounted) {
					setReady(true);
				}
			};
			void setup();
			return () => {
				mounted = false;
			};
		}, [experimentEnabled, tagUpliftEnabled]);

		return ready ? (
			<ExampleWrapper>
				{({ onInputChange }) => (
					<UserPicker
						fieldId="agent-selected-example"
						options={selected}
						defaultValue={selected}
						onInputChange={onInputChange}
						isMulti
					/>
				)}
			</ExampleWrapper>
		) : null;
	};

	Example.displayName = `AgentSelected${tagUpliftEnabled ? 'Uplift' : 'Legacy'}${experimentEnabled ? 'After' : 'Before'}`;
	return Example;
};

export const AgentSelectedLegacyBefore: React.ComponentType = createExample(false, false);
export const AgentSelectedLegacyAfter: React.ComponentType = createExample(true, false);
export const AgentSelectedUpliftBefore: React.ComponentType = createExample(false, true);
export const AgentSelectedUpliftAfter: React.ComponentType = createExample(true, true);
