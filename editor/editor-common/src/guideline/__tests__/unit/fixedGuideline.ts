import {
  createFixedGuidelinesFromLengths,
  createGuidesFromLengths,
} from '../../fixedGuideline';
import { GuidelineConfig, LengthGuide } from '../../types';

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
    ['with length value is 0', [0], [{ left: 0, right: 0, length: 0 }]],
    [
      'with length values contain 0',
      [-100, 0, 666],
      [
        { left: 50, right: -50, length: -100 },
        { left: 0, right: 0, length: 0 },
        { left: -333, right: 333, length: 666 },
      ],
    ],
    [
      'excluding nonsensical values',
      ['a', null, undefined, NaN, false, true, []],
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
      'with length value is 0',
      [0],
      [{ key: 'test-0-centre', position: { x: 0 } }],
    ],
    [
      'with length values contain 0',
      [-100, 0, 666],
      [
        { key: 'test--100-left', position: { x: 50 } },
        { key: 'test--100-right', position: { x: -50 } },
        { key: 'test-0-centre', position: { x: 0 } },
        { key: 'test-666-left', position: { x: -333 } },
        { key: 'test-666-right', position: { x: 333 } },
      ],
    ],
    [
      'excluding nonsensical values',
      ['a', null, undefined, NaN, false, true, []],
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
