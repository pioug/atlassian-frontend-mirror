/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2790c8ccdb9c76b4149452e82c63a555>>
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
import {
	CustomerServiceManagementIcon,
	CustomerServiceManagementLogo,
} from '@atlaskit/temp-nav-app-icons/customer-service-management';
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
import { LoomInternalIcon, LoomInternalLogo } from '@atlaskit/temp-nav-app-icons/loom-internal';
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
		Icon20: (props) => <AdminIcon {...props} size="20" />,
		Icon24: (props) => <AdminIcon {...props} size="24" />,
		Icon32: (props) => <AdminIcon {...props} size="32" />,
		Logo: (props) => <AdminLogo {...props} />,
	},
	{
		name: 'Align',
		Icon20: (props) => <AlignIcon {...props} size="20" />,
		Icon24: (props) => <AlignIcon {...props} size="24" />,
		Icon32: (props) => <AlignIcon {...props} size="32" />,
		Logo: (props) => <AlignLogo {...props} />,
	},
	{
		name: 'Analytics',
		Icon20: (props) => <AnalyticsIcon {...props} size="20" />,
		Icon24: (props) => <AnalyticsIcon {...props} size="24" />,
		Icon32: (props) => <AnalyticsIcon {...props} size="32" />,
		Logo: (props) => <AnalyticsLogo {...props} />,
	},
	{
		name: 'Assets',
		Icon20: (props) => <AssetsIcon {...props} size="20" />,
		Icon24: (props) => <AssetsIcon {...props} size="24" />,
		Icon32: (props) => <AssetsIcon {...props} size="32" />,
		Logo: (props) => <AssetsLogo {...props} />,
	},
	{
		name: 'Bitbucket',
		Icon20: (props) => <BitbucketIcon {...props} size="20" />,
		Icon24: (props) => <BitbucketIcon {...props} size="24" />,
		Icon32: (props) => <BitbucketIcon {...props} size="32" />,
		Logo: (props) => <BitbucketLogo {...props} />,
	},
	{
		name: 'Chat',
		Icon20: (props) => <ChatIcon {...props} size="20" />,
		Icon24: (props) => <ChatIcon {...props} size="24" />,
		Icon32: (props) => <ChatIcon {...props} size="32" />,
		Logo: (props) => <ChatLogo {...props} />,
	},
	{
		name: 'Company Hub',
		Icon20: (props) => <CompanyHubIcon {...props} size="20" />,
		Icon24: (props) => <CompanyHubIcon {...props} size="24" />,
		Icon32: (props) => <CompanyHubIcon {...props} size="32" />,
		Logo: (props) => <CompanyHubLogo {...props} />,
	},
	{
		name: 'Compass',
		Icon20: (props) => <CompassIcon {...props} size="20" />,
		Icon24: (props) => <CompassIcon {...props} size="24" />,
		Icon32: (props) => <CompassIcon {...props} size="32" />,
		Logo: (props) => <CompassLogo {...props} />,
	},
	{
		name: 'Confluence',
		Icon20: (props) => <ConfluenceIcon {...props} size="20" />,
		Icon24: (props) => <ConfluenceIcon {...props} size="24" />,
		Icon32: (props) => <ConfluenceIcon {...props} size="32" />,
		Logo: (props) => <ConfluenceLogo {...props} />,
	},
	{
		name: 'Customer Service Management',
		Icon20: (props) => <CustomerServiceManagementIcon {...props} size="20" />,
		Icon24: (props) => <CustomerServiceManagementIcon {...props} size="24" />,
		Icon32: (props) => <CustomerServiceManagementIcon {...props} size="32" />,
		Logo: (props) => <CustomerServiceManagementLogo {...props} />,
	},
	{
		name: 'Focus',
		Icon20: (props) => <FocusIcon {...props} size="20" />,
		Icon24: (props) => <FocusIcon {...props} size="24" />,
		Icon32: (props) => <FocusIcon {...props} size="32" />,
		Logo: (props) => <FocusLogo {...props} />,
	},
	{
		name: 'Goals',
		Icon20: (props) => <GoalsIcon {...props} size="20" />,
		Icon24: (props) => <GoalsIcon {...props} size="24" />,
		Icon32: (props) => <GoalsIcon {...props} size="32" />,
		Logo: (props) => <GoalsLogo {...props} />,
	},
	{
		name: 'Guard Detect',
		Icon20: (props) => <GuardDetectIcon {...props} size="20" />,
		Icon24: (props) => <GuardDetectIcon {...props} size="24" />,
		Icon32: (props) => <GuardDetectIcon {...props} size="32" />,
		Logo: (props) => <GuardDetectLogo {...props} />,
	},
	{
		name: 'Guard',
		Icon20: (props) => <GuardIcon {...props} size="20" />,
		Icon24: (props) => <GuardIcon {...props} size="24" />,
		Icon32: (props) => <GuardIcon {...props} size="32" />,
		Logo: (props) => <GuardLogo {...props} />,
	},
	{
		name: 'Home',
		Icon20: (props) => <HomeIcon {...props} size="20" />,
		Icon24: (props) => <HomeIcon {...props} size="24" />,
		Icon32: (props) => <HomeIcon {...props} size="32" />,
		Logo: (props) => <HomeLogo {...props} />,
	},
	{
		name: 'Jira Product Discovery',
		Icon20: (props) => <JiraProductDiscoveryIcon {...props} size="20" />,
		Icon24: (props) => <JiraProductDiscoveryIcon {...props} size="24" />,
		Icon32: (props) => <JiraProductDiscoveryIcon {...props} size="32" />,
		Logo: (props) => <JiraProductDiscoveryLogo {...props} />,
	},
	{
		name: 'Jira Service Management',
		Icon20: (props) => <JiraServiceManagementIcon {...props} size="20" />,
		Icon24: (props) => <JiraServiceManagementIcon {...props} size="24" />,
		Icon32: (props) => <JiraServiceManagementIcon {...props} size="32" />,
		Logo: (props) => <JiraServiceManagementLogo {...props} />,
	},
	{
		name: 'Jira',
		Icon20: (props) => <JiraIcon {...props} size="20" />,
		Icon24: (props) => <JiraIcon {...props} size="24" />,
		Icon32: (props) => <JiraIcon {...props} size="32" />,
		Logo: (props) => <JiraLogo {...props} />,
	},
	{
		name: 'Loom Internal',
		Icon20: (props) => <LoomInternalIcon {...props} size="20" />,
		Icon24: (props) => <LoomInternalIcon {...props} size="24" />,
		Icon32: (props) => <LoomInternalIcon {...props} size="32" />,
		Logo: (props) => <LoomInternalLogo {...props} />,
	},
	{
		name: 'Loom',
		Icon20: (props) => <LoomIcon {...props} size="20" />,
		Icon24: (props) => <LoomIcon {...props} size="24" />,
		Icon32: (props) => <LoomIcon {...props} size="32" />,
		Logo: (props) => <LoomLogo {...props} />,
	},
	{
		name: 'Opsgenie',
		Icon20: (props) => <OpsgenieIcon {...props} size="20" />,
		Icon24: (props) => <OpsgenieIcon {...props} size="24" />,
		Icon32: (props) => <OpsgenieIcon {...props} size="32" />,
		Logo: (props) => <OpsgenieLogo {...props} />,
	},
	{
		name: 'Projects',
		Icon20: (props) => <ProjectsIcon {...props} size="20" />,
		Icon24: (props) => <ProjectsIcon {...props} size="24" />,
		Icon32: (props) => <ProjectsIcon {...props} size="32" />,
		Logo: (props) => <ProjectsLogo {...props} />,
	},
	{
		name: 'Rovo',
		Icon20: (props) => <RovoIcon {...props} size="20" />,
		Icon24: (props) => <RovoIcon {...props} size="24" />,
		Icon32: (props) => <RovoIcon {...props} size="32" />,
		Logo: (props) => <RovoLogo {...props} />,
	},
	{
		name: 'Search',
		Icon20: (props) => <SearchIcon {...props} size="20" />,
		Icon24: (props) => <SearchIcon {...props} size="24" />,
		Icon32: (props) => <SearchIcon {...props} size="32" />,
		Logo: (props) => <SearchLogo {...props} />,
	},
	{
		name: 'Statuspage',
		Icon20: (props) => <StatuspageIcon {...props} size="20" />,
		Icon24: (props) => <StatuspageIcon {...props} size="24" />,
		Icon32: (props) => <StatuspageIcon {...props} size="32" />,
		Logo: (props) => <StatuspageLogo {...props} />,
	},
	{
		name: 'Studio',
		Icon20: (props) => <StudioIcon {...props} size="20" />,
		Icon24: (props) => <StudioIcon {...props} size="24" />,
		Icon32: (props) => <StudioIcon {...props} size="32" />,
		Logo: (props) => <StudioLogo {...props} />,
	},
	{
		name: 'Talent',
		Icon20: (props) => <TalentIcon {...props} size="20" />,
		Icon24: (props) => <TalentIcon {...props} size="24" />,
		Icon32: (props) => <TalentIcon {...props} size="32" />,
		Logo: (props) => <TalentLogo {...props} />,
	},
	{
		name: 'Teams',
		Icon20: (props) => <TeamsIcon {...props} size="20" />,
		Icon24: (props) => <TeamsIcon {...props} size="24" />,
		Icon32: (props) => <TeamsIcon {...props} size="32" />,
		Logo: (props) => <TeamsLogo {...props} />,
	},
	{
		name: 'Trello',
		Icon20: (props) => <TrelloIcon {...props} size="20" />,
		Icon24: (props) => <TrelloIcon {...props} size="24" />,
		Icon32: (props) => <TrelloIcon {...props} size="32" />,
		Logo: (props) => <TrelloLogo {...props} />,
	},
	{
		name: 'Custom Link',
		Icon20: (props) => <CustomLinkIcon {...props} size="20" label="Custom Link" />,
		Icon24: (props) => <CustomLinkIcon {...props} size="24" label="Custom Link" />,
		Icon32: (props) => <CustomLinkIcon {...props} size="32" label="Custom Link" />,
		Logo: null,
	},
	{
		name: 'More Atlassian Apps',
		Icon20: (props) => <MoreAtlassianAppsIcon {...props} size="20" label="More Atlassian Apps" />,
		Icon24: (props) => <MoreAtlassianAppsIcon {...props} size="24" label="More Atlassian Apps" />,
		Icon32: (props) => <MoreAtlassianAppsIcon {...props} size="32" label="More Atlassian Apps" />,
		Logo: null,
	},
];
