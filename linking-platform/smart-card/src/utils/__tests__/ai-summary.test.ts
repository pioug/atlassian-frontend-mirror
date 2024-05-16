import { type JsonLd } from 'json-ld-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
  CONTENT_URL_ACCEPTABLE_USE_POLICY,
  CONTENT_URL_AI_TROUBLESHOOTING,
} from '../../constants';
import { messages } from '../../messages';
import { mockConfluenceResponse } from '../../view/HoverCard/__tests__/__mocks__/mocks';
import { getAISummaryErrorMessage, getIsAISummaryEnabled } from '../ai-summary';

describe('getIsAISummaryEnabled', () => {
  const getMockResponse = (meta: Partial<JsonLd.Meta.BaseMeta> = {}) =>
    ({
      ...mockConfluenceResponse,
      meta: {
        ...mockConfluenceResponse.meta,
        ...meta,
      },
    } as JsonLd.Response);

  describe('returns false when AI is disabled', () => {
    const response = getMockResponse({ supportedFeature: ['AISummary'] });

    ffTest(
      'platform.linking-platform.smart-card.hover-card-ai-summaries',
      () => {
        const isAISummaryEnabled = getIsAISummaryEnabled(false, response);
        expect(isAISummaryEnabled).toBe(false);
      },
      () => {
        const isAISummaryEnabled = getIsAISummaryEnabled(false, response);
        expect(isAISummaryEnabled).toBe(false);
      },
    );
  });

  describe('when AI is enabled', () => {
    describe('returns true when AISummary is included in supportedFeatures', () => {
      const response = getMockResponse({ supportedFeature: ['AISummary'] });

      ffTest(
        'platform.linking-platform.smart-card.hover-card-ai-summaries',
        () => {
          const isAISummaryEnabled = getIsAISummaryEnabled(true, response);
          expect(isAISummaryEnabled).toBe(true);
        },
        () => {
          const isAISummaryEnabled = getIsAISummaryEnabled(true, response);
          expect(isAISummaryEnabled).toBe(false);
        },
      );
    });

    describe('returns false when AISummary is not included in supportedFeatures', () => {
      const response = getMockResponse({ supportedFeature: [] });

      ffTest(
        'platform.linking-platform.smart-card.hover-card-ai-summaries',
        () => {
          const isAISummaryEnabled = getIsAISummaryEnabled(true, response);
          expect(isAISummaryEnabled).toBe(false);
        },
      );
    });

    describe('returns false when link does not have supportedFeatures', () => {
      const response = getMockResponse();

      ffTest(
        'platform.linking-platform.smart-card.hover-card-ai-summaries',
        () => {
          const isAISummaryEnabled = getIsAISummaryEnabled(true, response);
          expect(isAISummaryEnabled).toBe(false);
        },
      );
    });
  });
});

describe('getAISummaryErrorMessage', () => {
  it('returns default error message', () => {
    const message = getAISummaryErrorMessage();

    expect(message).toEqual({
      message: messages.ai_summary_error_generic,
      url: CONTENT_URL_AI_TROUBLESHOOTING,
    });
  });

  it('returns acceptable violation error message', () => {
    const message = getAISummaryErrorMessage('ACCEPTABLE_USE_VIOLATIONS');

    expect(message).toEqual({
      message: messages.ai_summary_error_acceptable_use_violation,
      url: CONTENT_URL_ACCEPTABLE_USE_POLICY,
    });
  });

  it('returns HIPAA content error message', () => {
    const message = getAISummaryErrorMessage('HIPAA_CONTENT_DETECTED');

    expect(message).toEqual({
      message: messages.ai_summary_error_hipaa_content_detected,
    });
  });

  it('returns exceeding context length error message', () => {
    const message = getAISummaryErrorMessage('EXCEEDING_CONTEXT_LENGTH_ERROR');

    expect(message).toEqual({
      message: messages.ai_summary_error_exceeding_context_length_error,
    });
  });
});
