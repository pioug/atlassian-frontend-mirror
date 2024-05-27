import React, { type KeyboardEvent, useState } from 'react';

import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { type PopupProps } from '@atlaskit/popup/types';

import {
  PrimaryButton,
  type PrimaryButtonProps,
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
  isOpen?: boolean;
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
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    Your work
  </NavigationButton>,
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
      console.log('Teams click', ...args);
    }}
  >
    Teams
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Plans click', ...args);
    }}
  >
    Plans
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Assets click', ...args);
    }}
  >
    Assets
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

export const jiraPrimaryItemsGerman = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    Ihre Aufgaben
  </NavigationButton>,
  <PrimaryDropdown content={ProjectsContent} text="Projekte" />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    isHighlighted
  >
    Filter
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
      console.log('Teams click', ...args);
    }}
  >
    Teams
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Plans click', ...args);
    }}
  >
    Pläne
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Assets click', ...args);
    }}
  >
    Assets
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
  >
    Apps
  </NavigationButton>,
];

export const jiraPrimaryItemsSpanish = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    Tu trabajo
  </NavigationButton>,
  <PrimaryDropdown content={ProjectsContent} text="Projects" />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    isHighlighted
  >
    Filtros
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Dashboards click', ...args);
    }}
  >
    Paneles
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Teams click', ...args);
    }}
  >
    Equipos
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Plans click', ...args);
    }}
  >
    Planes
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Assets click', ...args);
    }}
  >
    Activos
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
  >
    Aplicaciones
  </NavigationButton>,
];

export const jiraPrimaryItemsTurkish = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    Çalışmalarınız
  </NavigationButton>,
  <PrimaryDropdown content={ProjectsContent} text="Projeler" />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    isHighlighted
  >
    Filtreler
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Dashboards click', ...args);
    }}
  >
    Gösterge Panoları
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Teams click', ...args);
    }}
  >
    Takımlar
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Plans click', ...args);
    }}
  >
    Planlar
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Assets click', ...args);
    }}
  >
    Varlıklar
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
  >
    Uygulamalar
  </NavigationButton>,
];

export const jiraPrimaryItemsJapanese = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    あなたの作業
  </NavigationButton>,
  <PrimaryDropdown content={ProjectsContent} text="プロジェクト" />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    isHighlighted
  >
    フィルター
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Dashboards click', ...args);
    }}
  >
    ダッシュボード
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Teams click', ...args);
    }}
  >
    チーム
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Plans click', ...args);
    }}
  >
    プラン
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Assets click', ...args);
    }}
  >
    アセット
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
  >
    アプリ
  </NavigationButton>,
];

export const defaultPrimaryItems = jiraPrimaryItems;
