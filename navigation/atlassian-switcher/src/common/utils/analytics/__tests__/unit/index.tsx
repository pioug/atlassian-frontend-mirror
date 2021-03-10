import React from 'react';
import { RenderTracker } from '../..';
import { mount } from 'enzyme';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import createStream, { Stream } from '../../../../../../test-helpers/stream';

describe('RenderTracker', () => {
  let eventStream: Stream<UIAnalyticsEvent>;
  beforeEach(() => {
    eventStream = createStream();
  });

  type DataScenario = [{ data: any }, { attributes: any }];
  const scenarios: DataScenario[] = [
    [{ data: { duration: null } }, { attributes: { duration: null } }],
    [
      { data: { duration: undefined } },
      { attributes: { duration: undefined } },
    ],
    [{ data: { duration: NaN } }, { attributes: { duration: NaN } }],
    [{ data: { duration: -1 } }, { attributes: { duration: -1 } }],
    [{ data: { duration: 0 } }, { attributes: { duration: 0, bucket: '500' } }],
    [{ data: { duration: 1 } }, { attributes: { duration: 1, bucket: '500' } }],
    [
      { data: { duration: 500 } },
      { attributes: { duration: 500, bucket: '500' } },
    ],
    [
      { data: { duration: 501 } },
      { attributes: { duration: 501, bucket: '1000' } },
    ],
    [
      { data: { duration: 1001 } },
      { attributes: { duration: 1001, bucket: '2000' } },
    ],
    [
      { data: { duration: 2001 } },
      { attributes: { duration: 2001, bucket: '4000' } },
    ],
    [
      { data: { duration: 4001 } },
      { attributes: { duration: 4001, bucket: '+Inf' } },
    ],
  ];
  scenarios.forEach(([input, expected]) => {
    describe(`given data ${JSON.stringify(
      input.data,
    )} supplied to RenderTracker`, () => {
      test(`sends ${JSON.stringify(
        expected,
      )} in the analytic payload`, async () => {
        mount(
          <AnalyticsListener channel="*" onEvent={eventStream}>
            <RenderTracker
              subject="atlassianSwitcherMockComponent"
              data={input.data}
            />
          </AnalyticsListener>,
        );
        const event = await eventStream.next();
        expect(event.payload).toEqual({
          action: 'rendered',
          actionSubject: 'atlassianSwitcherMockComponent',
          attributes: expected.attributes,
          eventType: 'operational',
        });
      });
    });
  });
});
