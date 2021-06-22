import { mapResultsToSwitcherProps } from '../../map-results-to-switcher-props';
import {
  ResultLoading,
  Status,
  ResultComplete,
  ResultError,
} from '../../../providers/as-data-provider';
import {
  AvailableProductsResponse,
  AvailableSite,
  SwitcherProductType,
  AvailableProduct,
  Product,
  CustomLinksResponse,
  RecommendationsEngineResponse,
  JoinableSitesResponse,
  CollaborationGraphContainersResponse,
  CollaborationGraphRecentContainerType,
  ProductKey,
} from '../../../../types';

const defaultFeatures = {
  disableCustomLinks: false,
  enableRecentContainers: true,
  xflow: true,
  disableSwitchToHeading: false,
  isEmceeLinkEnabled: false,
  isProductStoreInTrelloJSWFirstEnabled: false,
  isProductStoreInTrelloConfluenceFirstEnabled: false,
  isSlackDiscoveryEnabled: false,
  isTrustedAdminUIDeprecationEnabled: false,
};

describe('map-results-to-switcher-props', () => {
  describe('show heading and start link based on product and act959Enabled FF', () => {
    [
      {
        product: Product.JIRA,
        act959Enabled: true,
        expected: {
          showStartLink: true,
          showNewHeading: true,
        },
      },
      {
        product: Product.CONFLUENCE,
        act959Enabled: true,
        expected: {
          showStartLink: true,
          showNewHeading: true,
        },
      },
      // Expecting false
      {
        product: Product.START,
        act959Enabled: true,
        expected: {
          showStartLink: false,
          showNewHeading: true,
        },
      },
      {
        product: Product.JIRA,
        act959Enabled: false,
        expected: {
          showStartLink: false,
          showNewHeading: false,
        },
      },
      {
        product: Product.CONFLUENCE,
        act959Enabled: false,
        expected: {
          showStartLink: false,
          showNewHeading: false,
        },
      },
    ].forEach(({ product, act959Enabled, expected }) => {
      it(`returns showStartLink ${expected.showStartLink} and showHeading ${expected.showNewHeading} if the product is ${product} and FF is ${act959Enabled}`, () => {
        const props = mapResultsToSwitcherProps(
          null,
          {
            ...loadingProvidersResult,
            availableProducts: asCompletedProvider<AvailableProductsResponse>({
              unstableFeatures: {
                act959Enabled: act959Enabled,
              },
              sites: [],
              isPartial: false,
            }),
          },
          defaultFeatures,
          () => {},
          () => {},
          product,
        );

        expect(props.showStartLink).toEqual(expected.showStartLink);
        expect(props.showNewHeading).toEqual(expected.showNewHeading);
      });
    });
  });
  describe('hasLoaded flags', () => {
    it('account-centric hasLoadedCritical is set when license information has been loaded', () => {
      const props = mapResultsToSwitcherProps(
        null,
        loadingProvidersResult,
        defaultFeatures,
        () => {},
        () => {},
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(false);
    });

    it('account-centric hasLoaded is set when license information + permissions + product recommendations have been loaded', () => {
      const props = mapResultsToSwitcherProps(
        null,
        {
          ...loadingProvidersResult,
          isXFlowEnabled: asCompletedProvider(true),
          managePermission: asCompletedProvider(true),
          addProductsPermission: asCompletedProvider(true),
          productRecommendations: asCompletedProvider([]),
        },
        defaultFeatures,
        () => {},
        () => {},
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(true);
    });

    it('hasLoaded is not blocked on failed request', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...loadingProvidersResult,
          isXFlowEnabled: asFailedProvider(),
          managePermission: asFailedProvider(),
          addProductsPermission: asFailedProvider(),
          productRecommendations: asFailedProvider(),
        },
        defaultFeatures,
        () => {},
        () => {},
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(true);
    });

    it('xflow does not block hasLoaded if not enabled', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...loadingProvidersResult,
          managePermission: asCompletedProvider(true),
          addProductsPermission: asFailedProvider(),
        },
        {
          ...defaultFeatures,
          xflow: false,
        },
        () => {},
        () => {},
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(true);
    });
  });

  describe('user-centric products', () => {
    it('displays the products in alphabetical order with an expand link', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...loadingProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [
              generateSite('emu', SwitcherProductType.JIRA_SERVICE_DESK),
              generateSite(
                'frillneckedlizard',
                SwitcherProductType.JIRA_SOFTWARE,
              ),
              generateSite('dropbear', SwitcherProductType.JIRA_BUSINESS),
              generateSite('canetoad', SwitcherProductType.JIRA_SOFTWARE),
              generateSite('bilby', SwitcherProductType.CONFLUENCE),
              generateSite('koala', SwitcherProductType.JIRA_SOFTWARE),
              generateSite(
                'australianfauna',
                SwitcherProductType.JIRA_SOFTWARE,
              ),
            ],
          }),
        },
        {
          ...defaultFeatures,
          xflow: false,
        },
        () => {},
        () => {},
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          description: 'australianfauna',
          label: 'Jira Software',
          href:
            'https://australianfauna.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
          childItems: [
            {
              label: 'australianfauna',
              href:
                'https://australianfauna.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: 'canetoad',
              href:
                'https://canetoad.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: 'frillneckedlizard',
              href:
                'https://frillneckedlizard.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: 'koala',
              href:
                'https://koala.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
          ],
        },
        {
          description: 'emu',
          label: 'Jira Service Management',
          href:
            'https://emu.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
          childItems: [],
        },
        {
          description: 'dropbear',
          label: 'Jira Core',
          href:
            'https://dropbear.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=business',
          childItems: [],
        },
        {
          description: 'bilby',
          label: 'Confluence',
          href: 'https://bilby.atlassian.net/wiki',
          childItems: [],
        },
      ]);
    });

    it('shows the current site at the top of the product by default', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...loadingProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [
              generateSite('site60', SwitcherProductType.JIRA_SOFTWARE),
              generateSite('site30', SwitcherProductType.JIRA_SOFTWARE),
              generateSite('site10', SwitcherProductType.JIRA_SOFTWARE),
              generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE),
            ],
          }),
        },
        {
          ...defaultFeatures,
          xflow: false,
        },
        () => {},
        () => {},
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          description: CLOUD_ID,
          label: 'Jira Software',
          href: `https://${CLOUD_ID}.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software`,
          childItems: [
            {
              label: 'site10',
              href:
                'https://site10.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },

            {
              label: 'site30',
              href:
                'https://site30.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: 'site60',
              href:
                'https://site60.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: CLOUD_ID,
              href: `https://${CLOUD_ID}.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software`,
            },
          ],
        },
      ]);
    });

    it('shows descriptions for products that belong to multiple sites', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...loadingProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [
              generateSite('site50', SwitcherProductType.JIRA_SERVICE_DESK),
              generateSite('site30', SwitcherProductType.JIRA_BUSINESS),
              generateSite('site20', SwitcherProductType.OPSGENIE),
              generateSite('site40', SwitcherProductType.CONFLUENCE),
              generateSite('bitbucket', SwitcherProductType.BITBUCKET),
            ],
          }),
        },
        {
          ...defaultFeatures,
          xflow: false,
        },
        () => {},
        () => {},
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          description: 'site50',
          label: 'Jira Service Management',
          childItems: [],
        },
        { description: 'site30', label: 'Jira Core', childItems: [] },
        { description: 'site40', label: 'Confluence', childItems: [] },
        { description: 'site20', label: 'Opsgenie', childItems: [] },
        { label: 'Bitbucket', childItems: [] },
      ]);
    });

    it('does not show descriptions for products that belong to a single site', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...loadingProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [
              generateSite('site10', SwitcherProductType.JIRA_SERVICE_DESK),
              generateSite('site10', SwitcherProductType.JIRA_BUSINESS),
              generateSite('site10', SwitcherProductType.CONFLUENCE),
              generateSite('bitbucket', SwitcherProductType.BITBUCKET),
            ],
          }),
        },
        {
          ...defaultFeatures,
          xflow: false,
        },
        () => {},
        () => {},
      );

      expect(props.licensedProductLinks).toMatchObject([
        { label: 'Jira Service Management', childItems: [] },
        { label: 'Jira Core', childItems: [] },
        { label: 'Confluence', childItems: [] },
        { label: 'Bitbucket', childItems: [] },
      ]);
    });

    it('renders opsgenie and bitbucket correctly', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...loadingProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [
              generateSite(
                'opsgenie',
                SwitcherProductType.OPSGENIE,
                'https://app.opsgenie.com',
              ),
              generateSite(
                'bitbucket',
                SwitcherProductType.BITBUCKET,
                'https://bitbucket.org',
              ),
            ],
          }),
        },
        {
          ...defaultFeatures,
          xflow: false,
        },
        () => {},
        () => {},
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          description: 'opsgenie',
          label: 'Opsgenie',
          href: 'https://app.opsgenie.com',
          childItems: [],
        },
        {
          label: 'Bitbucket',
          href: 'https://bitbucket.org/dashboard/overview',
          childItems: [],
        },
      ]);
    });

    it('shows manage list if custom links are enabled', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          customLinks: asCompletedProvider<CustomLinksResponse>([
            {
              key: 'home',
              link:
                'https://some-random-instance.atlassian.net/secure/MyJiraHome.jspa',
              label: 'Jira',
              local: true,
            },
          ]),
          managePermission: asCompletedProvider(true),
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite('site40', SwitcherProductType.CONFLUENCE)],
          }),
        },
        {
          ...defaultFeatures,
          xflow: false,
        },
        () => {},
        () => {},
        Product.CONFLUENCE,
      );

      expect(props.showManageLink).toBe(true);
    });

    it('does not shows manage list if custom links are disabled', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          customLinks: asCompletedProvider<CustomLinksResponse>([
            {
              key: 'home',
              link:
                'https://some-random-instance.atlassian.net/secure/MyJiraHome.jspa',
              label: 'Jira',
              local: true,
            },
          ]),
          managePermission: asCompletedProvider(true),
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite('site40', SwitcherProductType.CONFLUENCE)],
          }),
        },
        {
          ...defaultFeatures,
          disableCustomLinks: true,
          xflow: false,
        },
        () => {},
        () => {},
        Product.CONFLUENCE,
      );

      expect(props.showManageLink).toBe(false);
    });
  });

  describe('recent containers', () => {
    it('returns recent links when collaboration graph endpoint is enabled', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          collaborationGraphRecentContainers: asCompletedProvider<
            CollaborationGraphContainersResponse
          >({
            collaborationGraphEntities: [
              {
                entityType: 'CONTAINER',
                containerType:
                  CollaborationGraphRecentContainerType.JIRA_PROJECT,
                id: '20740',
                containerDetails: {
                  id: '20740',
                  key: 'PC',
                  name: 'Project Central',
                  url: 'https://hello.atlassian.net/browse/PC',
                  iconUrl:
                    'https://hello.atlassian.net/secure/projectavatar?pid=20740&avatarId=15426',
                },
                score: 109250,
              },
            ],
          }),
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE)],
          }),
        },
        {
          ...defaultFeatures,
          enableRecentContainers: true,
        },
        () => {},
        () => {},
        Product.JIRA,
      );

      expect(props.recentLinks).toMatchObject([
        {
          key: '20740',
          label: 'Project Central',
          href: 'https://hello.atlassian.net/browse/PC',
          type: 'jiraProject',
        },
      ]);
    });

    it('returns no recent links when collaboration graph endpoint is disabled', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          collaborationGraphRecentContainers: asCompletedProvider<
            CollaborationGraphContainersResponse
          >({ collaborationGraphEntities: null }),
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE)],
          }),
        },
        defaultFeatures,
        () => {},
        () => {},
        Product.JIRA,
      );

      expect(props.recentLinks).toMatchObject([]);
    });
  });
  describe('customizeLinks', () => {
    [
      {
        product: Product.JIRA,
      },
      {
        product: Product.TRELLO,
      },
      {
        product: Product.CONFLUENCE,
      },
    ].forEach(({ product }) => {
      it('should NOT append atlOrigin to url for products that are NOT Confluence when customizeURL is present', () => {
        const mockAnalytics = {
          originProduct: product,
          originGeneratedId: '1234',
        };
        const mockCustomizeLinks = () => {
          return {
            mapUrl: (url: string, switcherType?: SwitcherProductType) => {
              if (switcherType === SwitcherProductType.CONFLUENCE) {
                return `${url}?atlOrigin=test`;
              } else {
                return url;
              }
            },
            getExtendedAnalyticsAttributes: (
              switcherType?: SwitcherProductType,
            ) => {
              if (switcherType === SwitcherProductType.CONFLUENCE) {
                return mockAnalytics;
              } else {
                return {};
              }
            },
          };
        };
        const props = mapResultsToSwitcherProps(
          null,
          {
            ...completedProvidersResult,
            availableProducts: asCompletedProvider<AvailableProductsResponse>({
              isPartial: false,
              sites: [
                generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE),
                generateSite(CLOUD_ID, SwitcherProductType.TRELLO),
              ],
            }),
          },
          defaultFeatures,
          () => {},
          () => {},
          product,
          undefined,
          undefined,
          undefined,
          mockCustomizeLinks,
        );
        expect(props.licensedProductLinks[0].href).not.toBeNull();
        expect(props.licensedProductLinks[0].href).not.toContain('atlOrigin');
        expect(
          props.getExtendedAnalyticsAttributes(
            SwitcherProductType.JIRA_SOFTWARE,
          ),
        ).toEqual({});
        expect(
          props.getExtendedAnalyticsAttributes(SwitcherProductType.TRELLO),
        ).toEqual({});
      });
    });
    [
      {
        product: Product.JIRA,
      },
      {
        product: Product.TRELLO,
      },
      {
        product: Product.CONFLUENCE,
      },
    ].forEach(({ product }) => {
      it('should append atlOrigin to url for Confluence when customizeURL is present', () => {
        const mockAnalytics = {
          originProduct: product,
          originGeneratedId: '1234',
        };
        const mockCustomizeLinks = () => ({
          mapUrl: (url: string, switcherType?: SwitcherProductType) => {
            if (switcherType === SwitcherProductType.CONFLUENCE) {
              return `${url}?atlOrigin=test`;
            } else {
              return url;
            }
          },
          getExtendedAnalyticsAttributes: (
            switcherType?: SwitcherProductType,
          ) => {
            if (switcherType === SwitcherProductType.CONFLUENCE) {
              return mockAnalytics;
            } else {
              return {};
            }
          },
        });
        const props = mapResultsToSwitcherProps(
          null,
          {
            ...completedProvidersResult,
            availableProducts: asCompletedProvider<AvailableProductsResponse>({
              isPartial: false,
              sites: [
                generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE),
                generateSite(CLOUD_ID, SwitcherProductType.CONFLUENCE),
                generateSite(CLOUD_ID, SwitcherProductType.TRELLO),
              ],
            }),
          },
          defaultFeatures,
          () => {},
          () => {},
          product,
          undefined,
          undefined,
          undefined,
          mockCustomizeLinks,
        );
        expect(
          props.getExtendedAnalyticsAttributes(
            SwitcherProductType.JIRA_SOFTWARE,
          ),
        ).toEqual({});
        expect(
          props.getExtendedAnalyticsAttributes(SwitcherProductType.CONFLUENCE),
        ).toEqual(mockAnalytics);
        expect(props.licensedProductLinks[1].href).toBe(
          'https://some-cloud-id.atlassian.net/wiki?atlOrigin=test',
        );
        expect(props.licensedProductLinks[0].href).not.toContain(
          '?atlOrigin=test',
        );
        expect(props.licensedProductLinks[2].href).not.toContain(
          '?atlOrigin=test',
        );
      });
    });
    it('should return empty object for analytic attributes if customizeLinks is not present', () => {
      const props = mapResultsToSwitcherProps(
        null,
        {
          ...completedProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.CONFLUENCE)],
          }),
        },
        defaultFeatures,
        () => {},
        () => {},
        Product.CONFLUENCE,
      );
      expect(
        props.getExtendedAnalyticsAttributes(SwitcherProductType.CONFLUENCE),
      ).toEqual({});
      expect(props.licensedProductLinks).toMatchObject([
        {
          href: 'https://some-cloud-id.atlassian.net/wiki',
        },
      ]);
    });
  });

  describe('renders Jira Work Management correctly', () => {
    it('should return Jira Core in licensed products with rebrand FF off', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.JIRA_BUSINESS)],
          }),
        },
        defaultFeatures,
        () => {},
        () => {},
        Product.JIRA,
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          href:
            'https://some-cloud-id.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=business',
          key: 'JIRA_BUSINESSsome-cloud-id',
          label: 'Jira Core',
        },
      ]);
    });

    it('should return Jira Work Management in licensed products with rebrand FF off', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.JIRA_BUSINESS)],
            unstableFeatures: {
              jwmRebrandEnabled: true,
            },
          }),
        },
        defaultFeatures,
        () => {},
        () => {},
        Product.JIRA,
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          href:
            'https://some-cloud-id.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=business',
          key: 'JIRA_BUSINESSsome-cloud-id',
          label: 'Jira Work Management',
        },
      ]);
    });
  });

  describe('renders JSM correctly', () => {
    it('should return JSM in licensed products', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [
              generateSite(CLOUD_ID, SwitcherProductType.JIRA_SERVICE_DESK),
            ],
          }),
        },
        defaultFeatures,
        () => {},
        () => {},
        Product.JIRA,
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          href:
            'https://some-cloud-id.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
          key: 'JIRA_SERVICE_DESKsome-cloud-id',
          label: 'Jira Service Management',
        },
      ]);
    });
    it('should return JSM in suggested products', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          isXFlowEnabled: asCompletedProvider(true),
          productRecommendations: asCompletedProvider<
            RecommendationsEngineResponse
          >([
            {
              productKey: ProductKey.JIRA_SERVICE_DESK,
            },
          ]),
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE)],
          }),
        },
        defaultFeatures,
        () => {},
        () => {},
        Product.JIRA,
      );
      expect(props.suggestedProductLinks).toMatchObject([
        {
          key: 'jira-servicedesk.ondemand',
          href: '/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
          label: 'Jira Service Management',
        },
      ]);
    });
    it('should return JSM in joinable sites', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          joinableSites: asCompletedProvider<JoinableSitesResponse>({
            sites: [
              {
                cloudId: 'CLOUD_ID_MOCK',
                displayName: 'Joinable',
                url: '/somewhere',
                avatarUrl: '',
                relevance: 1,
                products: {
                  [ProductKey.JIRA_SERVICE_DESK]: {
                    collaborators: [],
                    productUrl: '/someproduct-url',
                  },
                },
              },
            ],
          }),
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE)],
          }),
        },
        defaultFeatures,
        () => {},
        () => {},
        Product.JIRA,
      );

      expect(props.joinableSiteLinks).toMatchObject([
        {
          href: '/someproduct-url',
          key: 'CLOUD_ID_MOCK',
          label: 'Jira Service Management',
          description: 'Joinable',
          productType: 'JIRA_SERVICE_DESK',
        },
      ]);
    });
  });

  describe('Trusted Admin deprecation', () => {
    it('should return Administration link if the user is an Admin and isTrustedAdminUIDeprecationEnabled is passed', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          managePermission: asCompletedProvider(true),
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE)],
          }),
        },
        {
          ...defaultFeatures,
          isTrustedAdminUIDeprecationEnabled: true,
        },
        () => {},
        () => {},
        Product.JIRA,
      );

      expect(props.adminLinks).toMatchObject([
        {
          href: '/admin',
          key: 'administration',
        },
      ]);
    });
    it('should NOT return Administration link if the user is a trusted user and isTrustedAdminUIDeprecationEnabled is passed', () => {
      const props = mapResultsToSwitcherProps(
        CLOUD_ID,
        {
          ...completedProvidersResult,
          addProductsPermission: asCompletedProvider(true),
          availableProducts: asCompletedProvider<AvailableProductsResponse>({
            isPartial: false,
            sites: [generateSite(CLOUD_ID, SwitcherProductType.JIRA_SOFTWARE)],
          }),
        },
        {
          ...defaultFeatures,
          isTrustedAdminUIDeprecationEnabled: true,
        },
        () => {},
        () => {},
        Product.JIRA,
      );

      expect(props.adminLinks).toMatchObject([]);
    });
  });
});

