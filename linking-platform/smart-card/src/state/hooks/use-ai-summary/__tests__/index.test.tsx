import React from 'react';
import TestRenderer from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';
import { renderHook } from '@testing-library/react-hooks';
import uuid from 'uuid';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import '@atlaskit/link-test-helpers/jest';
import { useAISummary } from '../index';
import { AISummariesStore } from '../ai-summary-service/store';
import { ANALYTICS_CHANNEL } from '../../../../utils/analytics';
import * as ufo from '../../../analytics/ufoExperiences';
import { readStream } from '../ai-summary-service/readStream';

jest.mock('uuid', () => ({
  ...jest.requireActual('uuid'),
  __esModule: true,
  default: jest.fn().mockReturnValue('some-uuid-1'),
}));

jest.mock('../ai-summary-service/readStream', () => ({
  readStream: jest.fn(),
}));

const { act } = TestRenderer;

const successMock = {
  type: 'ANSWER_PART',
  message: { content: 'something' },
};

const errorMock = {
  type: 'ERROR',
  message: {
    message_template: 'NETWORK_ERROR',
    content: 'Error answering prompt',
    status_code: 500,
    error: 'The server has encountered trouble with some components',
  },
};

const unexpectedErrorMock = {
  type: 'ERROR',
  message: {
    message_template: 'RANDOM-BLAH-1234',
    content: 'Error answering prompt',
    status_code: 500,
    error: 'The server has encountered trouble with some components',
  },
};

async function* mockReadStreamSuccess() {
  yield successMock;
}

async function* mockReadStreamError() {
  yield errorMock;
}

async function* mockReadStreamErrorMulti() {
  yield successMock;
  yield errorMock;
}

async function* mockReadStreamErrorUnexpectedMulti() {
  yield successMock;
  yield unexpectedErrorMock;
}

const mockUseAISummaryProps = { url: 'test-url', ari: 'test-ari' };

