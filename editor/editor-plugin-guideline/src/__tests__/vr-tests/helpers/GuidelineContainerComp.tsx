import React from 'react';

import { GuidelineContainer } from '../../../guidelineContainer';
import { GuidelineConfig } from '../../../types';

const guidelines: GuidelineConfig[] = [
  { key: 'vertical_full', position: { x: 0 } },
  {
    key: 'vertical_with_range',
    position: { x: -100, y: { start: 100, end: 500 } },
  },
  {
    key: 'vertical_with_range_and_cap',
    position: {
      x: 100,
      y: { start: 100, end: 500 },
    },
    styles: { capStyle: 'line' },
  },
  {
    key: 'vertical_with_range_and_cap_active',
    position: {
      x: 200,
      y: { start: 100, end: 500 },
    },
    active: true,
    styles: { capStyle: 'line' },
  },
  { key: 'horizontal_01', position: { y: 400 } },
  {
    key: 'horizontal_with_range',
    position: { y: 550, x: { start: -180, end: 180 } },
  },
  {
    key: 'horizontal_with_range_and_cap',
    position: { y: 650, x: { start: -280, end: 180 } },
    styles: { capStyle: 'line' },
  },
  {
    key: 'horizontal_with_range_and_cap_active',
    position: { y: 750, x: { start: -280, end: 180 } },
    active: true,
    styles: { capStyle: 'line' },
  },
];

export const GuidelineContainerComp = () => {
  return (
    <GuidelineContainer
      guidelines={guidelines}
      height={800}
      centerOffset={600}
      width={1800}
      editorWidth={760}
    />
  );
};
