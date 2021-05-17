import { createTransformer } from '@atlaskit/codemod-utils';

import { migrateOnSelectType } from '../migrations/onSelect-to-onChange';

const transformer = createTransformer([migrateOnSelectType]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('change onSelect to onChange', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { useState } from 'react';
    import Tabs from '@atlaskit/tabs';
    import { TabData } from '@atlaskit/tabs/types';

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
        />
      );
    }
    `,
    `
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
    import React, { useState } from 'react';
    import Tabs from '@atlaskit/tabs';
    import { TabData } from '@atlaskit/tabs/types';

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
          onChange={(index, analyticsEvent) => {
            const selectedTab = tabs[index];
            ((selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex))(selectedTab, index, analyticsEvent);
          }}
          selected={selected}
          tabs={tabs}
        />
      );
    }
    `,
    'should change inline usage of onSelect to IIFE onChange and find the relevant tab data',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { useState } from 'react';
    import Tabs from '@atlaskit/tabs';

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      return (
        <Tabs
          onSelect={(selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex)}
          selected={selected}
          tabs={[
            { label: 'Tab 1', content: One, testId: 'one' },
            { label: 'Tab 2', content: Two },
            { label: 'Tab 3', content: Three },
            { label: 'Tab 4', content: Four },
          ]}
        />
      );
    }
    `,
    `
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
    import React, { useState } from 'react';
    import Tabs from '@atlaskit/tabs';

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      return (
        <Tabs
          onChange={(index, analyticsEvent) => {
            const selectedTab = [
              { label: 'Tab 1', content: One, testId: 'one' },
              { label: 'Tab 2', content: Two },
              { label: 'Tab 3', content: Three },
              { label: 'Tab 4', content: Four },
            ][index];

            ((selected, selectedIndex, analyticsEvent) => setSelected(selectedIndex))(selectedTab, index, analyticsEvent);
          }}
          selected={selected}
          tabs={[
            { label: 'Tab 1', content: One, testId: 'one' },
            { label: 'Tab 2', content: Two },
            { label: 'Tab 3', content: Three },
            { label: 'Tab 4', content: Four },
          ]}
        />
      );
    }
    `,
    'should change inline usage of onSelect to IIFE onChange and find the relevant tab data if tabs is defined inline',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';
    import { TabData } from '@atlaskit/tabs/types';

    const tabs: Array<TabData> = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          onSelect={onSelect}
          selected={selected}
          tabs={tabs}
        />
      );
    }
    `,
    `
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
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';
    import { TabData } from '@atlaskit/tabs/types';

    const tabs: Array<TabData> = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          onChange={(index, analyticsEvent) => {
            const selectedTab = tabs[index];
            onSelect(selectedTab, index, analyticsEvent);
          }}
          selected={selected}
          tabs={tabs}
        />
      );
    }
    `,
    'should change usage of onSelect to onChange with the relevant tab data',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          onSelect={onSelect}
          selected={selected}
          tabs={[
            { label: 'Tab 1', content: One, testId: 'one' },
            { label: 'Tab 2', content: Two },
            { label: 'Tab 3', content: Three },
            { label: 'Tab 4', content: Four },
          ]}
        />
      );
    }
    `,
    `
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
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          onChange={(index, analyticsEvent) => {
            const selectedTab = [
              { label: 'Tab 1', content: One, testId: 'one' },
              { label: 'Tab 2', content: Two },
              { label: 'Tab 3', content: Three },
              { label: 'Tab 4', content: Four },
            ][index];

            onSelect(selectedTab, index, analyticsEvent);
          }}
          selected={selected}
          tabs={[
            { label: 'Tab 1', content: One, testId: 'one' },
            { label: 'Tab 2', content: Two },
            { label: 'Tab 3', content: Three },
            { label: 'Tab 4', content: Four },
          ]}
        />
      );
    }
    `,
    'should change usage of onSelect to onChange with the relevant tab data if tabs is defined inline',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';

    const getTabs = () => (
      [
        { label: 'Tab 1', content: One, testId: 'one' },
        { label: 'Tab 2', content: Two },
        { label: 'Tab 3', content: Three },
        { label: 'Tab 4', content: Four },
      ]
    );

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          onSelect={onSelect}
          selected={selected}
          tabs={getTabs()}
        />
      );
    }
    `,
    `
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
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';

    const getTabs = () => (
      [
        { label: 'Tab 1', content: One, testId: 'one' },
        { label: 'Tab 2', content: Two },
        { label: 'Tab 3', content: Three },
        { label: 'Tab 4', content: Four },
      ]
    );

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          onChange={(index, analyticsEvent) => {
            const selectedTab = getTabs()[index];
            onSelect(selectedTab, index, analyticsEvent);
          }}
          selected={selected}
          tabs={getTabs()}
        />
      );
    }
  `,
    'should change usage of onSelect to onChange with the relevant tab data if tabs is a function',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';

    export default function defaultTabs(props) {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          onSelect={onSelect}
          selected={selected}
          {...props}
        />
      );
    }
    `,
    `
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
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';

    export default function defaultTabs(props) {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          onChange={(index, analyticsEvent) => {
            const selectedTab = props.tabs[index];
            onSelect(selectedTab, index, analyticsEvent);
          }}
          selected={selected}
          {...props}
        />
      );
    }
  `,
    'should change usage of onSelect to onChange if the tabs prop is spread',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          selected={selected}
          tabs={[
            { label: 'Tab 1', content: One, testId: 'one' },
            { label: 'Tab 2', content: <CustomElement onChange={() => {console.log('big change')}} /> },
            { label: 'Tab 3', content: Three },
            { label: 'Tab 4', content: Four },
          ]}
          onSelect={onSelect}
        />
      );
    }
    `,
    `
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
    import React, { useState } from 'react';

    import Tabs from '@atlaskit/tabs';

    export default function defaultTabs() {
      const [selected, setSelected] = useState(0);

      const onSelect = (selected, selectedIndex) => setSelected(selectedIndex);

      return (
        <Tabs
          selected={selected}
          tabs={[
            { label: 'Tab 1', content: One, testId: 'one' },
            { label: 'Tab 2', content: <CustomElement onChange={() => {console.log('big change')}} /> },
            { label: 'Tab 3', content: Three },
            { label: 'Tab 4', content: Four },
          ]}
          onChange={(index, analyticsEvent) => {
            const selectedTab = [
              { label: 'Tab 1', content: One, testId: 'one' },
              { label: 'Tab 2', content: <CustomElement onChange={() => {console.log('big change')}} /> },
              { label: 'Tab 3', content: Three },
              { label: 'Tab 4', content: Four },
            ][index];

            onSelect(selectedTab, index, analyticsEvent);
          }}
        />
      );
    }
    `,
    'should change usage of onSelect to onChange with the relevant tab data if onChange is defined in tabs children',
  );
});
