export function trimChunk(chunk: string) {
  return chunk.toLowerCase().replace(/\s/g, '');
}

export function singleWord(search: string) {
  return !search.includes(' ');
}

export function defaultCompareFn(
  a: number | string,
  b: number | string,
): number {
  return typeof a === 'number' && typeof b === 'number'
    ? a - b
    : String.prototype.localeCompare.call(a.toString(), b.toString());
}

export enum SortMode {
  PRIORITY_FIRST = 'first',
  PRIORITY_LAST = 'last',
}

export function buildSortPredicateWith<T>(
  getProp: (item: T) => string | number,
  getPriority: (item: T) => number,
  sortMode: SortMode,
  compareFn = defaultCompareFn,
): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const [propA, propB, prioA, prioB] = [
      getProp(a),
      getProp(b),
      getPriority(a),
      getPriority(b),
    ];
    const prioDiff = compareFn(prioA, prioB);

    if (sortMode === SortMode.PRIORITY_FIRST && prioDiff) {
      return prioDiff;
    } else if (sortMode === SortMode.PRIORITY_FIRST) {
      return compareFn(propA, propB);
    } else {
      // SortMode.PRIORITY_LAST
      return prioDiff;
    }
  };
}

export function distance(search: string, content: string): number {
  return trimChunk(search)
    .split('')
    .reduce(
      (acc, char, index) => {
        const { distance, offset } = acc;

        if (distance === Infinity) {
          return acc;
        }

        const indexInContent = content.indexOf(char, offset);

        if (indexInContent === -1) {
          return { distance: Infinity, offset: 0 };
        }

        return {
          offset: indexInContent + 1,
          distance:
            distance +
            (index !== indexInContent ? Math.abs(index - indexInContent) : 0),
        };
      },
      { distance: 0, offset: 0 },
    ).distance;
}

// Finds the distance of the search string from each word and returns the min.
// Ensures the search string starts with the letter of one of the words
export function distanceByWords(search: string, content: string): number {
  if (search === '') {
    return 0;
  }

  if (!singleWord(search)) {
    return distance(search, trimChunk(content));
  }

  const lowerSearch = trimChunk(search);

  return content
    .replace(/\s/g, ' ')
    .toLowerCase()
    .split(' ')
    .filter(word => lowerSearch[0] === word[0])
    .map(word => trimChunk(word))
    .reduce(
      (minDist, word) => Math.min(minDist, distance(lowerSearch, word)),
      Infinity,
    );
}

export function getSearchChunks({
  keywords,
  title,
}: {
  keywords?: string;
  title: string;
}) {
  return keywords ? [title].concat(keywords) : [title];
}

export function find(
  query: string,
  items: Array<{
    title: string;
    keywords?: string;
    priority?: number;
  }>,
) {
  return (
    items
      // pre-sort items by title ascending, putting prioritary items first
      .sort(
        buildSortPredicateWith(
          item => item.title,
          item => item.priority || Number.POSITIVE_INFINITY,
          SortMode.PRIORITY_FIRST,
        ),
      )
      // calculate lowest items distance to query
      .map(item => ({
        item,
        distance: getSearchChunks(item).reduce((acc, chunk) => {
          const chunkDistance = distanceByWords(query, chunk);
          return chunkDistance < acc ? chunkDistance : acc;
        }, Infinity),
      }))
      /**
       * Filter results giving:
       * - potential match when query is one word
       * - exact match when query has more words
       */
      .filter(({ distance }) =>
        singleWord(query) ? distance !== Infinity : distance === 0,
      )
      // post-sort items by distance ascending, putting prioritary items last
      .sort(
        buildSortPredicateWith(
          agg => agg.distance,
          agg => agg.item.priority || Number.POSITIVE_INFINITY,
          SortMode.PRIORITY_LAST,
        ),
      )
      .map(agg => agg.item)
  );
}
