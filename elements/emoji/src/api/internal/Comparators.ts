import { MAX_ORDINAL } from '../../util/constants';
import { isEmojiVariationDescription } from '../../util/type-helpers';
import { EmojiDescription } from '../../types';

/**
 * Create the default sort comparator to be used for the user queries against emoji
 *
 * @param query the query used in the search to be sorted. Any colons will be stripped from the query and it will be
 * converted to lowercase.
 * @param orderedIds the id of emoji ordered by how frequently they are used
 */
export function createSearchEmojiComparator(
  query?: string,
  orderedIds?: Array<string>,
): EmojiComparator {
  const textQuery = query
    ? query.replace(/:/g, '').toLowerCase().trim()
    : undefined;

  const comparators: EmojiComparator[] = [];

  if (query) {
    comparators.push(new AsciiMatchComparator(query));
  }

  // Add the comparators to the 'chain'. The order of adding each comparator is important to the sort that is applied by the
  // ChainedEmojiComparator. (Which is why you may see the same 'if' a few times.)

  if (textQuery) {
    comparators.push(new ExactShortNameMatchComparator(textQuery));
  }

  if (orderedIds && orderedIds.length) {
    comparators.push(new UsageFrequencyComparator(orderedIds));
  }

  if (textQuery) {
    comparators.push(
      new QueryStringPositionMatchComparator(textQuery, 'shortName'),
      new QueryStringPositionMatchComparator(textQuery, 'name'),
    );
  }

  comparators.push(
    OrderComparator.Instance,
    AlphabeticalShortnameComparator.Instance,
  );

  const comparator = new ChainedEmojiComparator(...comparators);
  comparator.compare = comparator.compare.bind(comparator);
  return comparator;
}

export function createUsageOnlyEmojiComparator(
  orderedIds: Array<string>,
): EmojiComparator {
  const comparator = new ChainedEmojiComparator(
    new UsageFrequencyComparator(orderedIds),
    new EmojiTypeComparator(),
    OrderComparator.Instance,
  );
  comparator.compare = comparator.compare.bind(comparator);
  return comparator;
}

/**
 * Returns a number representing the result of comparing e1 and e2.
 * Compatible with Array.sort, which is to say -
 *   - less than 0 if e1 should come first
 *   - 0 if they are equal; e1 and e2 will be unchanged in position relative to each other
 *   - greater than 0 if e2 should come first.
 */
export interface EmojiComparator {
  compare(e1: EmojiDescription, e2: EmojiDescription): number;
}

/**
 * A combinator comparator that applies an ordered chained of sub-comparators. The first comparator that
 * returns a non-zero value stops the chain and causes that value to be returned. If a comparator returns a
 * zero then the next one in the chain is tried.
 *
 * If no comparators in the chain return a non-zero value then zero will be returned.
 */
export class ChainedEmojiComparator implements EmojiComparator {
  private chain: EmojiComparator[];

  constructor(...comparators: EmojiComparator[]) {
    this.chain = comparators;
  }

  compare(e1: EmojiDescription, e2: EmojiDescription): number {
    for (let i = 0; i < this.chain.length; i++) {
      const result = this.chain[i].compare(e1, e2);
      if (result !== 0) {
        return result;
      }
    }

    return 0;
  }
}

/**
 * Orders two emoji such that if one of them has an ascii representation that exactly matches the query then it will
 * be ordered first.
 */
export class AsciiMatchComparator implements EmojiComparator {
  private query: string;

  constructor(query: string) {
    this.query = query;
  }

  compare(e1: EmojiDescription, e2: EmojiDescription) {
    const e1HasAscii = e1.ascii && e1.ascii.indexOf(this.query) !== -1;
    const e2HasAscii = e2.ascii && e2.ascii.indexOf(this.query) !== -1;

    if (e1HasAscii && !e2HasAscii) {
      return -1;
    } else if (!e1HasAscii && e2HasAscii) {
      return 1;
    }

    return 0;
  }
}

/**
 * Orders two emoji such that the one who's shortname matches the query exactly comes first. If there are matching
 * shortnames then the type of emoji is taken into account with SITE emoji coming first.
 */
export class ExactShortNameMatchComparator implements EmojiComparator {
  private colonQuery: string;
  private typeComparator: EmojiComparator;

  constructor(query: string) {
    this.colonQuery = `:${query}:`;
    this.typeComparator = new EmojiTypeComparator(true);
  }

  compare(e1: EmojiDescription, e2: EmojiDescription) {
    if (e1.shortName === this.colonQuery && e2.shortName === this.colonQuery) {
      return this.typeComparator.compare(e1, e2);
    } else if (e1.shortName === this.colonQuery) {
      return -1;
    } else if (e2.shortName === this.colonQuery) {
      return 1;
    }

    return 0;
  }
}

