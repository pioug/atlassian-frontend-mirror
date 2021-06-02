import { ColorWithAlpha } from '../../../../common';
import {
  DefaultDrawingArea,
  OutputSize,
} from '../../../../engine/components/drawingArea';

describe('MediaEditor DrawingArea', () => {
  const backColor: ColorWithAlpha = {
    red: 0xab,
    green: 0xdd,
    blue: 0x89,
    alpha: 0x32,
  };
  const size: OutputSize = { width: 1234, height: 678, screenScaleFactor: 32 };
  const canvas: HTMLCanvasElement = document.createElement('canvas');

  it('should return passed parameters', () => {
    const drawingArea = new DefaultDrawingArea(canvas, size, backColor);

    expect(drawingArea.canvas).toBe(canvas);
    expect(drawingArea.outputSize).toEqual(size);
    expect(drawingArea.backgroundColor).toEqual(backColor);
  });

  it('should provide resize event', () => {
    const drawingArea = new DefaultDrawingArea(canvas, size, backColor);

    expect(drawingArea.resize).toBeDefined();
  });

  it('should trigger resize event on setSize', (done) => {
    const drawingArea = new DefaultDrawingArea(canvas, size, backColor);
    expect(drawingArea.outputSize).toEqual(size);

    const newSize = { width: 500, height: 43, screenScaleFactor: 2 };
    drawingArea.resize.listen((size) => {
      expect(drawingArea.outputSize).toEqual(newSize);
      expect(size).toEqual(newSize);
      done();
    });
    drawingArea.setSize(newSize);
  });
});
