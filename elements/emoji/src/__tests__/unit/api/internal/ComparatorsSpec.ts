import { EmojiDescription, EmojiVariationDescription } from '../../../../types';

import {
  AlphabeticalShortnameComparator,
  AsciiMatchComparator,
  ChainedEmojiComparator,
  EmojiComparator,
  ExactShortNameMatchComparator,
  EmojiTypeComparator,
  OrderComparator,
  QueryStringPositionMatchComparator,
  UsageFrequencyComparator,
} from '../../../../api/internal/Comparators';

class PresetResultComparator implements EmojiComparator {
  private result: number;

  constructor(result: number) {
    this.result = result;
  }

  compare(_e1: EmojiDescription, _e2: EmojiDescription): number {
    return this.result;
  }
}

describe('ChainedEmojiComparator', () => {
  const emoji: EmojiDescription = {
    shortName: 'abc',
    type: 'standard',
    category: 'monkey trousers',
    representation: undefined,
    searchable: false,
  };

  it('should return first comparator result when not 0', () => {
    const comparator = new ChainedEmojiComparator(
      new PresetResultComparator(100),
      new PresetResultComparator(200),
    );

    expect(comparator.compare(emoji, emoji)).toEqual(100);
  });

  it('should return second comparator result when first is 0', () => {
    const comparator = new ChainedEmojiComparator(
      new PresetResultComparator(0),
      new PresetResultComparator(200),
    );

    expect(comparator.compare(emoji, emoji)).toEqual(200);
  });

  it('should return 0 when all comparators return 0', () => {
    const comparator = new ChainedEmojiComparator(
      new PresetResultComparator(0),
      new PresetResultComparator(0),
    );

    expect(comparator.compare(emoji, emoji)).toEqual(0);
  });

  it('should return 0 when no comparators', () => {
    const comparator = new ChainedEmojiComparator();

    expect(comparator.compare(emoji, emoji)).toEqual(0);
  });
});

