import { Result } from '../model/Result';

export const appendListWithoutDuplication = <T extends Result>(
  resultsFirst: T[],
  resultsSecond: T[],
) => {
  return resultsFirst.concat(
    resultsSecond.filter(result => {
      return (
        resultsFirst.findIndex(o => {
          return o.resultId === result.resultId;
        }) === -1
      );
    }),
  );
};
