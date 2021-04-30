import { getIsDiscoverMoreClickable } from '../../get-is-discover-more-clickable';

describe('isDiscoverMoreClickable', () => {
  describe('when passed two functions', () => {
    it('should return true', () => {
      expect(
        getIsDiscoverMoreClickable(
          () => {},
          () => {},
        ),
      ).toEqual(true);
    });
  });

  describe('when one of the args is not a function', () => {
    const cases = [
      { one: null, two: () => {} },
      { one: undefined, two: () => {} },
      { one: null, two: null },
      { one: {}, two: true },
      { one: true, two: true },
      { one: () => {}, two: true },
      { one: 1, two: () => {} },
      { one: () => {}, two: null },
      { one: () => {}, two: {} },
    ];
    test.each(cases)(
      `should return false for %p`,
      ({ one, two }) => {
        // @ts-ignore
        expect(getIsDiscoverMoreClickable(one, two)).toEqual(false);
      },
      1,
    );
  });
});
