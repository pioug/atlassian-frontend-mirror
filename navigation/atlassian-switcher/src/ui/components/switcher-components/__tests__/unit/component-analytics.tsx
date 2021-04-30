import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Switcher from '../../switcher';
import { MANAGE_HREF } from '../../../../../common/providers/jira-data-providers';
import Item from '@atlaskit/item';
import ManageButton from '../../../../primitives/manage-button';
import messages from '../../../../../common/utils/messages';
import { IntlProvider } from 'react-intl';
import createStream, { Stream } from '../../../../../../test-helpers/stream';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { SwitcherProductType } from '../../../../../types';
import { mapResultsToSwitcherProps } from '../../../../../common/utils/map-results-to-switcher-props';
import { Status } from '../../../../../common/providers/as-data-provider';

// Includes viewed and rendered events
const EXPECTED_RENDER_EVENTS = 6;

const DefaultAtlassianSwitcher = (props: any = {}) => {
  const stubIcon = () => <span />;
  const switcherLinks: Partial<ReturnType<typeof mapResultsToSwitcherProps>> = {
    getExtendedAnalyticsAttributes: () => ({}),
    licensedProductLinks: [
      {
        key: 'jira',
        label: 'Jira',
        Icon: stubIcon,
        href: '/secure/MyJiraHome.jspa',
        productType: SwitcherProductType.JIRA_BUSINESS,
        childItems: [
          {
            label: 'some-site',
            href: '/some-jira-site',
          },
          {
            label: 'other-site',
            href: '/other-jira-site',
          },
        ],
      },
    ],
    suggestedProductLinks: [
      {
        key: 'confluence.ondemand',
        label: 'Confluence',
        Icon: stubIcon,
        href: '/wiki',
      },
    ],
    fixedLinks: [],
    adminLinks: [
      {
        key: 'discover-more',
        label: 'Discover More',
        Icon: stubIcon,
        href: '/admin/billing/addapplication',
      },
    ],
    recentLinks: [
      {
        key: 'collabGraphLink',
        label: 'Collab Recent Container',
        Icon: stubIcon,
        href: '/some/recent/collab/container',
        type: 'collab-container-type',
        description: 'Collab Container Type',
      },
    ],
    customLinks: [
      {
        key: 'customLink',
        label: 'Some arbitrary link',
        Icon: stubIcon,
        href: 'https://example.com',
      },
    ],
    discoverSectionLinks: [],
    joinableSiteLinks: [],
    features: {},
    ...(props.overrideSwitcherLinks || {}),
  };
  const rawProviderResults = {
    joinableSites: {
      data: {
        sites: [],
      },
    },
    isXFlowEnabled: {
      data: {},
    },
    provisionedProducts: {
      data: [],
    },
    addProductsPermission: {
      data: false,
    },
    managePermission: {
      data: false,
    },
    recentContainers: {
      data: { data: [] },
    },
    collaborationGraphRecentContainers: {
      data: null,
    },
    customLinks: {
      data: [],
    },
    userSiteData: {
      data: {},
    },
    ...props.rawProviderResults,
  };

  return (
    <IntlProvider locale="en">
      <AnalyticsListener channel="*" onEvent={props.onEventFired}>
        <Switcher
          product="jira"
          cloudId="some-cloud-id"
          triggerXFlow={() => 'triggering xflow'}
          manageLink={MANAGE_HREF}
          messages={messages}
          hasLoaded
          hasLoadedCritical
          {...switcherLinks}
          {...props}
          rawProviderResults={rawProviderResults}
          enableRecentContainers={false}
          onDiscoverMoreClicked={() => 'onDiscoverMoreClicked'}
          isDiscoverMoreClickable={true}
        />
      </AnalyticsListener>
    </IntlProvider>
  );
};

const flattenContext = (context: Record<string, any>[]) =>
  context.reduce(
    (flattenedContext, contextLayer) =>
      contextLayer.navigationCtx && contextLayer.navigationCtx.attributes
        ? {
            ...flattenedContext,
            ...contextLayer.navigationCtx.attributes,
          }
        : flattenedContext,
    {},
  );

