import {
  GasPurePayload,
  OPERATIONAL_EVENT_TYPE,
  UI_EVENT_TYPE,
  TRACK_EVENT_TYPE,
  SCREEN_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { mount } from 'enzyme';
import cases from 'jest-in-case';
import React from 'react';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import Logger from '../../../helpers/logger';
import PeopleTeamsAnalyticsListener from '../../../peopleTeams/PeopleTeamsAnalyticsListener';
import { AnalyticsWebClient, FabricChannel } from '../../../types';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';

type CaseArgs = {
  name: string;
  eventPayload: GasPurePayload;
  clientPayload: GasPurePayload;
  eventType?: string;
  context: any[];
};

describe('PeopleTeamsAnalyticsListener', () => {
  const analyticsWebClientMock: AnalyticsWebClient = {
    sendUIEvent: jest.fn(),
    sendOperationalEvent: jest.fn(),
    sendTrackEvent: jest.fn(),
    sendScreenEvent: jest.fn(),
  };
  const loggerMock: Logger = createLoggerMock();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should register an Analytics listener on the peopleTeams channel', () => {
    const component = mount(
      <PeopleTeamsAnalyticsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <div />
      </PeopleTeamsAnalyticsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty('channel', 'peopleTeams');
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
        FabricChannel.peopleTeams,
      );
      const AnalyticsContexts = createAnalyticsContexts(context);

      const component = mount(
        <PeopleTeamsAnalyticsListener
          client={analyticsWebClientMock}
          logger={loggerMock}
        >
          <AnalyticsContexts>
            <ButtonWithAnalytics onClick={spy} />
          </AnalyticsContexts>
        </PeopleTeamsAnalyticsListener>,
      );

      component.find(ButtonWithAnalytics).simulate('click');

      let mockFn = analyticsWebClientMock.sendUIEvent;

      if (eventType === OPERATIONAL_EVENT_TYPE) {
        mockFn = analyticsWebClientMock.sendOperationalEvent;
      }

      if (eventType === TRACK_EVENT_TYPE) {
        mockFn = analyticsWebClientMock.sendTrackEvent;
      }

      if (eventType === SCREEN_EVENT_TYPE) {
        analyticsWebClientMock.sendScreenEvent;
      }

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
        context: [{ source: 'peopleTeams' }],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'peopleTeams',
            componentHierarchy: undefined,
            packageHierarchy: undefined,
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'peopleTeams',
          tags: ['peopleTeams'],
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
          { peopleTeamsCtx: { source: 'peopleTeamsNext' } },
          { peopleTeamsCtx: { source: 'globalpeopleTeams' } },
          { peopleTeamsCtx: { source: 'searchDrawer' } },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy:
              'issuesPage.peopleTeamsNext.globalpeopleTeams.searchDrawer',
            packageHierarchy: undefined,
            componentHierarchy: undefined,
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'searchDrawer',
          tags: ['peopleTeams'],
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
            peopleTeamsCtx: {
              packageName: '@atlaskit/peopleTeams-next',
              packageVersion: '0.0.7',
            },
          },
          {
            source: 'globalpeopleTeams',
            packageName: '@atlaskit/global-peopleTeams',
            packageVersion: '0.0.4',
          },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'globalpeopleTeams',
            packageHierarchy:
              '@atlaskit/peopleTeams-next@0.0.7,@atlaskit/global-peopleTeams@0.0.4',
            componentHierarchy: undefined,
            packageName: '@atlaskit/global-peopleTeams',
            packageVersion: '0.0.4',
          },
          source: 'globalpeopleTeams',
          tags: ['peopleTeams'],
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
          { component: 'peopleTeamsNext', source: 'peopleTeams' },
          { peopleTeamsCtx: { component: 'globalpeopleTeams' } },
          { component: 'globalItem' },
        ],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'peopleTeams',
            packageHierarchy: undefined,
            componentHierarchy: 'peopleTeamsNext.globalpeopleTeams.globalItem',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'peopleTeams',
          tags: ['peopleTeams'],
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
          { component: 'peopleTeamsNext', source: 'peopleTeams' },
          {
            peopleTeamsCtx: {
              component: 'globalpeopleTeams',
              attributes: { f: 'l', c: { m: 'n' } },
            },
          },
          {
            peopleTeamsCtx: {
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
            sourceHierarchy: 'peopleTeams',
            packageHierarchy: undefined,
            componentHierarchy:
              'peopleTeamsNext.globalpeopleTeams.globalItem.insideGlobalItem',
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
          source: 'peopleTeams',
          tags: ['peopleTeams'],
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
        context: [{ component: 'peopleTeamsNext', source: 'peopleTeams' }],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'peopleTeams',
            packageHierarchy: undefined,
            componentHierarchy: 'peopleTeamsNext',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'peopleTeams',
          tags: ['somethingInteresting', 'peopleTeams'],
        },
      },
      {
        name: 'without event type',
        eventPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
        },
        context: [{ component: 'peopleTeamsNext', source: 'peopleTeams' }],
        clientPayload: {
          action: 'someAction',
          actionSubject: 'someComponent',
          actionSubjectId: 'someComponentId',
          attributes: {
            sourceHierarchy: 'peopleTeams',
            packageHierarchy: undefined,
            componentHierarchy: 'peopleTeamsNext',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'peopleTeams',
          tags: ['peopleTeams'],
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
        context: [{ component: 'peopleTeamsNext', source: 'peopleTeams' }],
        clientPayload: {
          action: 'initialised',
          actionSubject: 'someComponent',
          attributes: {
            sourceHierarchy: 'peopleTeams',
            packageHierarchy: undefined,
            componentHierarchy: 'peopleTeamsNext',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'peopleTeams',
          tags: ['peopleTeams'],
        },
      },
      {
        name: 'with track event type',
        eventType: TRACK_EVENT_TYPE,
        eventPayload: {
          action: 'requested',
          actionSubject: 'someComponent',
          eventType: TRACK_EVENT_TYPE,
        },
        context: [{ component: 'peopleTeamsNext', source: 'peopleTeams' }],
        clientPayload: {
          action: 'requested',
          actionSubject: 'someComponent',
          attributes: {
            sourceHierarchy: 'peopleTeams',
            packageHierarchy: undefined,
            componentHierarchy: 'peopleTeamsNext',
            packageName: undefined,
            packageVersion: undefined,
          },
          source: 'peopleTeams',
          tags: ['peopleTeams'],
        },
      },
    ],
  );
});
