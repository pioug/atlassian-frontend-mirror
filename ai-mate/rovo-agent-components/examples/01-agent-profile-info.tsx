import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { Box, Inline, xcss } from '@atlaskit/primitives';

import { AgentProfileCreator, AgentProfileInfo } from '../src/ui/agent-profile-info';

const wrapperStyles = xcss({
	width: '280px',
	margin: 'space.200',
	marginBottom: 'space.500',
});

export default function () {
	return (
		<IntlProvider locale="en">
			<Inline space="space.200">
				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Gday Bot Agent"
						isStarred={true}
						onStarToggle={() => {}}
						creatorRender={
							<AgentProfileCreator
								creator="SYSTEM"
								isLoading={false}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						starCount={14253}
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
									name: 'Creator Name',
									profileLink: 'https://example.com',
								}}
								isLoading={false}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						starCount={512}
						agentDescription="Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice."
					/>
				</Box>

				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Test agent with long name Test agent with long name and loading"
						isStarred={true}
						onStarToggle={() => {}}
						starCount={12}
						creatorRender={
							<AgentProfileCreator
								creator={undefined}
								isLoading={true}
								onCreatorLinkClick={() => {
									console.log('Creator link clicked');
								}}
							/>
						}
						agentDescription="Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice."
					/>
				</Box>

				<Box xcss={wrapperStyles}>
					<AgentProfileInfo
						agentName="Agent without creator and description"
						isStarred={true}
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
						starCount={14253}
					/>
				</Box>
			</Inline>
		</IntlProvider>
	);
}
