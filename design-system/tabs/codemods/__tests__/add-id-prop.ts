import { createTransformer } from '@atlaskit/codemod-utils';

import { addIdProp } from '../migrations/add-id-prop';

const transformer = createTransformer([addIdProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('add id prop', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { customComponents } from './custom';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          testId="default"
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
    /* TODO: (from codemod) We have added an "id" prop to "Tabs" for accessibility reasons.
    The codemod has added a random ID but you can add one that makes sense for your use case. */
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { customComponents } from './custom';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          testId="default"
          id="4fzzzxjylrx4fzzzxjylrx">
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
    'should add an id prop',
  );
});
