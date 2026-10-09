import { type ComponentType } from 'react';

import {
	AdminIcon,
	AdminIcon as AtlassianAdminIcon,
	AdminIcon as AtlassianAdministrationIcon,
} from '@atlaskit/logo/admin/icon';
import {
	AdminLogoCS as AdminLogo,
	AdminLogoCS as AtlassianAdministrationLogo,
	AdminLogoCS as AtlassianAdminLogo,
} from '@atlaskit/logo/admin/logo';
import { AlignIcon, AlignIcon as JiraAlignIcon } from '@atlaskit/logo/align/icon';
import { AlignLogoCS as AlignLogo, AlignLogoCS as JiraAlignLogo } from '@atlaskit/logo/align/logo';
import {
	AnalyticsIcon,
	AnalyticsIcon as AtlassianAnalyticsIcon,
} from '@atlaskit/logo/analytics/icon';
import {
	AnalyticsLogoCS as AnalyticsLogo,
	AnalyticsLogoCS as AtlassianAnalyticsLogo,
} from '@atlaskit/logo/analytics/logo';
import { ArtifactsIcon } from '@atlaskit/logo/artifacts/icon';
import { ArtifactsLogo } from '@atlaskit/logo/artifacts/logo';
import { AssetsIcon } from '@atlaskit/logo/assets/icon';
import { AssetsLogoCS as AssetsLogo } from '@atlaskit/logo/assets/logo';
import { AtlasIcon } from '@atlaskit/logo/atlas-icon';
import { AtlassianAccessIcon } from '@atlaskit/logo/atlassian-access/icon';
import { AtlassianAccessLogo } from '@atlaskit/logo/atlassian-access/logo';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianMarketplaceIcon } from '@atlaskit/logo/atlassian-marketplace/icon';
import { AtlassianMarketplaceLogo } from '@atlaskit/logo/atlassian-marketplace/logo';
import { AtlassianLogo } from '@atlaskit/logo/atlassian/logo';
import { BambooIcon } from '@atlaskit/logo/bamboo/icon';
import { BambooLogoCS as BambooLogo } from '@atlaskit/logo/bamboo/logo';
import { BitbucketDataCenterIcon } from '@atlaskit/logo/bitbucket-data-center/icon';
import { BitbucketDataCenterLogoCS as BitbucketDataCenterLogo } from '@atlaskit/logo/bitbucket-data-center/logo';
import { BitbucketIcon } from '@atlaskit/logo/bitbucket-icon';
import { BitbucketLogoCS as BitbucketLogo } from '@atlaskit/logo/bitbucket/logo';
import { ChatIcon } from '@atlaskit/logo/chat/icon';
import { ChatLogoCS as ChatLogo } from '@atlaskit/logo/chat/logo';
import { CompassIcon } from '@atlaskit/logo/compass/icon';
import { CompassLogoCS as CompassLogo } from '@atlaskit/logo/compass/logo';
import { ConfluenceDataCenterIcon } from '@atlaskit/logo/confluence-data-center/icon';
import { ConfluenceDataCenterLogoCS as ConfluenceDataCenterLogo } from '@atlaskit/logo/confluence-data-center/logo';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { ConfluenceLogoCS as ConfluenceLogo } from '@atlaskit/logo/confluence/logo';
import { CrowdIcon } from '@atlaskit/logo/crowd/icon';
import { CrowdLogoCS as CrowdLogo } from '@atlaskit/logo/crowd/logo';
import { CustomerServiceManagementIcon } from '@atlaskit/logo/customer-service-management/icon';
import { CustomerServiceManagementLogoCS as CustomerServiceManagementLogo } from '@atlaskit/logo/customer-service-management/logo';
import { DxIcon } from '@atlaskit/logo/dx/icon';
import { FeedbackIcon } from '@atlaskit/logo/feedback/icon';
import { FeedbackLogoCS as FeedbackLogo } from '@atlaskit/logo/feedback/logo';
import { FocusIcon } from '@atlaskit/logo/focus/icon';
import { FocusLogoCS as FocusLogo } from '@atlaskit/logo/focus/logo';
import { GoalsIcon } from '@atlaskit/logo/goals/icon';
import { GoalsLogoCS as GoalsLogo } from '@atlaskit/logo/goals/logo';
import { GuardIcon } from '@atlaskit/logo/guard/icon';
import { GuardLogoCS as GuardLogo } from '@atlaskit/logo/guard/logo';
import { HomeIcon } from '@atlaskit/logo/home/icon';
import { HomeLogoCS as HomeLogo } from '@atlaskit/logo/home/logo';
import { HubIcon } from '@atlaskit/logo/hub/icon';
import { HubLogoCS as HubLogo } from '@atlaskit/logo/hub/logo';
import { InsightsIcon } from '@atlaskit/logo/insights/icon';
import { InsightsLogo } from '@atlaskit/logo/insights/logo';
import { JiraCodingAgentIcon } from '@atlaskit/logo/jira-coding-agent/icon';
import { JiraDataCenterIcon } from '@atlaskit/logo/jira-data-center/icon';
import { JiraDataCenterLogoCS as JiraDataCenterLogo } from '@atlaskit/logo/jira-data-center/logo';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraProductDiscoveryIcon } from '@atlaskit/logo/jira-product-discovery/icon';
import { JiraProductDiscoveryLogoCS as JiraProductDiscoveryLogo } from '@atlaskit/logo/jira-product-discovery/logo';
import { JiraServiceManagementDataCenterIcon } from '@atlaskit/logo/jira-service-management-data-center/icon';
import { JiraServiceManagementDataCenterLogoCS as JiraServiceManagementDataCenterLogo } from '@atlaskit/logo/jira-service-management-data-center/logo';
import { JiraServiceManagementIcon } from '@atlaskit/logo/jira-service-management-icon';
import { JiraServiceManagementLogoCS as JiraServiceManagementLogo } from '@atlaskit/logo/jira-service-management/logo';
import { JiraSoftwareIcon } from '@atlaskit/logo/jira-software-icon';
import { JiraSoftwareLogo } from '@atlaskit/logo/jira-software/logo';
import { JiraWorkManagementIcon } from '@atlaskit/logo/jira-work-management/icon';
import { JiraWorkManagementLogo } from '@atlaskit/logo/jira-work-management/logo';
import { JiraLogoCS as JiraLogo } from '@atlaskit/logo/jira/logo';
import { AtlasLogo } from '@atlaskit/logo/logo';
import { LoomAttributionLogoCS as LoomAttributionLogo } from '@atlaskit/logo/loom-attribution/logo';
import { LoomInternalIcon as LoomBlurpleIcon } from '@atlaskit/logo/loom-internal/icon';
import { LoomInternalLogoCS as LoomBlurpleLogo } from '@atlaskit/logo/loom-internal/logo';
import { LoomIcon as LoomAttributionIcon, LoomIcon } from '@atlaskit/logo/loom/icon';
import { LoomLogoCS as LoomLogo } from '@atlaskit/logo/loom/logo';
import { OpsgenieIcon } from '@atlaskit/logo/opsgenie-icon';
import { OpsgenieLogoCS as OpsgenieLogo } from '@atlaskit/logo/opsgenie/logo';
import { ProjectsIcon } from '@atlaskit/logo/projects/icon';
import { ProjectsLogoCS as ProjectsLogo } from '@atlaskit/logo/projects/logo';
import { RovoDevAgentIcon } from '@atlaskit/logo/rovo-dev-agent/icon';
import { RovoDevAgentLogoCS as RovoDevAgentLogo } from '@atlaskit/logo/rovo-dev-agent/logo';
import { RovoDevIcon } from '@atlaskit/logo/rovo-dev/icon';
import { RovoDevLogoCS as RovoDevLogo } from '@atlaskit/logo/rovo-dev/logo';
import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import { RovoLogoCS as RovoLogo } from '@atlaskit/logo/rovo/logo';
import { SearchIcon } from '@atlaskit/logo/search/icon';
import { SearchLogoCS as SearchLogo } from '@atlaskit/logo/search/logo';
import { StatuspageIcon } from '@atlaskit/logo/statuspage-icon';
import { StatuspageLogoCS as StatuspageLogo } from '@atlaskit/logo/statuspage/logo';
import { StudioIcon } from '@atlaskit/logo/studio/icon';
import { StudioLogoCS as StudioLogo } from '@atlaskit/logo/studio/logo';
import { TalentIcon } from '@atlaskit/logo/talent/icon';
import { TalentLogoCS as TalentLogo } from '@atlaskit/logo/talent/logo';
import { TeamsIcon } from '@atlaskit/logo/teams/icon';
import { TeamsLogoCS as TeamsLogo } from '@atlaskit/logo/teams/logo';
import { TrelloIcon } from '@atlaskit/logo/trello-icon';
import { TrelloLogoCS as TrelloLogo } from '@atlaskit/logo/trello/logo';
import type { LogoProps } from '@atlaskit/logo/types';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { logoDocsSchema } from '../../src/logo-docs-schema';

