import pWaitFor from 'p-wait-for';
import EmojiRepository, {
  getEmojiVariation,
} from '../../../api/EmojiRepository';
import { customCategory, customType } from '../../../util/constants';
import { containsEmojiId, toEmojiId } from '../../../util/type-helpers';
import { EmojiDescription, SearchSort } from '../../../types';
import {
  emojis as allEmojis,
  newEmojiRepository,
  openMouthEmoji,
  searchableEmojis,
  smileyEmoji,
  standardEmojis,
  thumbsdownEmoji,
  thumbsupEmoji,
} from '../_test-data';

function checkOrder(expected: any[], actual: any[]) {
  expect(actual).toHaveLength(expected.length);
  expected.forEach((emoji, idx) => {
    expect(emoji.id).toEqual(actual[idx].id);
  });
}

const cowboy: EmojiDescription = {
  id: '1f920',
  name: 'face with cowboy hat',
  shortName: ':cowboy:',
  type: 'STANDARD',
  category: 'PEOPLE',
  order: 10103,
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/standard/6ba7377a-fbd4-4efe-8dbc-f025cfb40c2b/32x32/people.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 646,
    y: 714,
    height: 32,
    width: 32,
    xIndex: 19,
    yIndex: 21,
  },
  searchable: true,
};

const siteTest: EmojiDescription = {
  id: '1f921',
  name: 'collision symbol',
  shortName: ':test:',
  type: customType,
  category: customCategory,
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/standard/6ba7377a-fbd4-4efe-8dbc-f025cfb40c2b/32x32/people.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 646,
    y: 714,
    height: 32,
    width: 32,
    xIndex: 19,
    yIndex: 21,
  },
  searchable: true,
};

const atlassianTest: EmojiDescription = {
  id: '1f922',
  name: 'boom',
  shortName: ':test:',
  type: 'ATLASSIAN',
  category: 'SYMBOL',
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/standard/6ba7377a-fbd4-4efe-8dbc-f025cfb40c2b/32x32/people.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 646,
    y: 714,
    height: 32,
    width: 32,
    xIndex: 19,
    yIndex: 21,
  },
  searchable: true,
};

const standardTest: EmojiDescription = {
  id: '1f923',
  name: 'BOOM',
  shortName: ':test1:',
  type: 'STANDARD',
  category: 'SYMBOL',
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/standard/6ba7377a-fbd4-4efe-8dbc-f025cfb40c2b/32x32/people.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 646,
    y: 714,
    height: 32,
    width: 32,
    xIndex: 19,
    yIndex: 21,
  },
  searchable: true,
};

const allNumberTest: EmojiDescription = {
  id: '1f43c',
  name: 'panda face',
  shortName: ':420:',
  type: 'STANDARD',
  category: 'NATURE',
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/standard/551c9814-1d37-4573-819d-afab3afeaf32/32x32/nature.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 238,
    y: 0,
    height: 32,
    width: 32,
    xIndex: 7,
    yIndex: 0,
  },
  searchable: true,
};

const frequentTest: EmojiDescription = {
  id: '1f43c',
  name: 'panda face',
  shortName: ':panda:',
  type: 'FREQUENT',
  category: 'FREQUENT',
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/standard/551c9814-1d37-4573-819d-afab3afeaf32/32x32/nature.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 238,
    y: 0,
    height: 32,
    width: 32,
    xIndex: 7,
    yIndex: 0,
  },
  searchable: true,
};

export const siteEmojiChinese1 = {
  id: 'chinese1',
  name: '我想你',
  fallback: ':chinese1:',
  type: 'SITE',
  category: 'CUSTOM',
  order: -1000,
  searchable: true,
  shortName: ':我想你:',
  creatorUserId: 'Thor',
  representation: {
    height: 120,
    width: 100,
    imagePath:
      'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/wtf@4x.png',
  },
  skinVariations: [],
};

export const siteEmojiChinese2 = {
  id: 'chinese2',
  name: '象形字',
  fallback: ':chinese2:',
  type: 'SITE',
  category: 'CUSTOM',
  order: -1000,
  searchable: true,
  shortName: ':象形字:',
  creatorUserId: 'Thor',
  representation: {
    height: 120,
    width: 100,
    imagePath:
      'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/wtf@4x.png',
  },
  skinVariations: [],
};

export const siteEmojiChinese3 = {
  id: 'chinese3',
  name: '我字',
  fallback: ':chinese3:',
  type: 'SITE',
  category: 'CUSTOM',
  order: -1000,
  searchable: true,
  shortName: ':我字:',
  creatorUserId: 'Thor',
  representation: {
    height: 120,
    width: 100,
    imagePath:
      'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/wtf@4x.png',
  },
  skinVariations: [],
};

