/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/react';

import DropboxIcon from '@atlaskit/icon/glyph/dropbox';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import WorkIcon from '@atlaskit/icon/glyph/folder';
import LightbulbIcon from '@atlaskit/icon/glyph/lightbulb';
import CustomerIcon from '@atlaskit/icon/glyph/person';
import QueueIcon from '@atlaskit/icon/glyph/queues';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import LanguageIcon from '@atlaskit/icon/glyph/world';

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
      id="language-menu"
      title="Language settings"
    >
      <Section>
        <ButtonItem>Customize</ButtonItem>

        <NestingItem id="german-settings" title="German Settings">
          <Section>
            <ButtonItem>Hallo Welt!</ButtonItem>
          </Section>
        </NestingItem>
        <NestingItem id="english-settings" title="English Settings">
          <Section>
            <ButtonItem>Hello World!</ButtonItem>
          </Section>
        </NestingItem>
      </Section>
    </NestingItem>
  );
};

const BasicExample = () => {
  return (
    <AppFrame shouldHideAppBar>
      <SideNavigation label="project" testId="side-navigation">
        <NavigationHeader>
          <SampleHeader />
        </NavigationHeader>
        <NestableNavigationContent
          initialStack={[]}
          testId="nestable-navigation-content"
        >
          <Section isList>
            <NestingItem
              id="filters"
              testId="filter-nesting-item"
              title="Filters"
              iconBefore={<FilterIcon label="" />}
              iconAfter={<LightbulbIcon label="" />}
            >
              <Section>
                <ButtonItem>Search issues</ButtonItem>
              </Section>
              <Section title="Starred" isList>
                <ButtonItem>Everything for me</ButtonItem>
                <ButtonItem>My open issues</ButtonItem>
                <ButtonItem>Reported by me</ButtonItem>
              </Section>
              <Section hasSeparator title="Other" isList>
                <ButtonItem>All issues</ButtonItem>
                <ButtonItem>Open issues</ButtonItem>
                <ButtonItem>Created recently</ButtonItem>
                <ButtonItem>Resolved recently</ButtonItem>
              </Section>
              <Section hasSeparator>
                <ButtonItem>View all filters</ButtonItem>
              </Section>
            </NestingItem>
            <NestingItem
              id="queues"
              testId="selected"
              isSelected
              title="Queues view"
              iconBefore={<QueueIcon label="" />}
            >
              <Section title="Queues" isList>
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
            <NestingItem
              id="settings"
              iconBefore={<SettingsIcon label="" />}
              title="Settings"
              testId="settings-nesting-item"
            >
              <Section>
                <LanguageSettings />
              </Section>
            </NestingItem>
            <NestingItem
              id="dropbox"
              iconBefore={<DropboxIcon label="" />}
              title="Dropbox"
              testId="dropbox-nesting-item"
              isDisabled
            >
              <Fragment />
            </NestingItem>
            <ButtonItem iconBefore={<WorkIcon label="" />}>
              Your work
            </ButtonItem>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <LinkItem href="#" iconBefore={<CustomerIcon label="" />}>
              Your customers
            </LinkItem>
          </Section>
        </NestableNavigationContent>
        <NavigationFooter>
          <SampleFooter />
        </NavigationFooter>
      </SideNavigation>
    </AppFrame>
  );
};

export default BasicExample;
