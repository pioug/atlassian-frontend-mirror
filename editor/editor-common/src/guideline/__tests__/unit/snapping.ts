import { findClosestSnap, getGuidelineSnaps } from '../../snapping';
import { GuidelineSnap } from '../../types';

const snapArray = [100, 200, 300, 400, 400, 500, 600];
const snapTo: GuidelineSnap[] = [
  { width: 600, guidelineKey: 'media_0_left' },
  { width: 100, guidelineKey: 'grid_0' },
  { width: 100, guidelineKey: 'grid_1' },
  { width: 200, guidelineKey: 'grid_2' },
  { width: 300, guidelineKey: 'grid_3' },
  { width: 400, guidelineKey: 'media_1' },
  { width: 400, guidelineKey: 'grid_4' },
  { width: 500, guidelineKey: 'media_2' },
  { width: 600, guidelineKey: 'media_0_right' },
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
      keys: ['grid_0', 'grid_1'],
    });
  });

  it('findClosestSnap with gap and default guidelines', () => {
    const mediaWidth = 180;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 20,
      keys: ['grid_2'],
    });
  });

  it('findClosestSnap - highlight default and dynamic guidelines', () => {
    const mediaWidth = 385;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 15,
      keys: ['grid_4'],
    });
  });

  it('findClosestSnap should return dynamic guideline', () => {
    const mediaWidth = 485;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 15,
      keys: ['media_2'],
    });
  });

  it('findClosestSnap should return multiple dynamic guidelines', () => {
    const mediaWidth = 585;
    const snapGap = 25;
    const result = findClosestSnap(mediaWidth, snapArray, snapTo, snapGap);

    expect(result).toEqual({
      gap: 15,
      keys: ['media_0_left', 'media_0_right'],
    });
  });
});

