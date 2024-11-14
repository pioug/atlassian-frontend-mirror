import React from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import BacklogIcon from '@atlaskit/icon/core/backlog';
import CommentIcon from '@atlaskit/icon/core/comment';
import LinkIcon from '@atlaskit/icon/core/link';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import FeedbackIcon from '@atlaskit/icon/core/migration/feedback';
import PageIcon from '@atlaskit/icon/core/migration/page';
import TeamsIcon from '@atlaskit/icon/core/migration/teams';
import MinusIcon from '@atlaskit/icon/core/minus';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import SmartLinkEmbedIcon from '@atlaskit/icon/core/smart-link-embed';
import SmartLinkInlineIcon from '@atlaskit/icon/core/smart-link-inline';
import SmartLinkListIcon from '@atlaskit/icon/core/smart-link-list';
import { Box, xcss } from '@atlaskit/primitives';

import { navigateToUrl, toAbsolutePath, toPackagePath } from './index';

const styles = xcss({ textAlign: 'right' });
const DocQuickLinks = () => (
	<Box paddingBlock="space.100" xcss={styles}>
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
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					description="Start here for Smart Links"
					onClick={() => navigateToUrl(toAbsolutePath('./card'))}
				>
					Card
				</DropdownItem>
				<DropdownItem
					elemBefore={<SmartLinkInlineIcon label="" />}
					description="Inline appearance"
					onClick={() => navigateToUrl(toAbsolutePath('./inline-card'))}
				>
					Inline
				</DropdownItem>
				<DropdownItem
					elemBefore={<SmartLinkCardIcon label="" />}
					description="Block appearance (card)"
					onClick={() => navigateToUrl(toAbsolutePath('./block-card'))}
				>
					Block
				</DropdownItem>
				<DropdownItem
					elemBefore={<SmartLinkEmbedIcon label="" />}
					description="Embed appearance (iframe)"
					onClick={() => navigateToUrl(toAbsolutePath('./embed-card'))}
				>
					Embed
				</DropdownItem>
				<DropdownItem
					elemBefore={<BacklogIcon label="" />}
					description="Composable Smart Links"
					onClick={() => navigateToUrl(toAbsolutePath('./flexible-card'))}
				>
					Flexible
				</DropdownItem>
				<DropdownItem
					description="Interactions such as preview, copy link, etc."
					onClick={() => navigateToUrl(toAbsolutePath('./card-actions'))}
				>
					Card actions
				</DropdownItem>
				<DropdownItem
					description="Smart Links inside Fabric Editor"
					onClick={() => navigateToUrl(toAbsolutePath('./card-in-editor'))}
				>
					Card in Editor
				</DropdownItem>
				<DropdownItem
					description="Non-lazyload Smart Links"
					onClick={() => navigateToUrl(toAbsolutePath('./card-ssr'))}
				>
					CardSSR
				</DropdownItem>
				<DropdownItem
					description="Error handling and fallback component"
					onClick={() => navigateToUrl(toAbsolutePath('./handle-errors'))}
				>
					Handle errors
				</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					elemBefore={<CommentIcon label="" />}
					description="Standalone Hover Preview"
					onClick={() => navigateToUrl(toAbsolutePath('./hover-card'))}
				>
					HoverCard
				</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					elemBefore={<MinusIcon label="" />}
					description="Hyperlink with built-in safety check"
					onClick={() => navigateToUrl(toAbsolutePath('./link-url'))}
				>
					LinkUrl
				</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./hooks'))}>Hooks</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./analytics'))}>
					Analytics
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./faq'))}>FAQ</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					description="SmartCardProvider, CardClient"
					elemAfter={<LinkExternalIcon label="Open in new tab" />}
					elemBefore={<AngleBracketsIcon label="" />}
					onClick={() => navigateToUrl(toPackagePath('linking-platform', 'link-provider'))}
				>
					Link provider
				</DropdownItem>
				<DropdownItem
					elemAfter={<LinkExternalIcon label="Open in new tab" />}
					elemBefore={<SmartLinkListIcon label="" />}
					description="List of links (Jira issues, Confluence list)"
					onClick={() => navigateToUrl(toPackagePath('linking-platform', 'link-datasource'))}
					target="_blank"
				>
					Link datasource
				</DropdownItem>
				<DropdownItem
					elemAfter={<LinkExternalIcon label="Open in new tab" />}
					elemBefore={<LinkIcon label="" />}
					description="Insert links"
					onClick={() => navigateToUrl(toPackagePath('linking-platform', 'link-picker'))}
					target="_blank"
				>
					Link picker
				</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					elemAfter={<LinkExternalIcon label="Open in new tab" />}
					elemBefore={<FeedbackIcon color="currentColor" spacing="spacious" label="" />}
					href="https://atlassian.enterprise.slack.com/archives/CFKGAQZRV"
					target="_blank"
				>
					#help-linking-platform
				</DropdownItem>
				<DropdownItem
					elemAfter={<LinkExternalIcon label="Open in new tab" />}
					elemBefore={<TeamsIcon color="currentColor" spacing="spacious" label="" />}
					href="https://hello.atlassian.net/wiki/spaces/TWPLP/pages/3609380368"
					target="_blank"
				>
					Contribution
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	</Box>
);

export default DocQuickLinks;
