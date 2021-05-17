import transformer from '../13.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('all transforms should be applied', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  // Note the first 2 are extreme cases, not many usages would have all these use cases
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React, { useState } from "react";
      import Tabs, { TabItem } from "@atlaskit/tabs";
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
        TabData,
      } from "@atlaskit/tabs/types";
      import { customComponents } from "./custom";

      const isContentPersisted = false;

      const tabs: Array<TabData> = [
        { label: 'Tab 1', content: One, testId: 'one' },
        { label: 'Tab 2', content: Two },
        { label: 'Tab 3', content: Three },
        { label: 'Tab 4', content: Four },
      ];

      export default function defaultTabs() {
        const [selected, setSelected] = useState(0);
        const isSelectedTest = (selected, tab, tabIndex) => tabIndex === 0;

        return (
          <Tabs
            onSelect={(selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex)}
            selected={selected}
            tabs={tabs}
            isContentPersisted={isContentPersisted}
            isSelectedTest={isSelectedTest}
            components={customComponents}
          />
        );
      }
      `,
    `
      /* TODO: (from codemod) We have added an "id" prop to "Tabs" for accessibility reasons.
      The codemod has added a random ID but you can add one that makes sense for your use case. */
      /* TODO: (from codemod) 
      This file uses onSelect and this prop has been changed names to onChange.

      The type of onChange has also changed from
      (selected: TabData, selectedIndex: number, analyticsEvent: UIAnalyticsEvent) => void;
      to
      (index: number, analyticsEvent: UIAnalyticsEvent) => void;

      The logic around selecting tabs has changed internally and there is no longer the concept of TabData.
      Tabs is now composable and the tabs prop has been removed.

      The codemod has changed your usage of onSelect to be one of onChange. We are using the tabs
      array and the selected index to pass the "selected tab" to your old onSelect function. This is
      functional but you may like to update your usage of tabs to fit with the new API.

      If you are using the selected prop you will need to ensure that you are passing in the index
      of the selected tab as it also doesn't accept TabData anymore. */
      /* TODO: (from codemod) 
      We could not automatically convert this code to the new API.

      This file uses \`Tabs\`’s \`component\` prop. This has been removed as part of moving to
      a compositional API.

      To create a custom tab (replacement for \`Item\` component) refer to the docs at
      https://atlassian.design/components/tabs/examples#customizing-tab

      To create a custom tab panel (replacement for \`Content\` component) refer to the docs at
      https://atlassian.design/components/tabs/examples#customizing-tab-panel */
      /* TODO: (from codemod) 
      We could not automatically convert this code to the new API.

      This file uses \`Tabs\`’s \`isSelectedTest\` prop. This has been removed as it is a second way
      to make \`Tabs\` controlled and is not needed.

      You will have to change your usage of \`tabs\` to use the \`selected\` prop.
      This is documented at https:atlassian.design/components/tabs/examples#controlled */
      import React, { useState } from "react";
      import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
      import { TabData } from "@atlaskit/tabs/types";
      import { customComponents } from "./custom";

      const isContentPersisted = false;

      const tabs: Array<TabData> = [
        { label: 'Tab 1', content: One, testId: 'one' },
        { label: 'Tab 2', content: Two },
        { label: 'Tab 3', content: Three },
        { label: 'Tab 4', content: Four },
      ];

      export default function defaultTabs() {
        const [selected, setSelected] = useState(0);
        const isSelectedTest = (selected, tab, tabIndex) => tabIndex === 0;

        return (
          (<Tabs
            onChange={(index, analyticsEvent) => {
              const selectedTab = tabs[index];
              ((selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex))(selectedTab, index, analyticsEvent);
            }}
            selected={selected}
            shouldUnmountTabPanelOnChange={!isContentPersisted}
            id="4fzzzxjylrx4fzzzxjylrx">
            <TabList>
              {tabs.map((tab, index) => <Tab testId={tab.testId} key={index}>{tab.label}</Tab>)}
            </TabList>
            {tabs.map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
          </Tabs>)
        );
      }
      `,
    'should change usages',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React, { useState } from "react";
      import Tabs, { TabItem, TabContent } from "@atlaskit/tabs";
      import {
        TabItemElementProps,
        TabItemComponentProvided,
        TabContentComponentProvided,
        TabItemType,
        TabContentType,
        SelectedProp,
        IsSelectedTestFunction,
        OnSelectCallback,
        TabsNavigationProps,
        Mode,
      } from "@atlaskit/tabs/types";
      import { TooltipItem, CustomContent } from './custom';

      export default function defaultTabs() {
        const [selected, setSelected] = useState(0);
        const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

        return (
          <Tabs
            selected={selected}
            tabs={[
              { label: 'Tab 1', content: One, testId: 'one' },
              { label: 'Tab 2', content: Two },
              { label: 'Tab 3', content: Three },
              { label: 'Tab 4', content: Four },
            ]}
            isSelectedTest={(selected, tab, tabIndex) => tabIndex === 0}
            isContentPersisted={true}
            components={{ Item: TooltipItem, Content: CustomContent}}
            onSelect={onSelect}
          />
        );
      }
      `,
    `
      /* TODO: (from codemod) We have added an "id" prop to "Tabs" for accessibility reasons.
      The codemod has added a random ID but you can add one that makes sense for your use case. */
      /* TODO: (from codemod) 
      This file uses onSelect and this prop has been changed names to onChange.

      The type of onChange has also changed from
      (selected: TabData, selectedIndex: number, analyticsEvent: UIAnalyticsEvent) => void;
      to
      (index: number, analyticsEvent: UIAnalyticsEvent) => void;

      The logic around selecting tabs has changed internally and there is no longer the concept of TabData.
      Tabs is now composable and the tabs prop has been removed.

      The codemod has changed your usage of onSelect to be one of onChange. We are using the tabs
      array and the selected index to pass the "selected tab" to your old onSelect function. This is
      functional but you may like to update your usage of tabs to fit with the new API.

      If you are using the selected prop you will need to ensure that you are passing in the index
      of the selected tab as it also doesn't accept TabData anymore. */
      /* TODO: (from codemod) 
      We could not automatically convert this code to the new API.

      This file uses \`Tabs\`’s \`component\` prop. This has been removed as part of moving to
      a compositional API.

      To create a custom tab (replacement for \`Item\` component) refer to the docs at
      https://atlassian.design/components/tabs/examples#customizing-tab

      To create a custom tab panel (replacement for \`Content\` component) refer to the docs at
      https://atlassian.design/components/tabs/examples#customizing-tab-panel */
      /* TODO: (from codemod) 
      We could not automatically convert this code to the new API.

      This file uses \`Tabs\`’s \`isSelectedTest\` prop. This has been removed as it is a second way
      to make \`Tabs\` controlled and is not needed.

      You will have to change your usage of \`tabs\` to use the \`selected\` prop.
      This is documented at https:atlassian.design/components/tabs/examples#controlled */
      import React, { useState } from "react";
      import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
      import { TooltipItem, CustomContent } from './custom';

      export default function defaultTabs() {
        const [selected, setSelected] = useState(0);
        const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

        return (
          (<Tabs
            selected={selected}
            onChange={(index, analyticsEvent) => {
              const selectedTab = [
                { label: 'Tab 1', content: One, testId: 'one' },
                { label: 'Tab 2', content: Two },
                { label: 'Tab 3', content: Three },
                { label: 'Tab 4', content: Four },
              ][index];

              onSelect(selectedTab, index, analyticsEvent);
            }}
            id="4fzzzxjylrx4fzzzxjylrx">
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
      }
      `,
    'should change usages with different variations of how the props are used',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React, { useState } from "react";
      import Tabs from "@atlaskit/tabs";
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
        TabData,
      } from "@atlaskit/tabs/types";

      const tabs: Array<TabData> = [
        { label: 'Tab 1', content: One, testId: 'one' },
        { label: 'Tab 2', content: Two },
        { label: 'Tab 3', content: Three },
        { label: 'Tab 4', content: Four },
      ];

      export default function defaultTabs() {
        const [selected, setSelected] = useState(0);

        return (
          <Tabs
            onSelect={(selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex)}
            selected={selected}
            tabs={tabs}
            isContentPersisted={false}
          />
        );
      }
      `,
    `
      /* TODO: (from codemod) We have added an "id" prop to "Tabs" for accessibility reasons.
      The codemod has added a random ID but you can add one that makes sense for your use case. */
      /* TODO: (from codemod) 
      This file uses onSelect and this prop has been changed names to onChange.

      The type of onChange has also changed from
      (selected: TabData, selectedIndex: number, analyticsEvent: UIAnalyticsEvent) => void;
      to
      (index: number, analyticsEvent: UIAnalyticsEvent) => void;

      The logic around selecting tabs has changed internally and there is no longer the concept of TabData.
      Tabs is now composable and the tabs prop has been removed.

      The codemod has changed your usage of onSelect to be one of onChange. We are using the tabs
      array and the selected index to pass the "selected tab" to your old onSelect function. This is
      functional but you may like to update your usage of tabs to fit with the new API.

      If you are using the selected prop you will need to ensure that you are passing in the index
      of the selected tab as it also doesn't accept TabData anymore. */
      import React, { useState } from "react";
      import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
      import { TabData } from "@atlaskit/tabs/types";

      const tabs: Array<TabData> = [
        { label: 'Tab 1', content: One, testId: 'one' },
        { label: 'Tab 2', content: Two },
        { label: 'Tab 3', content: Three },
        { label: 'Tab 4', content: Four },
      ];

      export default function defaultTabs() {
        const [selected, setSelected] = useState(0);

        return (
          (<Tabs
            onChange={(index, analyticsEvent) => {
              const selectedTab = tabs[index];
              ((selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex))(selectedTab, index, analyticsEvent);
            }}
            selected={selected}
            shouldUnmountTabPanelOnChange
            id="4fzzzxjylrx4fzzzxjylrx">
            <TabList>
              {tabs.map((tab, index) => <Tab testId={tab.testId} key={index}>{tab.label}</Tab>)}
            </TabList>
            {tabs.map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
          </Tabs>)
        );
      }
      `,
    'should change usages when not using components and isSelectedTest',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React, { useState } from "react";
      import Tabs from "@atlaskit/tabs";
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
      } from "@atlaskit/tabs/types";

      export default function defaultTabs(props) {
        const [selected, setSelected] = useState(0);

        return (
          <Tabs
            onSelect={(selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex)}
            selected={selected}
            {...props}
          />
        );
      }
      `,
    `
      /* TODO: (from codemod) We have added an "id" prop to "Tabs" for accessibility reasons.
      The codemod has added a random ID but you can add one that makes sense for your use case. */
      /* TODO: (from codemod) 
      This file uses onSelect and this prop has been changed names to onChange.

      The type of onChange has also changed from
      (selected: TabData, selectedIndex: number, analyticsEvent: UIAnalyticsEvent) => void;
      to
      (index: number, analyticsEvent: UIAnalyticsEvent) => void;

      The logic around selecting tabs has changed internally and there is no longer the concept of TabData.
      Tabs is now composable and the tabs prop has been removed.

      The codemod has changed your usage of onSelect to be one of onChange. We are using the tabs
      array and the selected index to pass the "selected tab" to your old onSelect function. This is
      functional but you may like to update your usage of tabs to fit with the new API.

      If you are using the selected prop you will need to ensure that you are passing in the index
      of the selected tab as it also doesn't accept TabData anymore. */
      /* TODO: (from codemod) 
      This file is spreading props on the Tabs component.

      The API has changed to be composable and a number of props have changed.
      - isSelectedTest no longer exists.
      - onSelect is now onChange and has a different type.
      - components prop has been removed in favour of the hooks, useTab and useTabPanel.
      - isContentPersisted is now called shouldUnmountTabPanelOnChange and its behaviour is inverted.

      If you were using any of these props, check the docs for the new API at
      https://atlassian.design/components/tabs/examples */
      import React, { useState } from "react";
      import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";

      export default function defaultTabs(props) {
        const [selected, setSelected] = useState(0);

        return (
          (<Tabs
            onChange={(index, analyticsEvent) => {
              const selectedTab = props.tabs[index];
              ((selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex))(selectedTab, index, analyticsEvent);
            }}
            selected={selected}
            {...props}
            id="4fzzzxjylrx4fzzzxjylrx"
            shouldUnmountTabPanelOnChange>
            <TabList>
              {props.tabs.map((tab, index) => <Tab testId={tab.testId} key={index}>{tab.label}</Tab>)}
            </TabList>
            {props.tabs.map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
          </Tabs>)
        );
      }
      `,
    'should change usages when spreading props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React, { useState } from "react";
      import Tabs, { TabItem, TabContent } from "@atlaskit/tabs";
      import {
        TabItemElementProps,
        TabItemComponentProvided,
        TabContentComponentProvided,
        TabItemType,
        TabContentType,
        SelectedProp,
        IsSelectedTestFunction,
        OnSelectCallback,
        TabsNavigationProps,
        Mode,
      } from "@atlaskit/tabs/types";
      import { TooltipItem, CustomContent } from './custom';

      export default function defaultTabs() {
        const [selected, setSelected] = useState(0);
        const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

        return (
          <Tabs
            onSelect={onSelect}
            selected={selected}
            tabs={[
              { label: 'Tab 1', content: One, testId: 'one' },
              { label: 'Tab 2', content: <CustomElement onChange={() => {console.log('big change')}} /> },
              { label: 'Tab 3', content: Three },
              { label: 'Tab 4', content: Four },
            ]}
            isSelectedTest={(selected, tab, tabIndex) => tabIndex === 0}
            isContentPersisted={true}
            components={{ Item: TooltipItem, Content: CustomContent}}
          />
        );
      }
      `,
    `
      /* TODO: (from codemod) We have added an "id" prop to "Tabs" for accessibility reasons.
      The codemod has added a random ID but you can add one that makes sense for your use case. */
      /* TODO: (from codemod) 
      This file uses onSelect and this prop has been changed names to onChange.

      The type of onChange has also changed from
      (selected: TabData, selectedIndex: number, analyticsEvent: UIAnalyticsEvent) => void;
      to
      (index: number, analyticsEvent: UIAnalyticsEvent) => void;

      The logic around selecting tabs has changed internally and there is no longer the concept of TabData.
      Tabs is now composable and the tabs prop has been removed.

      The codemod has changed your usage of onSelect to be one of onChange. We are using the tabs
      array and the selected index to pass the "selected tab" to your old onSelect function. This is
      functional but you may like to update your usage of tabs to fit with the new API.

      If you are using the selected prop you will need to ensure that you are passing in the index
      of the selected tab as it also doesn't accept TabData anymore. */
      /* TODO: (from codemod) 
      We could not automatically convert this code to the new API.

      This file uses \`Tabs\`’s \`component\` prop. This has been removed as part of moving to
      a compositional API.

      To create a custom tab (replacement for \`Item\` component) refer to the docs at
      https://atlassian.design/components/tabs/examples#customizing-tab

      To create a custom tab panel (replacement for \`Content\` component) refer to the docs at
      https://atlassian.design/components/tabs/examples#customizing-tab-panel */
      /* TODO: (from codemod) 
      We could not automatically convert this code to the new API.

      This file uses \`Tabs\`’s \`isSelectedTest\` prop. This has been removed as it is a second way
      to make \`Tabs\` controlled and is not needed.

      You will have to change your usage of \`tabs\` to use the \`selected\` prop.
      This is documented at https:atlassian.design/components/tabs/examples#controlled */
      import React, { useState } from "react";
      import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
      import { TooltipItem, CustomContent } from './custom';

      export default function defaultTabs() {
        const [selected, setSelected] = useState(0);
        const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

        return (
          (<Tabs
            onChange={(index, analyticsEvent) => {
              const selectedTab = [
                { label: 'Tab 1', content: One, testId: 'one' },
                { label: 'Tab 2', content: <CustomElement onChange={() => {console.log('big change')}} /> },
                { label: 'Tab 3', content: Three },
                { label: 'Tab 4', content: Four },
              ][index];

              onSelect(selectedTab, index, analyticsEvent);
            }}
            selected={selected}
            id="4fzzzxjylrx4fzzzxjylrx">
            <TabList>
              {[
                { label: 'Tab 1', content: One, testId: 'one' },
                { label: 'Tab 2', content: <CustomElement onChange={() => {console.log('big change')}} /> },
                { label: 'Tab 3', content: Three },
                { label: 'Tab 4', content: Four },
              ].map((tab, index) => <Tab testId={tab.testId} key={index}>{tab.label}</Tab>)}
            </TabList>
            {[
              { label: 'Tab 1', content: One, testId: 'one' },
              { label: 'Tab 2', content: <CustomElement onChange={() => {console.log('big change')}} /> },
              { label: 'Tab 3', content: Three },
              { label: 'Tab 4', content: Four },
            ].map((tab, index) => <TabPanel key={index}>{tab.content}</TabPanel>)}
          </Tabs>)
        );
      }
      `,
    'should change usages when onChange is defined in a child',
  );
});
