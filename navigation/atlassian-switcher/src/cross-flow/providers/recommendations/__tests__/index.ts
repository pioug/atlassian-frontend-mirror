import { ProductKey } from '../../../../types';

import { resolveRecommendations } from '../index';

describe('recommendations-provider-recommendations', () => {
  it('should return base recommendations if no feature flag provided', () => {
    expect(resolveRecommendations()).toEqual([
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
      { productKey: ProductKey.OPSGENIE },
    ]);
  });

  it('should return base recommendations if no feature flag is matched', () => {
    expect(
      resolveRecommendations({ 'some-random-feature-flag': 'experiment' }),
    ).toEqual([
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
      { productKey: ProductKey.OPSGENIE },
    ]);
  });

  it('should return trello specific recommendations if product store in trello feature flag is matched', () => {
    expect(
      resolveRecommendations({
        isProductStoreInTrelloEnabled: true,
      }),
    ).toEqual([
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
      { productKey: ProductKey.OPSGENIE },
    ]);
  });

  it('should return trello specific recommendations (with jira software first) if product store in trello feature flag is matched', () => {
    expect(
      resolveRecommendations({
        isProductStoreInTrelloJSWFirstEnabled: true,
      }),
    ).toEqual([
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
      { productKey: ProductKey.OPSGENIE },
    ]);
  });

  it('should return trello specific recommendations (with confluence first) if product store in trello feature flag is matched', () => {
    expect(
      resolveRecommendations({
        isProductStoreInTrelloConfluenceFirstEnabled: true,
      }),
    ).toEqual([
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
      { productKey: ProductKey.OPSGENIE },
    ]);
  });

  it('should return product store recommendations if feature flag is matched', () => {
    expect(resolveRecommendations({})).toEqual([
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
      { productKey: ProductKey.OPSGENIE },
    ]);
  });
});
