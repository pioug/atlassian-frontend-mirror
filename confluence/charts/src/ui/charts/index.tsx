import React from 'react';

import { LinearChart } from './LinearChart';
import { PieChart } from './PieChart';
import { Wrapper } from './styled';
import { ChartTypes } from './types';

export { ChartTypes };

export const Chart = ({ testId, chartType, data }: any) => {
  const ChartComponent = chartType === ChartTypes.PIE ? PieChart : LinearChart;
  const chartProps = { testId, chartType, data };
  return (
    <Wrapper testId={testId}>
      <ChartComponent {...chartProps} />
    </Wrapper>
  );
};
