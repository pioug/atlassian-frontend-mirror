import { generateDefaultGuidelines } from '../../defaultGuideline';

describe('generateDefaultGuidelines', () => {
  test('should generate appropriate guidelines when fullWidthMode is disabled', () => {
    const editorWidth = 1000;
    const containerWidth = 1200;
    const fullWidthMode = false;

    const result = generateDefaultGuidelines(
      editorWidth,
      containerWidth,
      fullWidthMode,
    );

    expect(result).toHaveLength(17);
  });

  test('should generate default inner grids', () => {
    const editorWidth = 800;

    const result = generateDefaultGuidelines(editorWidth, 900, false);

    expect(result).toMatchSnapshot();
  });

  test('should generate wide guidelines when fullWidthMode is not active', () => {
    const editorWidth = 1100;

    const result = generateDefaultGuidelines(editorWidth, 1100, false);

    expect(result).toMatchSnapshot();
  });

  test('should generate full-width guidelines when fullWidthMode is not active', () => {
    const containerWidth = 1400;

    const result = generateDefaultGuidelines(900, containerWidth, false);

    expect(result).toMatchSnapshot();
  });

  test('should not generate wide and full-width guidelines when fullWidthMode is active', () => {
    const editorWidth = 1000;
    const containerWidth = 1200;
    const fullWidthMode = true;

    const result = generateDefaultGuidelines(
      editorWidth,
      containerWidth,
      fullWidthMode,
    );

    expect(result).toHaveLength(13); // Only default inner grids should be generated
  });
});
