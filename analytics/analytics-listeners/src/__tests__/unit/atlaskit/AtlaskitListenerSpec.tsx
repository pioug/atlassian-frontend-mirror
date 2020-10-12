import { GasPurePayload, UI_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { mount } from 'enzyme';
import cases from 'jest-in-case';
import React from 'react';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import AtlaskitListener from '../../../atlaskit/AtlaskitListener';
import Logger from '../../../helpers/logger';
import { AnalyticsWebClient, FabricChannel } from '../../../types';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';

type CaseArgs = {
  name: string;
  eventPayload: GasPurePayload;
  clientPayload: GasPurePayload;
  context: any[];
};

describe('AtlaskitListener', () => {
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

  it('should register an Analytics listener on the atlaskit channel', () => {
    const component = mount(
      <AtlaskitListener client={analyticsWebClientMock} logger={loggerMock}>
        <div />
      </AtlaskitListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.atlaskit,
    );
  });

  cases(
    'should transform events from analyticsListener and fire UI events to the analyticsWebClient',
    (
      { eventPayload, clientPayload, context = [] }: CaseArgs,
      done: Function,
    ) => {
      const spy = jest.fn();
      const ButtonWithAnalytics = createButtonWithAnalytics(
        eventPayload,
        FabricChannel.atlaskit,
      );
      const AnalyticsContexts = createAnalyticsContexts(context);

      const component = mount(
        <AtlaskitListener client={analyticsWebClientMock} logger={loggerMock}>
          <AnalyticsContexts>
            <ButtonWithAnalytics onClick={spy} />
          </AnalyticsContexts>
        </AtlaskitListener>,
      );

      component.find(ButtonWithAnalytics).simulate('click');

      window.setTimeout(() => {
        expect(
          (analyticsWebClientMock.sendUIEvent as any).mock.calls[0][0],
        ).toMatchObject(clientPayload);
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
          tags: ['atlaskit'],
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
          { source: 'navigationNext' },
          { source: 'globalNavigation' },
          { source: 'searchDrawer' },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'navigationNext.globalNavigation.searchDrawer',
            packageHierarchy: undefined,
            componentHierarchy: undefined,
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'searchDrawer',
          tags: ['atlaskit'],
        },
      },
      {
        name: 'withContextActionSubject',
        eventPayload: {
          action: 'someAction',
          eventType: UI_EVENT_TYPE,
        },
        context: [
          { component: 'navigation', source: 'navigation' },
          { component: 'button' },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'button',
          attributes: {
            sourceHierarchy: 'navigation',
            packageHierarchy: undefined,
            componentHierarchy: 'navigation.button',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'navigation',
          tags: ['atlaskit'],
        },
      },

      {
        name: 'withNoContextActionSubject',
        eventPayload: {
          action: 'someAction',
          eventType: UI_EVENT_TYPE,
        },
        context: [
          // Component isn't the closest context array so it may not refer to the
          // actionSubject
          { component: 'navigation' },
          { source: 'globalNavigation' },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: undefined,
          attributes: {
            sourceHierarchy: 'globalNavigation',
            packageHierarchy: undefined,
            componentHierarchy: 'navigation',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'globalNavigation',
          tags: ['atlaskit'],
        },
      },
      {
        name: 'withActionSubjectOverride',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          eventType: UI_EVENT_TYPE,
        },
        context: [
          { actionSubjectOverride: 'someMoreDescriptiveComponent' },
          { actionSubjectOverride: 'someDescriptiveComponent' },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someMoreDescriptiveComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: undefined,
            packageHierarchy: undefined,
            componentHierarchy: undefined,
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'unknown',
          tags: ['atlaskit'],
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
          { packageName: '@atlaskit/navigation-next', packageVersion: '0.0.7' },
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
          tags: ['atlaskit'],
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
          { component: 'globalNavigation' },
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
          tags: ['atlaskit'],
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
            component: 'globalNavigation',
            attributes: { f: 'l', c: { m: 'n' } },
          },
          {
            component: 'globalItem',
            attributes: { f: 'g', c: { h: 'i', z: 'x' } },
          },
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
          tags: ['atlaskit'],
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
          tags: ['somethingInteresting', 'atlaskit'],
        },
      },
      {
        name: 'without event type',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
        } as GasPurePayload,
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
          tags: ['atlaskit'],
        } as GasPurePayload,
      },
    ] as CaseArgs[],
  );
});
