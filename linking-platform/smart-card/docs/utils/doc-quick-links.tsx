import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import PageIcon from '@atlaskit/icon/core/migration/page';
import { Box, xcss } from '@atlaskit/primitives';
import React from 'react';
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
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./card'))}>Card</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./inline-card'))}>
					Inline
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./block-card'))}>
					Block
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./embed-card'))}>
					Embed
				</DropdownItem>
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./flexible-card'))}>
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
				<DropdownItem onClick={() => navigateToUrl(toAbsolutePath('./link-url'))}>
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
		</DropdownMenu>
	</Box>
);

export default DocQuickLinks;