function generateSite(
  siteName: string,
  productType: SwitcherProductType,
  productUrl = '',
  adminAccess = false,
): AvailableSite {
  const availableProducts = [
    {
      productType,
      url: productUrl,
    },
  ] as AvailableProduct[]; // assert the type here so we can use `url`
  return {
    adminAccess,
    availableProducts,
    avatar: null,
    cloudId: siteName,
    displayName: siteName,
    url:
      productType === SwitcherProductType.BITBUCKET
        ? `https://bitbucket.org`
        : `https://${siteName}.atlassian.net`,
  };
}

const CLOUD_ID = 'some-cloud-id';

function asFailedProvider(): ResultError {
  return {
    status: Status.ERROR,
    error: 'error',
    data: null,
  };
}

function asCompletedProvider<T>(data: T): ResultComplete<T> {
  return {
    status: Status.COMPLETE,
    data,
  };
}

const loadingProviderResultObject: ResultLoading = {
  status: Status.LOADING,
  data: null,
};

const loadingProvidersResult = {
  customLinks: loadingProviderResultObject,
  recentContainers: loadingProviderResultObject,
  managePermission: loadingProviderResultObject,
  addProductsPermission: loadingProviderResultObject,
  isXFlowEnabled: loadingProviderResultObject,
  productRecommendations: loadingProviderResultObject,
  collaborationGraphRecentContainers: loadingProviderResultObject,
  availableProducts: asCompletedProvider<AvailableProductsResponse>({
    isPartial: false,
    sites: [],
  }),
  joinableSites: asCompletedProvider<JoinableSitesResponse>({
    sites: [],
  }),
};

const completedProvidersResult = {
  customLinks: asCompletedProvider<CustomLinksResponse>([]),
  managePermission: asCompletedProvider(false),
  addProductsPermission: asCompletedProvider(false),
  isXFlowEnabled: asCompletedProvider(false),
  productRecommendations: asCompletedProvider<RecommendationsEngineResponse>(
    [],
  ),
  collaborationGraphRecentContainers: asCompletedProvider<
    CollaborationGraphContainersResponse
  >({ collaborationGraphEntities: null }),
  joinableSites: asCompletedProvider<JoinableSitesResponse>({
    sites: [],
  }),
};
