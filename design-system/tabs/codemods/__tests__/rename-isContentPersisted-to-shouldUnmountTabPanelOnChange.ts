import { createTransformer } from '@atlaskit/codemod-utils';

import { renameIsContentPersistedToShouldUnmountTabPanelOnChange } from '../migrations/rename-isContentPersisted-to-shouldUnmountTabPanelOnChange';

const transformer = createTransformer([
  renameIsContentPersistedToShouldUnmountTabPanelOnChange,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('remove isSelectedTest prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          isContentPersisted={false}
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

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          shouldUnmountTabPanelOnChange
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
    'should change isContentPersisted=false to shouldUnmountTabPanelOnChange',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          isContentPersisted={true}
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
    'should remove isContentPersisted if set to true as that is now default behaviour',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          isContentPersisted
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
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

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
    'should remove isContentPersisted if its a simple boolean prop "true" as that is now default behaviour',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

    const isContentPersisted = false;

    export default function defaultTabs() {

      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          isContentPersisted={isContentPersisted}
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

    const isContentPersisted = false;

    export default function defaultTabs() {

      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          shouldUnmountTabPanelOnChange={!isContentPersisted}
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
    'should use the negation of isContentPersisted for shouldUnmountTabPanelOnChange',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

    export default function defaultTabs() {

      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
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
    import React from 'react';

    import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

    export default function defaultTabs() {

      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          shouldUnmountTabPanelOnChange>
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
    'should add shouldUnmountTabPanelOnChange if not defined',
  );
});
