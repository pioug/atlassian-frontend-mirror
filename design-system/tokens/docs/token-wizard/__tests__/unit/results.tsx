import tokens from '../../../../src/artifacts/tokens-raw/atlassian-light';
import { ActiveTokens } from '../../../../src/artifacts/types';
import results from '../../data/results';

type resultID = keyof typeof results;

function getTokenId(path: string[]) {
  return path.filter((el) => el !== '[default]').join('.');
}

describe('results list', () => {
  it('recommendations should include all active tokens', () => {
    const allRecommendations = Object.keys(results).reduce<ActiveTokens[]>(
      (previousValue, currentValue) => {
        return [
          ...previousValue,
          ...results[currentValue as resultID].map((obj) => obj.name),
        ];
      },
      [],
    );

    const dedupeAllRecommendations = [...new Set(allRecommendations)];

    const allActiveTokens = tokens
      .filter((token) => token.attributes.state === 'active')
      .filter(
        (token) =>
          !getTokenId(token.path).endsWith('hovered') &&
          !getTokenId(token.path).endsWith('pressed') &&
          !getTokenId(token.path).includes('UNSAFE'),
      )
      .map((token) => getTokenId(token.path));

    expect(dedupeAllRecommendations.sort()).toEqual(allActiveTokens.sort());
  });
});
