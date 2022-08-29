import React, { ReactNode } from 'react';

import { ClassNames } from '@emotion/core';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';

import { cssVar, line } from '../internal/constants';
import Line from '../internal/line';
import Terminal from '../internal/terminal';

export type DropIndicatorProps = {
  children: (props: { className?: string }) => ReactNode;
  edge: Edge | null;
  gap?: number;
  hasTerminal?: boolean;
  inset?: number;
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
export const TreeDropIndicator = ({
  children,
  edge,
  gap = 0,
  hasTerminal = false,
  inset = 0,
}: DropIndicatorProps) => {
  /**
   * To clearly communicate the resting place of a draggable item during a drag operation,
   * the drop indicator should be positioned half way between draggable items.
   */
  const offset = -0.5 * (gap + line.thickness);

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
                  [cssVar.offset]: `${offset}px`,
                  [cssVar.inset]: `${inset}px`,
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
};
