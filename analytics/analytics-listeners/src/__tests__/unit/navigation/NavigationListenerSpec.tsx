import {
  GasPurePayload,
  OPERATIONAL_EVENT_TYPE,
  UI_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { mount } from 'enzyme';
import cases from 'jest-in-case';
import React from 'react';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import Logger from '../../../helpers/logger';
import NavigationListener from '../../../navigation/NavigationListener';
import { AnalyticsWebClient, FabricChannel } from '../../../types';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';

type CaseArgs = {
  name: string;
  eventPayload: GasPurePayload;
  clientPayload: GasPurePayload;
  eventType?: string;
  context: any[];
};

describe('NavigationListener', () => {
  let analyticsWebClientMock: AnalyticsWebClient;
  let loggerMock: Logger;

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
    loggerMock = createLoggerMock();
  });

  it('should register an Analytics listener on the navigation channel', () => {
    const component = mount(
      <NavigationListener client={analyticsWebClientMock} logger={loggerMock}>
        <div />
      </NavigationListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty('channel', 'navigation');
  });

  cases(
    'should transform events from analyticsListener and fire UI and Operational events to the analyticsWebClient',
    (
      {
        eventPayload,
        clientPayload,
        eventType = UI_EVENT_TYPE,
        context = [],
      }: CaseArgs,
      done: Function,
    ) => {
      const spy = jest.fn();
      const ButtonWithAnalytics = createButtonWithAnalytics(
        eventPayload,
        FabricChannel.navigation,
      );
      const AnalyticsContexts = createAnalyticsContexts(context);

      const component = mount(
        <NavigationListener client={analyticsWebClientMock} logger={loggerMock}>
          <AnalyticsContexts>
            <ButtonWithAnalytics onClick={spy} />
          </AnalyticsContexts>
        </NavigationListener>,
      );

      component.find(ButtonWithAnalytics).simulate('click');

      const mockFn =
        eventType === OPERATIONAL_EVENT_TYPE
          ? analyticsWebClientMock.sendOperationalEvent
          : analyticsWebClientMock.sendUIEvent;

      window.setTimeout(() => {
        expect((mockFn as any).mock.calls[0][0]).toMatchObject(clientPayload);
        done();
      });
    },
    [
      {
        name: 'basic',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          eventType: UI_EVENT_TYPE,
        },
        context: [{ source: 'navigation' }],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'navigation',
            componentHierarchy: undefined,
            packageHierarchy: undefined,
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'navigation',
          tags: ['navigation'],
        },
      },
      {
        name: 'withSources',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          eventType: UI_EVENT_TYPE,
        },
        context: [
          { source: 'issuesPage' },
          { navigationCtx: { source: 'navigationNext' } },
          { navigationCtx: { source: 'globalNavigation' } },
          { navigationCtx: { source: 'searchDrawer' } },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy:
              'issuesPage.navigationNext.globalNavigation.searchDrawer',
            packageHierarchy: undefined,
            componentHierarchy: undefined,
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'searchDrawer',
          tags: ['navigation'],
        },
      },
      {
        name: 'withPackageInfo',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          eventType: UI_EVENT_TYPE,
        },
        context: [
          {
            navigationCtx: {
              packageName: '@atlaskit/navigation-next',
              packageVersion: '0.0.7',
            },
          },
          {
            source: 'globalNavigation',
            packageName: '@atlaskit/global-navigation',
            packageVersion: '0.0.4',
          },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'globalNavigation',
            packageHierarchy:
              '@atlaskit/navigation-next@0.0.7,@atlaskit/global-navigation@0.0.4',
            componentHierarchy: undefined,
            packageName: '@atlaskit/global-navigation',
            packageVersion: '0.0.4',
          },
          source: 'globalNavigation',
          tags: ['navigation'],
        },
      },
      {
        name: 'withComponentInfo',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          eventType: UI_EVENT_TYPE,
        },
        context: [
          { component: 'navigationNext', source: 'navigation' },
          { navigationCtx: { component: 'globalNavigation' } },
          { component: 'globalItem' },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'navigation',
            packageHierarchy: undefined,
            componentHierarchy: 'navigationNext.globalNavigation.globalItem',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'navigation',
          tags: ['navigation'],
        },
      },
      {
        name: 'extraAttributesViaContext',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            a: 'b',
            c: {
              d: 'e',
              z: 'y',
            },
          },
          eventType: UI_EVENT_TYPE,
        },
        context: [
          { component: 'navigationNext', source: 'navigation' },
          {
            navigationCtx: {
              component: 'globalNavigation',
              attributes: { f: 'l', c: { m: 'n' } },
            },
          },
          {
            navigationCtx: {
              component: 'globalItem',
              attributes: { f: 'g', c: { h: 'i', z: 'x' } },
            },
          },
          {
            component: 'insideGlobalItem',
            attributes: { f: 'z', c: { y: 'w', v: 'u' } },
          },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'navigation',
            packageHierarchy: undefined,
            componentHierarchy:
              'navigationNext.globalNavigation.globalItem.insideGlobalItem',
            packageName: undefined,
            packageVersion: undefined,
            a: 'b',
            c: {
              d: 'e',
              h: 'i',
              m: 'n',
              z: 'y',
            },
            f: 'g',
          },
          source: 'navigation',
          tags: ['navigation'],
        },
      },
      {
        name: 'tags',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          tags: ['somethingInteresting'],
          eventType: UI_EVENT_TYPE,
        },
        context: [{ component: 'navigationNext', source: 'navigation' }],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'navigation',
            packageHierarchy: undefined,
            componentHierarchy: 'navigationNext',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'navigation',
          tags: ['somethingInteresting', 'navigation'],
        },
      },
      {
        name: 'without event type',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
        },
        context: [{ component: 'navigationNext', source: 'navigation' }],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'navigation',
            packageHierarchy: undefined,
            componentHierarchy: 'navigationNext',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'navigation',
          tags: ['navigation'],
        },
      },

      {
        name: 'with operational event type',
        eventType: OPERATIONAL_EVENT_TYPE,
        eventPayload: {
          action: 'initialised',
          actionSubject: 'someComponent',
          eventType: OPERATIONAL_EVENT_TYPE,
        },
        context: [{ component: 'navigationNext', source: 'navigation' }],
        clientPayload: {
          action: 'initialised',
          actionSubject: 'someComponent',
          attributes: {
            sourceHierarchy: 'navigation',
            packageHierarchy: undefined,
            componentHierarchy: 'navigationNext',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'navigation',
          tags: ['navigation'],
        },
      },
    ],
  );
});
