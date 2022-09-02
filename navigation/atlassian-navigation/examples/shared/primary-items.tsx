import React, { KeyboardEvent, useState } from 'react';

import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { PopupProps } from '@atlaskit/popup/types';

import {
  PrimaryButton,
  PrimaryButtonProps,
  PrimaryDropdownButton,
} from '../../src';
import { useOverflowStatus } from '../../src/controllers/overflow';

const NavigationButton = (props: PrimaryButtonProps) => {
  const { isVisible } = useOverflowStatus();
  if (isVisible) {
    return <PrimaryButton {...props} />;
  } else {
    return <ButtonItem>{props.children}</ButtonItem>;
  }
};

const ProjectsContent = () => (
  <MenuGroup>
    <Section title="Starred">
      <ButtonItem>Mobile Research</ButtonItem>
      <ButtonItem testId="it-services">IT Services</ButtonItem>
    </Section>
    <Section hasSeparator title="Recent">
      <ButtonItem>Engineering Leadership</ButtonItem>
      <ButtonItem>BAU</ButtonItem>
      <ButtonItem>Hardware Support</ButtonItem>
      <ButtonItem>New Features</ButtonItem>
      <ButtonItem>SAS</ButtonItem>
    </Section>
    <Section hasSeparator>
      <ButtonItem>View all projects</ButtonItem>
    </Section>
  </MenuGroup>
);

type PrimaryDropdownProps = {
  content: PopupProps['content'];
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  text: string;
  isHighlighted?: boolean;
};

const PrimaryDropdown = (props: PrimaryDropdownProps) => {
  const { content, text, isHighlighted } = props;
  const { isVisible, closeOverflowMenu } = useOverflowStatus();
  const [isOpen, setIsOpen] = useState(false);
  const onDropdownItemClick = () => {
    console.log(
      'Programmatically closing the menu, even though the click happens inside the popup menu.',
    );
    closeOverflowMenu();
  };

  if (!isVisible) {
    return (
      <ButtonItem testId={text} onClick={onDropdownItemClick}>
        {text}
      </ButtonItem>
    );
  }

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown') {
      setIsOpen(true);
    }
  };

  return (
    <Popup
      content={content}
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      testId={`${text}-popup`}
      trigger={(triggerProps) => (
        <PrimaryDropdownButton
          onClick={onClick}
          onKeyDown={onKeyDown}
          isHighlighted={isHighlighted}
          isSelected={isOpen}
          testId={`${text}-popup-trigger`}
          {...triggerProps}
        >
          {text}
        </PrimaryDropdownButton>
      )}
    />
  );
};

export const bitbucketPrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    Your work
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Workspaces click', ...args);
    }}
  >
    Workspaces
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Repositories click', ...args);
    }}
  >
    Repositories
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Projects click', ...args);
    }}
  >
    Projects
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Pull requests click', ...args);
    }}
  >
    Pull requests
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
  >
    Issues
  </NavigationButton>,
];

export const confluencePrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Activity click', ...args);
    }}
  >
    Activity
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    Your work
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Spaces click', ...args);
    }}
  >
    Spaces
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('People click', ...args);
    }}
  >
    People
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
  >
    Apps
  </NavigationButton>,
];

export const jiraPrimaryItems = [
  <PrimaryDropdown content={ProjectsContent} text="Projects" />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    isHighlighted
  >
    Filters
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Dashboards click', ...args);
    }}
  >
    Dashboards
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
  >
    Apps
  </NavigationButton>,
];

export const opsGeniePrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Alerts click', ...args);
    }}
  >
    Alerts
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Incidents click', ...args);
    }}
  >
    Incidents
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Who is on-call click', ...args);
    }}
  >
    Who is on-call
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Teams click', ...args);
    }}
  >
    Teams
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Services click', ...args);
    }}
  >
    Services
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Analytics click', ...args);
    }}
  >
    Analytics
  </NavigationButton>,
];

export const defaultPrimaryItems = jiraPrimaryItems;
