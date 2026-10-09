import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AppHome } from '@atlaskit/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { CustomProductHome } from '@atlaskit/atlassian-navigation/custom-product-home';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { BitbucketIcon } from '@atlaskit/logo/bitbucket-icon';
import { BitbucketLogoCS as BitbucketLogo } from '@atlaskit/logo/bitbucket/logo';
import { CompassIcon } from '@atlaskit/logo/compass/icon';
import { CompassLogoCS as CompassLogo } from '@atlaskit/logo/compass/logo';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { ConfluenceLogoCS as ConfluenceLogo } from '@atlaskit/logo/confluence/logo';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraServiceManagementIcon } from '@atlaskit/logo/jira-service-management-icon';
import { JiraServiceManagementLogoCS as JiraServiceManagementLogo } from '@atlaskit/logo/jira-service-management/logo';
import { JiraLogoCS as JiraLogo } from '@atlaskit/logo/jira/logo';

import atlassianIconUrl from './assets/atlassian-icon.png';
import atlassianLogoUrl from './assets/atlassian-logo.png';

export const BitbucketAppHome = (): React.JSX.Element => (
	<AppHome
		onClick={console.log}
		siteTitle="Extranet"
		icon={BitbucketIcon}
		name="Bitbucket"
		testId="bitbucket-app-home"
	/>
);

export const BitbucketProductHome = (): React.JSX.Element => (
	<ProductHome
		onClick={console.log}
		siteTitle="Extranet"
		icon={BitbucketIcon}
		logo={BitbucketLogo}
		testId="bitbucket-product-home"
	/>
);

export const ConfluenceAppHome = (): React.JSX.Element => (
	<AppHome
		siteTitle="Extranet"
		icon={ConfluenceIcon}
		name="Confluence"
		href="#"
		testId="confluence-app-home"
	/>
);

export const ConfluenceProductHome = (): React.JSX.Element => (
	<ProductHome
		siteTitle="Extranet"
		icon={ConfluenceIcon}
		logo={ConfluenceLogo}
		href="#"
		testId="confluence-product-home"
	/>
);

export const JiraAppHome = (): React.JSX.Element => (
	<AppHome name="Jira" icon={JiraIcon} siteTitle="Extranet" testId="jira-app-home" />
);

// Using new logos inside ProductHome, as this is also supported
export const JiraProductHome = (): React.JSX.Element => (
	<ProductHome
		onClick={console.log}
		siteTitle="Extranet"
		aria-label={'Jira'}
		icon={JiraIcon}
		logo={JiraLogo}
		testId="jira-product-home"
	/>
);

export const JiraServiceManagementProductHome = (): React.JSX.Element => (
	<ProductHome
		siteTitle="Extranet"
		icon={JiraServiceManagementIcon}
		logo={JiraServiceManagementLogo}
		href="#"
		testId="jsm-product-home"
	/>
);

export const JiraServiceManagementAppHome = (): React.JSX.Element => (
	<AppHome
		name="Jira Service Management"
		icon={JiraServiceManagementIcon}
		siteTitle="Extranet"
		href="#"
		testId="jsm-app-home"
	/>
);

export const CompassAppHome = (): React.JSX.Element => (
	<AppHome name="Compass" icon={CompassIcon} siteTitle="Extranet" testId="compass-app-home" />
);

export const CompassProductHome = (): React.JSX.Element => (
	<ProductHome
		siteTitle="Extranet"
		icon={CompassIcon}
		logo={CompassLogo}
		testId="compass-product-home"
	/>
);

export const DefaultProductHome: () => React.JSX.Element = JiraProductHome;
export const DefaultAppHome: () => React.JSX.Element = JiraAppHome;

export const DefaultCustomProductHome = (): React.JSX.Element => (
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
