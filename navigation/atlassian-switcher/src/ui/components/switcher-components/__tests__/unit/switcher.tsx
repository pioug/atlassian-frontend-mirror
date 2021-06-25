import React from 'react';
import { mount, shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import AddIcon from '@atlaskit/icon/glyph/add';

import Switcher from '../../switcher';
import { Status } from '../../../../../common/providers/as-data-provider';
import {
  FeatureMap,
  SyntheticProviderResults,
  ProviderResults,
} from '../../../../../types';
import FormattedMessage from '../../../../../ui/primitives/formatted-message';
import { createIcon } from '../../../../../common/utils/icon-themes';
import messages from '../../../../../common/utils/messages';
import { SwitcherItemType } from '../../../../../common/utils/links';
import ErrorBoundary from '../../../error-boundary';

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
    data: { sites: [], isPartial: false },
    status: Status.COMPLETE,
  },
  productRecommendations: {
    data: [],
    status: Status.COMPLETE,
  },
};

const generateDiscoverMoreLinks = (): SwitcherItemType[] => [
  {
    key: 'discover-more',
    label: <FormattedMessage {...messages.moreAtlassianProductsLink} />,
    Icon: createIcon(AddIcon, { size: 'medium' }),
    href: '',
  },
];

jest.mock('../../custom-links-section', () => {
  let shouldThrowError = false;
  const setShouldThrowError = (val: boolean) => {
    shouldThrowError = val;
  };
  return {
    CustomLinksSection: () => {
      if (shouldThrowError) {
        throw new Error('');
      }
      return <p>Rendered</p>;
    },
    __setShouldThrowError: setShouldThrowError,
  };
});

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
          getExtendedAnalyticsAttributes={() => ({})}
          isDiscoverMoreClickable={true}
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
          getExtendedAnalyticsAttributes={() => ({})}
          isDiscoverMoreClickable={true}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('should render discover more section', () => {
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
          discoverSectionLinks={generateDiscoverMoreLinks()}
          rawProviderResults={providerResults}
          features={{} as FeatureMap}
          getExtendedAnalyticsAttributes={() => ({})}
          isDiscoverMoreClickable={true}
        />,
      ),
    ).toMatchSnapshot();
  });

  describe('Non-Core ErrorBoundary', () => {
    it('should render when there is an error in the non-core sections', () => {
      const customLinksModule = require('../../custom-links-section');
      customLinksModule.__setShouldThrowError(true);

      const wrapper = mount(
        <IntlProvider locale="en">
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
            customLinks={[
              {
                key: 'discover-more',
                label: 'test',
                Icon: createIcon(AddIcon, { size: 'medium' }),
                href: '',
              },
            ]}
            discoverSectionLinks={[]}
            rawProviderResults={providerResults}
            features={{} as FeatureMap}
            getExtendedAnalyticsAttributes={() => ({})}
            isDiscoverMoreClickable={true}
          />
        </IntlProvider>,
      );
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(ErrorBoundary).length).toEqual(4);
      expect(wrapper.find(ErrorBoundary).at(0).html()).toEqual('');
      expect(wrapper.find(ErrorBoundary).at(0).props().triggerSubject).toEqual(
        'crossJoinErrorBoundary',
      );
      expect(wrapper.find(ErrorBoundary).at(1).html()).toEqual('');
      expect(wrapper.find(ErrorBoundary).at(1).props().triggerSubject).toEqual(
        'crossFlowErrorBoundary',
      );
      expect(wrapper.find(ErrorBoundary).at(2).html()).toEqual('');
      expect(wrapper.find(ErrorBoundary).at(2).props().triggerSubject).toEqual(
        'recentSectionErrorBoundary',
      );
      expect(wrapper.find(ErrorBoundary).at(3).html()).toEqual('');
      expect(wrapper.find(ErrorBoundary).at(3).props().triggerSubject).toEqual(
        'customLinksErrorBoundary',
      );
    });

    it('should not render when there is no error in the non-core sections', () => {
      const customLinksModule = require('../../custom-links-section');
      customLinksModule.__setShouldThrowError(false);

      const wrapper = mount(
        <IntlProvider locale="en">
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
            customLinks={[
              {
                key: 'discover-more',
                label: 'test',
                Icon: createIcon(AddIcon, { size: 'medium' }),
                href: '',
              },
            ]}
            discoverSectionLinks={[]}
            rawProviderResults={providerResults}
            features={{} as FeatureMap}
            getExtendedAnalyticsAttributes={() => ({})}
            isDiscoverMoreClickable={true}
          />
        </IntlProvider>,
      );

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(ErrorBoundary).at(0).html()).toEqual('');
      expect(wrapper.find(ErrorBoundary).at(1).html()).toEqual('');
      expect(wrapper.find(ErrorBoundary).at(2).html()).toEqual('');
      expect(wrapper.find(ErrorBoundary).at(3).html()).not.toEqual('');
    });
  });
});
