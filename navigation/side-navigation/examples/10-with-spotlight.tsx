/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import DropboxIcon from '@atlaskit/icon/glyph/dropbox';
import WorkIcon from '@atlaskit/icon/glyph/folder';
import CustomerIcon from '@atlaskit/icon/glyph/person';
import QueueIcon from '@atlaskit/icon/glyph/queues';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import LanguageIcon from '@atlaskit/icon/glyph/world';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@atlaskit/onboarding';
import { N10 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  ButtonItem,
  LinkItem,
  NavigationFooter,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  Section,
  SideNavigation,
} from '../src';

import AppFrame from './common/app-frame';
import SampleFooter from './common/sample-footer';
import SampleHeader from './common/sample-header';

const LanguageSettings = () => {
  return (
    <NestingItem
      iconBefore={<LanguageIcon label="" />}
      id="3-1"
      title="Language settings"
    >
      <Section>
        <ButtonItem>Customize</ButtonItem>

        <NestingItem id="3-1-1" title="German Settings">
          <Section>
            <ButtonItem>Hallo Welt!</ButtonItem>
          </Section>
        </NestingItem>
        <NestingItem id="3-1-2" title="English Settings">
          <Section>
            <ButtonItem>Hello World!</ButtonItem>
          </Section>
        </NestingItem>
      </Section>
    </NestingItem>
  );
};

const twoColumnWrapper = {
  display: 'flex',
  gap: 8,
};
const BasicExample = () => {
  return (
    <SpotlightManager>
      <div css={twoColumnWrapper}>
        <AppFrame hideAppBar>
          <SideNavigation label="project" testId="side-navigation">
            <NavigationHeader>
              <SampleHeader />
            </NavigationHeader>
            <NestableNavigationContent initialStack={[]}>
              <Section>
                <SpotlightTarget name="buttonItem">
                  <ButtonItem iconBefore={<WorkIcon label="" />}>
                    Your work
                  </ButtonItem>
                </SpotlightTarget>
                <SpotlightTarget name="linkItem">
                  <LinkItem href="#" iconBefore={<CustomerIcon label="" />}>
                    Your customers
                  </LinkItem>
                </SpotlightTarget>
                <SpotlightTarget name="disabledItem">
                  <NestingItem
                    id="4"
                    iconBefore={<DropboxIcon label="" />}
                    title="Dropbox"
                    isDisabled
                  >
                    <span />
                  </NestingItem>
                </SpotlightTarget>
                <SpotlightTarget name="nestingItem">
                  <NestingItem
                    id="3"
                    iconBefore={<SettingsIcon label="" />}
                    title="Settings"
                  >
                    <Section>
                      <LanguageSettings />
                    </Section>
                  </NestingItem>
                </SpotlightTarget>
                <SpotlightTarget name="selectedNestingItem">
                  <NestingItem
                    id="1"
                    isSelected
                    title="Queues view"
                    iconBefore={<QueueIcon label="" />}
                  >
                    <Section title="Queues">
                      <ButtonItem>Untriaged</ButtonItem>
                      <ButtonItem>My feature work</ButtonItem>
                      <ButtonItem>My bugfix work</ButtonItem>
                      <ButtonItem>Signals</ButtonItem>
                      <ButtonItem>Assigned to me</ButtonItem>
                    </Section>
                    <Section hasSeparator>
                      <ButtonItem>New queue</ButtonItem>
                    </Section>
                  </NestingItem>
                </SpotlightTarget>
              </Section>
            </NestableNavigationContent>
            <NavigationFooter>
              <SampleFooter />
            </NavigationFooter>
          </SideNavigation>
        </AppFrame>
        <SpotlightTransition>
          <SpotlightRenderer />
        </SpotlightTransition>
      </div>
    </SpotlightManager>
  );
};

const SpotlightRenderer = () => {
  const [variant, setVariant] = useState<number | undefined>();
  const variants = [
    <Spotlight
      targetBgColor={token('color.background.default', N10)}
      actions={[
        {
          onClick: () => setVariant(Number(variant) + 1),
          text: 'Next',
        },
      ]}
      dialogPlacement="bottom left"
      heading="Button Item"
      target="buttonItem"
      key="buttonItem"
    >
      <p id="buttonItemSpotlightMessage">Check out this cool thing</p>
    </Spotlight>,

    <Spotlight
      targetBgColor={token('color.background.default', N10)}
      actions={[
        {
          onClick: () => setVariant(Number(variant) + 1),
          text: 'Next',
        },
        {
          onClick: () => setVariant(Number(variant) - 1),
          text: 'Previous',
        },
      ]}
      dialogPlacement="bottom left"
      heading="Link Item"
      target="linkItem"
      key="linkItem"
    >
      <p id="linkItemSpotlightMessage">Check out this cool thing</p>
    </Spotlight>,

    <Spotlight
      targetBgColor={token('color.background.default', N10)}
      actions={[
        {
          onClick: () => setVariant(Number(variant) + 1),
          text: 'Next',
        },
        {
          onClick: () => setVariant(Number(variant) - 1),
          text: 'Previous',
        },
      ]}
      dialogPlacement="bottom left"
      heading="Disabled Item"
      target="disabledItem"
      key="disabledItem"
    >
      <p id="disabledItemSpotlightMessage">Check out this cool thing</p>
    </Spotlight>,

    <Spotlight
      targetBgColor={token('color.background.default', N10)}
      actions={[
        {
          onClick: () => setVariant(Number(variant) + 1),
          text: 'Next',
        },
        {
          onClick: () => setVariant(Number(variant) - 1),
          text: 'Previous',
        },
      ]}
      dialogPlacement="bottom left"
      heading="Nesting Item"
      target="nestingItem"
      key="nestingItem"
    >
      <p id="nestingItemSpotlightMessage">Check out this cool thing</p>
    </Spotlight>,

    <Spotlight
      targetBgColor={token('color.background.default', N10)}
      actions={[
        {
          onClick: () => setVariant(undefined),
          text: 'Finish',
        },
        {
          onClick: () => setVariant(Number(variant) - 1),
          text: 'Previous',
        },
      ]}
      dialogPlacement="bottom left"
      heading="Selected Nesting Item"
      target="selectedNestingItem"
      key="selectedNestingItem"
    >
      <p id="selectedNestingItemSpotlightMessage">Check out this cool thing</p>
    </Spotlight>,
  ];

  if (variant !== undefined) {
    return variants[variant];
  }

  return (
    <div>
      <button id="show-spotlight" onClick={() => setVariant(0)}>
        Show spotlight
      </button>
    </div>
  );
};
export default BasicExample;
