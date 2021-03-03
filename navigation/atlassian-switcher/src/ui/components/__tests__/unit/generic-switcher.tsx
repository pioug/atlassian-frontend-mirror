import React from 'react';
import { mount } from 'enzyme';

import GenericSwitcher, {
  GenericSwitcherProps,
} from '../../../components/generic-switcher';
import { Product } from '../../../../types';
import { IntlProvider } from 'react-intl';

let mockResolveRecommendations: jest.Mock;
jest.mock('../../../../cross-flow/providers/recommendations', () => {
  const originalModule = jest.requireActual(
    '../../../../cross-flow/providers/recommendations',
  );
  mockResolveRecommendations = jest.fn();
  return {
    __esModule: true,
    ...originalModule,
    resolveRecommendations: mockResolveRecommendations.mockReturnValue(
      originalModule.resolveRecommendations,
    ),
  };
});

describe('generic-switcher', () => {
  let defaultProps: GenericSwitcherProps;
  beforeAll(() => {
    defaultProps = {
      cloudId: 'fake-cloud-id',
      features: {
        disableCustomLinks: false,
        enableRecentContainers: true,
        disableSwitchToHeading: false,
        xflow: true,
        isDiscoverMoreForEveryoneEnabled: true,
        isEmceeLinkEnabled: true,
        isDiscoverSectionEnabled: true,
        isDefaultEditionFreeExperimentEnabled: false,
        isProductStoreInTrelloJSWFirstEnabled: false,
        isProductStoreInTrelloConfluenceFirstEnabled: false,
        isSlackDiscoveryEnabled: false,
      },
      triggerXFlow: () => {},
      onDiscoverMoreClicked: () => {},
      product: Product.TRELLO,
    };
  });
  it('should not pass featureFlags to the recommendation resolver when recommendationFeatureFlags is not set', () => {
    mount(<GenericSwitcher {...defaultProps} />);
    expect(mockResolveRecommendations).toBeCalledWith({});
  });
  it('should pass featureFlags to the recommendations resolver when recommendationFeatureFlags is set', () => {
    const recommendationsFeatureFlags = {
      mySpecialRecommendationsFeatureFlag: true,
    };
    mount(
      <IntlProvider locale="en">
        <GenericSwitcher
          {...defaultProps}
          recommendationsFeatureFlags={recommendationsFeatureFlags}
        />
      </IntlProvider>,
    );
    expect(mockResolveRecommendations).toBeCalledWith(
      recommendationsFeatureFlags,
    );
  });
});