export const siteEmojiGreek1 = {
  id: 'greek1',
  name: 'ΦΏϖϘώ',
  fallback: ':greek1:',
  type: 'SITE',
  category: 'CUSTOM',
  order: -1000,
  searchable: true,
  shortName: ':ΦΏϖϘώ:',
  creatorUserId: 'Thor',
  representation: {
    height: 120,
    width: 100,
    imagePath:
      'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/wtf@4x.png',
  },
  skinVariations: [],
};

export const siteEmojiGreek2 = {
  id: 'greek2',
  name: 'ϪϮϼϠ',
  fallback: ':greek2:',
  type: 'SITE',
  category: 'CUSTOM',
  order: -1000,
  searchable: true,
  shortName: ':ϪϮϼϠ:',
  creatorUserId: 'Thor',
  representation: {
    height: 120,
    width: 100,
    imagePath:
      'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/wtf@4x.png',
  },
  skinVariations: [],
};

export const siteEmojiGreek3 = {
  id: 'greek3',
  name: 'ϪϮϘώ',
  fallback: ':greek3:',
  type: 'SITE',
  category: 'CUSTOM',
  order: -1000,
  searchable: true,
  shortName: ':ϪϮϘώ:',
  creatorUserId: 'Thor',
  representation: {
    height: 120,
    width: 100,
    imagePath:
      'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/wtf@4x.png',
  },
  skinVariations: [],
};

