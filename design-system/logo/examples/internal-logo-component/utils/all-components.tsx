/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1264e71bd7b6f8e3a0287c7aa01c245d>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

/* eslint-disable @atlaskit/platform/use-entrypoints-in-examples */
import { AdminIcon, AdminLogo, AdminLogoCS } from '../../../src/artifacts/logo-components/admin';
import { AlignIcon, AlignLogo, AlignLogoCS } from '../../../src/artifacts/logo-components/align';
import {
	AnalyticsIcon,
	AnalyticsLogo,
	AnalyticsLogoCS,
} from '../../../src/artifacts/logo-components/analytics';
import {
	AssetsIcon,
	AssetsLogo,
	AssetsLogoCS,
} from '../../../src/artifacts/logo-components/assets';
import { BambooIcon, BambooLogoCS } from '../../../src/artifacts/logo-components/bamboo';
import {
	BitbucketIcon,
	BitbucketLogo,
	BitbucketLogoCS,
} from '../../../src/artifacts/logo-components/bitbucket';
import {
	BitbucketDataCenterIcon,
	BitbucketDataCenterLogoCS,
} from '../../../src/artifacts/logo-components/bitbucket-data-center';
import { ChatIcon, ChatLogo, ChatLogoCS } from '../../../src/artifacts/logo-components/chat';
import {
	ChatNewIcon,
	ChatNewLogo,
	ChatNewLogoCS,
} from '../../../src/artifacts/logo-components/chat-new';
import { CompanyHubIcon, CompanyHubLogo } from '../../../src/artifacts/logo-components/company-hub';
import {
	CompassIcon,
	CompassLogo,
	CompassLogoCS,
} from '../../../src/artifacts/logo-components/compass';
import {
	ConfluenceIcon,
	ConfluenceLogo,
	ConfluenceLogoCS,
} from '../../../src/artifacts/logo-components/confluence';
import {
	ConfluenceDataCenterIcon,
	ConfluenceDataCenterLogoCS,
} from '../../../src/artifacts/logo-components/confluence-data-center';
import { CrowdIcon, CrowdLogoCS } from '../../../src/artifacts/logo-components/crowd';
import { CustomLinkIcon } from '../../../src/artifacts/logo-components/custom-link';
import {
	CustomerServiceManagementIcon,
	CustomerServiceManagementLogo,
	CustomerServiceManagementLogoCS,
} from '../../../src/artifacts/logo-components/customer-service-management';
import { DxIcon } from '../../../src/artifacts/logo-components/dx';
import { FocusIcon, FocusLogo, FocusLogoCS } from '../../../src/artifacts/logo-components/focus';
import { GoalsIcon, GoalsLogo, GoalsLogoCS } from '../../../src/artifacts/logo-components/goals';
import { GuardIcon, GuardLogo, GuardLogoCS } from '../../../src/artifacts/logo-components/guard';
import {
	GuardDetectIcon,
	GuardDetectLogo,
} from '../../../src/artifacts/logo-components/guard-detect';
import { HomeIcon, HomeLogo, HomeLogoCS } from '../../../src/artifacts/logo-components/home';
import { HubIcon, HubLogoCS } from '../../../src/artifacts/logo-components/hub';
import { JiraIcon, JiraLogo, JiraLogoCS } from '../../../src/artifacts/logo-components/jira';
import {
	JiraDataCenterIcon,
	JiraDataCenterLogoCS,
} from '../../../src/artifacts/logo-components/jira-data-center';
import {
	JiraProductDiscoveryIcon,
	JiraProductDiscoveryLogo,
	JiraProductDiscoveryLogoCS,
} from '../../../src/artifacts/logo-components/jira-product-discovery';
import {
	JiraServiceManagementIcon,
	JiraServiceManagementLogo,
	JiraServiceManagementLogoCS,
} from '../../../src/artifacts/logo-components/jira-service-management';
import {
	JiraServiceManagementDataCenterIcon,
	JiraServiceManagementDataCenterLogoCS,
} from '../../../src/artifacts/logo-components/jira-service-management-data-center';
import { LoomIcon, LoomLogo, LoomLogoCS } from '../../../src/artifacts/logo-components/loom';
import { LoomAttributionLogoCS } from '../../../src/artifacts/logo-components/loom-attribution';
import {
	LoomInternalIcon,
	LoomInternalLogo,
	LoomInternalLogoCS,
} from '../../../src/artifacts/logo-components/loom-internal';
import { MoreAtlassianAppsIcon } from '../../../src/artifacts/logo-components/more-atlassian-apps';
import {
	OpsgenieIcon,
	OpsgenieLogo,
	OpsgenieLogoCS,
} from '../../../src/artifacts/logo-components/opsgenie';
import {
	ProjectsIcon,
	ProjectsLogo,
	ProjectsLogoCS,
} from '../../../src/artifacts/logo-components/projects';
import { RovoIcon, RovoLogo, RovoLogoCS } from '../../../src/artifacts/logo-components/rovo';
import { RovoDevIcon, RovoDevLogoCS } from '../../../src/artifacts/logo-components/rovo-dev';
import {
	RovoDevAgentIcon,
	RovoDevAgentLogoCS,
} from '../../../src/artifacts/logo-components/rovo-dev-agent';
import { RovoHexIcon, RovoHexLogoCS } from '../../../src/artifacts/logo-components/rovo-hex';
import {
	SearchIcon,
	SearchLogo,
	SearchLogoCS,
} from '../../../src/artifacts/logo-components/search';
import {
	SearchNewIcon,
	SearchNewLogo,
	SearchNewLogoCS,
} from '../../../src/artifacts/logo-components/search-new';
import {
	StatuspageIcon,
	StatuspageLogo,
	StatuspageLogoCS,
} from '../../../src/artifacts/logo-components/statuspage';
import {
	StudioIcon,
	StudioLogo,
	StudioLogoCS,
} from '../../../src/artifacts/logo-components/studio';
import {
	StudioNewIcon,
	StudioNewLogo,
	StudioNewLogoCS,
} from '../../../src/artifacts/logo-components/studio-new';
import {
	TalentIcon,
	TalentLogo,
	TalentLogoCS,
} from '../../../src/artifacts/logo-components/talent';
import { TeamsIcon, TeamsLogo, TeamsLogoCS } from '../../../src/artifacts/logo-components/teams';
import {
	TrelloIcon,
	TrelloLogo,
	TrelloLogoCS,
} from '../../../src/artifacts/logo-components/trello';
import type { AppIconProps, AppLogoProps } from '../../../src/utils/types';
/* eslint-enable @atlaskit/platform/use-entrypoints-in-examples */

