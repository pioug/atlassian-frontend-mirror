import React, { Fragment, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import Popup from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const containerStyles = xcss({
  width: 'size.1000',
  height: 'size.1000',
  padding: 'space.100',
});

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <Text as="p">
        Popup (custom z-index 600) with Dropdown (custom z-index 610)
      </Text>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom-start"
        zIndex={600}
        content={() => (
          <Box xcss={containerStyles}>
            <DropdownMenu
              trigger="Page actions"
              zIndex={610}
              testId="dropdown"
              shouldRenderToParent
            >
              <DropdownItemGroup>
                <DropdownItem>Move</DropdownItem>
                <DropdownItem>Clone</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownItemGroup>
            </DropdownMenu>
          </Box>
        )}
        trigger={(triggerProps) => (
          <IconButton
            {...triggerProps}
            isSelected={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            value="Add"
            icon={MediaServicesAddCommentIcon}
            label="Add"
            testId="popup--trigger"
          />
        )}
      />
    </Fragment>
  );
};
