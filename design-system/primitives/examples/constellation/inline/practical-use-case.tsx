import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import StoryIcon from '@atlaskit/icon-object/glyph/story/16';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { Inline } from '@atlaskit/primitives';

const ActionsMenu = () => (
  <DropdownMenu trigger="Actions">
    <DropdownItemGroup>
      <DropdownItem>Edit</DropdownItem>
      <DropdownItem>Clone issue</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default function Example() {
  return (
    <Inline alignBlock="center" spread="space-between">
      <Inline space="space.100" alignBlock="center">
        <StoryIcon label="Issue type: Story" />
        <Heading level="h700">Create a backlog</Heading>
      </Inline>
      <Inline alignBlock="center" space="space.050">
        <IconButton
          icon={StarFilledIcon}
          appearance="subtle"
          label="Add as favourite"
        />
        <ActionsMenu />
      </Inline>
    </Inline>
  );
}
