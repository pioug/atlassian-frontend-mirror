import React, { useState } from 'react';

import { ButtonItem, HeadingItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';

import { Settings } from '../../src';

const SettingsContent = () => (
  <MenuGroup>
    <Section>
      <HeadingItem>App</HeadingItem>
      <ButtonItem>Admin settings</ButtonItem>
      <ButtonItem>Third party extensions</ButtonItem>
    </Section>
    <Section hasSeparator>
      <HeadingItem>Atlassian</HeadingItem>
      <ButtonItem>Customers</ButtonItem>
      <ButtonItem>Try Jira</ButtonItem>
    </Section>
  </MenuGroup>
);

export const DefaultSettings = () => {
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
      content={SettingsContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={(triggerProps) => (
        <Settings onClick={onClick} tooltip="Settings" {...triggerProps} />
      )}
    />
  );
};

export default DefaultSettings;
