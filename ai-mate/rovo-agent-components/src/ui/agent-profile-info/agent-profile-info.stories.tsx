import React, { type ComponentPropsWithoutRef } from 'react';

import type { Meta } from '@storybook/react';
import { injectable } from 'react-magnetic-di';
import { useFragment } from 'react-relay';

import { withDi, withUseIntl } from '@atlassian/agent-studio-test-utils/storybook-decorators';

import { AgentProfileInfo } from './index';

const commonDeps = [
	injectable(useFragment, () => ({
		isVerified: true,
	})),
];

const meta: Meta<ComponentPropsWithoutRef<typeof AgentProfileInfo>> = {
	decorators: [withUseIntl(), withDi(commonDeps)],
};

export default meta;

export const Default = {
	render: () => (
		<AgentProfileInfo
			agentName="Code Documentation Writer"
			agentDescription="Create or modify documentation files in your codebase to ensure that they are up to date"
			creatorRender={<div>Creator Render</div>}
			starCountRender={<div>Star Count Render</div>}
			headingRender={<div>Heading Render</div>}
			isStarred={true}
			isHidden={false}
			onStarToggle={() => {}}
		/>
	),
};
