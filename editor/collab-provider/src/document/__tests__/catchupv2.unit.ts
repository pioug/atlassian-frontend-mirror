import { catchupv2 } from '../catchupv2';
import type { Catchupv2Options } from '../../types';
import AnalyticsHelper from '../../analytics/analytics-helper';

const newMetadata = 'new-metadata';

const step1 = {
  userId: 'ari:cloud:identity::user/123',
  clientId: 123,
  from: 1,
  to: 4,
  stepType: 'replace',
  slice: {
    content: { type: 'paragraph', content: [{ type: 'text', text: 'abc' }] },
  },
};

const step2 = {
  userId: 'ari:cloud:identity::user/123',
  clientId: 123,
  from: 1,
  to: 3,
  stepType: 'replace',
  slice: {
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ab' }] }],
  },
};

describe('Catchupv2 ', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Silently continues when catchupv2 returns no steps', async () => {
    const options: Catchupv2Options = {
      getCurrentPmVersion: jest.fn().mockReturnValue(1),
      fetchCatchupv2: jest.fn().mockResolvedValue({
        steps: [],
        metadata: newMetadata,
      }),
      updateMetadata: jest.fn(),
      analyticsHelper: new AnalyticsHelper('fake-document-ari'),
      clientId: 'some-random-prosemirror-client-Id',
      onStepsAdded: jest.fn(),
    };

    await catchupv2(options);
    expect(options.fetchCatchupv2).toBeCalledWith(
      1,
      'some-random-prosemirror-client-Id',
    );
  });

  it('Should add steps and update metadata', async () => {
    const options: Catchupv2Options = {
      getCurrentPmVersion: jest.fn().mockReturnValue(1),
      fetchCatchupv2: jest.fn().mockResolvedValue({
        steps: [step1, step2],
        metadata: newMetadata,
      }),
      updateMetadata: jest.fn(),
      analyticsHelper: new AnalyticsHelper('fake-document-ari'),
      clientId: 'some-random-prosemirror-client-Id',
      onStepsAdded: jest.fn(),
    };

    await catchupv2(options);
    expect(options.onStepsAdded).toHaveBeenCalledTimes(1);
    expect(options.onStepsAdded).toHaveBeenCalledWith({
      steps: [step1, step2],
      version: 3,
    });
    expect(options.updateMetadata).toHaveBeenCalledTimes(1);
    expect(options.updateMetadata).toBeCalledWith(newMetadata);
  });

  it('Should send error analytics event for fetchCatchupv2 failing', async () => {
    const error = new Error('fake error');
    const options: Catchupv2Options = {
      getCurrentPmVersion: jest.fn().mockReturnValue(1),
      fetchCatchupv2: jest.fn().mockRejectedValueOnce(error),
      updateMetadata: jest.fn(),
      analyticsHelper: new AnalyticsHelper('fake-document-ari'),
      clientId: 'some-random-prosemirror-client-Id',
      onStepsAdded: jest.fn(),
    };

    const sendErrorEventSpy = jest.spyOn(
      AnalyticsHelper.prototype,
      'sendErrorEvent',
    );

    try {
      await catchupv2(options);
    } catch (err) {
      expect(options.fetchCatchupv2).toBeCalledWith(
        1,
        'some-random-prosemirror-client-Id',
      );
      expect(sendErrorEventSpy).toBeCalledWith(
        error,
        'Error while fetching catchupv2 from server',
      );
    }
  });
});
