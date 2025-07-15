import React, { type ReactNode, useState } from 'react';

import { AVATAR_SIZES } from '@atlaskit/avatar';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Flex, Text, xcss } from '@atlaskit/primitives';
import Select from '@atlaskit/select';

import {
	blueColor,
	greenColor,
	purpleColor,
	yellowColor,
} from '../src/ui/agent-avatar/generated-avatars';
import AutoDevIcon from '../src/ui/agent-avatar/generated-avatars/assets/auto-dev';
import AutoFixIcon from '../src/ui/agent-avatar/generated-avatars/assets/auto-fix';
import AutoReviewIcon from '../src/ui/agent-avatar/generated-avatars/assets/auto-review';
import BacklogBuddyIcon from '../src/ui/agent-avatar/generated-avatars/assets/backlog-buddy';
import CommsCrafterIcon from '../src/ui/agent-avatar/generated-avatars/assets/comms-crafter';
import CultureIcon from '../src/ui/agent-avatar/generated-avatars/assets/culture';
import CustomerInsightIcon from '../src/ui/agent-avatar/generated-avatars/assets/customer-insight';
import DecisionDirectorIcon from '../src/ui/agent-avatar/generated-avatars/assets/decision-director';
import FeatureFlagAvatarIcon from '../src/ui/agent-avatar/generated-avatars/assets/feature-flag-avatar';
import GenericAvatarIcon from '../src/ui/agent-avatar/generated-avatars/assets/generic-avatar';
import HireWriterIcon from '../src/ui/agent-avatar/generated-avatars/assets/hire-writer';
import MarketingMessageMaestroIcon from '../src/ui/agent-avatar/generated-avatars/assets/marketing-message-maestro';
import MyUserManualIcon from '../src/ui/agent-avatar/generated-avatars/assets/my-user-manual';
import OkrOracleIcon from '../src/ui/agent-avatar/generated-avatars/assets/okr-oracle';
import OpsAgentIcon from '../src/ui/agent-avatar/generated-avatars/assets/ops-agent';
import PitchPerfectorIcon from '../src/ui/agent-avatar/generated-avatars/assets/pitch-perfector';
import ProductRequirementIcon from '../src/ui/agent-avatar/generated-avatars/assets/product-requirement';
import ReleaseNoteIcon from '../src/ui/agent-avatar/generated-avatars/assets/release-notes';
import ResearchScoutIcon from '../src/ui/agent-avatar/generated-avatars/assets/research-scout';
import SocialMediaScribeIcon from '../src/ui/agent-avatar/generated-avatars/assets/social-media-scribe';
import TeamConnectionIcon from '../src/ui/agent-avatar/generated-avatars/assets/team-connection';
import WorkFlowBuilderIcon from '../src/ui/agent-avatar/generated-avatars/assets/workflow-builder';

const ComponentNameRenderer = ({ children, name }: { children: ReactNode; name: string }) => {
	return (
		<Flex direction="column" gap="space.100" alignItems="center">
			{children}
			<Text>{name}</Text>
		</Flex>
	);
};

export default () => {
	const [size, setSize] = useState(AVATAR_SIZES.xxlarge);
	const [color, setColor] = useState(greenColor);
	return (
		<Box>
			<Flex gap="space.200" xcss={marginBottom}>
				<Select
					onChange={(option) => {
						if (option != null) {
							setSize(Number(option.value));
						}
					}}
					options={[
						{ label: 'X-small', value: AVATAR_SIZES.xsmall.toString() },
						{ label: 'Small', value: AVATAR_SIZES.small.toString() },
						{ label: 'Medium', value: AVATAR_SIZES.medium.toString() },
						{ label: 'Large', value: AVATAR_SIZES.large.toString() },
						{ label: 'X-large', value: AVATAR_SIZES.xlarge.toString() },
						{ label: 'XX-large', value: AVATAR_SIZES.xxlarge.toString() },
					]}
					placeholder="Choose a size"
				/>
				<Select
					onChange={(option) => {
						if (option != null) {
							setColor(JSON.parse(option.value));
						}
					}}
					options={[
						{ label: 'Yellow', value: JSON.stringify(yellowColor) },
						{ label: 'Purple', value: JSON.stringify(purpleColor) },
						{ label: 'Green', value: JSON.stringify(greenColor) },
						{ label: 'Blue', value: JSON.stringify(blueColor) },
					]}
					placeholder="Choose a color"
				/>
			</Flex>
			<Flex gap="space.400" wrap="wrap">
				<ComponentNameRenderer name="AutoDevIcon">
					<AutoDevIcon size={size} primaryColor={color.primary} secondaryColor={color.secondary} />
				</ComponentNameRenderer>
				<ComponentNameRenderer name="AutoFixIcon">
					<AutoFixIcon size={size} primaryColor={color.primary} secondaryColor={color.secondary} />
				</ComponentNameRenderer>
				<ComponentNameRenderer name="AutoReviewIcon">
					<AutoReviewIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="BacklogBuddyIcon">
					<BacklogBuddyIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="CommsCrafterIcon">
					<CommsCrafterIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="CultureIcon">
					<CultureIcon size={size} primaryColor={color.primary} secondaryColor={color.secondary} />
				</ComponentNameRenderer>
				<ComponentNameRenderer name="CustomerInsightIcon">
					<CustomerInsightIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="CustomerInsightIcon">
					<CustomerInsightIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="DecisionDirectorIcon">
					<DecisionDirectorIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="FeatureFlagAvatarIcon">
					<FeatureFlagAvatarIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="GenericAvatarIcon">
					<GenericAvatarIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="HireWriterIcon">
					<HireWriterIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="MarketingMessageMaestroIcon">
					<MarketingMessageMaestroIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="MyUserManualIcon">
					<MyUserManualIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="OkrOracleIcon">
					<OkrOracleIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="OpsAgentIcon">
					<OpsAgentIcon size={size} primaryColor={color.primary} secondaryColor={color.secondary} />
				</ComponentNameRenderer>
				<ComponentNameRenderer name="PitchPerfectorIcon">
					<PitchPerfectorIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="ProductRequirementIcon">
					<ProductRequirementIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="ReleaseNoteIcon">
					<ReleaseNoteIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="ResearchScoutIcon">
					<ResearchScoutIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="SocialMediaScribeIcon">
					<SocialMediaScribeIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="TeamConnectionIcon">
					<TeamConnectionIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
				<ComponentNameRenderer name="WorkFlowBuilderIcon">
					<WorkFlowBuilderIcon
						size={size}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				</ComponentNameRenderer>
			</Flex>
		</Box>
	);
};

const marginBottom = xcss({
	marginBottom: 'space.200',
});
