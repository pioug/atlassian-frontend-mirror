import { type ComponentType } from 'react';

import {
	AdminIcon,
	AdminLogo,
	AlignIcon,
	AlignLogo,
	AnalyticsIcon,
	AnalyticsLogo,
	AssetsIcon,
	AssetsLogo,
	AtlasIcon,
	AtlasLogo,
	AtlassianAccessIcon,
	AtlassianAccessLogo,
	AtlassianAdminIcon,
	AtlassianAdministrationIcon,
	AtlassianAdministrationLogo,
	AtlassianAdminLogo,
	AtlassianAnalyticsIcon,
	AtlassianAnalyticsLogo,
	AtlassianIcon,
	AtlassianLogo,
	AtlassianMarketplaceIcon,
	AtlassianMarketplaceLogo,
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
	JiraSoftwareIcon,
	JiraSoftwareLogo,
	JiraWorkManagementIcon,
	JiraWorkManagementLogo,
	type LogoProps,
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
import { logoDocsSchema } from '../../src/logo-config';

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

export const logos = logoMap.map(({ logo }) => logo);
export const icons = logoMap.map(({ icon }) => icon);

/**
 * Helper function to find logo schema by name
 */
const getLogoSchema = (name: string) =>
	logoDocsSchema.find(({ name: logoName }) => logoName === name);

/**
 * Filters logos by type and excludes deprecated ones
 */
const filterByType = (type: 'legacy' | 'migration' | 'new') =>
	logoMap.filter(({ name }) => {
		const logo = getLogoSchema(name);
		return logo?.type === type && !logo?.deprecated;
	});

export const legacyOnlyLogosAndIcons = filterByType('legacy');
export const migrationLogosAndIcons = filterByType('migration');
export const newOnlyLogosAndIcons = filterByType('new');

export const deprecatedLogos = logoMap.filter(({ name }) => {
	const logo = getLogoSchema(name);
	return logo?.deprecated;
});

export const logosAndIcons = logoMap.sort((a, b) => {
	const aIndex = logoDocsSchema.findIndex(({ name: logoName }) => logoName === a.name);
	const bIndex = logoDocsSchema.findIndex(({ name: logoName }) => logoName === b.name);
	return aIndex - bIndex;
});

export const appearances: LogoProps['appearance'][] = ['brand', 'neutral', 'inverse'];
