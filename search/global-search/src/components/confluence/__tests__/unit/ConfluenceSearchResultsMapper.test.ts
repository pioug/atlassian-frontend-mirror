import {
  makeConfluenceObjectResult,
  makePersonResult,
  makeConfluenceContainerResult,
} from '../../../../__tests__/unit/_test-util';
import {
  DEFAULT_MAX_OBJECTS,
  MAX_PEOPLE,
  MAX_SPACES,
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
} from '../../ConfluenceSearchResultsMapper';
import { ConfluenceResultsMap, ResultsGroup } from '../../../../model/Result';
import { ConfluenceFeatures } from '../../../../util/features';

type TestParam = {
  desc: string;
  objectsCount: number | undefined;
  spacesCount: number | undefined;
  peopleCount: number | undefined;
};

const abTest = {
  abTestId: 'abTestId',
  controlId: 'controlId',
  experimentId: 'experimentId',
};

const features: ConfluenceFeatures = {
  abTest,
  useUrsForBootstrapping: false,
  isAutocompleteEnabled: false,
  complexSearchExtensionsEnabled: false,
  spaceballsExperimentEnabled: false,
  isNavAutocompleteEnabled: false,
};

const searchSessionId = 'searchSessionId';

[
  { desc: 'mapRecentResultsToUIGroups', mapper: mapRecentResultsToUIGroups },
  { desc: 'mapSearchResultsToUIGroups', mapper: mapSearchResultsToUIGroups },
].forEach(({ desc, mapper }) => {
  describe(`${desc} order and count`, () => {
    const generateResult = ({
      peopleCount,
      objectsCount,
      spacesCount,
    }: {
      peopleCount: number | undefined;
      objectsCount: number | undefined;
      spacesCount: number | undefined;
    }): ConfluenceResultsMap => ({
      people: {
        items: [...Array(peopleCount || 0)].map(makePersonResult),
        totalSize: peopleCount || 0,
      },
      objects: {
        items: [...Array(objectsCount || 0)].map(makeConfluenceObjectResult),
        totalSize: objectsCount || 0,
      },
      spaces: {
        items: [...Array(spacesCount || 0)].map(makeConfluenceContainerResult),
        totalSize: spacesCount || 0,
      },
    });

    [
      {
        desc: 'it should return 3 groups even with empty result',
        objectsCount: 0,
        spacesCount: 0,
        peopleCount: 0,
      },
      {
        desc: 'it should return ui groups each with correct items',
        objectsCount: 5,
        peopleCount: 2,
        spacesCount: 2,
      },
      {
        desc: 'it should return 3 groups even with empty results',
        objectsCount: 1,
        peopleCount: 0,
        spacesCount: 0,
      },
      {
        desc: 'it should return 3 groups even with missing results',
        peopleCount: 1,
        objectsCount: 0,
        spacesCount: 0,
      },
    ].forEach(({ desc, objectsCount, peopleCount, spacesCount }: TestParam) => {
      it(`${desc}`, () => {
        const recentResultsMap = generateResult({
          objectsCount,
          peopleCount,
          spacesCount,
        });

        const groups = mapper(recentResultsMap, features, searchSessionId);
        expect(groups.length).toBe(3);
        expect(groups.map(group => group.key)).toEqual([
          'objects',
          'spaces',
          'people',
        ]);

        expect(groups.map(group => group.items.length)).toEqual([
          objectsCount || 0,
          spacesCount || 0,
          peopleCount || 0,
        ]);
      });
    });

    it('should display max results if passed results are more than max', () => {
      const recentResultsMap = generateResult({
        objectsCount: DEFAULT_MAX_OBJECTS + 1,
        peopleCount: MAX_PEOPLE + 2,
        spacesCount: MAX_SPACES + 4,
      });
      const groups = mapper(recentResultsMap, features, searchSessionId);
      expect(groups.map(group => group.items.length)).toEqual([
        DEFAULT_MAX_OBJECTS,
        MAX_SPACES,
        MAX_PEOPLE,
      ]);
    });

    describe('grape experiment', () => {
      let grapeABTest;

      const recentResultsMap = generateResult({
        objectsCount: 20,
        peopleCount: MAX_PEOPLE + 2,
        spacesCount: MAX_SPACES + 4,
      });

      const checkResultCounts = (groups: ResultsGroup[], expected: number) => {
        expect(groups.map(group => group.items.length)).toEqual([
          expected,
          MAX_SPACES,
          MAX_PEOPLE,
        ]);
      };

      it('should display more results if in the grape experiment', () => {
        grapeABTest = {
          ...abTest,
          experimentId: 'grape-15',
        };
        const groups = mapper(
          recentResultsMap,
          { ...features, abTest: grapeABTest },
          searchSessionId,
        );
        checkResultCounts(groups, 15);
      });

      it('should still work if a bad ab test is supplied', () => {
        grapeABTest = {
          ...abTest,
          experimentId: 'grape-abc',
        };
        const groups = mapper(
          recentResultsMap,
          { ...features, abTest: grapeABTest },
          searchSessionId,
        );
        checkResultCounts(groups, DEFAULT_MAX_OBJECTS);
      });
    });
  });
});
