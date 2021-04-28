import { createTransformer } from '@atlaskit/codemod-utils';

import { removeTypes } from '../migrations/remove-types';

const transformer = createTransformer([removeTypes]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('remove components prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import {
      TabItemElementProps,
      TabItemComponentProvided,
      TabContentComponentProvided,
      TabItemType,
      TabContentType,
      SelectedProp,
      IsSelectedTestFunction,
      OnSelectCallback,
      TabsState,
      TabsNavigationProps,
      Mode,
    } from '@atlaskit/tabs/types';
    import { customComponents } from './custom';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          components={customComponents}
        >
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
            <Tab>Tab 4</Tab>
          </TabList>
          <TabPanel>One</TabPanel>
          <TabPanel>Two</TabPanel>
          <TabPanel>Three</TabPanel>
          <TabPanel>Four</TabPanel>
        </Tabs>
      );
    }
    `,
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { customComponents } from './custom';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          components={customComponents}
        >
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
            <Tab>Tab 4</Tab>
          </TabList>
          <TabPanel>One</TabPanel>
          <TabPanel>Two</TabPanel>
          <TabPanel>Three</TabPanel>
          <TabPanel>Four</TabPanel>
        </Tabs>
      );
    }
    `,
    'should remove types that no longe exist and remove line',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import {
      TabData,
      TabItemElementProps,
      TabItemComponentProvided,
      TabContentComponentProvided,
      TabItemType,
      TabContentType,
      SelectedProp,
      IsSelectedTestFunction,
      OnSelectCallback,
      TabsState,
      TabsNavigationProps,
      TabsProps as NewTabsProps,
      Mode,
    } from '@atlaskit/tabs/types';
    import { customComponents } from './custom';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          components={customComponents}
        >
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
            <Tab>Tab 4</Tab>
          </TabList>
          <TabPanel>One</TabPanel>
          <TabPanel>Two</TabPanel>
          <TabPanel>Three</TabPanel>
          <TabPanel>Four</TabPanel>
        </Tabs>
      );
    }
    `,
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { TabData, TabsProps as NewTabsProps } from '@atlaskit/tabs/types';
    import { customComponents } from './custom';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          components={customComponents}
        >
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
            <Tab>Tab 4</Tab>
          </TabList>
          <TabPanel>One</TabPanel>
          <TabPanel>Two</TabPanel>
          <TabPanel>Three</TabPanel>
          <TabPanel>Four</TabPanel>
        </Tabs>
      );
    }
    `,
    'should remove types that no longer exist but keep ones that do exist',
  );
});
