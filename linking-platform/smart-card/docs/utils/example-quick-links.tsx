import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import VidFullScreenOnIcon from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
import { Box, xcss } from '@atlaskit/primitives';
import React from 'react';
import { navigateToUrl, toExamplePath } from './index';

const styles = xcss({ textAlign: 'right' });

const DocQuickLinks = () => (
	<Box paddingBlock="space.100" xcss={styles}>
		<DropdownMenu<HTMLButtonElement>
			shouldFlip
			shouldRenderToParent
			spacing="compact"
			trigger={({ triggerRef, ...triggerProps }) => (
				<Button ref={triggerRef} {...triggerProps} iconBefore={VidFullScreenOnIcon}>
					Examples
				</Button>
			)}
		>
			<DropdownItemGroup hasSeparator>
				<DropdownItem
					description="Test the resolver, load Smart Links via URL, modify the link response."
					onClick={() => navigateToUrl(toExamplePath('json-ld-editor'))}
				>
					JSON-LD Editor
				</DropdownItem>
				<DropdownItem
					description="Try Hover Preview with various configurations."
					onClick={() => navigateToUrl(toExamplePath('hover-card'))}
				>
					Hover Preview Builder
				</DropdownItem>
				<DropdownItem
					description="Build a composable Smart Links."
					onClick={() => navigateToUrl(toExamplePath('flexible-smart-links-builder'))}
				>
					Flexible Smart Links Builder
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	</Box>
);

export default DocQuickLinks;
