import React from 'react';

import { AppHome, CustomProductHome, ProductHome } from '@atlaskit/atlassian-navigation';
import {
	BitbucketIcon,
	BitbucketLogo,
	CompassIcon,
	CompassLogo,
	ConfluenceIcon,
	ConfluenceLogo,
	JiraIcon,
	JiraLogo,
	JiraServiceManagementIcon,
	JiraServiceManagementLogo,
} from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	JiraIcon as JiraIconTemp,
	JiraLogo as JiraLogoTemp,
} from '@atlaskit/temp-nav-app-icons/jira';
import {
	JiraServiceManagementIcon as JiraServiceManagementIconTemp,
	JiraServiceManagementLogo as JiraServiceManagementLogoTemp,
} from '@atlaskit/temp-nav-app-icons/jira-service-management';

import atlassianIconUrl from './assets/atlassian-icon.png';
import atlassianLogoUrl from './assets/atlassian-logo.png';

export const BitbucketProductHome = () =>
	fg('platform-team25-app-icon-tiles') ? (
		<ProductHome
			onClick={console.log}
			siteTitle="Extranet"
			icon={BitbucketIcon}
			logo={BitbucketLogo}
			testId="bitbucket-product-home"
		/>
	) : (
		<AppHome
			name="Bitbucket"
			icon={BitbucketIcon}
			siteTitle="Extranet"
			testId="bitbucket-app-home"
		/>
	);

export const ConfluenceProductHome = () =>
	fg('platform-team25-app-icon-tiles') ? (
		<ProductHome
			siteTitle="Extranet"
			icon={ConfluenceIcon}
			logo={ConfluenceLogo}
			href="#"
			testId="confluence-product-home"
		/>
	) : (
		<AppHome
			name="Confluence"
			icon={ConfluenceIcon}
			siteTitle="Extranet"
			testId="confluence-app-home"
		/>
	);

// Using new logos inside ProductHome, as this is also supported
export const JiraProductHome = () => (
	<ProductHome
		onClick={console.log}
		siteTitle="Extranet"
		aria-label={'Jira'}
		icon={fg('platform-team25-app-icon-tiles') ? JiraIconTemp : JiraIcon}
		logo={fg('platform-team25-app-icon-tiles') ? JiraLogoTemp : JiraLogo}
		testId="jira-product-home"
	/>
);

export const JiraServiceManagementProductHome = () => (
	<ProductHome
		siteTitle="Extranet"
		icon={
			fg('platform-team25-app-icon-tiles')
				? JiraServiceManagementIconTemp
				: JiraServiceManagementIcon
		}
		logo={
			fg('platform-team25-app-icon-tiles')
				? JiraServiceManagementLogoTemp
				: JiraServiceManagementLogo
		}
		href="#"
		testId="jsm-product-home"
	/>
);

export const JiraServiceManagementAppHome = () => (
	<AppHome
		name="Jira Service Management"
		icon={JiraServiceManagementIcon}
		siteTitle="Extranet"
		testId="jsm-app-home"
	/>
);

export const CompassProductHome = () =>
	fg('platform-team25-app-icon-tiles') ? (
		<ProductHome
			siteTitle="Extranet"
			icon={CompassIcon}
			logo={CompassLogo}
			href="#"
			testId="confluence-product-home"
		/>
	) : (
		<AppHome name="Compass" icon={CompassIcon} siteTitle="Extranet" testId="compass-app-home" />
	);

export const DefaultProductHome = JiraProductHome;

export const JiraAppHome = () => (
	<AppHome name="Jira" icon={JiraIcon} siteTitle="Extranet" testId="jira-app-home" />
);

export const DefaultAppHome = JiraAppHome;

export const DefaultCustomProductHome = () => (
	<CustomProductHome
		href="#"
		siteTitle="Extranet"
		iconAlt="Custom icon"
		iconUrl={atlassianIconUrl}
		logoAlt="Custom logo"
		logoUrl={atlassianLogoUrl}
		testId="custom-product-home"
	/>
);
