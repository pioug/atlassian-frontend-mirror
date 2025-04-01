import React from 'react';

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
	BitbucketIcon as BitbucketIconTemp,
	BitbucketLogo as BitbucketLogoTemp,
} from '@atlaskit/temp-nav-app-icons/bitbucket';
import {
	CompassIcon as CompassIconTemp,
	CompassLogo as CompassLogoTemp,
} from '@atlaskit/temp-nav-app-icons/compass';
import {
	ConfluenceIcon as ConfluenceIconTemp,
	ConfluenceLogo as ConfluenceLogoTemp,
} from '@atlaskit/temp-nav-app-icons/confluence';
import {
	JiraIcon as JiraIconTemp,
	JiraLogo as JiraLogoTemp,
} from '@atlaskit/temp-nav-app-icons/jira';
import {
	JiraServiceManagementIcon as JiraServiceManagementIconTemp,
	JiraServiceManagementLogo as JiraServiceManagementLogoTemp,
} from '@atlaskit/temp-nav-app-icons/jira-service-management';

import { CustomProductHome, ProductHome } from '../../src';

import atlassianIconUrl from './assets/atlassian-icon.png';
import atlassianLogoUrl from './assets/atlassian-logo.png';

export const BitbucketProductHome = () => (
	<ProductHome
		onClick={console.log}
		siteTitle="Extranet"
		icon={fg('platform-team25-app-icon-tiles') ? BitbucketIconTemp : BitbucketIcon}
		logo={fg('platform-team25-app-icon-tiles') ? BitbucketLogoTemp : BitbucketLogo}
		testId="bitbucket-product-home"
	/>
);

export const ConfluenceProductHome = () => (
	<ProductHome
		siteTitle="Extranet"
		icon={fg('platform-team25-app-icon-tiles') ? ConfluenceIconTemp : ConfluenceIcon}
		logo={fg('platform-team25-app-icon-tiles') ? ConfluenceLogoTemp : ConfluenceLogo}
		href="#"
		testId="confluence-product-home"
	/>
);

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

export const CompassProductHome = () => (
	<ProductHome
		siteTitle="Extranet"
		icon={fg('platform-team25-app-icon-tiles') ? CompassIconTemp : CompassIcon}
		logo={fg('platform-team25-app-icon-tiles') ? CompassLogoTemp : CompassLogo}
		href="#"
		testId="confluence-product-home"
	/>
);

export const DefaultProductHome = JiraProductHome;

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
