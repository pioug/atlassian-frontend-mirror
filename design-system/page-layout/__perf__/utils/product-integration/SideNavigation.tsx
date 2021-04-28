/** @jsx jsx */

import { jsx } from '@emotion/core';

import DropboxIcon from '@atlaskit/icon/glyph/dropbox';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import WorkIcon from '@atlaskit/icon/glyph/folder';
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
} from '@atlaskit/side-navigation';

import SampleFooter from './SampleFooter';
import SampleHeader from './SampleHeader';

const LanguageSettings = () => {
  return (
    <NestingItem
      iconBefore={<LanguageIcon label="" />}
      id="3-1"
      title="Language settings"
    >
      <ButtonItem>Customize</ButtonItem>

      <NestingItem id="3-1-1" title="German Settings">
        <ButtonItem>Hallo Welt!</ButtonItem>
      </NestingItem>
      <NestingItem id="3-1-2" title="English Settings">
        <ButtonItem>Hello World!</ButtonItem>
      </NestingItem>
    </NestingItem>
  );
};

const PerfExample = () => {
  return (
    <SideNavigation label="project" testId="side-navigation">
      <NavigationHeader>
        <SampleHeader />
      </NavigationHeader>
      <NestableNavigationContent initialStack={[]}>
        <Section>
          <ButtonItem iconBefore={<WorkIcon label="" />}>Your work</ButtonItem>
          <LinkItem href="#" iconBefore={<CustomerIcon label="" />}>
            Your customers
          </LinkItem>
          <NestingItem
            id="1"
            isSelected
            title="Queues view"
            testId="nav-side-queues"
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
          <NestingItem
            id="2"
            testId="filter-nesting-item"
            title="Filters"
            iconBefore={<FilterIcon label="" />}
          >
            <Section>
              <ButtonItem>Search issues</ButtonItem>
            </Section>
            <Section title="Starred">
              <ButtonItem>Everything me</ButtonItem>
              <ButtonItem>My open issues</ButtonItem>
              <ButtonItem>Reported by me</ButtonItem>
            </Section>
            <Section hasSeparator title="Other">
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
            id="3"
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
          >
            <LanguageSettings />
          </NestingItem>
          <NestingItem
            id="4"
            iconBefore={<DropboxIcon label="" />}
            title="Dropbox"
            isDisabled
          >
            <span />
          </NestingItem>
        </Section>
      </NestableNavigationContent>
      <NavigationFooter>
        <SampleFooter />
      </NavigationFooter>
    </SideNavigation>
  );
};

export default PerfExample;
