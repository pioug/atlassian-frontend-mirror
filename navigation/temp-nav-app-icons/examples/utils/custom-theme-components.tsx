/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ae48b40e0b5c4b0485d7560d71b61b11>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { AssetsIcon, AssetsLogo, AssetsLogoCS } from '@atlaskit/temp-nav-app-icons/assets';
import {
	ConfluenceIcon,
	ConfluenceLogo,
	ConfluenceLogoCS,
} from '@atlaskit/temp-nav-app-icons/confluence';
import {
	CustomerServiceManagementIcon,
	CustomerServiceManagementLogo,
	CustomerServiceManagementLogoCS,
} from '@atlaskit/temp-nav-app-icons/customer-service-management';
import { JiraIcon, JiraLogo, JiraLogoCS } from '@atlaskit/temp-nav-app-icons/jira';
import {
	JiraProductDiscoveryIcon,
	JiraProductDiscoveryLogo,
	JiraProductDiscoveryLogoCS,
} from '@atlaskit/temp-nav-app-icons/jira-product-discovery';
import {
	JiraServiceManagementIcon,
	JiraServiceManagementLogo,
	JiraServiceManagementLogoCS,
} from '@atlaskit/temp-nav-app-icons/jira-service-management';
import { TrelloIcon, TrelloLogo, TrelloLogoCS } from '@atlaskit/temp-nav-app-icons/trello';

import { AppIconProps, AppLogoProps } from '../../src/utils/types';

export const customThemeApps: Array<{
	name: string;
	Icon12: React.ComponentType<AppIconProps>;
	Icon16: React.ComponentType<AppIconProps>;
	Icon20: React.ComponentType<AppIconProps>;
	Icon24: React.ComponentType<AppIconProps>;
	Icon32: React.ComponentType<AppIconProps>;
	Logo: React.ComponentType<AppLogoProps> | null;
	LogoCS: React.ComponentType<AppLogoProps> | null;
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
