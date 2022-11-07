import Ranks from '../rank';

describe('Plugin Ranks', () => {
  const findDuplicated = (arr: string[]): string[] => {
    return arr.reduce<{
      counts: { [key: string]: number };
      duplicates: string[];
    }>(
      (dups, item) => {
        dups.counts[item] = (dups.counts[item] ?? 0) + 1;
        if (dups.counts[item] === 2) {
          dups.duplicates.push(item);
        }
        return dups;
      },
      {
        counts: {},
        duplicates: [],
      },
    ).duplicates;
  };

  it(`should not contain duplicate plugins`, () => {
    expect(findDuplicated(Ranks.plugins)).toHaveLength(0);
  });

  it(`should not contain duplicate nodes`, () => {
    expect(findDuplicated(Ranks.nodes)).toHaveLength(0);
  });

  it(`should not contain duplicate marks`, () => {
    expect(findDuplicated(Ranks.marks)).toHaveLength(0);
  });
});
