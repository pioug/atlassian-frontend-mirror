import React, { FC } from 'react';

const { Fragment } = React;

interface Props {
  /** The number to format. */
  children?: number | string;
  /** The maximum value to display. If value is 100, and max is 50, "50+" will be displayed */
  max?: number;
}

const Format: FC<Props> = (props: Props) => {
  let formatted: number | string = '';
  let { children = 0, max = 0 } = props;

  if (children < 0) {
    children = 0;
  }

  if (max < 0) {
    max = 0;
  }

  if (max && max < children) {
    formatted = `${max}+`;
  } else if (children === Infinity) {
    formatted = '∞';
  } else {
    formatted = children;
  }

  return <Fragment>{formatted}</Fragment>;
};

export default Format;
