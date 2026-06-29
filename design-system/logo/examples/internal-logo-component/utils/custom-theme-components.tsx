import React from 'react';

/* eslint-disable @atlaskit/platform/use-entrypoints-in-examples */
import { AssetsIcon } from '../../../src/artifacts/logo-components/assets/icon';
import { AssetsLogo } from '../../../src/artifacts/logo-components/assets/logo';
import { AssetsLogoCS } from '../../../src/artifacts/logo-components/assets/logo-cs';
import { ConfluenceIcon } from '../../../src/artifacts/logo-components/confluence/icon';
import { ConfluenceLogo } from '../../../src/artifacts/logo-components/confluence/logo';
import { ConfluenceLogoCS } from '../../../src/artifacts/logo-components/confluence/logo-cs';
import { CustomerServiceManagementIcon } from '../../../src/artifacts/logo-components/customer-service-management/icon';
import { CustomerServiceManagementLogo } from '../../../src/artifacts/logo-components/customer-service-management/logo';
import { CustomerServiceManagementLogoCS } from '../../../src/artifacts/logo-components/customer-service-management/logo-cs';
import { JiraProductDiscoveryIcon } from '../../../src/artifacts/logo-components/jira-product-discovery/icon';
import { JiraProductDiscoveryLogo } from '../../../src/artifacts/logo-components/jira-product-discovery/logo';
import { JiraProductDiscoveryLogoCS } from '../../../src/artifacts/logo-components/jira-product-discovery/logo-cs';
import { JiraServiceManagementIcon } from '../../../src/artifacts/logo-components/jira-service-management/icon';
import { JiraServiceManagementLogo } from '../../../src/artifacts/logo-components/jira-service-management/logo';
import { JiraServiceManagementLogoCS } from '../../../src/artifacts/logo-components/jira-service-management/logo-cs';
import { JiraIcon } from '../../../src/artifacts/logo-components/jira/icon';
import { JiraLogo } from '../../../src/artifacts/logo-components/jira/logo';
import { JiraLogoCS } from '../../../src/artifacts/logo-components/jira/logo-cs';
import { TrelloIcon } from '../../../src/artifacts/logo-components/trello/icon';
import { TrelloLogo } from '../../../src/artifacts/logo-components/trello/logo';
import { TrelloLogoCS } from '../../../src/artifacts/logo-components/trello/logo-cs';
import type { AppIconProps, AppLogoProps } from '../../../src/utils/types';
/* eslint-enable @atlaskit/platform/use-entrypoints-in-examples */

export const customThemeApps: Array<{
	Icon12: React.ComponentType<AppIconProps>;
	Icon16: React.ComponentType<AppIconProps>;
	Icon20: React.ComponentType<AppIconProps>;
	Icon24: React.ComponentType<AppIconProps>;
	Icon32: React.ComponentType<AppIconProps>;
	Logo: React.ComponentType<AppLogoProps> | null;
	LogoCS: React.ComponentType<AppLogoProps> | null;
	name: string;
}> = [
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
		name: 'Assets',
		Icon12: (props) => <AssetsIcon {...props} size="12" />,
		Icon16: (props) => <AssetsIcon {...props} size="16" />,
		Icon20: (props) => <AssetsIcon {...props} size="20" />,
		Icon24: (props) => <AssetsIcon {...props} size="24" />,
		Icon32: (props) => <AssetsIcon {...props} size="32" />,
		Logo: (props) => <AssetsLogo {...props} />,
		LogoCS: (props) => <AssetsLogoCS {...props} />,
	},
];