export const rows: Array<{
	name: string;
	Icon12: React.ComponentType<AppIconProps> | null;
	Icon16: React.ComponentType<AppIconProps> | null;
	Icon20: React.ComponentType<AppIconProps> | null;
	Icon24: React.ComponentType<AppIconProps> | null;
	Icon32: React.ComponentType<AppIconProps> | null;
	Logo: React.ComponentType<AppLogoProps> | null;
	LogoCS: React.ComponentType<AppLogoProps> | null;
}> = [
	{
		name: 'Admin',
		Icon12: (props) => <AdminIcon {...props} size="12" />,
		Icon16: (props) => <AdminIcon {...props} size="16" />,
		Icon20: (props) => <AdminIcon {...props} size="20" />,
		Icon24: (props) => <AdminIcon {...props} size="24" />,
		Icon32: (props) => <AdminIcon {...props} size="32" />,
		Logo: (props) => <AdminLogo {...props} />,
		LogoCS: (props) => <AdminLogoCS {...props} />,
	},
	{
		name: 'Align',
		Icon12: (props) => <AlignIcon {...props} size="12" />,
		Icon16: (props) => <AlignIcon {...props} size="16" />,
		Icon20: (props) => <AlignIcon {...props} size="20" />,
		Icon24: (props) => <AlignIcon {...props} size="24" />,
		Icon32: (props) => <AlignIcon {...props} size="32" />,
		Logo: (props) => <AlignLogo {...props} />,
		LogoCS: (props) => <AlignLogoCS {...props} />,
	},
	{
		name: 'Analytics',
		Icon12: (props) => <AnalyticsIcon {...props} size="12" />,
		Icon16: (props) => <AnalyticsIcon {...props} size="16" />,
		Icon20: (props) => <AnalyticsIcon {...props} size="20" />,
		Icon24: (props) => <AnalyticsIcon {...props} size="24" />,
		Icon32: (props) => <AnalyticsIcon {...props} size="32" />,
		Logo: (props) => <AnalyticsLogo {...props} />,
		LogoCS: (props) => <AnalyticsLogoCS {...props} />,
	},
	{
		name: 'Assets',
		Icon12: (props) => <AssetsIcon {...props} size="12" />,
		Icon16: (props) => <AssetsIcon {...props} size="16" />,
		Icon20: (props) => <AssetsIcon {...props} size="20" />,
		Icon24: (props) => <AssetsIcon {...props} size="24" />,
		Icon32: (props) => <AssetsIcon {...props} size="32" />,
		Logo: (props) => <AssetsLogo {...props} />,
		LogoCS: (props) => <AssetsLogoCS {...props} />,
	},
	{
		name: 'Bamboo',
		Icon12: (props) => <BambooIcon {...props} size="12" />,
		Icon16: (props) => <BambooIcon {...props} size="16" />,
		Icon20: (props) => <BambooIcon {...props} size="20" />,
		Icon24: (props) => <BambooIcon {...props} size="24" />,
		Icon32: (props) => <BambooIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <BambooLogoCS {...props} />,
	},
	{
		name: 'Bitbucket Data Center',
		Icon12: (props) => <BitbucketDataCenterIcon {...props} size="12" />,
		Icon16: (props) => <BitbucketDataCenterIcon {...props} size="16" />,
		Icon20: (props) => <BitbucketDataCenterIcon {...props} size="20" />,
		Icon24: (props) => <BitbucketDataCenterIcon {...props} size="24" />,
		Icon32: (props) => <BitbucketDataCenterIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <BitbucketDataCenterLogoCS {...props} />,
	},
	{
		name: 'Bitbucket',
		Icon12: (props) => <BitbucketIcon {...props} size="12" />,
		Icon16: (props) => <BitbucketIcon {...props} size="16" />,
		Icon20: (props) => <BitbucketIcon {...props} size="20" />,
		Icon24: (props) => <BitbucketIcon {...props} size="24" />,
		Icon32: (props) => <BitbucketIcon {...props} size="32" />,
		Logo: (props) => <BitbucketLogo {...props} />,
		LogoCS: (props) => <BitbucketLogoCS {...props} />,
	},
	{
		name: 'Chat New',
		Icon12: (props) => <ChatNewIcon {...props} size="12" />,
		Icon16: (props) => <ChatNewIcon {...props} size="16" />,
		Icon20: (props) => <ChatNewIcon {...props} size="20" />,
		Icon24: (props) => <ChatNewIcon {...props} size="24" />,
		Icon32: (props) => <ChatNewIcon {...props} size="32" />,
		Logo: (props) => <ChatNewLogo {...props} />,
		LogoCS: (props) => <ChatNewLogoCS {...props} />,
	},
	{
		name: 'Chat',
		Icon12: (props) => <ChatIcon {...props} size="12" />,
		Icon16: (props) => <ChatIcon {...props} size="16" />,
		Icon20: (props) => <ChatIcon {...props} size="20" />,
		Icon24: (props) => <ChatIcon {...props} size="24" />,
		Icon32: (props) => <ChatIcon {...props} size="32" />,
		Logo: (props) => <ChatLogo {...props} />,
		LogoCS: (props) => <ChatLogoCS {...props} />,
	},
	{
		name: 'Compass',
		Icon12: (props) => <CompassIcon {...props} size="12" />,
		Icon16: (props) => <CompassIcon {...props} size="16" />,
		Icon20: (props) => <CompassIcon {...props} size="20" />,
		Icon24: (props) => <CompassIcon {...props} size="24" />,
		Icon32: (props) => <CompassIcon {...props} size="32" />,
		Logo: (props) => <CompassLogo {...props} />,
		LogoCS: (props) => <CompassLogoCS {...props} />,
	},
	{
		name: 'Confluence Data Center',
		Icon12: (props) => <ConfluenceDataCenterIcon {...props} size="12" />,
		Icon16: (props) => <ConfluenceDataCenterIcon {...props} size="16" />,
		Icon20: (props) => <ConfluenceDataCenterIcon {...props} size="20" />,
		Icon24: (props) => <ConfluenceDataCenterIcon {...props} size="24" />,
		Icon32: (props) => <ConfluenceDataCenterIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <ConfluenceDataCenterLogoCS {...props} />,
	},
	{
		name: 'Confluence',
		Icon12: (props) => <ConfluenceIcon {...props} size="12" />,
		Icon16: (props) => <ConfluenceIcon {...props} size="16" />,
		Icon20: (props) => <ConfluenceIcon {...props} size="20" />,
		Icon24: (props) => <ConfluenceIcon {...props} size="24" />,
		Icon32: (props) => <ConfluenceIcon {...props} size="32" />,
		Logo: (props) => <ConfluenceLogo {...props} />,
		LogoCS: (props) => <ConfluenceLogoCS {...props} />,
	},
	{
		name: 'Crowd',
		Icon12: (props) => <CrowdIcon {...props} size="12" />,
		Icon16: (props) => <CrowdIcon {...props} size="16" />,
		Icon20: (props) => <CrowdIcon {...props} size="20" />,
		Icon24: (props) => <CrowdIcon {...props} size="24" />,
		Icon32: (props) => <CrowdIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <CrowdLogoCS {...props} />,
	},
	{
		name: 'Customer Service Management',
		Icon12: (props) => <CustomerServiceManagementIcon {...props} size="12" />,
		Icon16: (props) => <CustomerServiceManagementIcon {...props} size="16" />,
		Icon20: (props) => <CustomerServiceManagementIcon {...props} size="20" />,
		Icon24: (props) => <CustomerServiceManagementIcon {...props} size="24" />,
		Icon32: (props) => <CustomerServiceManagementIcon {...props} size="32" />,
		Logo: (props) => <CustomerServiceManagementLogo {...props} />,
		LogoCS: (props) => <CustomerServiceManagementLogoCS {...props} />,
	},
	{
		name: 'Focus',
		Icon12: (props) => <FocusIcon {...props} size="12" />,
		Icon16: (props) => <FocusIcon {...props} size="16" />,
		Icon20: (props) => <FocusIcon {...props} size="20" />,
		Icon24: (props) => <FocusIcon {...props} size="24" />,
		Icon32: (props) => <FocusIcon {...props} size="32" />,
		Logo: (props) => <FocusLogo {...props} />,
		LogoCS: (props) => <FocusLogoCS {...props} />,
	},
	{
		name: 'Goals',
		Icon12: (props) => <GoalsIcon {...props} size="12" />,
		Icon16: (props) => <GoalsIcon {...props} size="16" />,
		Icon20: (props) => <GoalsIcon {...props} size="20" />,
		Icon24: (props) => <GoalsIcon {...props} size="24" />,
		Icon32: (props) => <GoalsIcon {...props} size="32" />,
		Logo: (props) => <GoalsLogo {...props} />,
		LogoCS: (props) => <GoalsLogoCS {...props} />,
	},
	{
		name: 'Guard',
		Icon12: (props) => <GuardIcon {...props} size="12" />,
		Icon16: (props) => <GuardIcon {...props} size="16" />,
		Icon20: (props) => <GuardIcon {...props} size="20" />,
		Icon24: (props) => <GuardIcon {...props} size="24" />,
		Icon32: (props) => <GuardIcon {...props} size="32" />,
		Logo: (props) => <GuardLogo {...props} />,
		LogoCS: (props) => <GuardLogoCS {...props} />,
	},
	{
		name: 'Home',
		Icon12: (props) => <HomeIcon {...props} size="12" />,
		Icon16: (props) => <HomeIcon {...props} size="16" />,
		Icon20: (props) => <HomeIcon {...props} size="20" />,
		Icon24: (props) => <HomeIcon {...props} size="24" />,
		Icon32: (props) => <HomeIcon {...props} size="32" />,
		Logo: (props) => <HomeLogo {...props} />,
		LogoCS: (props) => <HomeLogoCS {...props} />,
	},
	{
		name: 'Hub',
		Icon12: (props) => <HubIcon {...props} size="12" />,
		Icon16: (props) => <HubIcon {...props} size="16" />,
		Icon20: (props) => <HubIcon {...props} size="20" />,
		Icon24: (props) => <HubIcon {...props} size="24" />,
		Icon32: (props) => <HubIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <HubLogoCS {...props} />,
	},
	{
		name: 'Jira Data Center',
		Icon12: (props) => <JiraDataCenterIcon {...props} size="12" />,
		Icon16: (props) => <JiraDataCenterIcon {...props} size="16" />,
		Icon20: (props) => <JiraDataCenterIcon {...props} size="20" />,
		Icon24: (props) => <JiraDataCenterIcon {...props} size="24" />,
		Icon32: (props) => <JiraDataCenterIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <JiraDataCenterLogoCS {...props} />,
	},
	{
		name: 'Jira Product Discovery',
		Icon12: (props) => <JiraProductDiscoveryIcon {...props} size="12" />,
		Icon16: (props) => <JiraProductDiscoveryIcon {...props} size="16" />,
		Icon20: (props) => <JiraProductDiscoveryIcon {...props} size="20" />,
		Icon24: (props) => <JiraProductDiscoveryIcon {...props} size="24" />,
		Icon32: (props) => <JiraProductDiscoveryIcon {...props} size="32" />,
		Logo: (props) => <JiraProductDiscoveryLogo {...props} />,
		LogoCS: (props) => <JiraProductDiscoveryLogoCS {...props} />,
	},
	{
		name: 'Jira Service Management Data Center',
		Icon12: (props) => <JiraServiceManagementDataCenterIcon {...props} size="12" />,
		Icon16: (props) => <JiraServiceManagementDataCenterIcon {...props} size="16" />,
		Icon20: (props) => <JiraServiceManagementDataCenterIcon {...props} size="20" />,
		Icon24: (props) => <JiraServiceManagementDataCenterIcon {...props} size="24" />,
		Icon32: (props) => <JiraServiceManagementDataCenterIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <JiraServiceManagementDataCenterLogoCS {...props} />,
	},
	{
		name: 'Jira Service Management',
		Icon12: (props) => <JiraServiceManagementIcon {...props} size="12" />,
		Icon16: (props) => <JiraServiceManagementIcon {...props} size="16" />,
		Icon20: (props) => <JiraServiceManagementIcon {...props} size="20" />,
		Icon24: (props) => <JiraServiceManagementIcon {...props} size="24" />,
		Icon32: (props) => <JiraServiceManagementIcon {...props} size="32" />,
		Logo: (props) => <JiraServiceManagementLogo {...props} />,
		LogoCS: (props) => <JiraServiceManagementLogoCS {...props} />,
	},
	{
		name: 'Jira',
		Icon12: (props) => <JiraIcon {...props} size="12" />,
		Icon16: (props) => <JiraIcon {...props} size="16" />,
		Icon20: (props) => <JiraIcon {...props} size="20" />,
		Icon24: (props) => <JiraIcon {...props} size="24" />,
		Icon32: (props) => <JiraIcon {...props} size="32" />,
		Logo: (props) => <JiraLogo {...props} />,
		LogoCS: (props) => <JiraLogoCS {...props} />,
	},
	{
		name: 'Loom Attribution',
		Icon12: null,
		Icon16: null,
		Icon20: null,
		Icon24: null,
		Icon32: null,
		Logo: null,
		LogoCS: (props) => <LoomAttributionLogoCS {...props} />,
	},
	{
		name: 'Loom Internal',
		Icon12: (props) => <LoomInternalIcon {...props} size="12" />,
		Icon16: (props) => <LoomInternalIcon {...props} size="16" />,
		Icon20: (props) => <LoomInternalIcon {...props} size="20" />,
		Icon24: (props) => <LoomInternalIcon {...props} size="24" />,
		Icon32: (props) => <LoomInternalIcon {...props} size="32" />,
		Logo: (props) => <LoomInternalLogo {...props} />,
		LogoCS: (props) => <LoomInternalLogoCS {...props} />,
	},
	{
		name: 'Loom',
		Icon12: (props) => <LoomIcon {...props} size="12" />,
		Icon16: (props) => <LoomIcon {...props} size="16" />,
		Icon20: (props) => <LoomIcon {...props} size="20" />,
		Icon24: (props) => <LoomIcon {...props} size="24" />,
		Icon32: (props) => <LoomIcon {...props} size="32" />,
		Logo: (props) => <LoomLogo {...props} />,
		LogoCS: (props) => <LoomLogoCS {...props} />,
	},
	{
		name: 'Opsgenie',
		Icon12: (props) => <OpsgenieIcon {...props} size="12" />,
		Icon16: (props) => <OpsgenieIcon {...props} size="16" />,
		Icon20: (props) => <OpsgenieIcon {...props} size="20" />,
		Icon24: (props) => <OpsgenieIcon {...props} size="24" />,
		Icon32: (props) => <OpsgenieIcon {...props} size="32" />,
		Logo: (props) => <OpsgenieLogo {...props} />,
		LogoCS: (props) => <OpsgenieLogoCS {...props} />,
	},
	{
		name: 'Projects',
		Icon12: (props) => <ProjectsIcon {...props} size="12" />,
		Icon16: (props) => <ProjectsIcon {...props} size="16" />,
		Icon20: (props) => <ProjectsIcon {...props} size="20" />,
		Icon24: (props) => <ProjectsIcon {...props} size="24" />,
		Icon32: (props) => <ProjectsIcon {...props} size="32" />,
		Logo: (props) => <ProjectsLogo {...props} />,
		LogoCS: (props) => <ProjectsLogoCS {...props} />,
	},
	{
		name: 'Rovo Dev Agent',
		Icon12: (props) => <RovoDevAgentIcon {...props} size="12" />,
		Icon16: (props) => <RovoDevAgentIcon {...props} size="16" />,
		Icon20: (props) => <RovoDevAgentIcon {...props} size="20" />,
		Icon24: (props) => <RovoDevAgentIcon {...props} size="24" />,
		Icon32: (props) => <RovoDevAgentIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <RovoDevAgentLogoCS {...props} />,
	},
	{
		name: 'Rovo Dev',
		Icon12: (props) => <RovoDevIcon {...props} size="12" />,
		Icon16: (props) => <RovoDevIcon {...props} size="16" />,
		Icon20: (props) => <RovoDevIcon {...props} size="20" />,
		Icon24: (props) => <RovoDevIcon {...props} size="24" />,
		Icon32: (props) => <RovoDevIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <RovoDevLogoCS {...props} />,
	},
	{
		name: 'Rovo Hex',
		Icon12: (props) => <RovoHexIcon {...props} size="12" />,
		Icon16: (props) => <RovoHexIcon {...props} size="16" />,
		Icon20: (props) => <RovoHexIcon {...props} size="20" />,
		Icon24: (props) => <RovoHexIcon {...props} size="24" />,
		Icon32: (props) => <RovoHexIcon {...props} size="32" />,
		Logo: null,
		LogoCS: (props) => <RovoHexLogoCS {...props} />,
	},
	{
		name: 'Rovo',
		Icon12: (props) => <RovoIcon {...props} size="12" />,
		Icon16: (props) => <RovoIcon {...props} size="16" />,
		Icon20: (props) => <RovoIcon {...props} size="20" />,
		Icon24: (props) => <RovoIcon {...props} size="24" />,
		Icon32: (props) => <RovoIcon {...props} size="32" />,
		Logo: (props) => <RovoLogo {...props} />,
		LogoCS: (props) => <RovoLogoCS {...props} />,
	},
	{
		name: 'Search New',
		Icon12: (props) => <SearchNewIcon {...props} size="12" />,
		Icon16: (props) => <SearchNewIcon {...props} size="16" />,
		Icon20: (props) => <SearchNewIcon {...props} size="20" />,
		Icon24: (props) => <SearchNewIcon {...props} size="24" />,
		Icon32: (props) => <SearchNewIcon {...props} size="32" />,
		Logo: (props) => <SearchNewLogo {...props} />,
		LogoCS: (props) => <SearchNewLogoCS {...props} />,
	},
	{
		name: 'Search',
		Icon12: (props) => <SearchIcon {...props} size="12" />,
		Icon16: (props) => <SearchIcon {...props} size="16" />,
		Icon20: (props) => <SearchIcon {...props} size="20" />,
		Icon24: (props) => <SearchIcon {...props} size="24" />,
		Icon32: (props) => <SearchIcon {...props} size="32" />,
		Logo: (props) => <SearchLogo {...props} />,
		LogoCS: (props) => <SearchLogoCS {...props} />,
	},
	{
		name: 'Statuspage',
		Icon12: (props) => <StatuspageIcon {...props} size="12" />,
		Icon16: (props) => <StatuspageIcon {...props} size="16" />,
		Icon20: (props) => <StatuspageIcon {...props} size="20" />,
		Icon24: (props) => <StatuspageIcon {...props} size="24" />,
		Icon32: (props) => <StatuspageIcon {...props} size="32" />,
		Logo: (props) => <StatuspageLogo {...props} />,
		LogoCS: (props) => <StatuspageLogoCS {...props} />,
	},
	{
		name: 'Studio New',
		Icon12: (props) => <StudioNewIcon {...props} size="12" />,
		Icon16: (props) => <StudioNewIcon {...props} size="16" />,
		Icon20: (props) => <StudioNewIcon {...props} size="20" />,
		Icon24: (props) => <StudioNewIcon {...props} size="24" />,
		Icon32: (props) => <StudioNewIcon {...props} size="32" />,
		Logo: (props) => <StudioNewLogo {...props} />,
		LogoCS: (props) => <StudioNewLogoCS {...props} />,
	},
	{
		name: 'Studio',
		Icon12: (props) => <StudioIcon {...props} size="12" />,
		Icon16: (props) => <StudioIcon {...props} size="16" />,
		Icon20: (props) => <StudioIcon {...props} size="20" />,
		Icon24: (props) => <StudioIcon {...props} size="24" />,
		Icon32: (props) => <StudioIcon {...props} size="32" />,
		Logo: (props) => <StudioLogo {...props} />,
		LogoCS: (props) => <StudioLogoCS {...props} />,
	},
	{
		name: 'Talent',
		Icon12: (props) => <TalentIcon {...props} size="12" />,
		Icon16: (props) => <TalentIcon {...props} size="16" />,
		Icon20: (props) => <TalentIcon {...props} size="20" />,
		Icon24: (props) => <TalentIcon {...props} size="24" />,
		Icon32: (props) => <TalentIcon {...props} size="32" />,
		Logo: (props) => <TalentLogo {...props} />,
		LogoCS: (props) => <TalentLogoCS {...props} />,
	},
	{
		name: 'Teams',
		Icon12: (props) => <TeamsIcon {...props} size="12" />,
		Icon16: (props) => <TeamsIcon {...props} size="16" />,
		Icon20: (props) => <TeamsIcon {...props} size="20" />,
		Icon24: (props) => <TeamsIcon {...props} size="24" />,
		Icon32: (props) => <TeamsIcon {...props} size="32" />,
		Logo: (props) => <TeamsLogo {...props} />,
		LogoCS: (props) => <TeamsLogoCS {...props} />,
	},
	{
		name: 'Trello',
		Icon12: (props) => <TrelloIcon {...props} size="12" />,
		Icon16: (props) => <TrelloIcon {...props} size="16" />,
		Icon20: (props) => <TrelloIcon {...props} size="20" />,
		Icon24: (props) => <TrelloIcon {...props} size="24" />,
		Icon32: (props) => <TrelloIcon {...props} size="32" />,
		Logo: (props) => <TrelloLogo {...props} />,
		LogoCS: (props) => <TrelloLogoCS {...props} />,
	},
	{
		name: 'Company Hub',
		Icon12: (props) => <CompanyHubIcon {...props} size="12" />,
		Icon16: (props) => <CompanyHubIcon {...props} size="16" />,
		Icon20: (props) => <CompanyHubIcon {...props} size="20" />,
		Icon24: (props) => <CompanyHubIcon {...props} size="24" />,
		Icon32: (props) => <CompanyHubIcon {...props} size="32" />,
		Logo: (props) => <CompanyHubLogo {...props} />,
		LogoCS: null,
	},
	{
		name: 'Guard Detect',
		Icon12: (props) => <GuardDetectIcon {...props} size="12" />,
		Icon16: (props) => <GuardDetectIcon {...props} size="16" />,
		Icon20: (props) => <GuardDetectIcon {...props} size="20" />,
		Icon24: (props) => <GuardDetectIcon {...props} size="24" />,
		Icon32: (props) => <GuardDetectIcon {...props} size="32" />,
		Logo: (props) => <GuardDetectLogo {...props} />,
		LogoCS: null,
	},
	{
		name: 'Custom Link',
		Icon12: (props) => <CustomLinkIcon {...props} size="12" label="Custom Link" />,
		Icon16: (props) => <CustomLinkIcon {...props} size="16" label="Custom Link" />,
		Icon20: (props) => <CustomLinkIcon {...props} size="20" label="Custom Link" />,
		Icon24: (props) => <CustomLinkIcon {...props} size="24" label="Custom Link" />,
		Icon32: (props) => <CustomLinkIcon {...props} size="32" label="Custom Link" />,
		Logo: null,
		LogoCS: null,
	},
	{
		name: 'Dx',
		Icon12: (props) => <DxIcon {...props} size="12" />,
		Icon16: (props) => <DxIcon {...props} size="16" />,
		Icon20: (props) => <DxIcon {...props} size="20" />,
		Icon24: (props) => <DxIcon {...props} size="24" />,
		Icon32: (props) => <DxIcon {...props} size="32" />,
		Logo: null,
		LogoCS: null,
	},
	{
		name: 'More Atlassian Apps',
		Icon12: (props) => <MoreAtlassianAppsIcon {...props} size="12" label="More Atlassian Apps" />,
		Icon16: (props) => <MoreAtlassianAppsIcon {...props} size="16" label="More Atlassian Apps" />,
		Icon20: (props) => <MoreAtlassianAppsIcon {...props} size="20" label="More Atlassian Apps" />,
		Icon24: (props) => <MoreAtlassianAppsIcon {...props} size="24" label="More Atlassian Apps" />,
		Icon32: (props) => <MoreAtlassianAppsIcon {...props} size="32" label="More Atlassian Apps" />,
		Logo: null,
		LogoCS: null,
	},
];
