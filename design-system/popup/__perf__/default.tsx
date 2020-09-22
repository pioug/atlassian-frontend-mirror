/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';

import Popup from '../src';

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      content={() => (
        <div
          css={{
            width: 175,
            height: 250,
          }}
        />
      )}
      trigger={triggerProps => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          iconBefore={<MediaServicesAddCommentIcon label="Add" />}
        />
      )}
    />
  );
};
