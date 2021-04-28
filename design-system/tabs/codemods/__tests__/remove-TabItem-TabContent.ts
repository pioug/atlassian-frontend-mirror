import { createTransformer } from '@atlaskit/codemod-utils';

import { removeTabItemTabContent } from '../migrations/remove-TabItem-TabContent';

const transformer = createTransformer([removeTabItemTabContent]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

// I'm not adding a comment here as the components codemod will add one
describe('remove TabItem and TabContent import', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Tabs, { TabItem, TabContent } from '@atlaskit/tabs';

    const TooltipItem = (props: TabItemComponentProvided) => (
      <Tooltip content={props.data.tooltip}>
        <TabItem {...props} />
      </Tooltip>
    );

    const CustomContent = (props) => (
      <Tooltip content={props.data.tooltip}>
        <TabContent {...props} />
      </Tooltip>
    );

    const tabs = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          tabs={tabs}
          components={{ Item: TooltipItem, Content: CustomContent}}
        />
      );
    }
    `,
    `
    import React from 'react';
    import Tabs from '@atlaskit/tabs';

    const TooltipItem = (props: TabItemComponentProvided) => (
      <Tooltip content={props.data.tooltip}>
        <TabItem {...props} />
      </Tooltip>
    );

    const CustomContent = (props) => (
      <Tooltip content={props.data.tooltip}>
        <TabContent {...props} />
      </Tooltip>
    );

    const tabs = [
      { label: 'Tab 1', content: One, testId: 'one' },
      { label: 'Tab 2', content: Two },
      { label: 'Tab 3', content: Three },
      { label: 'Tab 4', content: Four },
    ];

    export default function defaultTabs() {
      return (
        <Tabs
          onChange={index => console.log('Selected Tab', index + 1)}
          id="default"
          testId="default"
          tabs={tabs}
          components={{ Item: TooltipItem, Content: CustomContent}}
        />
      );
    }
    `,
    'should remove TabItem and TabContent',
  );
});
