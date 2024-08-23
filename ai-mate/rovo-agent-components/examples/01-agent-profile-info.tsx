import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { Box, Grid, xcss } from '@atlaskit/primitives';

import {
	AgentProfileCreator,
	AgentProfileInfo,
	AgentStarCount,
} from '../src/ui/agent-profile-info';

const wrapperStyles = xcss({
	width: '280px',
	margin: 'space.200',
	marginBottom: 'space.500',
});

export default function () {
	return (
		<IntlProvider locale="en">
			<Grid templateColumns="1fr 1fr 1fr" gap="space.200">
				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Gday Bot Agent"
						isStarred={true}
						onStarToggle={() => {}}
						creatorRender={
							<AgentProfileCreator
								creator={{
									type: 'SYSTEM',
								}}
								isLoading={false}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						starCountRender={<AgentStarCount starCount={14253} isLoading={false} />}
						isHidden={false}
					/>
				</Box>

				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Agent Name"
						isStarred={true}
						onStarToggle={() => {}}
						creatorRender={
							<AgentProfileCreator
								creator={{
									type: 'CUSTOMER',
									name: 'Creator Name',
									profileLink: 'https://example.com',
								}}
								isLoading={false}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						starCountRender={<AgentStarCount starCount={512} isLoading={false} />}
						agentDescription="Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice."
						isHidden={false}
					/>
				</Box>

				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Test agent with long name Test agent with long name and loading"
						isStarred={true}
						onStarToggle={() => {}}
						creatorRender={
							<AgentProfileCreator
								creator={undefined}
								isLoading={true}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						starCountRender={<AgentStarCount starCount={undefined} isLoading={true} />}
						agentDescription="Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice."
						isHidden={false}
					/>
				</Box>

				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Agent without creator and description"
						isStarred={false}
						onStarToggle={() => {}}
						creatorRender={
							<AgentProfileCreator
								creator={undefined}
								isLoading={false}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						starCountRender={<AgentStarCount starCount={undefined} isLoading={false} />}
						isHidden={false}
					/>
				</Box>

				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Forge agent example"
						isStarred={false}
						onStarToggle={() => {}}
						creatorRender={
							<AgentProfileCreator
								creator={{
									type: 'THIRD_PARTY',
									name: 'Opsgenie Incident Timeline Lab',
								}}
								isLoading={false}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						starCountRender={<AgentStarCount starCount={undefined} isLoading={false} />}
						isHidden={false}
					/>
				</Box>

				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Agent with deactivated creator"
						isStarred={false}
						onStarToggle={() => {}}
						creatorRender={
							<AgentProfileCreator
								creator={{
									type: 'CUSTOMER',
									name: 'Creator Name',
									status: 'inactive',
									profileLink: 'https://example.com',
								}}
								isLoading={false}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						starCountRender={<AgentStarCount starCount={undefined} isLoading={false} />}
						isHidden={false}
					/>
				</Box>
			</Grid>
		</IntlProvider>
	);
}
