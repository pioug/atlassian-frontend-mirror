import { ITokenizer, Search, UnorderedSearchIndex } from 'js-search';
import { CategoryId } from '../components/picker/categories';
import { defaultCategories, frequentCategory } from '../util/constants';
import {
  getCategoryId,
  isEmojiDescriptionWithVariations,
} from '../util/type-helpers';
import {
  EmojiDescription,
  EmojiSearchResult,
  OptionalEmojiDescription,
  SearchOptions,
  SearchSort,
} from '../types';
import { tokenizerRegex } from './EmojiRepositoryRegex';
import {
  createSearchEmojiComparator,
  createUsageOnlyEmojiComparator,
} from './internal/Comparators';
import { UsageFrequencyTracker } from './internal/UsageFrequencyTracker';

type Token = {
  token: string;
  start: number;
};

// FS-1097 - duplicated in mentions - extract at some point into a shared library
class Tokenizer implements ITokenizer {
  public tokenize(text: string): string[] {
    return this.tokenizeAsTokens(text).map(token => token.token);
  }

  public tokenizeAsTokens(text: string): Token[] {
    let match;
    let tokens: Token[] = [];
    tokenizerRegex.lastIndex = 0;
    while ((match = tokenizerRegex.exec(text)) !== null) {
      if (match[0]) {
        tokens.push({
          token: match[0],
          start: match.index,
        });
      }
    }

    return tokens;
  }
}

declare type EmojiByKey = Map<any, EmojiDescription[]>;

interface EmojiToKey {
  (emoji: EmojiDescription): any;
}

const addAllVariants = (
  emoji: EmojiDescription,
  fnKey: EmojiToKey,
  map: EmojiByKey,
): void => {
  const key = fnKey(emoji);
  if (!map.has(key)) {
    map.set(key, []);
  }
  const emojisForKey = map.get(key);
  // Unnecessary, but typescript thinks it is. :/
  if (emojisForKey) {
    emojisForKey.push(emoji);
  }

  if (isEmojiDescriptionWithVariations(emoji)) {
    // map variations too
    const variations = emoji.skinVariations;
    if (variations) {
      variations.forEach(variation => addAllVariants(variation, fnKey, map));
    }
  }
};

const findByKey = (map: EmojiByKey, key: any): OptionalEmojiDescription => {
  const emojis = map.get(key);
  if (emojis && emojis.length) {
    // Priority is always to source from the last emoji set (last overrides first)
    return emojis[emojis.length - 1];
  }
  return undefined;
};

type SplitQuery = {
  nameQuery: string;
  asciiQuery: string;
};

const splitQuery = (query = ''): SplitQuery => {
  const isColonQuery = query.indexOf(':') === 0;
  if (isColonQuery) {
    return {
      nameQuery: query.slice(1),
      asciiQuery: query,
    };
  }

  return {
    nameQuery: query,
    asciiQuery: '',
  };
};

export const getEmojiVariation = (
  emoji: EmojiDescription,
  options?: SearchOptions,
): EmojiDescription => {
  if (isEmojiDescriptionWithVariations(emoji) && options) {
    const skinTone = options.skinTone;
    if (skinTone && emoji.skinVariations && emoji.skinVariations.length) {
      const skinToneEmoji = emoji.skinVariations[skinTone - 1]; // skinTone start at 1
      if (skinToneEmoji) {
        return skinToneEmoji;
      }
    }
  }
  return emoji;
};

const findEmojiIndex = (
  emojis: EmojiDescription[],
  toFind: EmojiDescription,
): number => {
  const findId = toFind.id;
  let match = -1;
  emojis.forEach((emoji, index) => {
    // Match if ID is defined and are equal
    // Or both have no id and shortnames match
    if (
      (emoji.id && emoji.id === findId) ||
      (!emoji.id && !findId && emoji.shortName === toFind.shortName)
    ) {
      match = index;
      return;
    }
  });
  return match;
};

export default class EmojiRepository {
  private emojis: EmojiDescription[];
  private fullSearch!: Search;
  private shortNameMap!: EmojiByKey;
  private idMap!: EmojiByKey;
  private asciiMap!: Map<string, EmojiDescription>;
  private dynamicCategoryList!: CategoryId[];
  private static readonly defaultEmojiWeight: number = 1000000;

