import AnalyticsHelper from '../../analytics/analytics-helper';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { Config } from '../../types';
import { createSocketIOSocket } from '../../socket-io-provider';
import { Channel } from '../../channel';

let fakeAnalyticsWebClient: AnalyticsWebClient = {
  sendOperationalEvent: jest.fn(),
  sendScreenEvent: jest.fn(),
  sendTrackEvent: jest.fn(),
  sendUIEvent: jest.fn(),
};

const fakeDocumentAri =
  'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230';
const testChannelConfig: Config = {
  url: 'https://localhost/ccollab',
  documentAri: fakeDocumentAri,
  createSocket: createSocketIOSocket,
  analyticsClient: fakeAnalyticsWebClient,
};

describe('Channel rate limiting unit tests', () => {
  it('Should not rate limit if off', () => {
    const analyticsHelper = new AnalyticsHelper(
      testChannelConfig.documentAri,
      testChannelConfig.analyticsClient,
    );
    const channel = new Channel(
      {
        ...testChannelConfig,
        rateLimitType: 0,
        rateLimitMaxStepSize: 1000000,
        rateLimitTotalStepSize: 1000000,
        rateLimitStepCount: 1,
      },
      analyticsHelper,
    );
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont really care what this is just that its jsonifiable'],
        },
      ]),
    ).not.toThrowError();
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont really care what this is just that its jsonifiable'],
        },
      ]),
    ).not.toThrowError();
  });

  it('Should rate limit frequent messages', () => {
    const analyticsHelper = new AnalyticsHelper(
      testChannelConfig.documentAri,
      testChannelConfig.analyticsClient,
    );
    const channel = new Channel(
      {
        ...testChannelConfig,
        rateLimitType: 2,
        rateLimitMaxStepSize: 1000000,
        rateLimitTotalStepSize: 1000000,
        rateLimitStepCount: 1,
      },
      analyticsHelper,
    );
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont really care what this is just that its jsonifiable'],
        },
      ]),
    ).not.toThrowError();
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont really care what this is just that its jsonifiable'],
        },
      ]),
    ).toThrowError();
  });

  it('Should rate limit large messages', () => {
    const analyticsHelper = new AnalyticsHelper(
      testChannelConfig.documentAri,
      testChannelConfig.analyticsClient,
    );
    const channel = new Channel(
      {
        ...testChannelConfig,
        rateLimitType: 2,
        rateLimitMaxStepSize: 10,
        rateLimitTotalStepSize: 1000000,
        rateLimitStepCount: 10000,
      },
      analyticsHelper,
    );
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont'],
        },
      ]),
    ).not.toThrowError();
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont really care what this is just that its jsonifiable'],
        },
      ]),
    ).toThrowError();
  });

  it('Should rate limit message bandwidth', () => {
    const analyticsHelper = new AnalyticsHelper(
      testChannelConfig.documentAri,
      testChannelConfig.analyticsClient,
    );
    const channel = new Channel(
      {
        ...testChannelConfig,
        rateLimitType: 2,
        rateLimitMaxStepSize: 1000000,
        rateLimitTotalStepSize: 10,
        rateLimitStepCount: 10000,
      },
      analyticsHelper,
    );
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont'],
        },
      ]),
    ).not.toThrowError();
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont'],
        },
      ]),
    ).toThrowError();
  });

  it('Should rate limit message bandwidth over multiple windows', () => {
    const analyticsHelper = new AnalyticsHelper(
      testChannelConfig.documentAri,
      testChannelConfig.analyticsClient,
    );
    const channel = new Channel(
      {
        ...testChannelConfig,
        rateLimitType: 2,
        rateLimitMaxStepSize: 1000000,
        rateLimitTotalStepSize: 10,
        rateLimitStepCount: 10000,
      },
      analyticsHelper,
    );
    expect(() =>
      channel.onAnyOutgoingHandler(0, [
        {
          type: 'steps:commit',
          steps: ['we dont'],
        },
      ]),
    ).not.toThrowError();
    expect(() =>
      channel.onAnyOutgoingHandler(60001, [
        {
          type: 'steps:commit',
          steps: ['we dont'],
        },
      ]),
    ).not.toThrowError();
    expect(() =>
      channel.onAnyOutgoingHandler(90000, [
        {
          type: 'steps:commit',
          steps: ['we dont'],
        },
      ]),
    ).toThrowError();
  });
});
