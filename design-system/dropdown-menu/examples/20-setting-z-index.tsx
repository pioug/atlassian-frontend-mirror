import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const containerStyles: React.CSSProperties = {
  width: 300,
  height: 300,
  padding: token('space.100', '8px'),
};

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
          <Box UNSAFE_style={containerStyles} as="div">
            <DropdownMenu trigger="Page actions" zIndex={610} testId="dropdown">
              <DropdownItemGroup>
                <DropdownItem>Move</DropdownItem>
                <DropdownItem>Clone</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownItemGroup>
            </DropdownMenu>
          </Box>
        )}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            isSelected={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            value="Add"
            iconBefore={<MediaServicesAddCommentIcon label="Add" />}
            testId="popup--trigger"
          />
        )}
      />
    </Fragment>
  );
};
