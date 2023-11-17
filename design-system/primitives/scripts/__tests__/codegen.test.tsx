import { createColorStylesFromTemplate } from '../color-codegen-template';
import { createElevationStylesFromTemplate } from '../elevation-codegen-template';
import { createSpacingStylesFromTemplate } from '../spacing-codegen-template';

describe('@atlaskit/primitives', () => {
  // colour stuff
  test('text styles are generated correctly', () => {
    expect(createColorStylesFromTemplate('text')).toMatchSnapshot();
  });
  test('background styles are generated correctly', () => {
    expect(createColorStylesFromTemplate('background')).toMatchSnapshot();
  });
  test('border styles are generated correctly', () => {
    expect(createColorStylesFromTemplate('border')).toMatchSnapshot();
  });

  // elevation stuff
  test('opacity styles are generated correctly', () => {
    expect(createElevationStylesFromTemplate('opacity')).toMatchSnapshot();
  });
  test('shadow styles are generated correctly', () => {
    expect(createElevationStylesFromTemplate('shadow')).toMatchSnapshot();
  });
  test('surface styles are generated correctly', () => {
    expect(createElevationStylesFromTemplate('surface')).toMatchSnapshot();
  });

  // spacing
  test('spacing styles are generated correctly', () => {
    expect(createSpacingStylesFromTemplate()).toMatchSnapshot();
  });

  test('incorrect config throws', () => {
    expect(() =>
      createColorStylesFromTemplate('fizzbuzz' as any),
    ).toThrowError();
    expect(() =>
      createElevationStylesFromTemplate('fizzbuzz' as any),
    ).toThrowError();
  });
});
