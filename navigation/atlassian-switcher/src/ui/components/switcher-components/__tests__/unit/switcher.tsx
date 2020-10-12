import React from 'react';
import { shallow } from 'enzyme';
import Switcher from '../../switcher';
import { Status } from '../../../../../common/providers/as-data-provider';
import {
  FeatureMap,
  SyntheticProviderResults,
  ProviderResults,
} from '../../../../../types';

const noop = () => void 0;
const providerResults: ProviderResults & SyntheticProviderResults = {
  joinableSites: {
    data: {
      sites: [],
    },
    status: Status.COMPLETE,
  },
  isXFlowEnabled: {
    data: false,
    status: Status.COMPLETE,
  },
  provisionedProducts: {
    data: {},
    status: Status.COMPLETE,
  },
  addProductsPermission: {
    data: false,
    status: Status.COMPLETE,
  },
  managePermission: {
    data: false,
    status: Status.COMPLETE,
  },
  recentContainers: {
    data: { data: [] },
    status: Status.COMPLETE,
  },
  collaborationGraphRecentContainers: {
    data: { collaborationGraphEntities: [] },
    status: Status.COMPLETE,
  },
  customLinks: {
    data: [],
    status: Status.COMPLETE,
  },
  userSiteData: {
    data: { currentSite: { url: '', products: [] } },
    status: Status.COMPLETE,
  },
  availableProducts: {
    data: { sites: [] },
    status: Status.COMPLETE,
  },
  productRecommendations: {
    data: [],
    status: Status.COMPLETE,
  },
};

describe('Switcher', () => {
  it('should render sections with headers by default', () => {
    expect(
      shallow(
        <Switcher
          triggerXFlow={noop}
          hasLoaded
          hasLoadedCritical
          hasLoadedInstanceProviders
          onDiscoverMoreClicked={noop}
          licensedProductLinks={[]}
          suggestedProductLinks={[]}
          joinableSiteLinks={[]}
          fixedLinks={[]}
          adminLinks={[]}
          recentLinks={[]}
          customLinks={[]}
          discoverSectionLinks={[]}
          rawProviderResults={providerResults}
          features={{} as FeatureMap}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('should be able to disable switch to section header with "disableSwitchToHeading"', () => {
    expect(
      shallow(
        <Switcher
          triggerXFlow={noop}
          hasLoaded
          hasLoadedCritical
          hasLoadedInstanceProviders
          onDiscoverMoreClicked={noop}
          licensedProductLinks={[]}
          suggestedProductLinks={[]}
          joinableSiteLinks={[]}
          fixedLinks={[]}
          adminLinks={[]}
          recentLinks={[]}
          customLinks={[]}
          disableSwitchToHeading
          discoverSectionLinks={[]}
          rawProviderResults={providerResults}
          features={{} as FeatureMap}
        />,
      ),
    ).toMatchSnapshot();
  });
});
