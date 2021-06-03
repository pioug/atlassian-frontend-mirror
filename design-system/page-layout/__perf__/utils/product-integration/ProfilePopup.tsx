import React, { useState } from 'react';

import { Profile } from '@atlaskit/atlassian-navigation';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';

export const DefaultProfile = () => (
  <Profile
    icon={<img src={avatarUrl} alt="Your profile and settings" />}
    onClick={() => {}}
    tooltip="Your profile and settings"
  />
);

export const avatarUrl =
  'data:image/png;base64,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';

const ProfileContent = () => (
  <MenuGroup>
    <Section>
      <ButtonItem>Give us feedback</ButtonItem>
    </Section>
    <Section title="Jira" hasSeparator>
      <ButtonItem>Settings</ButtonItem>
    </Section>
    <Section title="John Smith" hasSeparator>
      <ButtonItem>Profile</ButtonItem>
      <ButtonItem>Account settings</ButtonItem>
      <ButtonItem>Logout</ButtonItem>
    </Section>
  </MenuGroup>
);

const imgCSS = {
  borderRadius: '100%',
  height: 24,
  width: 24,
};
export const ProfilePopup = () => {
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
      content={ProfileContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={(triggerProps) => (
        <Profile
          icon={
            <img
              style={imgCSS}
              src={avatarUrl}
              alt="Your profile and settings"
            />
          }
          onClick={onClick}
          isSelected={isOpen}
          tooltip="Your profile and settings"
          {...triggerProps}
        />
      )}
    />
  );
};