describe('getGuidelineSnaps', () => {
  const guidelines = [
    { key: 'fullwidth_left', position: { x: -900 } },
    { key: 'wide_left', position: { x: -505 } },
    { key: 'grid_1', position: { x: -380 } },
    { key: 'grid_2', position: { x: -20 } },
    { key: 'grid_3', position: { x: 0 } },
    { key: 'grid_4', position: { x: 20 } },
    { key: 'grid_5', position: { x: 380 } },
    { key: 'media_1', position: { x: 70 } },
    { key: 'wide_right', position: { x: 505 } },
    { key: 'fullwidth_right', position: { x: 900 } },
  ];

  const editorWidth = 760;

  it('center layout', () => {
    const result = getGuidelineSnaps(guidelines, editorWidth, 'center');
    expect(result).toEqual({
      snaps: {
        x: [1800, 1010, 760, 40, 140],
      },
      guidelineReference: [
        { guidelineKey: 'fullwidth_left', width: 1800 },
        { guidelineKey: 'wide_left', width: 1010 },
        { guidelineKey: 'grid_1', width: 760 },
        { guidelineKey: 'grid_2', width: 40 },
        { guidelineKey: 'grid_3', width: 0 },
        { guidelineKey: 'grid_4', width: 40 },
        { guidelineKey: 'grid_5', width: 760 },
        { guidelineKey: 'media_1', width: 140 },
        { guidelineKey: 'wide_right', width: 1010 },
        { guidelineKey: 'fullwidth_right', width: 1800 },
      ],
    });
  });

  it('wide layout', () => {
    const result = getGuidelineSnaps(guidelines, editorWidth, 'wide');
    expect(result).toEqual({
      snaps: {
        x: [1800, 1010, 760, 40, 140],
      },
      guidelineReference: [
        { guidelineKey: 'fullwidth_left', width: 1800 },
        { guidelineKey: 'wide_left', width: 1010 },
        { guidelineKey: 'grid_1', width: 760 },
        { guidelineKey: 'grid_2', width: 40 },
        { guidelineKey: 'grid_3', width: 0 },
        { guidelineKey: 'grid_4', width: 40 },
        { guidelineKey: 'grid_5', width: 760 },
        { guidelineKey: 'media_1', width: 140 },
        { guidelineKey: 'wide_right', width: 1010 },
        { guidelineKey: 'fullwidth_right', width: 1800 },
      ],
    });
  });

  it('full-width layout', () => {
    const result = getGuidelineSnaps(guidelines, editorWidth, 'full-width');
    expect(result).toEqual({
      snaps: {
        x: [1800, 1010, 760, 40, 140],
      },
      guidelineReference: [
        { guidelineKey: 'fullwidth_left', width: 1800 },
        { guidelineKey: 'wide_left', width: 1010 },
        { guidelineKey: 'grid_1', width: 760 },
        { guidelineKey: 'grid_2', width: 40 },
        { guidelineKey: 'grid_3', width: 0 },
        { guidelineKey: 'grid_4', width: 40 },
        { guidelineKey: 'grid_5', width: 760 },
        { guidelineKey: 'media_1', width: 140 },
        { guidelineKey: 'wide_right', width: 1010 },
        { guidelineKey: 'fullwidth_right', width: 1800 },
      ],
    });
  });

  it('align-end layout', () => {
    const result = getGuidelineSnaps(guidelines, editorWidth, 'align-end');
    expect(result).toEqual({
      snaps: {
        x: [1280, 885, 760, 400, 380, 360, 310],
      },
      guidelineReference: [
        { guidelineKey: 'fullwidth_left', width: 1280 },
        { guidelineKey: 'wide_left', width: 885 },
        { guidelineKey: 'grid_1', width: 760 },
        { guidelineKey: 'grid_2', width: 400 },
        { guidelineKey: 'grid_3', width: 380 },
        { guidelineKey: 'grid_4', width: 360 },
        { guidelineKey: 'grid_5', width: 0 },
        { guidelineKey: 'media_1', width: 310 },
        { guidelineKey: 'wide_right', width: -125 },
        { guidelineKey: 'fullwidth_right', width: -520 },
      ],
    });
  });

  it('wrap-right layout', () => {
    const result = getGuidelineSnaps(guidelines, editorWidth, 'wrap-right');
    expect(result).toEqual({
      snaps: {
        x: [1280, 885, 760, 400, 380, 360, 310],
      },
      guidelineReference: [
        { guidelineKey: 'fullwidth_left', width: 1280 },
        { guidelineKey: 'wide_left', width: 885 },
        { guidelineKey: 'grid_1', width: 760 },
        { guidelineKey: 'grid_2', width: 400 },
        { guidelineKey: 'grid_3', width: 380 },
        { guidelineKey: 'grid_4', width: 360 },
        { guidelineKey: 'grid_5', width: 0 },
        { guidelineKey: 'media_1', width: 310 },
        { guidelineKey: 'wide_right', width: -125 },
        { guidelineKey: 'fullwidth_right', width: -520 },
      ],
    });
  });

  it('align-start layout', () => {
    const result = getGuidelineSnaps(guidelines, editorWidth, 'align-start');
    expect(result).toEqual({
      snaps: {
        x: [360, 380, 400, 760, 450, 885, 1280],
      },
      guidelineReference: [
        { guidelineKey: 'fullwidth_left', width: -520 },
        { guidelineKey: 'wide_left', width: -125 },
        { guidelineKey: 'grid_1', width: 0 },
        { guidelineKey: 'grid_2', width: 360 },
        { guidelineKey: 'grid_3', width: 380 },
        { guidelineKey: 'grid_4', width: 400 },
        { guidelineKey: 'grid_5', width: 760 },
        { guidelineKey: 'media_1', width: 450 },
        { guidelineKey: 'wide_right', width: 885 },
        { guidelineKey: 'fullwidth_right', width: 1280 },
      ],
    });
  });

  it('wrap-left layout', () => {
    const result = getGuidelineSnaps(guidelines, editorWidth, 'wrap-left');
    expect(result).toEqual({
      snaps: {
        x: [360, 380, 400, 760, 450, 885, 1280],
      },
      guidelineReference: [
        { guidelineKey: 'fullwidth_left', width: -520 },
        { guidelineKey: 'wide_left', width: -125 },
        { guidelineKey: 'grid_1', width: 0 },
        { guidelineKey: 'grid_2', width: 360 },
        { guidelineKey: 'grid_3', width: 380 },
        { guidelineKey: 'grid_4', width: 400 },
        { guidelineKey: 'grid_5', width: 760 },
        { guidelineKey: 'media_1', width: 450 },
        { guidelineKey: 'wide_right', width: 885 },
        { guidelineKey: 'fullwidth_right', width: 1280 },
      ],
    });
  });

  it('no layout, treated as center layout', () => {
    const result = getGuidelineSnaps(guidelines, editorWidth);
    expect(result).toEqual({
      snaps: {
        x: [1800, 1010, 760, 40, 140],
      },
      guidelineReference: [
        { guidelineKey: 'fullwidth_left', width: 1800 },
        { guidelineKey: 'wide_left', width: 1010 },
        { guidelineKey: 'grid_1', width: 760 },
        { guidelineKey: 'grid_2', width: 40 },
        { guidelineKey: 'grid_3', width: 0 },
        { guidelineKey: 'grid_4', width: 40 },
        { guidelineKey: 'grid_5', width: 760 },
        { guidelineKey: 'media_1', width: 140 },
        { guidelineKey: 'wide_right', width: 1010 },
        { guidelineKey: 'fullwidth_right', width: 1800 },
      ],
    });
  });
});
