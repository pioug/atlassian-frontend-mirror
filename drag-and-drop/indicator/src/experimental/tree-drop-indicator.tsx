import React, { ReactNode } from 'react';

import { ClassNames } from '@emotion/react';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';

import { cssVar, line } from '../internal/constants';
import Line from '../internal/line';
import Terminal from '../internal/terminal';

export type DropIndicatorProps = {
  children: (props: { className?: string }) => ReactNode;
  /**
   * The `edge` to draw a drop indicator on.
   *
   * `edge` is required as for the best possible performance
   * outcome you should only render this component when it needs to do something
   *
   * @example {closestEdge && <DropIndicator edge={closestEdge} />}
   */
  edge: Edge | null;
  /**
   * `gap` allows you to position the drop indicator further away from the drop target.
   * `gap` should be the distance between your drop targets
   * a drop indicator will be rendered halfway between the drop targets
   * (the drop indicator will be offset by half of the `gap`)
   *
   * `gap` should be a valid CSS length.
   * @example "8px"
   * @example "var(--gap)"
   */
  gap?: string;
  hasTerminal?: boolean;
  inset?: string;
};

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Drop indicator__
 *
 * A drop indicator {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export function DropIndicator({
  children,
  edge,
  gap = '0px',
  hasTerminal = false,
  inset = '0px',
}: DropIndicatorProps) {
  /**
   * To clearly communicate the resting place of a draggable item during a drag operation,
   * the drop indicator should be positioned half way between draggable items.
   */
  const offset = `calc(-0.5 * (${gap} + ${line.thickness}px))`;

  return (
    <Terminal edge={edge}>
      {({ className: terminalClassName }) => (
        <Line edge={edge}>
          {({ className: lineClassName }) => (
            <ClassNames>
              {({ css, cx }) => {
                const offsetStyles = css({
                  // side effect: adding 'position:relative' to element
                  // this is needed to support drawing the line with `position:absolute`
                  position: 'relative',
                  [cssVar.offset]: offset,
                  [cssVar.inset]: inset,
                });

                return children({
                  className: cx([
                    offsetStyles,
                    lineClassName,
                    hasTerminal && terminalClassName,
                  ]),
                });
              }}
            </ClassNames>
          )}
        </Line>
      )}
    </Terminal>
  );
}