describe('Atlassian Switcher - SLIs', () => {
  let eventStream: Stream<UIAnalyticsEvent>;
  let immediateIds: NodeJS.Immediate[] = [];
  beforeEach(() => {
    eventStream = createStream();
  });
  afterEach(() => {
    immediateIds.forEach(immediateId => window.clearImmediate(immediateId));
  });

  describe('Joinable sites rendered SLI', () => {
    const PRECEDING_EVENTS = 2;
    it('fires not_rendered event when the provider fails', async () => {
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          rawProviderResults={{
            joinableSites: {
              data: null,
            },
          }}
          enableRecentContainers
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const { payload: renderJoinableSitesPayload } = await eventStream.next();
      expect(renderJoinableSitesPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherJoinableSites',
      });
      expect(renderJoinableSitesPayload.attributes).toHaveProperty('duration');
      expect(
        renderJoinableSitesPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderJoinableSitesPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(renderJoinableSitesPayload.attributes.providerFailed).toBeTruthy();
    });

    it('fires not_rendered event when the provider returns a non-empty result but no sites are rendered', async () => {
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          rawProviderResults={{
            joinableSites: {
              data: {
                sites: [{ cloudId: 'cid-123' }],
              },
            },
          }}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const { payload: renderJoinableSitesPayload } = await eventStream.next();
      expect(renderJoinableSitesPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherJoinableSites',
      });
      expect(renderJoinableSitesPayload.attributes).toHaveProperty('duration');
      expect(
        renderJoinableSitesPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderJoinableSitesPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(renderJoinableSitesPayload.attributes.providerFailed).toBeFalsy();
    });

    it('fires rendered event when the provider returns a non-empty result and sites are rendered', async () => {
      const overrideSwitcherLinks = {
        joinableSiteLinks: [
          {
            key: 'confluence.ondemand',
            label: 'Confluence',
            Icon: () => <span />,
            href: '/wiki',
          },
        ],
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
          rawProviderResults={{
            joinableSites: {
              data: {
                sites: [{ cloudId: 'cid-123' }],
              },
            },
          }}
        />,
      );
      // Skip switcher viewed event
      eventStream.skip(1);

      const { payload: viewJoinableSitesPayload } = await eventStream.next();
      expect(viewJoinableSitesPayload).toMatchObject({
        eventType: 'ui',
        action: 'viewed',
        actionSubject: 'atlassianSwitcherJoinableSites',
      });

      // Skip switcher rendered event
      eventStream.skip(1);

      const { payload: renderJoinableSitesPayload } = await eventStream.next();
      expect(renderJoinableSitesPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherJoinableSites',
      });
      expect(renderJoinableSitesPayload.attributes).toHaveProperty('duration');
      expect(
        renderJoinableSitesPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderJoinableSitesPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(renderJoinableSitesPayload.attributes.emptyRender).toBeFalsy();
    });

    it('fires rendered event when the provider returns an empty result', async () => {
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          rawProviderResults={{
            joinableSites: {
              data: {
                sites: [],
              },
            },
          }}
          joinableSites={[]}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const { payload: renderJoinableSitesPayload } = await eventStream.next();
      expect(renderJoinableSitesPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherJoinableSites',
      });
      expect(renderJoinableSitesPayload.attributes).toHaveProperty('duration');
      expect(
        renderJoinableSitesPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderJoinableSitesPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(renderJoinableSitesPayload.attributes.emptyRender).toBeTruthy();
    });
  });

  describe('Recommended products rendered SLI', () => {
    const PRECEDING_EVENTS = 3;
    it('fires rendered event none of the providers fail', async () => {
      mount(<DefaultAtlassianSwitcher onEventFired={eventStream} />);
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecommendedProductsPayload,
      } = await eventStream.next();
      expect(renderRecommendedProductsPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherRecommendedProducts',
      });
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecommendedProductsPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(
        renderRecommendedProductsPayload.attributes.emptyRender,
      ).toBeFalsy();
    });

    it('fires not_rendered when isXFlowEnabled provider fails', async () => {
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          rawProviderResults={{
            isXFlowEnabled: {
              data: null,
            },
          }}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecommendedProductsPayload,
      } = await eventStream.next();
      expect(renderRecommendedProductsPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherRecommendedProducts',
      });
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecommendedProductsPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(
        renderRecommendedProductsPayload.attributes.providerFailed,
      ).toBeTruthy();
    });

    it('fires not_rendered when provisionedProducts provider fails', async () => {
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          rawProviderResults={{
            provisionedProducts: {
              data: null,
            },
          }}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecommendedProductsPayload,
      } = await eventStream.next();
      expect(renderRecommendedProductsPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherRecommendedProducts',
      });
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecommendedProductsPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(
        renderRecommendedProductsPayload.attributes.providerFailed,
      ).toBeTruthy();
    });
  });

  describe('Discover more rendered SLI', () => {
    const PRECEDING_EVENTS = 4;
    it('discoverMoreForEveryone enabled - fires rendered event when the item is shown', async () => {
      mount(
        <DefaultAtlassianSwitcher onEventFired={eventStream} features={{}} />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecommendedProductsPayload,
      } = await eventStream.next();
      expect(renderRecommendedProductsPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherDiscoverMore',
      });
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecommendedProductsPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
    });

    it('discoverMoreForEveryone enabled - fires not_rendered event when the item is not rendered', async () => {
      const overrideSwitcherLinks = {
        adminLinks: [],
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          features={{}}
          overrideSwitcherLinks={overrideSwitcherLinks}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecommendedProductsPayload,
      } = await eventStream.next();
      expect(renderRecommendedProductsPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherDiscoverMore',
      });
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecommendedProductsPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(
        renderRecommendedProductsPayload.attributes.providerFailed,
      ).toBeFalsy();
    });

    it('permissions based - fires not_rendered if a permissions provider fails', async () => {
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          rawProviderResults={{
            addProductsPermission: {
              data: null,
            },
          }}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecommendedProductsPayload,
      } = await eventStream.next();
      expect(renderRecommendedProductsPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherDiscoverMore',
      });
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecommendedProductsPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(
        renderRecommendedProductsPayload.attributes.providerFailed,
      ).toBeTruthy();
    });

    it('permissions based - fires not_rendered if one of the providers returns true but the item is not rendered', async () => {
      const overrideSwitcherLinks = {
        adminLinks: [],
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          rawProviderResults={{
            addProductsPermission: {
              data: true,
            },
          }}
          overrideSwitcherLinks={overrideSwitcherLinks}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecommendedProductsPayload,
      } = await eventStream.next();
      expect(renderRecommendedProductsPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherDiscoverMore',
      });
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecommendedProductsPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(
        renderRecommendedProductsPayload.attributes.providerFailed,
      ).toBeFalsy();
    });

    it('permissions based - fires rendered event if the item is rendered', async () => {
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          rawProviderResults={{
            addProductsPermission: {
              data: true,
            },
          }}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecommendedProductsPayload,
      } = await eventStream.next();
      expect(renderRecommendedProductsPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherDiscoverMore',
      });
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecommendedProductsPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecommendedProductsPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(
        renderRecommendedProductsPayload.attributes.emptyRender,
      ).toBeFalsy();
    });
  });

  describe('Recent containers SLI', () => {
    const PRECEDING_EVENTS = 5;

    it('collaboration graph recent containers - fires rendered event if provider returns an empty list', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
        recentLinks: [],
        features: { enableRecentContainers: true },
      };
      const rawProviderResults = {
        collaborationGraphRecentContainers: {
          data: {
            collaborationGraphEntities: [],
          },
        },
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
          rawProviderResults={rawProviderResults}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecentContainersPayload,
      } = await eventStream.next();
      expect(renderRecentContainersPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherRecentContainers',
      });
      expect(renderRecentContainersPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecentContainersPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecentContainersPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(renderRecentContainersPayload.attributes.emptyRender).toBeTruthy();
    });

    it('collaboration graph recent containers - fires rendered event if provider returns data and recent links are rendered', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
        features: { enableRecentContainers: true },
      };
      const rawProviderResults = {
        collaborationGraphRecentContainers: {
          data: {
            collaborationGraphEntities: [{ cloudId: 'cid-123' }],
          },
        },
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
          rawProviderResults={rawProviderResults}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecentContainersPayload,
      } = await eventStream.next();
      expect(renderRecentContainersPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherRecentContainers',
      });
      expect(renderRecentContainersPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecentContainersPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecentContainersPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(renderRecentContainersPayload.attributes.emptyRender).toBeFalsy();
    });

    it('collaboration graph recent containers - fires not rendered event if the provider fails', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
        features: { enableRecentContainers: true },
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecentContainersPayload,
      } = await eventStream.next();
      expect(renderRecentContainersPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherRecentContainers',
      });
      expect(renderRecentContainersPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecentContainersPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecentContainersPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(
        renderRecentContainersPayload.attributes.providerFailed,
      ).toBeTruthy();
    });

    it('collaboration graph recent containers - fires not rendered event if the provider returns data but no recent links are rendered', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
        recentLinks: [],
        features: { enableRecentContainers: true },
      };
      const rawProviderResults = {
        collaborationGraphRecentContainers: {
          data: {
            collaborationGraphEntities: [{ cloudId: 'cid-123' }],
          },
        },
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
          rawProviderResults={rawProviderResults}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: renderRecentContainersPayload,
      } = await eventStream.next();
      expect(renderRecentContainersPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherRecentContainers',
      });
      expect(renderRecentContainersPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        renderRecentContainersPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(renderRecentContainersPayload.attributes).toHaveProperty(
        'providerFailed',
      );
      expect(
        renderRecentContainersPayload.attributes.providerFailed,
      ).toBeFalsy();
    });

    it('collaboration graph recent containers - fires no event if the recents section is disabled', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
        recentLinks: [],
        features: { enableRecentContainers: false },
      };

      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
        />,
      );

      for (const event of eventStream.allEvents()) {
        expect(event.payload.actionSubject).not.toContain('RecentContainers');
      }
    });
  });

  describe('Custom links SLI', () => {
    const PRECEDING_EVENTS = 5;
    it('fires rendered event when the provider returns an empty list', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
        customLinks: [],
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: customLinksContainersPayload,
      } = await eventStream.next();
      expect(customLinksContainersPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherCustomLinks',
      });
      expect(customLinksContainersPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        customLinksContainersPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(customLinksContainersPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(customLinksContainersPayload.attributes.emptyRender).toBeTruthy();
    });

    it('fires rendered event when the provider returns data and custom links are rendered', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
      };
      const rawProviderResults = {
        customLinks: {
          data: [{ cloudId: 'cloudid-123' }],
        },
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
          rawProviderResults={rawProviderResults}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: customLinksContainersPayload,
      } = await eventStream.next();
      expect(customLinksContainersPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherCustomLinks',
      });
      expect(customLinksContainersPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        customLinksContainersPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(customLinksContainersPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(customLinksContainersPayload.attributes.emptyRender).toBeFalsy();
    });

    it('fires rendered event when the provider returns data but no custom links are rendered', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
        customLinks: [],
      };
      const rawProviderResults = {
        customLinks: {
          data: [{ cloudId: 'cloudid-123' }],
        },
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
          rawProviderResults={rawProviderResults}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: customLinksContainersPayload,
      } = await eventStream.next();
      expect(customLinksContainersPayload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcherCustomLinks',
      });
      expect(customLinksContainersPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        customLinksContainersPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(customLinksContainersPayload.attributes).toHaveProperty(
        'emptyRender',
      );
      expect(customLinksContainersPayload.attributes.emptyRender).toBeTruthy();
    });

    it('fires not_rendered event when the provider fails', async () => {
      const overrideSwitcherLinks = {
        hasLoadedInstanceProviders: true,
      };
      const rawProviderResults = {
        customLinks: {
          data: null,
          status: Status.ERROR,
        },
      };
      mount(
        <DefaultAtlassianSwitcher
          onEventFired={eventStream}
          overrideSwitcherLinks={overrideSwitcherLinks}
          rawProviderResults={rawProviderResults}
        />,
      );
      eventStream.skip(PRECEDING_EVENTS);

      const {
        payload: customLinksContainersPayload,
      } = await eventStream.next();
      expect(customLinksContainersPayload).toMatchObject({
        eventType: 'operational',
        action: 'not_rendered',
        actionSubject: 'atlassianSwitcherCustomLinks',
      });
      expect(customLinksContainersPayload.attributes).toHaveProperty(
        'duration',
      );
      expect(
        customLinksContainersPayload.attributes.duration,
      ).toBeGreaterThanOrEqual(0);
      expect(customLinksContainersPayload.attributes.notRenderedReason).toEqual(
        'custom_links_api_error',
      );
    });
  });
});

