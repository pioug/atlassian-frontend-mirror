import React from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import FeedbackIcon from '@atlaskit/icon/core/migration/feedback';
import PageIcon from '@atlaskit/icon/core/migration/page';
import TeamsIcon from '@atlaskit/icon/core/migration/teams';
import MinusIcon from '@atlaskit/icon/core/minus';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import SmartLinkEmbedIcon from '@atlaskit/icon/core/smart-link-embed';
import SmartLinkInlineIcon from '@atlaskit/icon/core/smart-link-inline';
import { Box, xcss } from '@atlaskit/primitives';

import { navigateToUrl, toAbsolutePath } from './index';

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
					Overview
				</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					description="Start here for Smart Link"
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
					description="Composable Smart Link"
					onClick={() => navigateToUrl(toAbsolutePath('./flexible-card'))}
				>
					Flexible
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./card-actions'))}>
					Card actions
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./card-in-editor'))}>
					Card in Editor
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./card-ssr'))}>
					CardSSR
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./handle-errors'))}>
					Handle errors
				</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./hover-card'))}>
					HoverCard
				</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					elemBefore={<MinusIcon label="" />}
					onClick={() => navigateToUrl(toAbsolutePath('./link-url'))}
				>
					LinkUrl
				</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./hooks'))}>Hooks</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./provider'))}>
					SmartCardProvider
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./client'))}>
					CardClient
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./analytics'))}>
					Analytics
				</DropdownItem>{' '}
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					description="Questions and feedback"
					elemBefore={<FeedbackIcon color="currentColor" spacing="spacious" label="" />}
					href="https://atlassian.enterprise.slack.com/archives/CFKGAQZRV"
					target="_blank"
				>
					#help-linking-platform
				</DropdownItem>
				<DropdownItem
					description="Contributing to Smart Links"
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
