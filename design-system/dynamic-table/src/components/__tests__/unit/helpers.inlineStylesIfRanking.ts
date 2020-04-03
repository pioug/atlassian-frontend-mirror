import { inlineStylesIfRanking } from '../../../internal/helpers';

const width = 100;
const height = 200;

test('should return empty object if not in ranking state', () => {
  expect(inlineStylesIfRanking(false, width, height)).toEqual({});
});

test('should not add height prop if not passed', () => {
  expect(inlineStylesIfRanking(true, width)).toEqual({ width });
});

test('should add height if passed', () => {
  expect(inlineStylesIfRanking(true, width, height)).toEqual({
    width,
    height,
  });
});
