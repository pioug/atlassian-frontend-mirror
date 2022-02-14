/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import Popup from '@atlaskit/popup';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const containerStyles = css({
  width: 300,
  height: 300,
  padding: 8,
});

const DropdownMenuZIndex = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      zIndex={600}
      content={() => (
        <div css={containerStyles}>
          <DropdownMenu trigger="Page actions" zIndex={610} testId="dropdown">
            <DropdownItemGroup>
              <DropdownItem>Move</DropdownItem>
              <DropdownItem>Clone</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownItemGroup>
          </DropdownMenu>
        </div>
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
  );
};

export default DropdownMenuZIndex;
