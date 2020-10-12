import { buildShownEventDetails } from '../../analytics-util';
import {
  makeConfluenceContainerResult,
  makeConfluenceObjectResult,
  makePersonResult,
} from '../../../__tests__/unit/_test-util';
import { ResultType } from '../../../model/Result';

describe('Analytics', () => {
  describe('buildShownEventDetails', () => {
    it('should generate empty results given an empty array', () => {
      const attributes = buildShownEventDetails();

      expect(attributes).toEqual({
        resultCount: 0,
        resultSectionCount: 0,
        resultContext: [],
      });
    });

    it('should correctly transform confluence object results', () => {
      const mockConfluenceObjectResult = makeConfluenceObjectResult({
        resultId: '1',
      });

      const attributes = buildShownEventDetails([mockConfluenceObjectResult]);

      expect(attributes).toEqual({
        resultCount: 1,
        resultSectionCount: 1,
        resultContext: [
          {
            sectionId: ResultType.ConfluenceObjectResult,
            results: [
              {
                resultContentId: '1',
                resultType: 'confluence-page',
                containerId: 'containerId',
                isRecentResult: false,
              },
            ],
          },
        ],
      });
    });

    it('should correctly transform recent confluence object results', () => {
      const mockConfluenceObjectResult = makeConfluenceObjectResult({
        resultId: '1',
        isRecentResult: true,
      });

      const attributes = buildShownEventDetails([mockConfluenceObjectResult]);

      expect(attributes).toEqual({
        resultCount: 1,
        resultSectionCount: 1,
        resultContext: [
          {
            sectionId: ResultType.ConfluenceObjectResult,
            results: [
              {
                resultContentId: '1',
                resultType: 'confluence-page',
                containerId: 'containerId',
                isRecentResult: true,
              },
            ],
          },
        ],
      });
    });

    it('should return correct attributes for space results', () => {
      const mockSpaceResult = makeConfluenceContainerResult({ resultId: '1' });

      const attributes = buildShownEventDetails([mockSpaceResult]);

      expect(attributes).toEqual({
        resultCount: 1,
        resultSectionCount: 1,
        resultContext: [
          {
            sectionId: ResultType.GenericContainerResult,
            results: [
              {
                resultContentId: '1',
              },
            ],
          },
        ],
      });
    });

    it('should return correct attributes for people results', () => {
      const mockPersonResult = makePersonResult({ resultId: '1' });

      const attributes = buildShownEventDetails([mockPersonResult]);

      expect(attributes).toEqual({
        resultCount: 1,
        resultSectionCount: 1,
        resultContext: [
          {
            sectionId: ResultType.PersonResult,
            results: [
              {
                resultContentId: '1',
              },
            ],
          },
        ],
      });
    });

    it('should return correct attributes when given multiple sections', () => {
      const mockPersonResult = makePersonResult({ resultId: '1' });
      const mockSpaceResult = makeConfluenceContainerResult({ resultId: '2' });
      const mockConfluenceObjectResult = makeConfluenceContainerResult({
        resultId: '3',
      });

      const attributes = buildShownEventDetails(
        [mockPersonResult],
        [mockSpaceResult],
        [mockConfluenceObjectResult],
      );

      expect(attributes).toEqual({
        resultCount: 3,
        resultSectionCount: 3,
        resultContext: [
          {
            sectionId: ResultType.PersonResult,
            results: [
              {
                resultContentId: '1',
              },
            ],
          },
          {
            sectionId: ResultType.GenericContainerResult,
            results: [
              {
                resultContentId: '2',
              },
            ],
          },
          {
            sectionId: ResultType.GenericContainerResult,
            results: [
              {
                resultContentId: '3',
              },
            ],
          },
        ],
      });
    });

    it('should preserve the order of the results passed in', () => {
      const mockPersonResultA = makePersonResult({ resultId: '1A' });
      const mockPersonResultB = makePersonResult({ resultId: '1B' });
      const mockSpaceResultA = makeConfluenceContainerResult({
        resultId: '2A',
      });
      const mockSpaceResultB = makeConfluenceContainerResult({
        resultId: '2B',
      });

      const mockPeople = [mockPersonResultA, mockPersonResultB];
      const mockSpaces = [mockSpaceResultA, mockSpaceResultB];

      const attributes = buildShownEventDetails(mockPeople, mockSpaces);

      expect(attributes).toEqual({
        resultCount: 4,
        resultSectionCount: 2,
        resultContext: [
          {
            sectionId: ResultType.PersonResult,
            results: [
              {
                resultContentId: '1A',
              },
              {
                resultContentId: '1B',
              },
            ],
          },
          {
            sectionId: ResultType.GenericContainerResult,
            results: [
              {
                resultContentId: '2A',
              },
              {
                resultContentId: '2B',
              },
            ],
          },
        ],
      });
    });
  });
});