describe('EmojiComparator implementations', () => {
  let comparator: EmojiComparator;

  let left: EmojiDescription;
  let right: EmojiDescription;

  beforeEach(() => {
    left = {
      shortName: 'placeholder',
      type: 'type',
      category: 'category',
      representation: undefined,
      searchable: false,
    };
    right = {
      shortName: 'placeholder',
      type: 'type',
      category: 'category',
      representation: undefined,
      searchable: false,
    };
  });

  describe('AlphabeticalShortnameComparator', () => {
    beforeEach(() => {
      comparator = AlphabeticalShortnameComparator.Instance;
    });

    it('should be negative when left comes before right', () => {
      left.shortName = ':abcde:';
      right.shortName = ':abdef:';

      expect(comparator.compare(left, right)).toEqual(-1);
    });

    it('should be positive when right comes before left', () => {
      left.shortName = ':zbcde:';
      right.shortName = ':abdef:';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return 0 when left and right are identical', () => {
      expect(comparator.compare(left, right)).toEqual(0);
    });
  });

  describe('AsciiMatchComparator', () => {
    beforeEach(() => {
      comparator = new AsciiMatchComparator(':->');
    });

    it('should be negative when left matches and emoji and right does not', () => {
      left.ascii = [':>', ':->'];
      right.ascii = ['x-)'];

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when left does not matches and emoji and right does', () => {
      left.ascii = ['x-)'];
      right.ascii = [':>', ':->'];

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should be zero when both match', () => {
      left.ascii = [':>', ':->'];
      right.ascii = [':->'];

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should be zero when neither match', () => {
      left.ascii = [':>', ':-)'];
      right.ascii = ['x-)'];

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should be zero when neither have an ascii representation', () => {
      expect(comparator.compare(left, right)).toEqual(0);
    });
  });

  describe('ExactShortNameMatchComparator', () => {
    beforeEach(() => {
      comparator = new ExactShortNameMatchComparator('apple');
    });

    it('should be negative when left exactly matches the query', () => {
      left.shortName = ':apple:';
      right.shortName = ':appleseed:';

      expect(comparator.compare(left, right)).toEqual(-1);
    });

    it('should be positive when right exactly matches the query', () => {
      left.shortName = ':applepie:';
      right.shortName = ':apple:';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return negative when left and right both match but left is a site emoji ', () => {
      left.shortName = ':apple:';
      left.type = 'SITE';
      right.shortName = ':apple:';
      right.type = 'STANDARD';

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when left and right both match but right is a site emoji ', () => {
      left.shortName = ':apple:';
      left.type = 'STANDARD';
      right.shortName = ':apple:';
      right.type = 'SITE';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should be positive when left and right both match but left is of unknown type', () => {
      left.shortName = ':apple:';
      left.type = 'UNKNOWN_TYPE';
      right.shortName = ':apple:';
      right.type = 'STANDARD';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return 0 when left and right both match and are of the same type', () => {
      left.shortName = ':apple:';
      left.type = 'STANDARD';
      right.shortName = ':apple:';
      right.type = 'STANDARD';

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should return 0 when neither left or right match', () => {
      left.shortName = ':abcde:';
      right.shortName = ':fghijk:';

      expect(comparator.compare(left, right)).toEqual(0);
    });
  });

  describe('EmojiTypeComparator', () => {
    describe('standard order', () => {
      beforeEach(() => {
        comparator = new EmojiTypeComparator(false);
      });

      it('should order STANDARD before ATLASSIAN', () => {
        left.type = 'STANDARD';
        right.type = 'ATLASSIAN';

        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);
      });

      it('should order STANDARD before SITE', () => {
        left.type = 'STANDARD';
        right.type = 'SITE';

        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);
      });

      it('should order ATLASSIAN before SITE', () => {
        left.type = 'ATLASSIAN';
        right.type = 'SITE';

        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);
      });

      it('should order STANDARD, ATLASSIAN and SITE before an unknown type', () => {
        left.type = 'STANDARD';
        right.type = 'monkeytrousers';

        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);

        left.type = 'ATLASSIAN';
        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);

        left.type = 'SITE';
        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);
      });

      it('should return 0 for emoji of the same types', () => {
        left.type = 'STANDARD';
        right.type = 'STANDARD';

        expect(comparator.compare(left, right)).toEqual(0);

        left.type = 'monkeytrousers';
        right.type = 'simianwaistcoat';

        expect(comparator.compare(left, right)).toEqual(0);
      });
    });

    describe('reverse order', () => {
      beforeEach(() => {
        comparator = new EmojiTypeComparator(true);
      });

      it('should order STANDARD after ATLASSIAN', () => {
        left.type = 'STANDARD';
        right.type = 'ATLASSIAN';

        expect(comparator.compare(left, right) > 0).toEqual(true);
        expect(comparator.compare(right, left) < 0).toEqual(true);
      });

      it('should order STANDARD after SITE', () => {
        left.type = 'STANDARD';
        right.type = 'SITE';

        expect(comparator.compare(left, right) > 0).toEqual(true);
        expect(comparator.compare(right, left) < 0).toEqual(true);
      });

      it('should order ATLASSIAN after SITE', () => {
        left.type = 'ATLASSIAN';
        right.type = 'SITE';

        expect(comparator.compare(left, right) > 0).toEqual(true);
        expect(comparator.compare(right, left) < 0).toEqual(true);
      });

      it('should order STANDARD, ATLASSIAN and SITE before an unknown type', () => {
        left.type = 'STANDARD';
        right.type = 'monkeytrousers';

        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);

        left.type = 'ATLASSIAN';
        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);

        left.type = 'SITE';
        expect(comparator.compare(left, right) < 0).toEqual(true);
        expect(comparator.compare(right, left) > 0).toEqual(true);
      });
    });
  });

  describe('OrderComparator', () => {
    beforeEach(() => {
      comparator = OrderComparator.Instance;
    });

    it('should be negative when left has lower order', () => {
      left.order = 50;
      right.order = 51;

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when right has lower order', () => {
      left.order = 50;
      right.order = 42;

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return 0 when order is equal', () => {
      left.order = 50;
      right.order = 50;

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should be negative when left has order but right does not', () => {
      left.order = 50;
      right.order = undefined;

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when right has order but left does not', () => {
      left.order = undefined;
      right.order = 51;

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return 0 when neither have order', () => {
      left.order = undefined;
      right.order = undefined;

      expect(comparator.compare(left, right)).toEqual(0);
    });
  });

  describe('QueryStringPositionMatchComparator', () => {
    beforeEach(() => {
      comparator = new QueryStringPositionMatchComparator('ad', 'shortName');
    });

    it('should be negative when left matches earlier', () => {
      left.shortName = 'sad';
      right.shortName = 'amstrad';

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when right matches earlier', () => {
      left.shortName = 'persuade';
      right.shortName = 'lad';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return 0 when both match at the same position', () => {
      left.shortName = 'sad';
      right.shortName = 'dad';

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should return 0 when neither matches', () => {
      left.shortName = 'monkey';
      right.shortName = 'trousers';

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should be negative when left matches but right does not', () => {
      left.shortName = 'glad';
      right.shortName = 'stride';

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when right matches but left does not', () => {
      left.shortName = 'frosted';
      right.shortName = 'amstrad';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return 0 when neither contain the property', () => {
      comparator = new QueryStringPositionMatchComparator('ad', 'name');

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should be negative when left contains the property and matches but right does not', () => {
      comparator = new QueryStringPositionMatchComparator('ad', 'name');
      left.name = 'straddled';

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when right contains the property but left does not', () => {
      comparator = new QueryStringPositionMatchComparator('ad', 'name');
      right.name = 'straddled';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });
  });

  describe('UsageFrequencyComparator', () => {
    beforeEach(() => {
      comparator = new UsageFrequencyComparator(['xyz', 'abc', 'def', 'uvw']);
    });

    it('should be negative when left is ordered higher', () => {
      left.id = 'abc';
      right.id = 'def';

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when right is ordered higher', () => {
      left.id = 'abc';
      right.id = 'xyz';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return 0 when both have the same order', () => {
      left.id = 'abc';
      right.id = 'abc';

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should return 0 when neither have order', () => {
      left.id = 'fff';
      right.id = 'ggg';

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should return 0 when there is no order information', () => {
      comparator = new UsageFrequencyComparator([]);
      left.id = 'fff';
      right.id = 'ggg';

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should be negative when left has order and right does not', () => {
      left.id = 'uvw';
      right.id = 'ggg';

      expect(comparator.compare(left, right) < 0).toEqual(true);
    });

    it('should be positive when right has order and left does not', () => {
      left.id = 'fff';
      right.id = 'abc';

      expect(comparator.compare(left, right) > 0).toEqual(true);
    });

    it('should return 0 when the emoji have no id', () => {
      left.id = undefined;
      right.id = undefined;

      expect(comparator.compare(left, right)).toEqual(0);
    });

    it('should use baseId for position if emoji are variations', () => {
      const leftVariation: EmojiVariationDescription = {
        id: 'abc',
        baseId: 'uvw',
        ...left,
      };

      const rightVariation: EmojiVariationDescription = {
        id: 'def',
        baseId: 'xyz',
        ...right,
      };

      expect(comparator.compare(leftVariation, rightVariation) > 0).toEqual(
        true,
      );
    });
  });
});
