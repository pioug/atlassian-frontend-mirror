import React from 'react';

import styled from '@emotion/styled';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { MarkerCircle } from '@visx/marker';
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

export const Legend = styled.div<{ direction: string }>`
  display: flex;
  flex-direction: ${p =>
    p.direction === 'left' || p.direction === 'right' ? 'column' : 'row'};
  font-size: 11px;
  justify-content: center;

  ${p =>
    p.direction === 'top' || p.direction === 'auto'
      ? `top: 20px;
  position: relative;`
      : ''}

  ${p => (p.direction === 'bottom' ? `order: 1;` : '')}

  ${p =>
    p.direction === 'right'
      ? `margin-left: -20px;
  margin-right: 10px;
  order: 1;`
      : ''}

  ${p =>
    p.direction === 'left'
      ? `margin-right: 10px;
  margin-left: 10px;`
      : ''}
`;

export const ChartLegendGroup = styled.div<{ direction: string }>`
  display: flex;
  flex-direction: ${p =>
    p.direction === 'left' || p.direction === 'right' ? 'row' : 'column'};
`;

const LineComponent = (props: {
  seriesNames: any;
  tableData: any;
  xAccessor: any;
  showPoints?: boolean;
}) =>
  props.seriesNames
    .filter((name: string) => name !== props.xAccessor)
    .map((seriesName: any, idx: number) => {
      return (
        <>
          {props.showPoints && (
            <MarkerCircle
              id={`marker-circle-${idx}`}
              fill={colorSequence[idx]}
              size={1.5}
              refX={2}
            />
          )}
          <AnimatedLineSeries
            dataKey={`${seriesName}-${idx}`}
            data={props.tableData}
            xAccessor={(data: { [key: string]: any }) => data[props.xAccessor]}
            yAccessor={(data: { [key: string]: any }) => data[seriesName]}
            markerMid={`url(#marker-circle-${idx}`}
            markerStart={`url(#marker-circle-${idx}`}
            markerEnd={`url(#marker-circle-${idx}`}
          />
        </>
      );
    });

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
  legendPosition: string;
  chartScale: PickD3Scale<'ordinal', any, any>;
  showPoints?: boolean;
}) => {
  const {
    seriesNames,
    tableData,
    xAccessor,
    showLegend,
    chartScale,
    legendPosition,
    showPoints,
  } = props;

  const legend = (
    <LegendOrdinal scale={chartScale}>
      {labels => (
        <Legend direction={legendPosition}>
          {labels.map((label, i) => (
            <LegendItem key={`legend-quantile-${i}`} margin={5}>
              <svg width={8} height={8}>
                <circle fill={label.value} r={4} cx={4} cy={4} />
              </svg>
              <LegendLabel align="left" margin="0 0 0 4px">
                {label.text}
              </LegendLabel>
            </LegendItem>
          ))}
        </Legend>
      )}
    </LegendOrdinal>
  );

  return (
    <div data-testid={props.testId}>
      <ChartLegendGroup direction={legendPosition}>
        {showLegend && legend}
        <XYChart
          theme={customTheme}
          xScale={{
            type: 'band',
          }}
          yScale={{
            type: 'linear',
          }}
          height={props.height || 350}
          key={`${showLegend} ${legendPosition}`}
        >
          <AnimatedGrid
            key={`grid-${123}`}
            rows={true}
            columns={false}
            animationTrajectory={'center'}
            numTicks={5}
          />
          {props.chartType === ChartTypes.LINE ? (
            <LineComponent
              seriesNames={seriesNames}
              tableData={tableData}
              xAccessor={xAccessor}
              showPoints={showPoints}
            />
          ) : (
            <BarComponent
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
            strokeWidth={0}
          />
          <AnimatedAxis
            key={`temp-axis-${123}-${false}`}
            label={props.yLabel || 'count'}
            orientation={'left'}
            numTicks={5}
            animationTrajectory={'center'}
          />
        </XYChart>
      </ChartLegendGroup>
    </div>
  );
};
