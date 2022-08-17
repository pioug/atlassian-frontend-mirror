import type { Input } from '@atlaskit/drag-and-drop/types';

import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '../../src/experimental/tree';

import { getDefaultInput, getElements, getRect } from './_util';

type Scenario = {
  description: string;
  input: Input;
  expected: Edge;
  only?: boolean;
};

const rect = getRect({
  top: 0,
  left: 0,
  right: 100,
  bottom: 100,
});

/**
 * Midpoint
 */
function between(inner: number, outer: number): number {
  return (inner + outer) / 2;
}

test('between test helper', () => {
  expect(between(3, 5)).toBe(4);
  expect(between(-3, -5)).toBe(-4);
  expect(between(0, 0)).toBe(0);
  expect(between(0, 10)).toBe(5);
  expect(between(-2, 2)).toBe(0);
});

/**
 * Testing behaviors at the corners of the rectangle.
 */
const cornerScenarios: Scenario[] = [
  {
    description: 'top left corner',
    input: getDefaultInput({
      clientX: rect.left,
      clientY: rect.top,
    }),
    expected: 'top',
  },
  {
    description: 'top right corner',
    input: getDefaultInput({
      clientX: rect.right,
      clientY: rect.top,
    }),
    expected: 'top',
  },
  {
    description: 'bottom left corner',
    input: getDefaultInput({
      clientX: rect.left,
      clientY: rect.bottom,
    }),
    expected: 'bottom',
  },
  {
    description: 'bottom right corner',
    input: getDefaultInput({
      clientX: rect.right,
      clientY: rect.bottom,
    }),
    expected: 'child',
  },
];

/**
 * Testing behaviors along the edges of the interior regions.
 */
const boundaryScenarios: Scenario[] = [
  {
    description: 'boundary of top and bottom (above)',
    input: getDefaultInput({
      clientX: rect.left,
      clientY: between(rect.top, rect.bottom) - 1,
    }),
    expected: 'top',
  },
  {
    description: 'boundary of top and bottom (below)',
    input: getDefaultInput({
      clientX: rect.left,
      clientY: between(rect.top, rect.bottom),
    }),
    expected: 'bottom',
  },
  {
    description: 'boundary of top and child (above)',
    input: getDefaultInput({
      clientX: rect.right,
      clientY: between(rect.top, rect.bottom) - 1,
    }),
    expected: 'top',
  },
  {
    description: 'boundary of top and child (below)',
    input: getDefaultInput({
      clientX: rect.right,
      clientY: between(rect.top, rect.bottom),
    }),
    expected: 'child',
  },
  {
    description: 'boundary of bottom and child (left of)',
    input: getDefaultInput({
      clientX: rect.left + 0.25 * rect.width - 1,
      clientY: rect.bottom,
    }),
    expected: 'bottom',
  },
  {
    description: 'boundary of bottom and child (right of)',
    input: getDefaultInput({
      clientX: rect.left + 0.25 * rect.width,
      clientY: rect.bottom,
    }),
    expected: 'child',
  },
];

const scenarios: Scenario[] = [...cornerScenarios, ...boundaryScenarios];

scenarios.forEach((scenario: Scenario) => {
  const base = scenario.only ? test.only : test;

  base.skip(`scenario: ${scenario.description}`, () => {
    const [element] = getElements();
    element.getBoundingClientRect = () => rect;

    const result = extractClosestEdge(
      attachClosestEdge({}, { element, input: scenario.input, inset: 0 }),
    );
    expect(result).toEqual(scenario.expected);
  });
});
