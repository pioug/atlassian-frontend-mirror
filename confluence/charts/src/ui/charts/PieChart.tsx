import React from 'react';

import { Group } from '@visx/group';
import { withParentSize } from '@visx/responsive';
import { scaleOrdinal } from '@visx/scale';
import { Pie } from '@visx/shape';
import { animated, interpolate, useTransition } from 'react-spring';

import { tableToColumnSet } from './utilities';

const getValueOf = (key: any) => (data: any) => data[key];

const getLetterFrequencyColorOf = (values: any[], accessor: string) =>
  scaleOrdinal({
    domain: values.map(l => l[accessor]),
    // @TODO: need to update this part based on the feedback from the designers
    range: ['#1800f3', '#04b922', '#f3a000', '#def603', '#8f11b', '#5a08f1'],
  });

const fromLeaveTransition = ({ endAngle }: { endAngle: number }) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});

const enterUpdateTransition = (
  { startAngle, endAngle } = { startAngle: 0, endAngle: 360 },
) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

const AnimatedPie = (props: any) => {
  const { arcs, path, getKey, getColor } = props;

  const animationSequence: any = {
    from: fromLeaveTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: fromLeaveTransition,
  };

  //@TODO: Clean up typescript issues here.
  const transitions = useTransition(arcs, getKey, animationSequence);
  return (
    <>
      {transitions.map(({ item: arc, props, key }: any) => {
        const [centroidX, centroidY] = path.centroid(arc);
        const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

        return (
          <g key={key}>
            <animated.path
              // compute interpolated path d attribute from intermediate angle values
              d={interpolate(
                [props.startAngle, props.endAngle],
                (startAngle, endAngle) =>
                  path({
                    ...arc,
                    startAngle,
                    endAngle,
                  }),
              )}
              fill={getColor(arc)}
              // onClick={() => onClickDatum(arc)}
              // onTouchStart={() => onClickDatum(arc)}
            />
            {hasSpaceForLabel && (
              <animated.g style={{ opacity: props.opacity }}>
                <text
                  fill="white"
                  x={centroidX}
                  y={centroidY}
                  dy=".33em"
                  fontSize={9}
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {getKey(arc)}
                </text>
              </animated.g>
            )}
          </g>
        );
      })}
    </>
  );
};

const margin = { top: 20, right: 20, bottom: 20, left: 20 };

export const PieChart: any = withParentSize((props: any) => {
  const innerWidth = props.parentWidth - margin.left - margin.right;
  const innerHeight = 350 - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;
  const pieSortValues = (a: number, b: number) => b - a;

  const [seriesNames, tableData] = tableToColumnSet(props.data);

  return (
    <svg width={props.parentWidth} height={350}>
      <Group top={top} left={left}>
        <Pie
          data={tableData}
          pieValue={getValueOf(seriesNames[1])}
          pieSortValues={pieSortValues}
          outerRadius={radius}
        >
          {pie => (
            <AnimatedPie
              {...pie}
              getKey={({ data }: any) => data[seriesNames[0]]}
              getColor={({ data }: any) =>
                getLetterFrequencyColorOf(
                  tableData,
                  seriesNames[0],
                )(data[seriesNames[0]])
              }
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
});
