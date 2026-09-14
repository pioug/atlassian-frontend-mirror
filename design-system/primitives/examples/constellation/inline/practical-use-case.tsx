import React from 'react';

import IconButton from '@atlaskit/button/icon/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import Heading from '@atlaskit/heading/heading';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StoryObject from '@atlaskit/object/story';
import { Inline } from '@atlaskit/primitives/compiled/inline';

const ActionsMenu = () => (
	<DropdownMenu shouldRenderToParent trigger="Actions">
		<DropdownItemGroup>
			<DropdownItem>Edit</DropdownItem>
			<DropdownItem>Clone work item</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

export default function Example(): React.JSX.Element {
	return (
		<Inline alignBlock="center" spread="space-between">
			<Inline space="space.100" alignBlock="center">
				<StoryObject label="Work type: Story" />
				<Heading size="large">Create a backlog</Heading>
			</Inline>
			<Inline alignBlock="center" space="space.050">
				<IconButton icon={StarStarredIcon} appearance="subtle" label="Add as favorite" />
				<ActionsMenu />
			</Inline>
		</Inline>
	);
}
