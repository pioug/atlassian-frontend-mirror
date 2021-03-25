import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';

import { Chart, ChartTypes } from '../../ui/charts';

describe('Charts', () => {
  describe('testId property', () => {
    test('Should be found by data-testid', async () => {
      const testId = 'charts';
      const { getByTestId } = render(
        <Chart testId={testId} chartType={ChartTypes.LINE} data={null} />,
      );
      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