const logoMap: {
	name: (typeof logoDocsSchema)[number]['name'];
	logo: ComponentType<LogoProps>;
	icon: ComponentType<LogoProps>;
}[] = [
	// Program logos
	{ name: 'atlassian', logo: AtlassianLogo, icon: AtlassianIcon },
	{ name: 'atlassian-access', logo: AtlassianAccessLogo, icon: AtlassianAccessIcon },
	{ name: 'atlassian-marketplace', logo: AtlassianMarketplaceLogo, icon: AtlassianMarketplaceIcon },
	// App logos
	{ name: 'home', logo: HomeLogo, icon: HomeIcon },
	{ name: 'hub', logo: HubLogo, icon: HubIcon },
	{ name: 'confluence', logo: ConfluenceLogo, icon: ConfluenceIcon },
	{ name: 'jira', logo: JiraLogo, icon: JiraIcon },
	{ name: 'loom', logo: LoomLogo, icon: LoomIcon },
	{ name: 'loom-blurple', logo: LoomBlurpleLogo, icon: LoomBlurpleIcon },
	{ name: 'loom-attribution', logo: LoomAttributionLogo, icon: LoomAttributionIcon },
	{ name: 'rovo', logo: RovoLogo, icon: RovoIcon },
	{ name: 'align', logo: AlignLogo, icon: AlignIcon },
	{ name: 'focus', logo: FocusLogo, icon: FocusIcon },
	{ name: 'talent', logo: TalentLogo, icon: TalentIcon },
	{
		name: 'jira-product-discovery',
		logo: JiraProductDiscoveryLogo,
		icon: JiraProductDiscoveryIcon,
	},
	{ name: 'bitbucket', logo: BitbucketLogo, icon: BitbucketIcon },
	{ name: 'compass', logo: CompassLogo, icon: CompassIcon },
	{ name: 'dx', logo: DxIcon, icon: DxIcon },
	{ name: 'rovo-dev', logo: RovoDevLogo, icon: RovoDevIcon },
	{
		name: 'rovo-dev-agent',
		logo: RovoDevAgentLogo,
		icon: RovoDevAgentIcon,
	},
	{ name: 'jira-coding-agent', logo: JiraCodingAgentIcon, icon: JiraCodingAgentIcon },
	{
		name: 'jira-service-management',
		logo: JiraServiceManagementLogo,
		icon: JiraServiceManagementIcon,
	},
	{ name: 'artifacts', logo: ArtifactsLogo, icon: ArtifactsIcon },
	{ name: 'assets', logo: AssetsLogo, icon: AssetsIcon },
	{
		name: 'customer-service-management',
		logo: CustomerServiceManagementLogo,
		icon: CustomerServiceManagementIcon,
	},
	{ name: 'opsgenie', logo: OpsgenieLogo, icon: OpsgenieIcon },
	{ name: 'statuspage', logo: StatuspageLogo, icon: StatuspageIcon },
	{ name: 'trello', logo: TrelloLogo, icon: TrelloIcon },
	{ name: 'admin', logo: AdminLogo, icon: AdminIcon },
	{ name: 'analytics', logo: AnalyticsLogo, icon: AnalyticsIcon },
	{ name: 'insights', logo: InsightsLogo, icon: InsightsIcon },
	{ name: 'chat', logo: ChatLogo, icon: ChatIcon },
	{ name: 'feedback', logo: FeedbackLogo, icon: FeedbackIcon },
	{ name: 'goals', logo: GoalsLogo, icon: GoalsIcon },
	{ name: 'guard', logo: GuardLogo, icon: GuardIcon },
	{ name: 'projects', logo: ProjectsLogo, icon: ProjectsIcon },
	{ name: 'search', logo: SearchLogo, icon: SearchIcon },
	{ name: 'studio', logo: StudioLogo, icon: StudioIcon },
	{ name: 'teams', logo: TeamsLogo, icon: TeamsIcon },
	{ name: 'jira-data-center', logo: JiraDataCenterLogo, icon: JiraDataCenterIcon },
	{
		name: 'jira-service-management-data-center',
		logo: JiraServiceManagementDataCenterLogo,
		icon: JiraServiceManagementDataCenterIcon,
	},
	{
		name: 'confluence-data-center',
		logo: ConfluenceDataCenterLogo,
		icon: ConfluenceDataCenterIcon,
	},
	{ name: 'bitbucket-data-center', logo: BitbucketDataCenterLogo, icon: BitbucketDataCenterIcon },
	{ name: 'bamboo', logo: BambooLogo, icon: BambooIcon },
	{ name: 'crowd', logo: CrowdLogo, icon: CrowdIcon },
	// Deprecated logos
	{
		name: 'atlassian-administration',
		logo: AtlassianAdministrationLogo,
		icon: AtlassianAdministrationIcon,
	},
	{ name: 'atlassian-admin', logo: AtlassianAdminLogo, icon: AtlassianAdminIcon },
	{ name: 'atlassian-analytics', logo: AtlassianAnalyticsLogo, icon: AtlassianAnalyticsIcon },
	// @ts-ignore Atlas icon has slightly different types
	{ name: 'atlas', logo: AtlasLogo, icon: AtlasIcon },
	{ name: 'jira-software', logo: JiraSoftwareLogo, icon: JiraSoftwareIcon },
	{ name: 'jira-align', logo: JiraAlignLogo, icon: JiraAlignIcon },
	{ name: 'jira-work-management', logo: JiraWorkManagementLogo, icon: JiraWorkManagementIcon },
];