describe('Atlassian Switcher - Component Analytics', () => {
  let wrapper: ReactWrapper;
  let eventStream: Stream<UIAnalyticsEvent>;
  let immediateIds: NodeJS.Immediate[] = [];
  beforeEach(() => {
    eventStream = createStream();
    wrapper = mount(<DefaultAtlassianSwitcher onEventFired={eventStream} />);
  });
  afterEach(() => {
    immediateIds.forEach(immediateId => window.clearImmediate(immediateId));
  });

  it('should fire "atlassianSwitcher rendered and "atlassianSwitcher viewed"', async () => {
    // UI event when the Switcher is viewed at all (before content load)
    const { payload: viewedPayload } = await eventStream.next();
    expect(viewedPayload).toMatchObject({
      eventType: 'ui',
      action: 'viewed',
      actionSubject: 'atlassianSwitcher',
      attributes: {
        suggestedProducts: ['confluence.ondemand'],
        licensedProducts: ['JIRA_BUSINESS'],
        adminLinks: ['discover-more'],
        fixedLinks: [],
        numberOfSites: 2,
      },
    });

    // Operational events when the Switcher first displays content
    const {
      payload: renderAvailableProductsPayload,
    } = await eventStream.next();
    expect(renderAvailableProductsPayload).toMatchObject({
      eventType: 'operational',
      action: 'rendered',
      actionSubject: 'atlassianSwitcherAvailableProducts',
    });
    expect(renderAvailableProductsPayload.attributes).toHaveProperty(
      'duration',
    );
    expect(
      renderAvailableProductsPayload.attributes.duration,
    ).toBeGreaterThanOrEqual(0);

    // Skip joinable sites and recommended products render event (covered in joinable sites SLO tests)
    eventStream.skip(3);

    const { payload: renderSwitcherPayload } = await eventStream.next();
    expect(renderSwitcherPayload).toMatchObject({
      eventType: 'operational',
      action: 'rendered',
      actionSubject: 'atlassianSwitcher',
    });
    expect(renderSwitcherPayload.attributes).toHaveProperty('duration');
    expect(renderSwitcherPayload.attributes.duration).toBeGreaterThanOrEqual(0);
  });

  it('should fire "atlassianSwitcher viewed" with correct numberOfSites for site-centric', async () => {
    // site-centric response doesn't have any childItems
    const overrideSwitcherLinks = {
      licensedProductLinks: [
        {
          key: 'jira',
          label: 'Jira',
          Icon: () => <span />,
          href: '/secure/MyJiraHome.jspa',
          productType: SwitcherProductType.JIRA_BUSINESS,
        },
      ],
    };
    eventStream = createStream();
    wrapper = mount(
      <DefaultAtlassianSwitcher
        onEventFired={eventStream}
        overrideSwitcherLinks={overrideSwitcherLinks}
      />,
    );

    // UI event when the Switcher is viewed at all (before content load)
    const { payload: viewedPayload } = await eventStream.next();
    expect(viewedPayload).toMatchObject({
      eventType: 'ui',
      action: 'viewed',
      actionSubject: 'atlassianSwitcher',
      attributes: {
        suggestedProducts: ['confluence.ondemand'],
        licensedProducts: ['JIRA_BUSINESS'],
        adminLinks: ['discover-more'],
        fixedLinks: [],
        numberOfSites: 1,
      },
    });
  });

  describe('should fire "atlassianSwitcherItem clicked"', () => {
    const appSwitcherLinksCategories = [
      {
        name: 'for licensedProductLinks',
        data: {
          itemType: 'product',
          itemId: null,
          itemsCount: 5,
          groupItemsCount: 2,
        },
      },
      {
        name: 'for licensedProductLinks expand',
        data: {
          itemType: 'product',
          itemId: null,
          itemsCount: 5,
          groupItemsCount: 2,
        },
        subject: 'atlassianSwitcherItemExpand',
      },
      {
        name: 'for adminLinks',
        data: {
          itemType: 'admin',
          itemId: 'discover-more',
          itemsCount: 5,
          groupItemsCount: 2,
        },
      },
      {
        name: 'for suggestedProductLinks',
        data: {
          group: 'discover',
          itemType: 'try',
          itemId: 'confluence.ondemand',
          itemsCount: 5,
          groupItemsCount: 1,
        },
      },
      {
        name: 'for recentLinks',
        data: {
          group: 'recent',
          itemType: 'recent',
          itemId: 'collab-container-type',
          itemsCount: 5,
          groupItemsCount: 1,
        },
      },
      {
        name: 'for customLinks',
        data: {
          group: 'customLinks',
          itemType: 'customLink',
          itemId: null,
          itemsCount: 5,
          groupItemsCount: 1,
        },
      },
    ];

    for (let i = 0; i < appSwitcherLinksCategories.length; i++) {
      const appSwitcherLinkCategory = appSwitcherLinksCategories[i];
      it(appSwitcherLinkCategory.name, async () => {
        eventStream.skip(EXPECTED_RENDER_EVENTS);
        const item = wrapper.find(Item);
        item.at(i).simulate('click');
        const { payload, context } = await eventStream.next();
        expect(payload).toMatchObject({
          eventType: 'ui',
          action: 'clicked',
          actionSubject:
            appSwitcherLinkCategory.subject || 'atlassianSwitcherItem',
        });
        expect(flattenContext(context)).toMatchObject({
          group: 'switchTo',
          ...appSwitcherLinkCategory.data,
        });
      });
    }
  });

  it('should fire "atlassianSwitcherItemExpand clicked" and "atlassianSwitcherChildItem clicked"', async () => {
    const analyticsData = {
      itemType: 'product',
      itemId: null,
      itemsCount: 5,
      groupItemsCount: 2,
      productType: SwitcherProductType.JIRA_BUSINESS,
    };

    eventStream.skip(EXPECTED_RENDER_EVENTS);

    const expandToggle = wrapper
      .find(Item)
      .find('[data-test-id="switcher-expand-toggle"]');

    expandToggle.at(0).simulate('click');
    const { payload, context } = await eventStream.next();

    expect(payload).toMatchObject({
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'atlassianSwitcherItemExpand',
    });
    expect(flattenContext(context)).toMatchObject({
      group: 'switchTo',
      ...analyticsData,
    });

    const childItem = wrapper
      .find(Item)
      .find('[data-test-id="switcher-child-item"]');
    childItem.at(0).simulate('click');

    const {
      payload: childItemClickPayload,
      context: childItemClickContext,
    } = await eventStream.next();
    expect(childItemClickPayload).toMatchObject({
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'atlassianSwitcherChildItem',
    });
    expect(flattenContext(childItemClickContext)).toMatchObject({
      group: 'switchTo',
      ...analyticsData,
    });
  });

  it('should fire "button clicked - manageListButton"', async () => {
    await eventStream.skip(EXPECTED_RENDER_EVENTS);
    /*
      This is needed as there's a slight delay between the rendered event being fired
      and the last endpoint being proccessed. This can be removed once we instrument
      the data providers with analytics and we intentionally skip the events triggered
      by the fetch calls.
     */
    immediateIds.push(
      window.setImmediate(() => {
        wrapper.update();
        const manageButton = wrapper.find(ManageButton);
        manageButton.simulate('click');
      }),
    );
    const { payload, context } = await eventStream.next();
    expect(payload).toMatchObject({
      action: 'clicked',
      actionSubject: 'button',
    });
    expect(flattenContext(context)).toMatchObject({
      itemsCount: 5,
    });
  });
});
