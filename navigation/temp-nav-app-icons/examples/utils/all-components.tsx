/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::403e6146855def362088639438f524b5>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { AdminIcon, AdminLogo } from '@atlaskit/temp-nav-app-icons/admin';
import { AlignIcon, AlignLogo } from '@atlaskit/temp-nav-app-icons/align';
import { AnalyticsIcon, AnalyticsLogo } from '@atlaskit/temp-nav-app-icons/analytics';
import { AssetsIcon, AssetsLogo } from '@atlaskit/temp-nav-app-icons/assets';
import { BitbucketIcon, BitbucketLogo } from '@atlaskit/temp-nav-app-icons/bitbucket';
import { ChatIcon, ChatLogo } from '@atlaskit/temp-nav-app-icons/chat';
import { CompanyHubIcon, CompanyHubLogo } from '@atlaskit/temp-nav-app-icons/company-hub';
import { CompassIcon, CompassLogo } from '@atlaskit/temp-nav-app-icons/compass';
import { ConfluenceIcon, ConfluenceLogo } from '@atlaskit/temp-nav-app-icons/confluence';
import { CustomLinkIcon } from '@atlaskit/temp-nav-app-icons/custom-link';
import { FocusIcon, FocusLogo } from '@atlaskit/temp-nav-app-icons/focus';
import { GoalsIcon, GoalsLogo } from '@atlaskit/temp-nav-app-icons/goals';
import { GuardIcon, GuardLogo } from '@atlaskit/temp-nav-app-icons/guard';
import { GuardDetectIcon, GuardDetectLogo } from '@atlaskit/temp-nav-app-icons/guard-detect';
import { HomeIcon, HomeLogo } from '@atlaskit/temp-nav-app-icons/home';
import { JiraIcon, JiraLogo } from '@atlaskit/temp-nav-app-icons/jira';
import {
	JiraProductDiscoveryIcon,
	JiraProductDiscoveryLogo,
} from '@atlaskit/temp-nav-app-icons/jira-product-discovery';
import {
	JiraServiceManagementIcon,
	JiraServiceManagementLogo,
} from '@atlaskit/temp-nav-app-icons/jira-service-management';
import { LoomIcon, LoomLogo } from '@atlaskit/temp-nav-app-icons/loom';
import { MoreAtlassianAppsIcon } from '@atlaskit/temp-nav-app-icons/more-atlassian-apps';
import { OpsgenieIcon, OpsgenieLogo } from '@atlaskit/temp-nav-app-icons/opsgenie';
import { ProjectsIcon, ProjectsLogo } from '@atlaskit/temp-nav-app-icons/projects';
import { RovoIcon, RovoLogo } from '@atlaskit/temp-nav-app-icons/rovo';
import { SearchIcon, SearchLogo } from '@atlaskit/temp-nav-app-icons/search';
import { StatuspageIcon, StatuspageLogo } from '@atlaskit/temp-nav-app-icons/statuspage';
import { StudioIcon, StudioLogo } from '@atlaskit/temp-nav-app-icons/studio';
import { TalentIcon, TalentLogo } from '@atlaskit/temp-nav-app-icons/talent';
import { TeamsIcon, TeamsLogo } from '@atlaskit/temp-nav-app-icons/teams';
import { TrelloIcon, TrelloLogo } from '@atlaskit/temp-nav-app-icons/trello';

import { AppIconProps, AppLogoProps } from '../../src/utils/types';

