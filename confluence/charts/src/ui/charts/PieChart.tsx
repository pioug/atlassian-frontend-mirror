import React from 'react';

import { Group } from '@visx/group';
import { withParentSize } from '@visx/responsive';
import { Pie } from '@visx/shape';
import { animated, interpolate, useTransition } from 'react-spring';

const getValueOf = (key: any) => (data: any) => data[key];

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

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

export const PieChart: any = withParentSize((props: any) => {
  const innerWidth = props.parentWidth - margin.left - margin.right;
  const innerHeight = 350 - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;
  const pieSortValues = (a: number, b: number) => b - a;

  const { seriesNames, tableData, chartScale } = props;

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
              getColor={({ data }: any) => chartScale(data[seriesNames[0]])}
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
});
