import React from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import VidFullScreenOnIcon from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

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
			<DropdownItemGroup>
				<DropdownItem
					description="Examples of Smart Links"
					onClick={() => navigateToUrl(toExamplePath('showcase'))}
				>
					Showcase
				</DropdownItem>
				<DropdownItem
					description="Load Smart Link via URL, test the resolver, modify the link response"
					onClick={() => navigateToUrl(toExamplePath('json-ld-editor'))}
				>
					JSON-LD Editor
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
