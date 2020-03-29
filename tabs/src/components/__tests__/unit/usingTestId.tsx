import { render } from '@testing-library/react';
import React from 'react';

import Tabs from '../../../components/Tabs';

const tabs = [
  { label: 'Tab 1', content: <p>One</p> },
  { label: 'Tab 2', content: <p>Two</p> },
  { label: 'Tab 3', content: <p>Three</p> },
  { label: 'Tab 4', content: <p>Four</p> },
];

const tabsWithTestIds = tabs.map((tab, index) => ({
  ...tab,
  testId: `tab-${index + 1}`,
}));

describe('Tabs should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const tabsTestId = 'the-tabs';
    const tabTestId = 'tab-1';
    const { getByTestId } = render(
      <Tabs tabs={tabsWithTestIds} testId={tabsTestId} />,
    );

    expect(getByTestId(tabsTestId)).toBeTruthy();
    expect(getByTestId(tabTestId)).toBeTruthy();
  });
});
