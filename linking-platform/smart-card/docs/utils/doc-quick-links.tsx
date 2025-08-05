import React from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import BacklogIcon from '@atlaskit/icon/core/backlog';
import CommentIcon from '@atlaskit/icon/core/comment';
import LinkIcon from '@atlaskit/icon/core/link';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import MinusIcon from '@atlaskit/icon/core/minus';
import PageIcon from '@atlaskit/icon/core/page';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import SmartLinkIcon from '@atlaskit/icon/core/smart-link';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import SmartLinkEmbedIcon from '@atlaskit/icon/core/smart-link-embed';
import SmartLinkInlineIcon from '@atlaskit/icon/core/smart-link-inline';
import SmartLinkListIcon from '@atlaskit/icon/core/smart-link-list';
import TeamsIcon from '@atlaskit/icon/core/teams';
import { Box } from '@atlaskit/primitives/compiled';

import { navigateToUrl, openUrl, toAbsolutePath, toPackagePath } from './index';

const cardDocs = [
	{
		name: 'Card',
		description: 'Start here for Smart Links',
		elemBefore: <SmartLinkIcon label="" />,
		onClick: () => navigateToUrl(toAbsolutePath('./card')),
	},
	{
		name: 'Inline',
		description: 'Inline appearance',
		elemBefore: <SmartLinkInlineIcon label="" />,
		onClick: () => navigateToUrl(toAbsolutePath('./inline-card')),
	},
	{
		name: 'Block',
		description: 'Block appearance (card)',
		elemBefore: <SmartLinkCardIcon label="" />,
		onClick: () => navigateToUrl(toAbsolutePath('./block-card')),
	},
	{
		name: 'Embed',
		description: 'Embed appearance (iframe)',
		elemBefore: <SmartLinkEmbedIcon label="" />,
		onClick: () => navigateToUrl(toAbsolutePath('./embed-card')),
	},
	{
		name: 'Flexible',
		description: 'Composable Smart Links',
		elemBefore: <BacklogIcon label="" />,
		onClick: () => navigateToUrl(toAbsolutePath('./flexible-card')),
	},

	{
		name: 'Card actions',
		description: 'Interactions such as preview, copy link, etc.',
		onClick: () => navigateToUrl(toAbsolutePath('./card-actions')),
	},
	{
		name: 'Card in Editor',
		description: 'Smart Links inside Fabric Editor',
		onClick: () => navigateToUrl(toAbsolutePath('./card-in-editor')),
	},
	{
		name: 'CardSSR',
		description: 'Non-lazyload Smart Links',
		onClick: () => navigateToUrl(toAbsolutePath('./card-ssr')),
	},
	{
		name: 'Handle errors',
		description: 'Error handling and fallback component',
		onClick: () => navigateToUrl(toAbsolutePath('./handle-errors')),
	},
];

const hoverCardDocs = [
	{
		name: 'HoverCard',
		description: 'Standalone Hover Preview',
		elemBefore: <CommentIcon label="" />,
		onClick: () => navigateToUrl(toAbsolutePath('./hover-card')),
	},
];

const linkUrlDocs = [
	{
		name: 'LinkUrl',
		description: 'Hyperlink with built-in safety check',
		elemBefore: <MinusIcon label="" />,
		onClick: () => navigateToUrl(toAbsolutePath('./link-url')),
	},
];

const utilDocs = [
	{ name: 'Hooks', onClick: () => navigateToUrl(toAbsolutePath('./hooks')) },
	{ name: 'Analytics', onClick: () => navigateToUrl(toAbsolutePath('./analytics')) },
];

const packageLinks = [
	{
		name: 'Link provider',
		description: 'SmartCardProvider, CardClient',
		elemBefore: <AngleBracketsIcon label="" />,
		elemAfter: <LinkExternalIcon label="Open in new tab" />,
		onClick: () => openUrl(toPackagePath('linking-platform', 'link-provider')),
	},
	{
		name: 'Link datasource',
		description: 'Smart Link List View (SLLV)',
		elemBefore: <SmartLinkListIcon label="" />,
		elemAfter: <LinkExternalIcon label="Open in new tab" />,
		onClick: () => openUrl(toPackagePath('linking-platform', 'link-datasource')),
	},
	{
		name: 'Link picker',
		description: 'Insert links',
		elemBefore: <LinkIcon label="" />,
		elemAfter: <LinkExternalIcon label="Open in new tab" />,
		onClick: () => openUrl(toPackagePath('linking-platform', 'link-picker')),
	},
];

const externalLinks = [
	{
		name: 'FAQ',
		elemBefore: <QuestionCircleIcon label="" />,
		elemAfter: <LinkExternalIcon label="Open in new tab" />,
		onClick: () => openUrl('https://hello.atlassian.net/wiki/spaces/TWPLP/pages/4448067142'),
	},
	{
		name: '#help-fe-linking-platform',
		elemBefore: <MegaphoneIcon label="" />,
		elemAfter: <LinkExternalIcon label="Open in new tab" />,
		onClick: () => openUrl('https://atlassian.enterprise.slack.com/archives/CFKGAQZRV'),
	},
	{
		name: 'Contribution',
		elemBefore: <TeamsIcon label="" />,
		elemAfter: <LinkExternalIcon label="Open in new tab" />,
		onClick: () => openUrl('https://hello.atlassian.net/wiki/spaces/TWPLP/pages/3609380368'),
	},
];

export const LinkItemGroups: {
	items: {
		description?: string;
		elemAfter?: React.ReactNode;
		elemBefore?: React.ReactNode;
		name: string;
		onClick: () => void;
	}[];
}[] = [
	{ items: cardDocs },
	{ items: hoverCardDocs },
	{ items: linkUrlDocs },
	{ items: utilDocs },
	{ items: packageLinks },
	{ items: externalLinks },
];

const DocQuickLinks = () => (
	<Box paddingBlock="space.100">
		<DropdownMenu<HTMLButtonElement>
			shouldFlip
			shouldRenderToParent
			spacing="compact"
			trigger={({ triggerRef, ...triggerProps }) => (
				<Button ref={triggerRef} {...triggerProps} iconBefore={PageIcon}>
					Documentation
				</Button>
			)}
		>
			<DropdownItemGroup hasSeparator>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./intro'))}>
					@ataskit/smart-card
				</DropdownItem>
			</DropdownItemGroup>
			{LinkItemGroups.map((group, groupIdx) => (
				<DropdownItemGroup hasSeparator key={`group-${groupIdx}`}>
					{group.items.map(({ description, elemAfter, elemBefore, name, onClick }, itemIdx) => (
						<DropdownItem
							description={description}
							elemAfter={elemAfter}
							elemBefore={elemBefore}
							key={`item-${groupIdx}-${itemIdx}`}
							onClick={onClick}
						>
							{name}
						</DropdownItem>
					))}
				</DropdownItemGroup>
			))}
		</DropdownMenu>
	</Box>
);

export default DocQuickLinks;
