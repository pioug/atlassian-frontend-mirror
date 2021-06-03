import React from 'react';

import { cleanup, render } from '@testing-library/react';

import Tabs, { Tab, TabList, TabPanel } from '../../index';

afterEach(cleanup);

describe('Tabs should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const tabsTestId = 'the-tabs';
    const testIds = ['one', 'two', 'three'];
    const { getByTestId } = render(
      <Tabs testId={tabsTestId} id="test">
        <TabList>
          {testIds.map((testId) => (
            <Tab key={testId} testId={testId}>
              {testId}
            </Tab>
          ))}
        </TabList>
        {testIds.map((testId) => (
          <TabPanel key={testId} testId={`${testId}-panel`}>
            {testId} panel
          </TabPanel>
        ))}
      </Tabs>,
    );

    expect(getByTestId(tabsTestId)).toBeTruthy();
    testIds.forEach((testId) => {
      const tab = getByTestId(testId);
      expect(tab).toBeTruthy();
      expect(tab.innerText).toBe(testId);
    });
    // Only selected tab panel would render
    const tabPanel = getByTestId(`${testIds[0]}-panel`);
    expect(tabPanel).toBeTruthy();
    expect(tabPanel.innerText).toBe(`${testIds[0]} panel`);
  });
});
