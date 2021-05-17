import { createTransformer } from '@atlaskit/codemod-utils';

import { removeIsSelectedTestProp } from '../migrations/remove-isSelectedTest-prop';

const transformer = createTransformer([removeIsSelectedTestProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('remove isSelectedTest prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

    export default function defaultTabs() {
      const isSelectedTest = (selected, tab, tabIndex) => tabIndex === 0;

      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          isSelectedTest={isSelectedTest}
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
    /* TODO: (from codemod) 
    We could not automatically convert this code to the new API.

    This file uses \`Tabs\`’s \`isSelectedTest\` prop. This has been removed as it is a second way
    to make \`Tabs\` controlled and is not needed.

    You will have to change your usage of \`tabs\` to use the \`selected\` prop.
    This is documented at https:atlassian.design/components/tabs/examples#controlled */
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

    export default function defaultTabs() {
      const isSelectedTest = (selected, tab, tabIndex) => tabIndex === 0;

      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default">
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
    'should remove isSelectedTest if it is defined inline',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { isSelectedTest } from 'utils';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          isSelectedTest={isSelectedTest}
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
    /* TODO: (from codemod) 
    We could not automatically convert this code to the new API.

    This file uses \`Tabs\`’s \`isSelectedTest\` prop. This has been removed as it is a second way
    to make \`Tabs\` controlled and is not needed.

    You will have to change your usage of \`tabs\` to use the \`selected\` prop.
    This is documented at https:atlassian.design/components/tabs/examples#controlled */
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { isSelectedTest } from 'utils';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default">
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
    'should remove isSelectedTest if it is imported',
  );
});
