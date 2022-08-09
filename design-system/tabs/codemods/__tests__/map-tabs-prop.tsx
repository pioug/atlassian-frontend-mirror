import { createTransformer } from '@atlaskit/codemod-utils';

import { mapTabsProp, removeTabsProp } from '../migrations/map-tabs-prop';

const transformer = createTransformer([mapTabsProp, removeTabsProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('map tabs prop to components', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import Tabs from "@atlaskit/tabs";

    const tabs = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default () => (
      <Tabs
        tabs={tabs}
      />
    );
    `,
    `
    import React from "react";
    import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";

    const tabs = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default () => (
      (<Tabs>
        <TabList>
          {tabs.map((tab, index) => <Tab testId={tab.testId} key={index}>{tab.label}</Tab>)}
        </TabList>
        {tabs.map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
      </Tabs>)
    );

    `,
    'should map tabs correctly',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import Tabs from "@atlaskit/tabs";

    export default () => (
      <Tabs
        tabs={[
          { label: 'Tab 1', content: One, testId: 'one' },
          { label: 'Tab 2', content: Two },
          { label: 'Tab 3', content: Three },
          { label: 'Tab 4', content: Four },
        ]}
      />
    );
    `,
    `
    import React from "react";
    import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";

    export default () => (
      (<Tabs>
        <TabList>
          {[
            { label: 'Tab 1', content: One, testId: 'one' },
            { label: 'Tab 2', content: Two },
            { label: 'Tab 3', content: Three },
            { label: 'Tab 4', content: Four },
          ].map((tab, index) => <Tab testId={tab.testId} key={index}>{tab.label}</Tab>)}
        </TabList>
        {[
          { label: 'Tab 1', content: One, testId: 'one' },
          { label: 'Tab 2', content: Two },
          { label: 'Tab 3', content: Three },
          { label: 'Tab 4', content: Four },
        ].map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
      </Tabs>)
    );

    `,
    'should map tabs correctly if defined inline',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import Tabs from "@atlaskit/tabs";

    const Tab = () => {};
    const TabList = () => {};

    const tabs = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default () => (
      <Tabs
        tabs={tabs}
      />
    );
    `,
    `
    import React from "react";
    import Tabs, { Tab as AtlaskitTab, TabList as AtlaskitTabList, TabPanel } from "@atlaskit/tabs";

    const Tab = () => {};
    const TabList = () => {};

    const tabs = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default () => (
      (<Tabs>
        <AtlaskitTabList>
          {tabs.map(
            (tab, index) => <AtlaskitTab testId={tab.testId} key={index}>{tab.label}</AtlaskitTab>
          )}
        </AtlaskitTabList>
        {tabs.map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
      </Tabs>)
    );

    `,
    'should map tabs correctly - with alias',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import Tabs from "@atlaskit/tabs";

    const Tab = () => {};
    const TabList = () => {};
    const TabPanel = () => {};

    const tabs = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default () => (
      <Tabs
        tabs={tabs}
      />
    );
    `,
    `
    import React from "react";
    import Tabs, {
      Tab as AtlaskitTab,
      TabList as AtlaskitTabList,
      TabPanel as AtlaskitTabPanel,
    } from "@atlaskit/tabs";

    const Tab = () => {};
    const TabList = () => {};
    const TabPanel = () => {};

    const tabs = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default () => (
      (<Tabs>
        <AtlaskitTabList>
          {tabs.map(
            (tab, index) => <AtlaskitTab testId={tab.testId} key={index}>{tab.label}</AtlaskitTab>
          )}
        </AtlaskitTabList>
        {tabs.map(
          (tab, index) => <AtlaskitTabPanel key={index}>{tab.content}</AtlaskitTabPanel>
        )}
      </Tabs>)
    );

    `,
    'should map tabs correctly - with all clashed',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import Tabs from "@atlaskit/tabs";

    const getTabs = () => (
      [
        { label: 'Tab 1', content: One, testId: 'one' },
        { label: 'Tab 2', content: Two },
        { label: 'Tab 3', content: Three },
        { label: 'Tab 4', content: Four },
      ]
    );

    export default () => (
      <Tabs
        tabs={getTabs()}
      />
    );
    `,
    `
    import React from "react";
    import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";

    const getTabs = () => (
      [
        { label: 'Tab 1', content: One, testId: 'one' },
        { label: 'Tab 2', content: Two },
        { label: 'Tab 3', content: Three },
        { label: 'Tab 4', content: Four },
      ]
    );

    export default () => (
      (<Tabs>
        <TabList>
          {getTabs().map((tab, index) => <Tab testId={tab.testId} key={index}>{tab.label}</Tab>)}
        </TabList>
        {getTabs().map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
      </Tabs>)
    );

    `,
    'should map tabs correctly if defined inline',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import Tabs from "@atlaskit/tabs";

    export default (props) => (
      <Tabs
        {...props}
      />
    );
    `,
    `
    /* TODO: (from codemod) 
    This file is spreading props on the Tabs component.

    The API has changed to be composable and a number of props have changed.
    - isSelectedTest no longer exists.
    - onSelect is now onChange and has a different type.
    - components prop has been removed in favour of the hooks, useTab and useTabPanel.
    - isContentPersisted is now called shouldUnmountTabPanelOnChange and its behaviour is inverted.

    If you were using any of these props, check the docs for the new API at
    https://atlassian.design/components/tabs/examples */
    import React from "react";
    import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";

    export default (props) => (
      (<Tabs {...props}>
        <TabList>
          {props.tabs.map((tab, index) => <Tab testId={tab.testId} key={index}>{tab.label}</Tab>)}
        </TabList>
        {props.tabs.map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
      </Tabs>)
    );

    `,
    'should map tabs correctly if spread is used',
  );
});
