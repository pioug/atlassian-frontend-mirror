import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import VidFullScreenOnIcon from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
import { Box, xcss } from '@atlaskit/primitives';
import React from 'react';
import { navigateToUrl, toExamplePath } from './index';

const styles = xcss({ textAlign: 'right' });

const ExampleQuickLinks = () => (
	<Box paddingBlock="space.100" xcss={styles}>
		<DropdownMenu<HTMLButtonElement>
			shouldFlip
			shouldRenderToParent
			spacing="compact"
			trigger={({ triggerRef, ...triggerProps }) => (
				<Button ref={triggerRef} {...triggerProps} iconBefore={VidFullScreenOnIcon}>
					Tools
				</Button>
			)}
		>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					description="Test the resolver, load Smart Link via URL, modify the link response"
					onClick={() => navigateToUrl(toExamplePath('json-ld-editor'))}
				>
					JSON-LD Editor
				</DropdownItem>
				<DropdownItem
					description="Build hover card with different configurations"
					onClick={() => navigateToUrl(toExamplePath('hover-card'))}
				>
					Hover Preview Builder
				</DropdownItem>
				<DropdownItem
					description="Build a composable Smart Link"
					onClick={() => navigateToUrl(toExamplePath('flexible-smart-links-builder'))}
				>
					Flexible Smart Links Builder
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	</Box>
);

export default ExampleQuickLinks;