  // protected to allow subclasses to access (for testing and storybooks).
  protected usageTracker!: UsageFrequencyTracker;

  constructor(
    emojis: EmojiDescription[],
    usageTracker?: UsageFrequencyTracker,
  ) {
    this.emojis = emojis;
    this.initMembers(usageTracker);
  }

  /**
   * Returns all available (and searchable) emoji in some default order.
   */
  all(): EmojiSearchResult {
    const options: SearchOptions = {
      sort: SearchSort.None,
    };

    return this.search('', options);
  }

  /**
   * Text search of emoji shortName and name field for suitable matches.
   *
   * Returns an array of all (searchable) emoji if query is empty or null, otherwise returns matching emoji.
   *
   * You can change how the results are sorted by specifying a custom EmojiComparator in the SearchOptions. If
   * you don't want any sorting you can also disable via the SearchOptions (this might be a useful optimisation).
   * If no sort is specified in SearchOptions then a default sorting it applied based on the query.
   */
  search(query?: string, options?: SearchOptions): EmojiSearchResult {
    let filteredEmoji: EmojiDescription[] = [];

    const { nameQuery, asciiQuery } = splitQuery(query);
    if (nameQuery) {
      filteredEmoji = this.fullSearch.search(nameQuery) as EmojiDescription[];

      if (asciiQuery) {
        filteredEmoji = this.withAsciiMatch(asciiQuery, filteredEmoji);
      }
    } else {
      filteredEmoji = this.getAllSearchableEmojis();
    }

    filteredEmoji = this.applySearchOptions(filteredEmoji, query, options);

    return {
      emojis: filteredEmoji,
      query,
    };
  }

  /**
   * Returns all emoji with matching shortName
   */
  findAllMatchingShortName(shortName: string): EmojiDescription[] {
    return this.shortNameMap.get(shortName) || [];
  }

  /**
   * Returns the first matching emoji matching the shortName, or null if none found.
   */
  findByShortName(shortName: string): OptionalEmojiDescription {
    return findByKey(this.shortNameMap, shortName);
  }

  /**
   * Returns the first matching emoji matching the id, or null if none found.
   */
  findById(id: string): OptionalEmojiDescription {
    return findByKey(this.idMap, id);
  }

  findByAsciiRepresentation(asciiEmoji: string): OptionalEmojiDescription {
    return this.asciiMap.get(asciiEmoji);
  }

  findInCategory(categoryId: CategoryId): EmojiDescription[] {
    if (categoryId === frequentCategory) {
      return this.getFrequentlyUsed();
    } else {
      return this.all().emojis.filter(emoji => emoji.category === categoryId);
    }
  }

  addUnknownEmoji(emoji: EmojiDescription) {
    this.emojis = [...this.emojis, emoji];
    this.fullSearch.addDocuments([emoji]);
    this.addToMaps(emoji);
    this.addToDynamicCategories(emoji);
  }

  getAsciiMap(): Map<string, EmojiDescription> {
    return this.asciiMap;
  }

  /**
   * Return the most frequently used emoji, ordered from most frequent to least frequent. Return an empty array if
   * there are none.
   *
   * @param options optional settings to be applied to the set of frequently used emoji
   */
  getFrequentlyUsed(options?: SearchOptions): EmojiDescription[] {
    const emojiIds = this.usageTracker.getOrder();

    let emojiResult = emojiIds
      .map(id => this.findById(id))
      .filter(e => e !== undefined) as EmojiDescription[];

    if (options) {
      emojiResult = this.applySearchOptions(emojiResult, '', options);
    }

    return emojiResult;
  }

  getDynamicCategoryList(): CategoryId[] {
    return this.dynamicCategoryList.slice();
  }

  /**
   * Call this on emoji usage to allow the EmojiRepository to track the usage of emoji (which could be useful
   * in sorting, etc).
   *
   * @param emoji the emoji that was just used
   */
  used(emoji: EmojiDescription) {
    this.usageTracker.recordUsage(emoji);

    // If this is the first usage ensure that we update the dynamic categories.
    // This is done in a 'timeout' since the usageTracker call previously also happens in a timeout. This ensures that
    // the frequent category will not appear until the usage has been tracked (avoiding the possibility of an empty
    // frequent category being shown in the picker).
    if (this.dynamicCategoryList.indexOf(frequentCategory) === -1) {
      window.setTimeout(() => {
        this.dynamicCategoryList.push(frequentCategory);
      });
    }
  }

