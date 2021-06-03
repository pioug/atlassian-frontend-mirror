/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import ArrowRight from '@atlaskit/icon/glyph/arrow-right';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import { ButtonItem, PopupMenuGroup, Section } from '@atlaskit/menu';

import Popup from '../src';

const NestedPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopupMenuGroup onClick={(e) => e.stopPropagation()}>
      <Section>
        <ButtonItem>Create project</ButtonItem>
        <ButtonItem>View all projects</ButtonItem>
      </Section>
      <Section hasSeparator>
        <Popup
          isOpen={isOpen}
          placement="right-start"
          onClose={() => setIsOpen(false)}
          content={() => <NestedPopup />}
          trigger={(triggerProps) => (
            <ButtonItem
              {...triggerProps}
              isSelected={isOpen}
              onClick={() => setIsOpen(true)}
              iconAfter={<ArrowRight label="" />}
            >
              More actions
            </ButtonItem>
          )}
        />
      </Section>
    </PopupMenuGroup>
  );
};

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      content={() => <NestedPopup />}
      placement="bottom-start"
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          iconBefore={<MenuIcon label="" />}
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          Actions
        </Button>
      )}
    />
  );
};
