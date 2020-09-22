import React from 'react';

import Tabs from '../src';

const tabs = [
  { label: 'Tab 1', content: <div>One</div> },
  { label: 'Tab 2', content: <div>Two</div> },
  { label: 'Tab 3', content: <div>Three</div> },
];

export default () => <Tabs tabs={tabs} />;
