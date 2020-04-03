import { percentile } from '../../percentile';

describe('percentile', () => {
  it('returns undefined for empty series', () => {
    expect(percentile([], 0)).toBeUndefined();
  });

  it.each`
    ratio   | expected | series
    ${0.25} | ${3.0}   | ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    ${0.5}  | ${5.5}   | ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    ${0.75} | ${8.0}   | ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    ${0.01} | ${1.0}   | ${[1, 2, 3, 4, 2, 3, 4, 10, 5, 7, 8, 11]}
    ${0.1}  | ${2.0}   | ${[1, 2, 3, 4, 2, 3, 4, 10, 5, 7, 8, 11]}
    ${0.8}  | ${8.0}   | ${[1, 2, 3, 4, 2, 3, 4, 10, 5, 7, 8, 11]}
    ${0.99} | ${11.0}  | ${[1, 2, 3, 4, 2, 3, 4, 10, 5, 7, 8, 11]}
  `(
    'percentile($series, $ratio) === $expected',
    ({ ratio, series, expected }) => {
      expect(percentile(series, ratio)).toBe(expected);
    },
  );
});
