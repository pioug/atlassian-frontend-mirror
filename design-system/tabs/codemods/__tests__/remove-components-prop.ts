import { createTransformer } from '@atlaskit/codemod-utils';

import { removeComponentsProp } from '../migrations/remove-components-prop';

const transformer = createTransformer([removeComponentsProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('remove components prop', () => {
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
    /* TODO: (from codemod) 
    We could not automatically convert this code to the new API.

    This file uses \`Tabs\`’s \`component\` prop. This has been removed as part of moving to
    a compositional API.

    To create a custom tab (replacement for \`Item\` component) refer to the docs at
    https://atlassian.design/components/tabs/examples#customizing-tab

    To create a custom tab panel (replacement for \`Content\` component) refer to the docs at
    https://atlassian.design/components/tabs/examples#customizing-tab-panel */
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { customComponents } from './custom';

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
    'should remove component prop if using variable',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { TooltipItem, CustomContent } from './custom';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          components={{ Item: TooltipItem, Content: CustomContent}}
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

    This file uses \`Tabs\`’s \`component\` prop. This has been removed as part of moving to
    a compositional API.

    To create a custom tab (replacement for \`Item\` component) refer to the docs at
    https://atlassian.design/components/tabs/examples#customizing-tab

    To create a custom tab panel (replacement for \`Content\` component) refer to the docs at
    https://atlassian.design/components/tabs/examples#customizing-tab-panel */
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
    import { TooltipItem, CustomContent } from './custom';

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
    'should remove component prop if using an object',
  );
});
