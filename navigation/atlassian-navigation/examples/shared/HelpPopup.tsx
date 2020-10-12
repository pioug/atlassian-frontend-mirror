import React, { useState } from 'react';

import { ButtonItem, HeadingItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';

import { Help } from '../../src';

const HelpContent = () => (
  <MenuGroup>
    <Section>
      <HeadingItem>Help</HeadingItem>
      <ButtonItem>Atlassian Documentation</ButtonItem>
      <ButtonItem>Atlassian Community</ButtonItem>
      <ButtonItem>What's New</ButtonItem>
      <ButtonItem>Get Jira Mobile</ButtonItem>
      <ButtonItem>Keyboard shortcuts</ButtonItem>
      <ButtonItem>About Jira</ButtonItem>
    </Section>
    <Section hasSeparator>
      <HeadingItem>Legal</HeadingItem>
      <ButtonItem>Terms of use</ButtonItem>
      <ButtonItem>Privacy Policy</ButtonItem>
    </Section>
  </MenuGroup>
);

export const HelpPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={HelpContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={triggerProps => (
        <Help
          isSelected={isOpen}
          onClick={onClick}
          tooltip="Help"
          {...triggerProps}
        />
      )}
    />
  );
};