describe('useAISummary', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    AISummariesStore.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not try to initiate AI Summary Service when URL is an empty string', async () => {
    const storeSetSpy = jest.spyOn(AISummariesStore, 'set');

    renderHook(() =>
      useAISummary({
        url: '',
      }),
    );

    expect(storeSetSpy).toHaveBeenCalledTimes(0);
    storeSetSpy.mockRestore();
  });

  it('sets status on successful response', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
    (readStream as jest.Mock).mockImplementationOnce(mockReadStreamSuccess);

    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps));
    await act(async () => {
      await result.current.summariseUrl();
    });

    expect(result.current.state?.status).toBe('done');
    expect(result.current.state?.content).toBe('something');
  });

  it('sets status on summariseUrl error response', async () => {
    fetchMock.mockRejectOnce(new Error('foo'));
    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps));
    await act(async () => {
      await result.current.summariseUrl();
    });
    expect(result.current.state?.status).toBe('error');
    expect(result.current.state?.content).toBe('');
  });

  it('sets status on summariseUrl successful response with error message', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
    (readStream as jest.Mock).mockImplementationOnce(mockReadStreamError);

    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps));
    await act(async () => {
      await result.current.summariseUrl();
    });
    expect(result.current.state?.status).toBe('error');
    expect(result.current.state?.content).toBe('');
    expect(result.current.state?.error).toBe('NETWORK_ERROR');
  });

  it('sets status on summariseUrl successful response with error message mid stream', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
    (readStream as jest.Mock).mockImplementationOnce(mockReadStreamErrorMulti);

    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps));
    await act(async () => {
      await result.current.summariseUrl();
    });
    expect(result.current.state?.status).toBe('error');
    expect(result.current.state?.content).toBe('');
    expect(result.current.state?.error).toBe('NETWORK_ERROR');
  });

  it('sets error on error mid stream with an unexpected error message', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
    (readStream as jest.Mock).mockImplementationOnce(
      mockReadStreamErrorUnexpectedMulti,
    );

    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps));
    await act(async () => {
      await result.current.summariseUrl();
    });
    expect(result.current.state?.status).toBe('error');
    expect(result.current.state?.content).toBe('');
    expect(result.current.state?.error).toBe('UNEXPECTED');
  });

  it('sends summary success event', async () => {
    const experienceId = 'ufo-experience-success-id';
    const onEventSpy = jest.fn();
    const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
    const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');

    uuid.mockReturnValueOnce(experienceId);
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
    (readStream as jest.Mock).mockImplementationOnce(mockReadStreamSuccess);

    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps), {
      wrapper: ({ children }) => (
        <AnalyticsListener onEvent={onEventSpy} channel={ANALYTICS_CHANNEL}>
          {children}
        </AnalyticsListener>
      ),
    });

    await act(async () => {
      await result.current.summariseUrl();
    });

    expect(onEventSpy).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          actionSubject: 'summary',
          action: 'success',
        },
      },
      ANALYTICS_CHANNEL,
    );
    expect(ufoStartSpy).toBeCalledTimes(1);
    expect(ufoStartSpy).toBeCalledWith('smart-link-ai-summary', experienceId);
    expect(ufoSucceedSpy).toBeCalledTimes(1);
    expect(ufoSucceedSpy).toBeCalledWith('smart-link-ai-summary', experienceId);
  });

  it('sends summary failed event', async () => {
    const experienceId = 'ufo-experience-failed-id';
    const onEventSpy = jest.fn();
    const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
    const ufoFailSpy = jest.spyOn(ufo, 'failUfoExperience');

    uuid.mockReturnValueOnce(experienceId);
    fetchMock.mockRejectOnce(new Error('foo'));

    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps), {
      wrapper: ({ children }) => (
        <AnalyticsListener onEvent={onEventSpy} channel={ANALYTICS_CHANNEL}>
          {children}
        </AnalyticsListener>
      ),
    });
    await act(async () => {
      await result.current.summariseUrl();
    });

    expect(onEventSpy).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          actionSubject: 'summary',
          action: 'failed',
          attributes: {
            reason: 'UNEXPECTED',
            isSloError: true
          },
        },
      },
      ANALYTICS_CHANNEL,
    );

    expect(ufoStartSpy).toBeCalledTimes(1);
    expect(ufoStartSpy).toBeCalledWith('smart-link-ai-summary', experienceId);
    expect(ufoFailSpy).toBeCalledTimes(1);
    expect(ufoFailSpy).toBeCalledWith('smart-link-ai-summary', experienceId);
  });
  it(`sets isSloError attribute to false when reason is HIPAA_CONTENT_DETECTED`, async () => {
    const onEventSpy = jest.fn();

    fetchMock.mockRejectOnce(new Error('HIPAA_CONTENT_DETECTED'));

    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps), {
      wrapper: ({ children }) => (
        <AnalyticsListener onEvent={onEventSpy} channel={ANALYTICS_CHANNEL}>
          {children}
        </AnalyticsListener>
      ),
    });
    await act(async () => {
      await result.current.summariseUrl();
    });

    expect(onEventSpy).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          actionSubject: 'summary',
          action: 'failed',
          attributes: {
            reason: 'HIPAA_CONTENT_DETECTED',
            isSloError: false
          },
        },
      },
      ANALYTICS_CHANNEL,
    );
  });

  it(`sets isSloError attribute to false when reason is ACCEPTABLE_USE_VIOLATIONS`, async () => {
    const onEventSpy = jest.fn();

    fetchMock.mockRejectOnce(new Error('ACCEPTABLE_USE_VIOLATIONS'));

    const { result } = renderHook(() => useAISummary(mockUseAISummaryProps), {
      wrapper: ({ children }) => (
        <AnalyticsListener onEvent={onEventSpy} channel={ANALYTICS_CHANNEL}>
          {children}
        </AnalyticsListener>
      ),
    });
    await act(async () => {
      await result.current.summariseUrl();
    });

    expect(onEventSpy).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          actionSubject: 'summary',
          action: 'failed',
          attributes: {
            reason: 'ACCEPTABLE_USE_VIOLATIONS',
            isSloError: false
          },
        },
      },
      ANALYTICS_CHANNEL,
    );
  });
});