describe('EmojiRepository', () => {
  let emojiRepository: EmojiRepository;

  beforeEach(() => {
    // emojiRepository has state that can influence search results so make it fresh for each test.
    emojiRepository = newEmojiRepository();
  });

  describe('Search with non standard characters', () => {
    it('one match expected when searching emoji with chinese characters', () => {
      const repository = new EmojiRepository([
        cowboy,
        frequentTest,
        siteEmojiChinese1,
        siteEmojiChinese2,
        siteEmojiChinese3,
      ]);
      const emojis = repository.search(':想').emojis;
      expect(emojis.length).toEqual(1);
      expect(emojis[0].shortName).toEqual(':我想你:');
    });

    it('two matches expected when searching emoji with chinese characters', () => {
      const repository = new EmojiRepository([
        cowboy,
        frequentTest,
        siteEmojiChinese1,
        siteEmojiChinese2,
        siteEmojiChinese3,
      ]);
      const emojis = repository.search(':字').emojis;
      expect(emojis.length).toEqual(2);

      expect(emojis[0].shortName).toEqual(':我字:');
      expect(emojis[1].shortName).toEqual(':象形字:');
    });

    it('one match expected when searching emoji with greek characters', () => {
      const repository = new EmojiRepository([
        cowboy,
        frequentTest,
        siteEmojiChinese1,
        siteEmojiGreek1,
        siteEmojiGreek2,
        siteEmojiGreek3,
      ]);
      const emojis = repository.search(':ϪϮϼ').emojis;
      expect(emojis.length).toEqual(1);
      expect(emojis[0].id).toEqual('greek2');
    });

    it('two matches expected when searching emoji with greek characters', () => {
      const repository = new EmojiRepository([
        cowboy,
        frequentTest,
        siteEmojiChinese1,
        siteEmojiGreek1,
        siteEmojiGreek2,
        siteEmojiGreek3,
      ]);
      const emojis = repository.search(':ϪϮ').emojis;
      expect(emojis.length).toEqual(2);
      expect(emojis[0].id).toEqual('greek3');
      expect(emojis[1].id).toEqual('greek2');
    });
  });

  describe('#search', () => {
    it('all', () => {
      const expectedEmojis = [
        ...searchableEmojis.slice(0, 10), // upto flag,
        cowboy,
        ...searchableEmojis.slice(10), // rest...
      ];
      const repository = new EmojiRepository(expectedEmojis);
      const emojis = repository.all().emojis;
      checkOrder(expectedEmojis, emojis);
    });

    it('all should not include non-searchable emoji', () => {
      const emojis = emojiRepository.all().emojis;

      expect(emojis.length).toBeGreaterThan(0);
      expect(
        emojis.filter(emoji => emoji.shortName === ':police_officer:').length,
      ).toEqual(0);
    });

    it('search all - colon style', () => {
      const expectedEmojis = [
        ...searchableEmojis.slice(0, 10), // upto flag,
        cowboy,
        ...searchableEmojis.slice(10), // rest...
      ];
      const repository = new EmojiRepository(expectedEmojis);
      const emojis = repository.search(':', { sort: SearchSort.None }).emojis;
      checkOrder(expectedEmojis, emojis);
    });

    it('no categories repeat', () => {
      const emojis = emojiRepository.all().emojis;
      const foundCategories = new Set<string>();
      let lastCategory: string;

      emojis.forEach(emoji => {
        if (emoji.category !== lastCategory) {
          expect(foundCategories.has(emoji.category)).toEqual(false);
          lastCategory = emoji.category;
        }
      });
    });

    it('returns frequently used before others except for an exact shortname match', done => {
      const greenHeart = emojiRepository.findByShortName(':green_heart:');
      const heart = emojiRepository.findByShortName(':heart:');

      if (!greenHeart || !heart) {
        fail(
          'The emoji needed for this test were not found in the EmojiRepository',
        );
        done();
      } else {
        const result: EmojiDescription[] = emojiRepository.search(':hear')
          .emojis;
        let heartIndex = result.indexOf(heart);
        let greenHeartIndex = result.indexOf(greenHeart);

        expect(heartIndex).not.toEqual(-1);
        expect(greenHeartIndex).not.toEqual(-1);
        expect(heartIndex < greenHeartIndex).toEqual(true);

        emojiRepository.used(greenHeart);

        // usage is recorded asynchronously so give it a chance to happen by running the asserts with window.setTimeout
        window.setTimeout(() => {
          const nextResult: EmojiDescription[] = emojiRepository.search(':hear')
            .emojis;
          heartIndex = nextResult.indexOf(heart);
          greenHeartIndex = nextResult.indexOf(greenHeart);

          expect(heartIndex).not.toEqual(-1);
          expect(greenHeartIndex).not.toEqual(-1);
          expect(greenHeartIndex < heartIndex).toEqual(true);

          // exact matching shortname should come above usage
          const exactMatchResult: EmojiDescription[] = emojiRepository.search(
            ':heart:',
          ).emojis;
          expect(
            exactMatchResult.indexOf(heart) <
              exactMatchResult.indexOf(greenHeart),
          ).toEqual(true);
          done();
        });
      }
    });

    it('returns exact matches first', () => {
      const firstEmoji = emojiRepository.search(':grin').emojis[0];
      expect(firstEmoji.shortName).toEqual(':grin:');
    });

    it('conflicting shortName matches show in type order Site -> Atlassian -> Standard', () => {
      const splitCategoryEmojis = [
        ...searchableEmojis.slice(0, 10), // upto flag,
        atlassianTest,
        standardTest,
        siteTest,
        ...searchableEmojis.slice(10), // rest...
      ];
      const repository = new EmojiRepository(splitCategoryEmojis);
      const emojis = repository.search(':test').emojis;
      const expectedEmoji = [siteTest, atlassianTest, standardTest];
      checkOrder(expectedEmoji, emojis);
    });

    it('thumbsup emojis appears before thumbs down', () => {
      const emojis = emojiRepository.search(':thumbs').emojis;
      const expectedEmoji = [thumbsupEmoji, thumbsdownEmoji];
      checkOrder(expectedEmoji, emojis);
    });

    it('options - limit ignored if missing', () => {
      const emojis = emojiRepository.search('', { sort: SearchSort.None })
        .emojis;
      checkOrder(searchableEmojis, emojis);
    });

    it('options - limit results', () => {
      const emojis = emojiRepository.search('', {
        limit: 10,
        sort: SearchSort.None,
      }).emojis;
      checkOrder(searchableEmojis.slice(0, 10), emojis);
    });

    it('includes ascii match at the top', () => {
      const emojis = emojiRepository.search(':O').emojis;
      expect(emojis[0]).toEqual(openMouthEmoji);
    });

    it('de-dupes ascii match from other matches', () => {
      const emojis = emojiRepository.search(':O').emojis;
      const openMouthEmojiCount = emojis.filter(e => e.id === openMouthEmoji.id)
        .length;
      expect(openMouthEmojiCount).toEqual(1);
    });

    it('minus not indexed', () => {
      const emojis = emojiRepository.search(':congo').emojis;
      expect(emojis.length).toEqual(1);
      expect(emojis[0].name).toEqual('Congo - Brazzaville');
      const noEmojis = emojiRepository.search(':-').emojis;
      expect(noEmojis.length).toEqual(0);
    });

    it('returns emojis whose shortName starts with a number', () => {
      const expectedEmojis = [...searchableEmojis, allNumberTest];
      const repository = new EmojiRepository(expectedEmojis);
      const emojis = repository.search(':4').emojis;
      expect(emojis.length).toEqual(1);
      expect(emojis[0].name).toEqual('panda face');
    });

    it('should include numbers as a part of the query', () => {
      const expectedEmojis = [...searchableEmojis, atlassianTest, standardTest];
      const repository = new EmojiRepository(expectedEmojis);
      const emojis = repository.search(':test1').emojis;
      expect(emojis.length).toEqual(1);
      expect(emojis[0].name).toEqual('BOOM');
    });

    it('should not find a non-searchable emoji', () => {
      // ensure :police_officer: is present
      const policeEmoji = emojiRepository.findByShortName(':police_officer:');
      expect(policeEmoji === undefined).toEqual(false);

      const emojis = emojiRepository.search(':police_officer:').emojis;
      expect(emojis.length).toEqual(0);
    });
  });

  describe('#addUnknownEmoji', () => {
    it('add custom emoji', () => {
      const siteEmojiId = toEmojiId(siteTest);
      const repository = new EmojiRepository(allEmojis);
      repository.addUnknownEmoji(siteTest);
      const searchEmojis = repository.search('').emojis;
      expect(searchEmojis.length).toEqual(searchableEmojis.length + 1);
      expect(containsEmojiId(searchEmojis, siteEmojiId)).toEqual(true);

      expect(repository.findById(siteEmojiId.id as string)).toEqual(siteTest);
      expect(repository.findByShortName(siteEmojiId.shortName)).toEqual(
        siteTest,
      );
    });

    it('add custom category when the first custom emoji is added', () => {
      const repository = new EmojiRepository(standardEmojis);

      expect(repository.getDynamicCategoryList()).not.toContain(customCategory); // no custom emojis in the repository yet

      repository.addUnknownEmoji(siteTest);

      expect(repository.getDynamicCategoryList()).not.toContain([
        customCategory,
      ]);
    });

    it('add non-custom emoji', () => {
      const standardTest = allEmojis[0];
      const repository = new EmojiRepository(allEmojis.slice(1));
      const numSearchable = repository.search('').emojis.length;
      repository.addUnknownEmoji(standardTest);
      const searchEmojis = repository.search('').emojis;
      expect(searchEmojis.length).toEqual(numSearchable + 1);
      expect(containsEmojiId(searchEmojis, toEmojiId(standardTest))).toEqual(
        true,
      );

      expect(repository.findById(standardTest.id as string)).toEqual(
        standardTest,
      );
      expect(repository.findByShortName(standardTest.shortName)).toEqual(
        standardTest,
      );
    });
  });

  describe('#findByAsciiRepresentation', () => {
    it('returns the correct emoji for a matching ascii representation', () => {
      const emoji = emojiRepository.findByAsciiRepresentation(':D');
      expect(emoji).toEqual(smileyEmoji);
    });

    it('returns the correct emoji for alternative ascii representation', () => {
      const emoji = emojiRepository.findByAsciiRepresentation('=D');
      expect(emoji).toEqual(smileyEmoji);
    });

    it('returns undefined when there is no matching ascii representation', () => {
      const emoji = emojiRepository.findByAsciiRepresentation('not-ascii');
      expect(emoji).toEqual(undefined);
    });
  });

  describe('#findAllMatchingShortName', () => {
    it('returns a list of emoji with exact match in shortName', () => {
      const repository = new EmojiRepository([
        ...allEmojis,
        siteTest,
        atlassianTest,
      ]);
      expect(repository.findAllMatchingShortName(':test:')).toEqual([
        siteTest,
        atlassianTest,
      ]);
    });

    it('returns an empty list if no emoji shortNames match', () => {
      const repository = new EmojiRepository(allEmojis);
      expect(repository.findAllMatchingShortName(':test:')).toEqual([]);
    });

    it('does not partially match on shortname', () => {
      const repository = new EmojiRepository([...allEmojis, standardTest]);
      expect(repository.findAllMatchingShortName(':test:')).toEqual([]);
    });
  });

  describe('#delete', () => {
    let copyEmojis: EmojiDescription[];
    beforeEach(() => {
      // Deep copy emoji list
      copyEmojis = JSON.parse(JSON.stringify(allEmojis));
    });

    it('should not be able to search by shortname for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      const numSmileys = repository.search(':smiley').emojis.length;
      repository.delete(smileyEmoji);
      expect(repository.search(':smiley').emojis.length).toEqual(
        numSmileys - 1,
      );
    });

    it('should not be able to search by ascii for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      const numSmileys = repository.search(':D').emojis.length;
      repository.delete(smileyEmoji);
      expect(repository.search(':D').emojis.length).toEqual(numSmileys - 1);
    });

    it('should not be able to find by shortname for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      repository.delete(smileyEmoji);
      expect(repository.findByShortName(smileyEmoji.shortName)).toEqual(
        undefined,
      );
    });

    it('should not be able to find by id for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      repository.delete(smileyEmoji);
      expect(repository.findById(smileyEmoji.id!)).toEqual(undefined);
    });

    it('should not be able to find by ascii for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      repository.delete(smileyEmoji);
      smileyEmoji.ascii!.forEach((a: string) =>
        expect(repository.findByAsciiRepresentation(a)).toEqual(undefined),
      );
    });

    it('should not be able to find by category an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      repository.delete(smileyEmoji);
      const peopleEmojis = repository.findInCategory('PEOPLE');
      peopleEmojis.forEach(emoji =>
        expect(emoji.shortName).not.toEqual(smileyEmoji.shortName),
      );
    });
  });

  describe('#getDynamicCategories', () => {
    it('returns an empty list if only standard emojis', () => {
      const repository = new EmojiRepository(standardEmojis);
      expect(repository.getDynamicCategoryList()).toEqual([]);
    });

    it('returns all dynamic categories present in list of stored emojis', () => {
      const allCategoryEmojis = [...allEmojis, frequentTest];
      const repository = new EmojiRepository(allCategoryEmojis);
      expect(repository.getDynamicCategoryList()).toEqual([
        'ATLASSIAN',
        'CUSTOM',
        'FREQUENT',
      ]);
    });

    it('should return FREQUENT as a category if there is emoji use tracked', done => {
      const repository = new EmojiRepository(standardEmojis);
      const heart = repository.findByShortName(':heart:');

      if (!heart) {
        fail(
          'The emoji needed for this test were not found in the EmojiRepository',
        );
        done();
      } else {
        repository.used(heart);

        // usage is recorded asynchronously so give it a chance to happen by running the asserts with window.setTimeout
        window.setTimeout(() => {
          expect(repository.getDynamicCategoryList()).toEqual(['FREQUENT']);
          done();
        });
      }
    });
  });

  describe('getEmojiVariation', () => {
    it('should return the supplied emoji if invalid skintone provided', () => {
      let variation = getEmojiVariation(thumbsupEmoji, { skinTone: 9 });
      expect(variation.shortName).toEqual(':thumbsup:');

      variation = getEmojiVariation(thumbsupEmoji, { skinTone: 0 });
      expect(variation.shortName).toEqual(':thumbsup:');
    });
  });

  describe('getFrequentlyUsed', () => {
    it('should return frequently used with the correct skin tone', done => {
      const emojiRepository = newEmojiRepository();
      emojiRepository.used(thumbsupEmoji);

      // usage is recorded asynchronously so give it a chance to happen by running the asserts with window.setTimeout
      window.setTimeout(() => {
        let emoji = emojiRepository.getFrequentlyUsed({ skinTone: 4 });
        expect(emoji).toHaveLength(1);
        expect(emoji[0].shortName).toEqual(
          `${thumbsupEmoji.shortName}:skin-tone-5:`,
        );
        done();
      });
    });

    it('should return a limited number of frequently used', async () => {
      const emojiRepository = newEmojiRepository();
      emojiRepository.used(thumbsupEmoji);
      emojiRepository.used(thumbsdownEmoji);
      emojiRepository.used(smileyEmoji);
      emojiRepository.used(openMouthEmoji);

      await pWaitFor(() => emojiRepository.getFrequentlyUsed().length === 4);

      let emoji = emojiRepository.getFrequentlyUsed();
      expect(emoji).toHaveLength(4);

      emoji = emojiRepository.getFrequentlyUsed({ limit: 2 });
      expect(emoji).toHaveLength(2);
    });

    it('should return frequent emoji on find operations with original category', done => {
      const emojiRepository = newEmojiRepository();
      emojiRepository.used(thumbsupEmoji);

      // usage is recorded asynchronously so give it a chance to happen by running the asserts with window.setTimeout
      window.setTimeout(() => {
        const thumbsUp = emojiRepository.findByShortName(':thumbsup:');
        expect(thumbsUp!.category).toEqual('PEOPLE');

        done();
      });
    });
  });
});
