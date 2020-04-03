import React from 'react';
import ReactDOM from 'react-dom';
export type ElementDimension = 'height' | 'width';

export const getElementDimension = (
  component: React.Component,
  dimension: ElementDimension,
): number => {
  const element = ReactDOM.findDOMNode(component) as Element;
  const dimensionValue = element.getBoundingClientRect()[dimension];

  return Math.round(dimensionValue);
};
