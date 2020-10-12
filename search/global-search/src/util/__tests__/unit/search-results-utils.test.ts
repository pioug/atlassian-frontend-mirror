import {
  Result,
  ContentType,
  AnalyticsType,
  ResultType,
} from '../../../model/Result';
import { appendListWithoutDuplication } from '../../search-results-utils';

describe('search-results-utils', () => {
  const mockResult = (resultId: string): Result => {
    return {
      resultId,
      name: `name_${resultId}`,
      href: `http://${resultId}`,
      analyticsType: AnalyticsType.RecentConfluence,
      // field to disambiguate between result types
      resultType: ResultType.ConfluenceObjectResult,
      contentType: `contentType-${resultId}` as ContentType,
    } as Result;
  };

  it('appends 2 results lists WITHOUT overlapping elements', () => {
    const resultList1 = [mockResult('1'), mockResult('2')];
    const resultList2 = [mockResult('3'), mockResult('4')];

    const mergedResults = appendListWithoutDuplication(
      resultList1,
      resultList2,
    );

    expect(mergedResults).toEqual([
      mockResult('1'),
      mockResult('2'),
      mockResult('3'),
      mockResult('4'),
    ]);
  });

  it('appends 2 results lists WITH overlapping elements', () => {
    const resultList1 = [
      mockResult('1'),
      mockResult('overlap1'),
      mockResult('overlap2'),
    ];
    const resultList2 = [
      mockResult('overlap2'),
      mockResult('2'),
      mockResult('overlap1'),
    ];

    const mergedResults = appendListWithoutDuplication(
      resultList1,
      resultList2,
    );

    expect(mergedResults).toEqual([
      mockResult('1'),
      mockResult('overlap1'),
      mockResult('overlap2'),
      mockResult('2'),
    ]);
  });
});
