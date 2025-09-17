/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { IntlProvider } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Grid } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { AgentProfileCreator, AgentProfileInfo } from '../src/ui/agent-profile-info';
import { AgentStarCount } from '../src/ui/agent-profile-info/agent-star-count';

const styles = cssMap({
	wrapper: {
		width: '280px',
		marginTop: token('space.200'),
		marginRight: token('space.200'),
		marginBottom: token('space.500'),
		marginLeft: token('space.200'),
	},
	gridWrapper: {
		gridTemplateColumns: '1fr 1fr 1fr',
	},
});

export default function () {
	return (
		<IntlProvider locale="en">
			<Grid xcss={styles.gridWrapper} gap="space.200">
				<Box xcss={styles.wrapper}>
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

				<Box xcss={styles.wrapper}>
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

				<Box xcss={styles.wrapper}>
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

				<Box xcss={styles.wrapper}>
					<AgentProfileInfo
						agentName="Test agent with long unbreakable description"
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
						agentDescription="https://hello.atlassian.net/wiki/spaces/~70121164347b28c684f438d9c2bdbb160b08b/pages/5749122820/My+Rovo+Agent+isn+t+doing+what+I+m+telling+it+to+do"
						isHidden={false}
					/>
				</Box>

				<Box xcss={styles.wrapper}>
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

				<Box xcss={styles.wrapper}>
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

				<Box xcss={styles.wrapper}>
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
