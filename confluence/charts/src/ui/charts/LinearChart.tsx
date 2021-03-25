import React from 'react';

import styled from '@emotion/styled';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { PickD3Scale } from '@visx/scale';
import {
  AnimatedAxis,
  AnimatedBarGroup,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  buildChartTheme,
  XYChart,
} from '@visx/xychart';

import { N40, N400 } from '@atlaskit/theme/colors';

import { colorSequence } from '../../colors';

import { ChartTypes } from './types';

const customTheme = buildChartTheme({
  backgroundColor: '#ffffff',
  gridColor: N40,
  gridColorDark: N400,
  tickLength: 4,
  colors: colorSequence,
});

export const CenteredLegend = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 11px;
  justify-content: center;
  top: 20px;
  position: relative;
`;

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
  testId?: string;
  chartType: ChartTypes;
  height?: number;
  xAccessor: any;
  yLabel: any | undefined;
  seriesNames: string[];
  tableData: number[][];
  showLegend?: boolean;
  chartScale: PickD3Scale<'ordinal', any, any>;
}) => {
  const { seriesNames, tableData, xAccessor, showLegend, chartScale } = props;

  const legend = (
    <LegendOrdinal scale={chartScale}>
      {labels => (
        <CenteredLegend>
          {labels.map((label, i) => (
            <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
              <svg width={8} height={8}>
                <circle fill={label.value} r={4} cx={4} cy={4} />
              </svg>
              <LegendLabel align="left" margin="0 0 0 4px">
                {label.text}
              </LegendLabel>
            </LegendItem>
          ))}
        </CenteredLegend>
      )}
    </LegendOrdinal>
  );

  return (
    <div data-testId={props.testId}>
      {showLegend && legend}
      <XYChart
        theme={customTheme}
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
