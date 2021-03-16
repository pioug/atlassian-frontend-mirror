import React from 'react';

import {
  AnimatedAxis,
  AnimatedBarGroup,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  lightTheme,
  XYChart,
} from '@visx/xychart';

import { ChartTypes } from './types';
import { tableToColumnSet } from './utilities';

const LineComponent = (props: {
  seriesNames: any;
  tableData: any;
  xAccessor: any;
}) =>
  props.seriesNames
    .filter((name: string) => name !== props.xAccessor)
    .map((seriesName: any, idx: number) => (
      <AnimatedLineSeries
        key={seriesName}
        dataKey={seriesName}
        data={props.tableData}
        xAccessor={(data: { [key: string]: any }) => data[props.xAccessor]}
        yAccessor={(data: { [key: string]: any }) => data[seriesName]}
      />
    ));

const BarComponent = (props: {
  seriesNames: any;
  tableData: any;
  xAccessor: any;
}) => (
  <AnimatedBarGroup>
    {props.seriesNames
      .filter((name: string) => name !== props.xAccessor)
      .map((seriesName: string, idx: number) => (
        <AnimatedBarSeries
          key={seriesName}
          dataKey={seriesName}
          data={props.tableData}
          xAccessor={(data: { [key: string]: any }) => data[props.xAccessor]}
          yAccessor={(data: { [key: string]: any }) => data[seriesName]}
          barPadding={3}
        />
      ))}
  </AnimatedBarGroup>
);

export const LinearChart = (props: {
  data: any;
  testId?: string;
  chartType: ChartTypes;
  height?: number;
  xAccesor: any | undefined;
  yLabel: any | undefined;
}) => {
  if (!props.data) {
    return null;
  }

  const [seriesNames, tableData] = tableToColumnSet(props.data);
  const xAccessor = props.xAccesor || seriesNames[0];
  return (
    <div data-testId={props.testId}>
      <XYChart
        theme={lightTheme}
        xScale={{
          type: 'band',
        }}
        yScale={{
          type: 'linear',
        }}
        height={350}
      >
        <AnimatedGrid
          key={`grid-${123}`}
          rows={true}
          columns={false}
          animationTrajectory={'center'}
          numTicks={5}
        />
        {props.chartType === ChartTypes.BAR ? (
          <BarComponent
            seriesNames={seriesNames}
            tableData={tableData}
            xAccessor={xAccessor}
          />
        ) : (
          <LineComponent
            seriesNames={seriesNames}
            tableData={tableData}
            xAccessor={xAccessor}
          />
        )}
        <AnimatedAxis
          key={`time-axis-${123}-${false}`}
          orientation={'bottom'}
          numTicks={6}
          label={xAccessor}
          animationTrajectory={'center'}
        />
        <AnimatedAxis
          key={`temp-axis-${123}-${false}`}
          label={props.yLabel || 'count'}
          orientation={'left'}
          numTicks={5}
          animationTrajectory={'center'}
        />
      </XYChart>
    </div>
  );
};