/**
 * Orders two emoji based on their type, with the types being STANDARD, ATLASSIAN and SITE (in that order).
 * If the comparator is configured to 'reverse' then the order will be SITE, ATLASSIAN, STANDARD.
 *
 * Regardless of the reverse setting, an unknown type will always come last.
 */
export class EmojiTypeComparator implements EmojiComparator {
  private typeToNumber: Map<string, number>;

  constructor(reverse?: boolean) {
    if (reverse) {
      this.typeToNumber = new Map<string, number>([
        ['SITE', 0],
        ['ATLASSIAN', 1],
        ['STANDARD', 2],
      ]);
    } else {
      this.typeToNumber = new Map<string, number>([
        ['STANDARD', 0],
        ['ATLASSIAN', 1],
        ['SITE', 2],
      ]);
    }
  }

  compare(e1: EmojiDescription, e2: EmojiDescription) {
    return this.emojiTypeToOrdinal(e1) - this.emojiTypeToOrdinal(e2);
  }

  private emojiTypeToOrdinal(emoji: EmojiDescription): number {
    let ordinal = this.typeToNumber.get(emoji.type);
    if (ordinal === undefined) {
      ordinal = 10;
    }

    return ordinal;
  }
}

/**
 * Order two emoji such as the one which is more frequently used comes first. If neither have any usage
 * information then leave their order unchanged.
 */
export class UsageFrequencyComparator implements EmojiComparator {
  // A Map of emoji base Id to their order in a least of most frequently used
  private positionLookup: Map<string, number>;

  constructor(orderedIds: Array<string>) {
    this.positionLookup = new Map();
    // Make ordering start from 1 to avoid having zero in the map (which is falsey)
    orderedIds.map((id, index) => this.positionLookup.set(id, index + 1));
  }

  compare(e1: EmojiDescription, e2: EmojiDescription) {
    if (!e1.id || !e2.id) {
      return 0; // this shouldn't occur. Leave position unchanged if there is any missing id.
    }

    let i1 = this.getPositionInOrder(e1);
    let i2 = this.getPositionInOrder(e2);

    return i1 - i2;
  }

  /**
   * Get the ordinal representing the position of this emoji.
   *
   * @param id the id of the emoji
   */
  private getPositionInOrder(emoji: EmojiDescription) {
    let id = emoji.id ? emoji.id : '0';
    if (isEmojiVariationDescription(emoji)) {
      id = emoji.baseId;
    }

    const position = this.positionLookup.get(id);
    if (position) {
      return position;
    } else {
      return MAX_ORDINAL;
    }
  }
}

type KeysOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp | undefined ? P : never;
}[keyof T];

/**
 * A comparator that will sort higher an emoji which matches the query string earliest in the indicated
 * property.
 */
export class QueryStringPositionMatchComparator implements EmojiComparator {
  private readonly propertyName: KeysOfType<EmojiDescription, string>;
  private query: string;

  /**
   * @param query the query to match
   * @param propertyToCompare the property of EmojiDescription to check for query within
   */
  constructor(
    query: string,
    propertyToCompare: KeysOfType<EmojiDescription, string>,
  ) {
    this.query = query;
    if (!propertyToCompare) {
      throw new Error('propertyToCompare is required');
    }
    this.propertyName = propertyToCompare;
  }

  private getScore(emoji: EmojiDescription) {
    // It is fine to do override the null check here because we are checking
    // it on the constructor.
    const propertyValue: string | undefined = emoji[this.propertyName!];
    const score = propertyValue
      ? propertyValue.indexOf(this.query)
      : MAX_ORDINAL;
    return score === -1 ? MAX_ORDINAL : score;
  }

  compare(e1: EmojiDescription, e2: EmojiDescription) {
    return this.getScore(e1) - this.getScore(e2);
  }
}

export class OrderComparator implements EmojiComparator {
  private static INSTANCE: OrderComparator;
  private constructor() {}

  public static get Instance() {
    return this.INSTANCE || (this.INSTANCE = new this());
  }

  compare(e1: EmojiDescription, e2: EmojiDescription) {
    let o1 = e1.order ? e1.order : MAX_ORDINAL;
    let o2 = e2.order ? e2.order : MAX_ORDINAL;

    return o1 - o2;
  }
}

export class AlphabeticalShortnameComparator implements EmojiComparator {
  private static INSTANCE: AlphabeticalShortnameComparator;
  private constructor() {}

  public static get Instance() {
    return this.INSTANCE || (this.INSTANCE = new this());
  }

  compare(e1: EmojiDescription, e2: EmojiDescription) {
    return e1.shortName.localeCompare(e2.shortName);
  }
}
