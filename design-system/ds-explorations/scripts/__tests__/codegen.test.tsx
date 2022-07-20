import { createColorStylesFromTemplate } from '../color-codegen-template';
describe('@atlaskit/design-system-explorations', () => {
  test('text styles are generated correctly', () => {
    expect(createColorStylesFromTemplate('text')).toMatchSnapshot();
  });

  test('bg styles are generated correctly', () => {
    expect(createColorStylesFromTemplate('background')).toMatchSnapshot();
  });

  test('border styles are generated correctly', () => {
    expect(createColorStylesFromTemplate('border')).toMatchSnapshot();
  });

  test('incorrect config throws', () => {
    expect(() =>
      createColorStylesFromTemplate('fizzbuzz' as any),
    ).toThrowError();
  });
});
