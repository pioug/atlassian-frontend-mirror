import type { GuidelineConfig } from '@atlaskit/editor-plugin-guideline';

import {
  createFixedGuidelinesFromLengths,
  createGuidesFromLengths,
} from '../../fixedGuideline';
import { LengthGuide } from '../../types';

describe('fixedGuideline', () => {
  test.each<[string, any[], LengthGuide[]]>([
    [
      'with sane length values',
      [100, 500],
      [
        { left: -50, right: 50, length: 100 },
        { left: -250, right: 250, length: 500 },
      ],
    ],
    [
      'with inverted length values',
      [-100, -500],
      [
        { left: 50, right: -50, length: -100 },
        { left: 250, right: -250, length: -500 },
      ],
    ],
    ['with empty length values', [], []],
    [
      'excluding nonsensical values',
      [0, 'a', null, undefined, NaN, false, true, []],
      [],
    ],
    [
      'excluding duplicate length values',
      [100, 500, 100, 500],
      [
        { left: -50, right: 50, length: 100 },
        { left: -250, right: 250, length: 500 },
      ],
    ],
    [
      'with floating points',
      [333, 501],
      [
        { left: -166.5, right: 166.5, length: 333 },
        { left: -250.5, right: 250.5, length: 501 },
      ],
    ],
  ])(
    `should return correct guide values %s`,
    (_description, lengths, result) => {
      expect(createGuidesFromLengths(lengths)).toEqual(result);
    },
  );

  test.each<[string, any[], GuidelineConfig[]]>([
    [
      'with sane length values',
      [100, 500],
      [
        { key: 'test-100-left', position: { x: -50 } },
        { key: 'test-100-right', position: { x: 50 } },
        { key: 'test-500-left', position: { x: -250 } },
        { key: 'test-500-right', position: { x: 250 } },
      ],
    ],
    [
      'with inverted length values',
      [-100, -500],
      [
        { key: 'test--100-left', position: { x: 50 } },
        { key: 'test--100-right', position: { x: -50 } },
        { key: 'test--500-left', position: { x: 250 } },
        { key: 'test--500-right', position: { x: -250 } },
      ],
    ],
    ['with empty length values', [], []],
    [
      'excluding nonsensical values',
      [0, 'a', null, undefined, NaN, false, true, []],
      [],
    ],
    [
      'excluding duplicate length values',
      [100, 500, 100, 500],
      [
        { key: 'test-100-left', position: { x: -50 } },
        { key: 'test-100-right', position: { x: 50 } },
        { key: 'test-500-left', position: { x: -250 } },
        { key: 'test-500-right', position: { x: 250 } },
      ],
    ],
    [
      'with floating points',
      [333, 501],
      [
        { key: 'test-333-left', position: { x: -166.5 } },
        { key: 'test-333-right', position: { x: 166.5 } },
        { key: 'test-501-left', position: { x: -250.5 } },
        { key: 'test-501-right', position: { x: 250.5 } },
      ],
    ],
  ])(`should return correct guidelines %s`, (_description, lengths, result) => {
    expect(createFixedGuidelinesFromLengths(lengths, 'test')).toEqual(result);
  });
});
