import { isWebGLAvailable } from '../../webgl';

describe('isWebGLAvailable helper method', () => {
  it('should create only 1 canvas context and cache the return value from getContext', () => {
    const fn = jest.fn();

    fn.mockReturnValue(true);
    HTMLCanvasElement.prototype.getContext = fn;

    expect(isWebGLAvailable()).toEqual(true);
    expect(isWebGLAvailable()).toEqual(true);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should return false when the canvas context is not available', () => {
    const fn = jest.fn();

    fn.mockReturnValue(null);
    HTMLCanvasElement.prototype.getContext = fn;

    expect(isWebGLAvailable(true)).toEqual(false);
  });
});
