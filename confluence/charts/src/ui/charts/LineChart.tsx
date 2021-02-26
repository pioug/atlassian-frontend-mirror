import React from 'react';

import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  lightTheme,
  XYChart,
} from '@visx/xychart';

type Nestable = {
  type: string;
  content?: Nestable[];
  text?: string;
};

type TableRow = {
  type: 'tableHeader' | 'tableRow';
  attrs: any;
  content: Nestable[];
};

type TableData = {
  type: 'table';
  attrs: any;
  content: TableRow[];
};

const getText = (child: Nestable): string => {
  if (child.content) {
    return child.content.map(getText).join('\n');
  }

  return child.text || '';
};

// x-axis picker from column
// y-value is that column value
const tableToColumnSet = (inputData: TableData) => {
  const firstRow = inputData.content[0];
  const seriesNames = firstRow.content.map(child => getText(child));

  const tableRawData = inputData.content.slice(1);
  const tableData = tableRawData.map(tableRow =>
    tableRow.content.map(child => Number(getText(child))),
  );

  // convert [2012, 8, 153, 121] into
  // { year: 2012, a: 8, b: 153, c: 121 }
  const namedTableData = tableData.map((dataRow, rowIdx) =>
    dataRow.reduce((namedData, colData, colIdx) => {
      namedData[seriesNames[colIdx]] = colData;
      namedData['idx'] = rowIdx;
      return namedData;
    }, {} as any),
  );

  return [seriesNames, namedTableData];
};

export const LineChart = (props: {
  height?: number;
  data: any;
  testId?: string;
}) => {
  const [seriesNames, tableData] = tableToColumnSet(props.data);

  // console.log(tableData);

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
        height={props.height || 350}
      >
        <AnimatedGrid
          key={`grid-${123}`} // force animate on update
          rows={true}
          columns={false}
          animationTrajectory={'center'}
          numTicks={5}
        />

        {seriesNames
          .filter(name => name !== 'Year')
          .map((seriesName, idx) => (
            <AnimatedLineSeries
              key={seriesName}
              dataKey={seriesName}
              data={tableData}
              xAccessor={data => data.Year}
              yAccessor={data => data[seriesName]}
            ></AnimatedLineSeries>
          ))}

        <AnimatedAxis
          key={`time-axis-${123}-${false}`}
          orientation={'bottom'}
          numTicks={6}
          label="Year"
          animationTrajectory={'center'}
        />
        <AnimatedAxis
          key={`temp-axis-${123}-${false}`}
          label="Untitled axis"
          orientation={'left'}
          numTicks={5}
          animationTrajectory={'center'}
        />
      </XYChart>
    </div>
  );
};
