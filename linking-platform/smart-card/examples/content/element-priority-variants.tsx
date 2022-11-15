import React from 'react';
import { ElementItem, ElementName, MetadataBlock } from '../../src';
import ExampleContainer from './example-container';
import { IconType } from '../../src/constants';

const priorities = [
  IconType.PriorityBlocker,
  IconType.PriorityCritical,
  IconType.PriorityHigh,
  IconType.PriorityHighest,
  IconType.PriorityLow,
  IconType.PriorityLowest,
  IconType.PriorityMajor,
  IconType.PriorityMedium,
  IconType.PriorityMinor,
  IconType.PriorityTrivial,
  IconType.PriorityUndefined,
];

const primary = priorities.map((icon) => ({
  name: ElementName.Priority,
  icon,
})) as ElementItem[];

export default () => (
  <ExampleContainer>
    <MetadataBlock primary={primary} />
  </ExampleContainer>
);
