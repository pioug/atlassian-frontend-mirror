import * as Core from '../../binaries/mediaEditor';
import { BitmapExporter } from '../../bitmapExporter';

type Module = Core.NativeModule;

describe('MediaEditor BitmapExporter', () => {
  let canvas: HTMLCanvasElement;
  let bitmapExporter: BitmapExporter;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    const nativeModule = <Module>(<any>{
      HEAPU8: {
        buffer: jest.fn(),
      },
    });
    bitmapExporter = new BitmapExporter(canvas, nativeModule);
  });

  it('prepare method should return false for negative width', () => {
    expect(bitmapExporter.prepare(-1, 10)).toBe(false);
  });

  it('prepare method should return false for negative height', () => {
    expect(bitmapExporter.prepare(10, -1)).toBe(false);
  });

  it('prepare method should return false for zero width', () => {
    expect(bitmapExporter.prepare(0, 10)).toBe(false);
  });

  it('prepare method should return false for zero height', () => {
    expect(bitmapExporter.prepare(10, 0)).toBe(false);
  });

  it('prepare method should return true for correct width and height', () => {
    expect(bitmapExporter.prepare(10, 10)).toBe(true);
  });

  it('should return data from canvas', () => {
    const base64Image = 'data:image/png';
    jest.spyOn(canvas, 'toDataURL').mockImplementation(() => base64Image);

    bitmapExporter.prepare(10, 10);
    const data = bitmapExporter.getBase64Image('image/png');
    expect(data).toBe(base64Image);
  });
});
