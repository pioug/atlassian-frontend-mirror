import React, { Fragment } from 'react';

interface FormatProps {
  /**
   * The number to format.
   */
  children?: number | string;
  /**
   * The maximum value to display. If value is 100, and max is 50, "50+" will be displayed
   */
  max?: number;
}

function formatValueWhenLessThanZero(value: string | number = 0) {
  if (value < 0) {
    return 0;
  }

  return value;
}

function formatValueWhenExceedsBoundary(
  value: string | number,
  max: string | number,
) {
  if (max && max < value) {
    return `${max}+`;
  }

  if (value === Infinity) {
    return '∞';
  }

  return value;
}

/**
 * __Format__
 *
 * This component can be used to compose your own badge together, or if you need
 * the badge style formatting somewhere else.
 *
 * - [Examples](https://atlassian.design/components/badge/badge-format/examples)
 * - [Code](https://atlassian.design/components/badge/badge-format/code)
 */
function Format({ children, max }: FormatProps) {
  const formattedChildren = formatValueWhenLessThanZero(children);
  const formattedMax = formatValueWhenLessThanZero(max);

  return (
    <Fragment>
      {formatValueWhenExceedsBoundary(formattedChildren, formattedMax)}
    </Fragment>
  );
}

export default Format;
