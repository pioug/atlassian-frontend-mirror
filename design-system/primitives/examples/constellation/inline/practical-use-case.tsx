import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import StoryIcon from '@atlaskit/icon-object/glyph/story/16';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import { Inline } from '@atlaskit/primitives/compiled';

const ActionsMenu = () => (
	<DropdownMenu shouldRenderToParent trigger="Actions">
		<DropdownItemGroup>
			<DropdownItem>Edit</DropdownItem>
			<DropdownItem>Clone work item</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

export default function Example() {
	return (
		<Inline alignBlock="center" spread="space-between">
			<Inline space="space.100" alignBlock="center">
				<StoryIcon label="Work type: Story" />
				<Heading size="large">Create a backlog</Heading>
			</Inline>
			<Inline alignBlock="center" space="space.050">
				<IconButton icon={StarStarredIcon} appearance="subtle" label="Add as favorite" />
				<ActionsMenu />
			</Inline>
		</Inline>
	);
}
