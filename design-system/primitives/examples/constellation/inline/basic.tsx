import React from 'react';

import Button from '@atlaskit/button';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import StoryIcon from '@atlaskit/icon-object/glyph/story/16';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { Inline } from '@atlaskit/primitives';
import { Y400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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
    <Inline spread="space-between">
      <Inline space="space.100" alignBlock="center">
        <StoryIcon label="Issue type: Story" />
        <Heading level="h700">Create a backlog</Heading>
      </Inline>
      <Inline space="space.050">
        <Button
          iconAfter={
            <StarFilledIcon
              label="Add as favourite"
              size="medium"
              primaryColor={token('color.icon.accent.yellow', Y400)}
            />
          }
          appearance="subtle"
        ></Button>
        <ActionsMenu />
      </Inline>
    </Inline>
  );
}
