import React, { useState } from 'react';

import { ButtonItem, HeadingItem, MenuGroup, Section } from '@atlaskit/menu';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
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

class MockNotificationLogClient extends NotificationLogClient {
  mockedCount = 0;

  constructor(mockedCount: number) {
    super('', '');

    this.mockedCount = mockedCount;
  }

  public async countUnseenNotifications() {
    return Promise.resolve({ count: this.mockedCount });
  }
}

const client = new MockNotificationLogClient(5);
const emptyClient = new MockNotificationLogClient(0);

export const HelpPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const [buttonLabel, setButtonLabel] = useState<number | undefined>();

  const NotificationsBadge = () => (
    <NotificationIndicator
      max={3}
      onCountUpdated={updateButtonLabel}
      // force a zero-count after the drawer has been opened
      notificationLogProvider={Promise.resolve(
        interacted ? emptyClient : client,
      )}
    />
  );

  const updateButtonLabel = ({
    newCount,
    oldCount,
    source,
  }: {
    newCount: number;
    oldCount?: number;
    source?: string;
  }) => {
    setButtonLabel(newCount || 0);
  };

  const onClick = () => {
    // let the badge icon know to clear its count
    setInteracted(true);
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
          badge={NotificationsBadge}
          isSelected={isOpen}
          onClick={onClick}
          tooltip={`Help. Notifications (${buttonLabel})`}
          {...triggerProps}
        />
      )}
    />
  );
};
