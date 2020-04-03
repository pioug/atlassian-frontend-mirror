import { ZoomLevel } from '../../../../newgen/domain/zoomLevel';
import * as jsc from 'jsverify';

const scaleGenerator = () =>
  jsc.oneof(
    [jsc.number(0.1, 2.0), jsc.constant(1)], // guarantees that 1 will be checked
  );

describe('ZoomLevel', () => {
  it('should sort zoom levels correctly', () => {
    const zoomLevel = new ZoomLevel(2);
    expect(zoomLevel.zoomLevels).toEqual([
      0.12,
      0.24,
      0.48,
      0.96,
      1,
      2,
      3,
      4,
      8,
      12,
      16,
    ]);
  });

  jsc.property(
    'selects the initialValue if no value is selected',
    scaleGenerator(),
    scale => {
      const zoomLevel = new ZoomLevel(scale);
      expect(zoomLevel.value === scale).toBeTruthy();
      return zoomLevel.value === scale;
    },
  );

  jsc.property(
    'the zoomLevel of 100% does always exist exactly once',
    scaleGenerator(),
    scale => {
      const zoomLevel = new ZoomLevel(scale);
      expect(
        zoomLevel.zoomLevels.filter(i => i === 1).length === 1,
      ).toBeTruthy();
      return zoomLevel.zoomLevels.filter(i => i === 1).length === 1;
    },
  );

  jsc.property(
    'zooming in maintains the initialValue',
    scaleGenerator(),
    scale => {
      const original = new ZoomLevel(scale);
      const zoomed = original.zoomIn();
      expect(original.initialValue === zoomed.initialValue).toBeTruthy();
      return original.initialValue === zoomed.initialValue;
    },
  );

  jsc.property(
    'zooming out maintains the initialValue',
    scaleGenerator(),
    scale => {
      const original = new ZoomLevel(scale);
      const zoomed = original.zoomOut();
      expect(original.initialValue === zoomed.initialValue).toBeTruthy();
      return original.initialValue === zoomed.initialValue;
    },
  );

  jsc.property(
    'increases the zoom level when zooming in',
    scaleGenerator(),
    scale => {
      const zoomLevel = new ZoomLevel(scale);
      expect(zoomLevel.zoomIn().value > zoomLevel.value).toBeTruthy();
      return zoomLevel.zoomIn().value > zoomLevel.value;
    },
  );

  jsc.property(
    'decreases the zoom level when zooming out',
    scaleGenerator(),
    scale => {
      const zoomLevel = new ZoomLevel(scale);
      expect(zoomLevel.zoomOut().value < zoomLevel.value).toBeTruthy();
      return zoomLevel.zoomOut().value < zoomLevel.value;
    },
  );

  jsc.property(
    'will not increase the zoom level when the maximum is reached',
    scaleGenerator(),
    scale => {
      const zoomLevel = new ZoomLevel(scale).fullyZoomIn();
      expect(zoomLevel.zoomIn().value === zoomLevel.value).toBeTruthy();
      return zoomLevel.zoomIn().value === zoomLevel.value;
    },
  );

  jsc.property(
    'will not decrease the zoom level when the minimum is reached',
    scaleGenerator(),
    scale => {
      const zoomLevel = new ZoomLevel(scale).fullyZoomOut();
      expect(zoomLevel.zoomOut().value === zoomLevel.value).toBeTruthy();
      return zoomLevel.zoomOut().value === zoomLevel.value;
    },
  );

  jsc.property(
    'will report if zooming out is possible',
    scaleGenerator(),
    scale => {
      const zoomLevelDefault = new ZoomLevel(scale);
      const zoomLevelMin = new ZoomLevel(scale).fullyZoomOut();
      expect(
        zoomLevelDefault.canZoomOut && !zoomLevelMin.canZoomOut,
      ).toBeTruthy();
      return zoomLevelDefault.canZoomOut && !zoomLevelMin.canZoomOut;
    },
  );

  jsc.property(
    'will report if zooming in is possible',
    scaleGenerator(),
    scale => {
      const zoomLevelDefault = new ZoomLevel(scale);
      const zoomLevelMax = new ZoomLevel(scale).fullyZoomIn();
      expect(
        zoomLevelDefault.canZoomIn && !zoomLevelMax.canZoomIn,
      ).toBeTruthy();
      return zoomLevelDefault.canZoomIn && !zoomLevelMax.canZoomIn;
    },
  );

  jsc.property(
    'the percentage will be returned as an integer string',
    scaleGenerator(),
    scale => {
      const zoomLevel = new ZoomLevel(scale);
      expect(zoomLevel.asPercentage.includes('.')).toBeFalsy();
      return !zoomLevel.asPercentage.includes('.');
    },
  );
});