export const logos: ComponentType<{
	size?: 'small' | 'large' | 'medium' | 'xlarge' | 'xsmall' | 'xxsmall';
	appearance?: 'brand' | 'neutral' | 'inverse';
	textColor?: string;
	iconColor?: string;
	label?: string;
	testId?: string;
}>[] = logoMap.map(({ logo }) => logo);
export const icons: ComponentType<{
	size?: 'small' | 'large' | 'medium' | 'xlarge' | 'xsmall' | 'xxsmall';
	appearance?: 'brand' | 'neutral' | 'inverse';
	textColor?: string;
	iconColor?: string;
	label?: string;
	testId?: string;
}>[] = logoMap.map(({ icon }) => icon);

/**
 * Helper function to find logo schema by name
 */
const getLogoSchema = (name: string) =>
	logoDocsSchema.find(({ name: logoName }) => logoName === name);

/**
 * Filters logos by type and excludes deprecated ones
 */
const filterByType = (type: 'legacy' | 'migration' | 'new' | 'rovo-hex') =>
	logoMap.filter(({ name }) => {
		const logo = getLogoSchema(name);
		return logo?.type === type && !logo?.deprecated;
	});

export const legacyOnlyLogosAndIcons: {
	name: (typeof logoDocsSchema)[number]['name'];
	logo: ComponentType<LogoProps>;
	icon: ComponentType<LogoProps>;
}[] = filterByType('legacy');
export const migrationLogosAndIcons: {
	name: (typeof logoDocsSchema)[number]['name'];
	logo: ComponentType<LogoProps>;
	icon: ComponentType<LogoProps>;
}[] = filterByType('migration');
export const newOnlyLogosAndIcons: {
	name: (typeof logoDocsSchema)[number]['name'];
	logo: ComponentType<LogoProps>;
	icon: ComponentType<LogoProps>;
}[] = filterByType('new');
export const rovoHexLogosAndIcons: {
	name: (typeof logoDocsSchema)[number]['name'];
	logo: ComponentType<LogoProps>;
	icon: ComponentType<LogoProps>;
}[] = filterByType('rovo-hex');

export const deprecatedLogos: {
	name: (typeof logoDocsSchema)[number]['name'];
	logo: ComponentType<LogoProps>;
	icon: ComponentType<LogoProps>;
}[] = logoMap.filter(({ name }) => {
	const logo = getLogoSchema(name);
	return logo?.deprecated;
});

export const logosAndIcons: {
	name: (typeof logoDocsSchema)[number]['name'];
	logo: ComponentType<LogoProps>;
	icon: ComponentType<LogoProps>;
}[] = logoMap.sort((a, b) => {
	const aIndex = logoDocsSchema.findIndex(({ name: logoName }) => logoName === a.name);
	const bIndex = logoDocsSchema.findIndex(({ name: logoName }) => logoName === b.name);
	return aIndex - bIndex;
});

export const appearances: LogoProps['appearance'][] = ['brand', 'neutral', 'inverse'];
