import { type ComponentType } from 'react';

import { AtlasIcon } from '@atlaskit/logo/atlas-icon';
import { AtlasLogo } from '@atlaskit/logo/logo';
import { AtlassianAccessIcon } from '@atlaskit/logo/atlassian-access/icon';
import { AtlassianAccessLogo } from '@atlaskit/logo/atlassian-access/logo';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianLogo } from '@atlaskit/logo/atlassian/logo';
import { AtlassianMarketplaceIcon } from '@atlaskit/logo/atlassian-marketplace/icon';
import { AtlassianMarketplaceLogo } from '@atlaskit/logo/atlassian-marketplace/logo';
import { JiraSoftwareIcon } from '@atlaskit/logo/jira-software-icon';
import { JiraSoftwareLogo } from '@atlaskit/logo/jira-software/logo';
import { JiraWorkManagementIcon } from '@atlaskit/logo/jira-work-management/icon';
import { JiraWorkManagementLogo } from '@atlaskit/logo/jira-work-management/logo';
import type { LogoProps } from '@atlaskit/logo/types';
import {
	AdminIcon,
	AdminLogo,
	AlignIcon,
	AlignLogo,
	AnalyticsIcon,
	AnalyticsLogo,
	AssetsIcon,
	AssetsLogo,
	AtlassianAdminIcon,
	AtlassianAdministrationIcon,
	AtlassianAdministrationLogo,
	AtlassianAdminLogo,
	AtlassianAnalyticsIcon,
	AtlassianAnalyticsLogo,
	BambooIcon,
	BambooLogo,
	BitbucketDataCenterIcon,
	BitbucketDataCenterLogo,
	BitbucketIcon,
	BitbucketLogo,
	ChatIcon,
	ChatLogo,
	CompassIcon,
	CompassLogo,
	ConfluenceDataCenterIcon,
	ConfluenceDataCenterLogo,
	ConfluenceIcon,
	ConfluenceLogo,
	CrowdIcon,
	CrowdLogo,
	CustomerServiceManagementIcon,
	CustomerServiceManagementLogo,
	DxIcon,
	FeedbackIcon,
	FeedbackLogo,
	FocusIcon,
	FocusLogo,
	GoalsIcon,
	GoalsLogo,
	GuardIcon,
	GuardLogo,
	HomeIcon,
	HomeLogo,
	HubIcon,
	HubLogo,
	JiraAlignIcon,
	JiraAlignLogo,
	JiraCodingAgentIcon,
	JiraDataCenterIcon,
	JiraDataCenterLogo,
	JiraIcon,
	JiraLogo,
	JiraProductDiscoveryIcon,
	JiraProductDiscoveryLogo,
	JiraServiceManagementDataCenterIcon,
	JiraServiceManagementDataCenterLogo,
	JiraServiceManagementIcon,
	JiraServiceManagementLogo,
	LoomAttributionIcon,
	LoomAttributionLogo,
	LoomBlurpleIcon,
	LoomBlurpleLogo,
	LoomIcon,
	LoomLogo,
	OpsgenieIcon,
	OpsgenieLogo,
	ProjectsIcon,
	ProjectsLogo,
	RovoDevAgentIcon,
	RovoDevAgentLogo,
	RovoDevIcon,
	RovoDevLogo,
	RovoIcon,
	RovoLogo,
	SearchIcon,
	SearchLogo,
	StatuspageIcon,
	StatuspageLogo,
	StudioIcon,
	StudioLogo,
	TalentIcon,
	TalentLogo,
	TeamsIcon,
	TeamsLogo,
	TrelloIcon,
	TrelloLogo,
} from '@atlaskit/logo';

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