export const rows: Array<{
	name: string;
	Icon20: React.ComponentType<AppIconProps>;
	Icon24: React.ComponentType<AppIconProps>;
	Icon32: React.ComponentType<AppIconProps>;
	Logo: React.ComponentType<AppLogoProps> | null;
}> = [
	{
		name: 'Admin',
		Icon20: (props: any) => <AdminIcon {...props} size="20" />,
		Icon24: (props: any) => <AdminIcon {...props} size="24" />,
		Icon32: (props: any) => <AdminIcon {...props} size="32" />,
		Logo: () => <AdminLogo />,
	},
	{
		name: 'Align',
		Icon20: (props: any) => <AlignIcon {...props} size="20" />,
		Icon24: (props: any) => <AlignIcon {...props} size="24" />,
		Icon32: (props: any) => <AlignIcon {...props} size="32" />,
		Logo: () => <AlignLogo />,
	},
	{
		name: 'Analytics',
		Icon20: (props: any) => <AnalyticsIcon {...props} size="20" />,
		Icon24: (props: any) => <AnalyticsIcon {...props} size="24" />,
		Icon32: (props: any) => <AnalyticsIcon {...props} size="32" />,
		Logo: () => <AnalyticsLogo />,
	},
	{
		name: 'Assets',
		Icon20: (props: any) => <AssetsIcon {...props} size="20" />,
		Icon24: (props: any) => <AssetsIcon {...props} size="24" />,
		Icon32: (props: any) => <AssetsIcon {...props} size="32" />,
		Logo: () => <AssetsLogo />,
	},
	{
		name: 'Bitbucket',
		Icon20: (props: any) => <BitbucketIcon {...props} size="20" />,
		Icon24: (props: any) => <BitbucketIcon {...props} size="24" />,
		Icon32: (props: any) => <BitbucketIcon {...props} size="32" />,
		Logo: () => <BitbucketLogo />,
	},
	{
		name: 'Chat',
		Icon20: (props: any) => <ChatIcon {...props} size="20" />,
		Icon24: (props: any) => <ChatIcon {...props} size="24" />,
		Icon32: (props: any) => <ChatIcon {...props} size="32" />,
		Logo: () => <ChatLogo />,
	},
	{
		name: 'Company Hub',
		Icon20: (props: any) => <CompanyHubIcon {...props} size="20" />,
		Icon24: (props: any) => <CompanyHubIcon {...props} size="24" />,
		Icon32: (props: any) => <CompanyHubIcon {...props} size="32" />,
		Logo: () => <CompanyHubLogo />,
	},
	{
		name: 'Compass',
		Icon20: (props: any) => <CompassIcon {...props} size="20" />,
		Icon24: (props: any) => <CompassIcon {...props} size="24" />,
		Icon32: (props: any) => <CompassIcon {...props} size="32" />,
		Logo: () => <CompassLogo />,
	},
	{
		name: 'Confluence',
		Icon20: (props: any) => <ConfluenceIcon {...props} size="20" />,
		Icon24: (props: any) => <ConfluenceIcon {...props} size="24" />,
		Icon32: (props: any) => <ConfluenceIcon {...props} size="32" />,
		Logo: () => <ConfluenceLogo />,
	},
	{
		name: 'Focus',
		Icon20: (props: any) => <FocusIcon {...props} size="20" />,
		Icon24: (props: any) => <FocusIcon {...props} size="24" />,
		Icon32: (props: any) => <FocusIcon {...props} size="32" />,
		Logo: () => <FocusLogo />,
	},
	{
		name: 'Goals',
		Icon20: (props: any) => <GoalsIcon {...props} size="20" />,
		Icon24: (props: any) => <GoalsIcon {...props} size="24" />,
		Icon32: (props: any) => <GoalsIcon {...props} size="32" />,
		Logo: () => <GoalsLogo />,
	},
	{
		name: 'Guard Detect',
		Icon20: (props: any) => <GuardDetectIcon {...props} size="20" />,
		Icon24: (props: any) => <GuardDetectIcon {...props} size="24" />,
		Icon32: (props: any) => <GuardDetectIcon {...props} size="32" />,
		Logo: () => <GuardDetectLogo />,
	},
	{
		name: 'Guard',
		Icon20: (props: any) => <GuardIcon {...props} size="20" />,
		Icon24: (props: any) => <GuardIcon {...props} size="24" />,
		Icon32: (props: any) => <GuardIcon {...props} size="32" />,
		Logo: () => <GuardLogo />,
	},
	{
		name: 'Home',
		Icon20: (props: any) => <HomeIcon {...props} size="20" />,
		Icon24: (props: any) => <HomeIcon {...props} size="24" />,
		Icon32: (props: any) => <HomeIcon {...props} size="32" />,
		Logo: () => <HomeLogo />,
	},
	{
		name: 'Jira Product Discovery',
		Icon20: (props: any) => <JiraProductDiscoveryIcon {...props} size="20" />,
		Icon24: (props: any) => <JiraProductDiscoveryIcon {...props} size="24" />,
		Icon32: (props: any) => <JiraProductDiscoveryIcon {...props} size="32" />,
		Logo: () => <JiraProductDiscoveryLogo />,
	},
	{
		name: 'Jira Service Management',
		Icon20: (props: any) => <JiraServiceManagementIcon {...props} size="20" />,
		Icon24: (props: any) => <JiraServiceManagementIcon {...props} size="24" />,
		Icon32: (props: any) => <JiraServiceManagementIcon {...props} size="32" />,
		Logo: () => <JiraServiceManagementLogo />,
	},
	{
		name: 'Jira',
		Icon20: (props: any) => <JiraIcon {...props} size="20" />,
		Icon24: (props: any) => <JiraIcon {...props} size="24" />,
		Icon32: (props: any) => <JiraIcon {...props} size="32" />,
		Logo: () => <JiraLogo />,
	},
	{
		name: 'Loom',
		Icon20: (props: any) => <LoomIcon {...props} size="20" />,
		Icon24: (props: any) => <LoomIcon {...props} size="24" />,
		Icon32: (props: any) => <LoomIcon {...props} size="32" />,
		Logo: () => <LoomLogo />,
	},
	{
		name: 'Opsgenie',
		Icon20: (props: any) => <OpsgenieIcon {...props} size="20" />,
		Icon24: (props: any) => <OpsgenieIcon {...props} size="24" />,
		Icon32: (props: any) => <OpsgenieIcon {...props} size="32" />,
		Logo: () => <OpsgenieLogo />,
	},
	{
		name: 'Projects',
		Icon20: (props: any) => <ProjectsIcon {...props} size="20" />,
		Icon24: (props: any) => <ProjectsIcon {...props} size="24" />,
		Icon32: (props: any) => <ProjectsIcon {...props} size="32" />,
		Logo: () => <ProjectsLogo />,
	},
	{
		name: 'Rovo',
		Icon20: (props: any) => <RovoIcon {...props} size="20" />,
		Icon24: (props: any) => <RovoIcon {...props} size="24" />,
		Icon32: (props: any) => <RovoIcon {...props} size="32" />,
		Logo: () => <RovoLogo />,
	},
	{
		name: 'Search',
		Icon20: (props: any) => <SearchIcon {...props} size="20" />,
		Icon24: (props: any) => <SearchIcon {...props} size="24" />,
		Icon32: (props: any) => <SearchIcon {...props} size="32" />,
		Logo: () => <SearchLogo />,
	},
	{
		name: 'Statuspage',
		Icon20: (props: any) => <StatuspageIcon {...props} size="20" />,
		Icon24: (props: any) => <StatuspageIcon {...props} size="24" />,
		Icon32: (props: any) => <StatuspageIcon {...props} size="32" />,
		Logo: () => <StatuspageLogo />,
	},
	{
		name: 'Studio',
		Icon20: (props: any) => <StudioIcon {...props} size="20" />,
		Icon24: (props: any) => <StudioIcon {...props} size="24" />,
		Icon32: (props: any) => <StudioIcon {...props} size="32" />,
		Logo: () => <StudioLogo />,
	},
	{
		name: 'Talent',
		Icon20: (props: any) => <TalentIcon {...props} size="20" />,
		Icon24: (props: any) => <TalentIcon {...props} size="24" />,
		Icon32: (props: any) => <TalentIcon {...props} size="32" />,
		Logo: () => <TalentLogo />,
	},
	{
		name: 'Teams',
		Icon20: (props: any) => <TeamsIcon {...props} size="20" />,
		Icon24: (props: any) => <TeamsIcon {...props} size="24" />,
		Icon32: (props: any) => <TeamsIcon {...props} size="32" />,
		Logo: () => <TeamsLogo />,
	},
	{
		name: 'Trello',
		Icon20: (props: any) => <TrelloIcon {...props} size="20" />,
		Icon24: (props: any) => <TrelloIcon {...props} size="24" />,
		Icon32: (props: any) => <TrelloIcon {...props} size="32" />,
		Logo: () => <TrelloLogo />,
	},
	{
		name: 'Custom Link',
		Icon20: (props: any) => <CustomLinkIcon {...props} size="20" label="Custom Link" />,
		Icon24: (props: any) => <CustomLinkIcon {...props} size="24" label="Custom Link" />,
		Icon32: (props: any) => <CustomLinkIcon {...props} size="32" label="Custom Link" />,
		Logo: null,
	},
	{
		name: 'More Atlassian Apps',
		Icon20: (props: any) => (
			<MoreAtlassianAppsIcon {...props} size="20" label="More Atlassian Apps" />
		),
		Icon24: (props: any) => (
			<MoreAtlassianAppsIcon {...props} size="24" label="More Atlassian Apps" />
		),
		Icon32: (props: any) => (
			<MoreAtlassianAppsIcon {...props} size="32" label="More Atlassian Apps" />
		),
		Logo: null,
	},
];
