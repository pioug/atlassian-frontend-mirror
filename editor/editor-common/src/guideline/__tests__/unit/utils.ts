import { getContainerWidthOrFullEditorWidth } from '../../utils';

describe('getContainerWidthOrFullEditorWidth', () => {
  it('should return expected width', () => {
    const containerWidth = 1200;
    const expectedWidth = 568;

    const result = getContainerWidthOrFullEditorWidth(containerWidth);
    expect(result).toEqual(expectedWidth);
  });
});
