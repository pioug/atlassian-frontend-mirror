import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Tabs, { TabItem } from '../src';
import { Content } from './shared';
import { TabItemComponentProvided } from '../src/types';

export const tabs = [
  {
    label: 'Tab 1',
    content: <Content>One</Content>,
    tooltip: 'Tooltip for tab 1',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 2',
    content: <Content>Two</Content>,
    tooltip: 'Tooltip for tab 2',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 3',
    content: <Content>Three</Content>,
    tooltip: 'Tooltip for tab 3',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 4',
    content: <Content>Four</Content>,
    tooltip: 'Tooltip for tab 4',
    href: 'http://atlassian.design',
  },
];

/** This custom component wraps a tooltip around the tab item */
const TooltipItem = (props: TabItemComponentProvided) => (
  <Tooltip content={props.data.tooltip}>
    <TabItem {...props} />
  </Tooltip>
);

/** This custom component makes the tab items function like regular links */
const LinkItem = ({
  elementProps,
  // We're opting out of default keyboard navigation so we don't need innerRef
  innerRef,
  ...tabItemProps
}: TabItemComponentProvided) => {
  // We also remove the onKeyDown handler and tabIndex attribute
  // from elementProps to opt out of default keyboard navigation
  const { onKeyDown, tabIndex, ...requiredElementProps } = elementProps;
  return (
    <a
      // We add the rest of the elementProps to our <a>...
      {...requiredElementProps}
      href={tabItemProps.data.href}
      style={{ textDecoration: 'none' }}
    >
      {/* ...then pass the data and state params on to the TabItem */}
      <TabItem {...tabItemProps} />
    </a>
  );
};

export default () => (
  <div>
    <h3>Tabs with tooltips</h3>
    <Tabs
      components={{ Item: TooltipItem }}
      onSelect={(_tab, index) => console.log('Selected Tab', index + 1)}
      tabs={tabs}
    />
    <h3>Tabs as links</h3>
    <Tabs components={{ Item: LinkItem }} selected={tabs[0]} tabs={tabs} />
  </div>
);
