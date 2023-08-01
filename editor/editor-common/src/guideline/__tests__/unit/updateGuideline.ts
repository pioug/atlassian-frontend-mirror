import type { GuidelineConfig } from '../../types';
import { getGuidelinesWithHighlights } from '../../updateGuideline';

const guidelineConfig = (
  key: string,
  x: number,
  show: boolean,
  active: boolean,
): GuidelineConfig => {
  return { key, position: { x }, show, active };
};

describe('updateGuideline', () => {
  let defaultGuidelines: GuidelineConfig[];

  beforeEach(() => {
    defaultGuidelines = [
      guidelineConfig('guide-1', 100, true, false),
      guidelineConfig('guide-2', -100, true, false),
      guidelineConfig('guide-3', 200, true, false),
    ];
  });

  // Param Description in order of appearance. [
  // string             - test description
  // number             - the remaining gap distance to the active guidelines
  // number             - the allowed maxGap distance to a guideline
  // string[]           - the current active guideline keys
  // GuidelineConfig[]  - the expect guideline config return result
  // ]
  test.each<[string, number, number, string[], GuidelineConfig[]]>([
    [
      'when gap < maxGap',
      9,
      10,
      ['guide-1'],
      [
        guidelineConfig('guide-1', 100, true, true),
        guidelineConfig('guide-2', -100, true, false),
        guidelineConfig('guide-3', 200, true, false),
      ],
    ],
    [
      'when gap === maxGap',
      10,
      10,
      ['guide-1'],
      [
        guidelineConfig('guide-1', 100, true, false),
        guidelineConfig('guide-2', -100, true, false),
        guidelineConfig('guide-3', 200, true, false),
      ],
    ],
    [
      'when gap > maxGap',
      11,
      10,
      ['guide-1'],
      [
        guidelineConfig('guide-1', 100, true, false),
        guidelineConfig('guide-2', -100, true, false),
        guidelineConfig('guide-3', 200, true, false),
      ],
    ],
    [
      'when all guidelines are active',
      0,
      10,
      ['guide-1', 'guide-2', 'guide-3'],
      [
        guidelineConfig('guide-1', 100, true, true),
        guidelineConfig('guide-2', -100, true, true),
        guidelineConfig('guide-3', 200, true, true),
      ],
    ],
    [
      'when no guidelines are active',
      0,
      10,
      [],
      [
        guidelineConfig('guide-1', 100, true, false),
        guidelineConfig('guide-2', -100, true, false),
        guidelineConfig('guide-3', 200, true, false),
      ],
    ],
    [
      'when all guidelines are active by gap >= maxGap',
      10,
      10,
      ['guide-1', 'guide-2', 'guide-3'],
      [
        guidelineConfig('guide-1', 100, true, false),
        guidelineConfig('guide-2', -100, true, false),
        guidelineConfig('guide-3', 200, true, false),
      ],
    ],
    [
      'when unknown guideline is active',
      0,
      10,
      ['guide-4'],
      [
        guidelineConfig('guide-1', 100, true, false),
        guidelineConfig('guide-2', -100, true, false),
        guidelineConfig('guide-3', 200, true, false),
      ],
    ],
  ])(
    `should return correct guideline config highlight values %s`,
    (_description, gap, maxGap, activeKeys, result) => {
      expect(
        getGuidelinesWithHighlights(gap, maxGap, activeKeys, defaultGuidelines),
      ).toEqual(result);
    },
  );
});
