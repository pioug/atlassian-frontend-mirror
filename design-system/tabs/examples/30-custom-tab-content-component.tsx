/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Tabs from '../src';
import { TabContentComponentProvided } from '../src/types';

export const tabs = [
  {
    label: 'Tab 1',
    heading: 'Tab One',
    body: 'This is tab one.',
    content: 1,
  },
  {
    label: 'Tab 2',
    heading: 'Tab Two',
    body: 'This is tab two.',
    content: 2,
  },
  {
    label: 'Tab 3',
    heading: 'Tab Three',
    body: 'This is tab three.',
    content: '3',
  },
  {
    label: 'Tab 4',
    heading: 'Tab Four',
    body: 'This is tab four.',
    content: '4',
  },
];

const CustomContent = ({ data, elementProps }: TabContentComponentProvided) => (
  <div
    css={css`
      padding: 20px;
    `}
    {...elementProps}
  >
    <h3>{data.heading}</h3>
    <p>{data.body}</p>
  </div>
);

export default () => (
  <div>
    <Tabs
      components={{ Content: CustomContent }}
      onSelect={(_tab, index) => console.log('Selected Tab', index + 1)}
      tabs={tabs}
    />
  </div>
);
