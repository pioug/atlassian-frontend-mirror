import React, { useState } from 'react';

import { Help } from '@atlaskit/atlassian-navigation';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
const HelpContent = () => (
  <MenuGroup testId={'nav-help-content'}>
    <Section title="Help">
      <ButtonItem>Atlassian Documentation</ButtonItem>
      <ButtonItem>Atlassian Community</ButtonItem>
      <ButtonItem>What's New</ButtonItem>
      <ButtonItem>Get Jira Mobile</ButtonItem>
      <ButtonItem>Keyboard shortcuts</ButtonItem>
      <ButtonItem>About Jira</ButtonItem>
    </Section>
    <Section title="Legal" hasSeparator>
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
      trigger={(triggerProps) => (
        <Help
          testId={'nav-help'}
          isSelected={isOpen}
          onClick={onClick}
          tooltip="Help"
          {...triggerProps}
        />
      )}
    />
  );
};
