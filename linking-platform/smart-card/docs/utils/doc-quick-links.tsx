import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import PageIcon from '@atlaskit/icon/core/migration/page';
import { Box, xcss } from '@atlaskit/primitives';
import React from 'react';
import { toAbsolutePath } from './index';

const styles = xcss({ textAlign: 'right' });

const DocQuickLinks = () => (
	<Box paddingBlock="space.100" xcss={styles}>
		<DropdownMenu<HTMLButtonElement>
			shouldFlip
			shouldRenderToParent
			trigger={({ triggerRef, ...triggerProps }) => (
				<Button ref={triggerRef} {...triggerProps} iconBefore={PageIcon}>
					Smart Links Documentation
				</Button>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem href={toAbsolutePath('./card')}>Card</DropdownItem>
				<DropdownItem href={toAbsolutePath('./inline-card')}>Inline</DropdownItem>
				<DropdownItem href={toAbsolutePath('./block-card')}>Block</DropdownItem>
				<DropdownItem href={toAbsolutePath('./embed-card')}>Embed</DropdownItem>
				<DropdownItem href={toAbsolutePath('./flexible-card')}>Flexible</DropdownItem>
				<DropdownItem href={toAbsolutePath('./card-actions')}>Card actions</DropdownItem>
				<DropdownItem href={toAbsolutePath('./card-in-editor')}>Card in Editor</DropdownItem>
				<DropdownItem href={toAbsolutePath('./card-ssr')}>CardSSR</DropdownItem>
				<DropdownItem href={toAbsolutePath('./handle-errors')}>Handle errors</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem href={toAbsolutePath('./hover-card')}>HoverCard</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem href={toAbsolutePath('./link-url')}>LinkUrl</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem href={toAbsolutePath('./hooks')}>Hooks</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem href={toAbsolutePath('./provider')}>SmartCardProvider</DropdownItem>
				<DropdownItem href={toAbsolutePath('./client')}>CardClient</DropdownItem>
				<DropdownItem href={toAbsolutePath('./analytics')}>Analytics</DropdownItem>{' '}
			</DropdownItemGroup>
		</DropdownMenu>
	</Box>
);

export default DocQuickLinks;
