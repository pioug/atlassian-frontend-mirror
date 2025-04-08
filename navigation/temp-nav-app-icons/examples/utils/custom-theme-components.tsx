/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ae48b40e0b5c4b0485d7560d71b61b11>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { ConfluenceIcon, ConfluenceLogo } from '@atlaskit/temp-nav-app-icons/confluence';
import {
	CustomerServiceManagementIcon,
	CustomerServiceManagementLogo,
} from '@atlaskit/temp-nav-app-icons/customer-service-management';
import { JiraIcon, JiraLogo } from '@atlaskit/temp-nav-app-icons/jira';
import {
	JiraProductDiscoveryIcon,
	JiraProductDiscoveryLogo,
} from '@atlaskit/temp-nav-app-icons/jira-product-discovery';
import {
	JiraServiceManagementIcon,
	JiraServiceManagementLogo,
} from '@atlaskit/temp-nav-app-icons/jira-service-management';
import { TrelloIcon, TrelloLogo } from '@atlaskit/temp-nav-app-icons/trello';

import { AppIconProps, AppLogoProps } from '../../src/utils/types';

export const customThemeApps: Array<{
	name: string;
	Icon12: React.ComponentType<AppIconProps>;
	Icon16: React.ComponentType<AppIconProps>;
	Icon20: React.ComponentType<AppIconProps>;
	Icon24: React.ComponentType<AppIconProps>;
	Icon32: React.ComponentType<AppIconProps>;
	Logo: React.ComponentType<AppLogoProps> | null;
}> = [
	{
		name: 'Confluence',
		Icon12: (props) => <ConfluenceIcon {...props} size="12" />,
		Icon16: (props) => <ConfluenceIcon {...props} size="16" />,
		Icon20: (props) => <ConfluenceIcon {...props} size="20" />,
		Icon24: (props) => <ConfluenceIcon {...props} size="24" />,
		Icon32: (props) => <ConfluenceIcon {...props} size="32" />,
		Logo: (props) => <ConfluenceLogo {...props} />,
	},
	{
		name: 'Jira Product Discovery',
		Icon12: (props) => <JiraProductDiscoveryIcon {...props} size="12" />,
		Icon16: (props) => <JiraProductDiscoveryIcon {...props} size="16" />,
		Icon20: (props) => <JiraProductDiscoveryIcon {...props} size="20" />,
		Icon24: (props) => <JiraProductDiscoveryIcon {...props} size="24" />,
		Icon32: (props) => <JiraProductDiscoveryIcon {...props} size="32" />,
		Logo: (props) => <JiraProductDiscoveryLogo {...props} />,
	},
	{
		name: 'Jira Service Management',
		Icon12: (props) => <JiraServiceManagementIcon {...props} size="12" />,
		Icon16: (props) => <JiraServiceManagementIcon {...props} size="16" />,
		Icon20: (props) => <JiraServiceManagementIcon {...props} size="20" />,
		Icon24: (props) => <JiraServiceManagementIcon {...props} size="24" />,
		Icon32: (props) => <JiraServiceManagementIcon {...props} size="32" />,
		Logo: (props) => <JiraServiceManagementLogo {...props} />,
	},
	{
		name: 'Customer Service Management',
		Icon12: (props) => <CustomerServiceManagementIcon {...props} size="12" />,
		Icon16: (props) => <CustomerServiceManagementIcon {...props} size="16" />,
		Icon20: (props) => <CustomerServiceManagementIcon {...props} size="20" />,
		Icon24: (props) => <CustomerServiceManagementIcon {...props} size="24" />,
		Icon32: (props) => <CustomerServiceManagementIcon {...props} size="32" />,
		Logo: (props) => <CustomerServiceManagementLogo {...props} />,
	},
	{
		name: 'Jira',
		Icon12: (props) => <JiraIcon {...props} size="12" />,
		Icon16: (props) => <JiraIcon {...props} size="16" />,
		Icon20: (props) => <JiraIcon {...props} size="20" />,
		Icon24: (props) => <JiraIcon {...props} size="24" />,
		Icon32: (props) => <JiraIcon {...props} size="32" />,
		Logo: (props) => <JiraLogo {...props} />,
	},

	{
		name: 'Trello',
		Icon12: (props) => <TrelloIcon {...props} size="12" />,
		Icon16: (props) => <TrelloIcon {...props} size="16" />,
		Icon20: (props) => <TrelloIcon {...props} size="20" />,
		Icon24: (props) => <TrelloIcon {...props} size="24" />,
		Icon32: (props) => <TrelloIcon {...props} size="32" />,
		Logo: (props) => <TrelloLogo {...props} />,
	},
];