  delete(emoji: EmojiDescription) {
    const deletedIndex = findEmojiIndex(this.emojis, emoji);
    if (deletedIndex !== -1) {
      // Remove the deleted emojis from the internal list
      this.emojis.splice(deletedIndex, 1);
      // Reconstruct repository member variables
      this.initMembers(this.usageTracker);
    }
  }

  private withAsciiMatch(
    ascii: string,
    emojis: EmojiDescription[],
  ): EmojiDescription[] {
    let result = emojis;
    const asciiEmoji = this.findByAsciiRepresentation(ascii);
    if (asciiEmoji) {
      // Ensures that the same emoji isn't already in the list
      // If it is, we give precedence to the ascii match
      result = emojis.filter(e => e.id !== asciiEmoji.id);
      result = [asciiEmoji, ...result];
    }
    return result;
  }

  private applySearchOptions(
    emojis: EmojiDescription[],
    query?: string,
    options?: SearchOptions,
  ): EmojiDescription[] {
    if (!options) {
      options = <SearchOptions>{};
    }

    if (options.sort === undefined) {
      options.sort = SearchSort.Default;
    }

    let comparator;
    if (options.sort === SearchSort.Default) {
      comparator = createSearchEmojiComparator(
        query,
        this.usageTracker.getOrder(),
      );
    } else if (options.sort === SearchSort.UsageFrequency) {
      comparator = createUsageOnlyEmojiComparator(this.usageTracker.getOrder());
    }

    if (comparator) {
      comparator.compare = comparator.compare.bind(comparator); // TODO bind at a better place
      emojis = emojis.sort(comparator.compare);
    }

    if (options.limit && options.limit > 0) {
      emojis = emojis.slice(0, options.limit);
    }

    if (options.skinTone) {
      return emojis.map(emoji => {
        return getEmojiVariation(emoji, options);
      });
    }

    return emojis;
  }

  private initMembers(usageTracker?: UsageFrequencyTracker): void {
    this.usageTracker = usageTracker || new UsageFrequencyTracker();
    this.initRepositoryMetadata();
    this.initSearchIndex();
  }

  /**
   * Optimisation to initialise all map member variables in single loop over emojis
   */
  private initRepositoryMetadata(): void {
    this.shortNameMap = new Map();
    this.idMap = new Map();
    this.asciiMap = new Map();
    const categorySet = new Set<CategoryId>();

    this.emojis.forEach(emoji => {
      categorySet.add(emoji.category as CategoryId);
      this.addToMaps(emoji);
    });

    if (this.usageTracker.getOrder().length) {
      categorySet.add(frequentCategory);
    }

    this.dynamicCategoryList = Array.from(categorySet).filter(
      category => defaultCategories.indexOf(category) === -1,
    );
  }

  private initSearchIndex(): void {
    this.fullSearch = new Search('id');
    this.fullSearch.tokenizer = new Tokenizer();
    this.fullSearch.searchIndex = new UnorderedSearchIndex();
    this.fullSearch.addIndex('name');
    this.fullSearch.addIndex('shortName');

    this.fullSearch.addDocuments(this.getAllSearchableEmojis());
  }

  private getAllSearchableEmojis(): EmojiDescription[] {
    return this.emojis.filter(emojiDescription => emojiDescription.searchable);
  }

  private addToMaps(emoji: EmojiDescription): void {
    // Give default value and assign higher weight to Atlassian emojis for logical order when sorting
    if (typeof emoji.order === 'undefined' || emoji.order === -1) {
      emoji.order = EmojiRepository.defaultEmojiWeight;
    }
    if (typeof emoji.id === 'undefined') {
      emoji.id = EmojiRepository.defaultEmojiWeight.toString();
    }
    addAllVariants(emoji, e => e.shortName, this.shortNameMap);
    addAllVariants(emoji, e => e.id, this.idMap);
    if (emoji.ascii) {
      emoji.ascii.forEach(a => this.asciiMap.set(a, emoji));
    }
  }

  private addToDynamicCategories(emoji: EmojiDescription): void {
    const category = getCategoryId(emoji);
    if (
      defaultCategories.indexOf(category) === -1 &&
      this.dynamicCategoryList.indexOf(category) === -1
    ) {
      this.dynamicCategoryList.push(category);
    }
  }
}
