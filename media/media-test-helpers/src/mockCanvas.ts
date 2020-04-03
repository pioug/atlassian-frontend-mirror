export function mockCanvas(width: number = 0, height: number = 0) {
  const context: Partial<CanvasRenderingContext2D> = {
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    drawImage: jest.fn(),
    arc: jest.fn(),
    save: jest.fn(),
    beginPath: jest.fn(),
    restore: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    clip: jest.fn(),
    fillRect: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
  };

  return {
    canvas: {
      width,
      height,
      toDataURL: jest.fn(),
      getContext: jest.fn().mockReturnValue(context),
    },
    context,
  };
}
