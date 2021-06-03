/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import FilterIcon from '@atlaskit/icon/glyph/filter';
import WorkIcon from '@atlaskit/icon/glyph/folder';
import CustomerIcon from '@atlaskit/icon/glyph/person';
import QueueIcon from '@atlaskit/icon/glyph/queues';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import LanguageIcon from '@atlaskit/icon/glyph/world';
import Select from '@atlaskit/select';

import {
  ButtonItem,
  HeadingItem,
  LinkItem,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  Section,
  SideNavigation,
} from '../src';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

interface OptionType {
  label: string;
  value: string[];
}

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

const ControlledExample = () => {
  const [stack, setStack] = useState<string[]>([]);

  return (
    <AppFrame
      content={
        <div css={{ flexGrow: 1, padding: 32 }}>
          <Select<OptionType>
            onChange={(value) => setStack((value as OptionType).value || [])}
            options={[
              { label: 'Root', value: [] },
              {
                label: 'Queues view',
                value: ['1'],
              },
              {
                label: 'Filters',
                value: ['2'],
              },
              {
                label: 'Settings',
                value: ['3'],
              },
              {
                label: 'Settings -> Language settings',
                value: ['3', '3-1'],
              },
              {
                label: 'Settings -> Language settings -> German settings',
                value: ['3', '3-1', '3-1-1'],
              },
              {
                label: 'Settings -> Language settings -> English settings',
                value: ['3', '3-1', '3-1-2'],
              },
              {
                label: 'Unknown view',
                value: ['potato'],
              },
            ]}
            value={{
              label: stack.length ? stack.join(',') : 'Root',
              value: stack,
            }}
          />
        </div>
      }
    >
      <SideNavigation label="project" testId="side-navigation">
        <NavigationHeader>
          <SampleHeader />
        </NavigationHeader>
        <NestableNavigationContent onChange={setStack} stack={stack}>
          <Section>
            <ButtonItem isSelected iconBefore={<WorkIcon label="" />}>
              Your work
            </ButtonItem>
            <LinkItem href="#" iconBefore={<CustomerIcon label="" />}>
              Your customers
            </LinkItem>
            <NestingItem
              id="1"
              title="Queues view"
              iconBefore={<QueueIcon label="" />}
            >
              <Section>
                <HeadingItem>Queues</HeadingItem>
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
              <Section>
                <HeadingItem>Starred</HeadingItem>
                <ButtonItem>Everything me</ButtonItem>
                <ButtonItem>My open issues</ButtonItem>
                <ButtonItem>Reported by me</ButtonItem>
              </Section>
              <Section hasSeparator>
                <HeadingItem>Other</HeadingItem>
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
          </Section>
        </NestableNavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default ControlledExample;
