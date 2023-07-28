import { findClosestSnap, getSnapWidth, SnapTo } from '../../snapping';

const snapArray = [-600, -100, 100, 200, 300, 400, 400, 500, 600];
const snapTo: SnapTo[] = [
  { width: -600, guidelineKey: 'media_negative_600' },
  { width: -100, guidelineKey: 'default_negative_100' },
  { width: 100, guidelineKey: 'default_100' },
  { width: 200, guidelineKey: 'default_200' },
  { width: 300, guidelineKey: 'default_300' },
  { width: 400, guidelineKey: 'media_400' },
  { width: 400, guidelineKey: 'default_400' },
  { width: 500, guidelineKey: 'media_500' },
  { width: 600, guidelineKey: 'media_600' },
];

describe('findClosestSnap ', () => {
  it('findClosestSnap with no gap should return an empty keys array', () => {
    const mediaWidth = 180;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo);

    expect(result).toEqual({ gap: 20, keys: [] });
  });

  it('findClosestSnap - returns multiple guidelines', () => {
    const mediaWidth = 80;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 20,
      keys: ['default_negative_100', 'default_100'],
    });
  });

  it('findClosestSnap with gap and default guidelines', () => {
    const mediaWidth = 180;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 20,
      keys: ['default_200'],
    });
  });

  it('findClosestSnap - highlight default and dynamic guidelines', () => {
    const mediaWidth = 385;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 15,
      keys: ['default_400'],
    });
  });

  it('findClosestSnap should return dynamic guideline', () => {
    const mediaWidth = 485;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 15,
      keys: ['media_500'],
    });
  });

  it('findClosestSnap should return multiple dynamic guidelines', () => {
    const mediaWidth = 585;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 15,
      keys: ['media_negative_600', 'media_600'],
    });
  });
});

describe('getSnapWidth', () => {
  const guidelines = [
    { key: 'g1', position: { x: 10 } },
    { key: 'g2', position: { x: 20 } },
    { key: 'g3', position: { x: 30 } },
  ];

  it('center layout', () => {
    const result = getSnapWidth(guidelines, 100, 25, 'center');
    expect(result).toEqual([
      { guidelineKey: 'g1', width: 130 },
      { guidelineKey: 'g2', width: 110 },
      { guidelineKey: 'g3', width: 90 },
    ]);
  });

  it('wide layout', () => {
    const result = getSnapWidth(guidelines, 100, 25, 'wide');
    expect(result).toEqual([
      { guidelineKey: 'g1', width: 130 },
      { guidelineKey: 'g2', width: 110 },
      { guidelineKey: 'g3', width: 90 },
    ]);
  });

  it('full-width layout', () => {
    const result = getSnapWidth(guidelines, 100, 25, 'full-width');
    expect(result).toEqual([
      { guidelineKey: 'g1', width: 130 },
      { guidelineKey: 'g2', width: 110 },
      { guidelineKey: 'g3', width: 90 },
    ]);
  });

  it('align-end layout', () => {
    const result = getSnapWidth(guidelines, 100, 25, 'align-end');
    expect(result).toEqual([
      { guidelineKey: 'g1', width: 115 },
      { guidelineKey: 'g2', width: 105 },
      { guidelineKey: 'g3', width: 95 },
    ]);
  });

  it('wrap-right layout', () => {
    const result = getSnapWidth(guidelines, 100, 25, 'wrap-right');
    expect(result).toEqual([
      { guidelineKey: 'g1', width: 115 },
      { guidelineKey: 'g2', width: 105 },
      { guidelineKey: 'g3', width: 95 },
    ]);
  });

  it('align-start layout', () => {
    const result = getSnapWidth(guidelines, 100, 25, 'align-start');
    expect(result).toEqual([
      { guidelineKey: 'g1', width: 85 },
      { guidelineKey: 'g2', width: 95 },
      { guidelineKey: 'g3', width: 105 },
    ]);
  });

  it('wrap-left layout', () => {
    const result = getSnapWidth(guidelines, 100, 25, 'wrap-left');
    expect(result).toEqual([
      { guidelineKey: 'g1', width: 85 },
      { guidelineKey: 'g2', width: 95 },
      { guidelineKey: 'g3', width: 105 },
    ]);
  });

  it('no layout', () => {
    const result = getSnapWidth(guidelines, 100, 25, null);
    expect(result).toEqual([]);
  });
});
