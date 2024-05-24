import { AISummaryService } from '../';
import {
  type StreamAnswerPart,
  type StreamResponse,
  type StreamError,
  type AISummaryServiceProps,
} from '../types';
import { readStream } from '../readStream';
import { streamAnswer, streamErrorAnswer } from './__mocks__/streamAnswers';
import type { ProductType } from '@atlaskit/linking-common';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { type getXProductHeaderValue } from '../utils';

const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

/**
 * Generator function to simulate a stream of chunks from AI Mate. Used to mock the readStream function.
 */
function* streamAnswerGenerator() {
  for (let value of streamAnswer) {
    yield value;
  }
}

function* streamErrorAnswerGenerator() {
  for (let value of streamErrorAnswer) {
    yield value;
  }
}

jest.mock('../readStream', () => ({ readStream: jest.fn() }));

const url = 'https://url-to-summarise/';

const aiSummaryServiceDefaultHeadersConfig = {
  'Content-Type': 'application/json;charset=UTF-8',
  'x-experience-id': 'smart-link',
  'x-product': 'confluence',
};

const customConfig: AISummaryServiceProps = {
  url: url,
  ari: 'test-ari',
  baseUrl: 'https://custom-base-url/',
  headers: { 'custom-header': 'custom-value' },
  product: 'BITBUCKET' as ProductType,
};

describe('AI Summary Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch the AI response with default config', () => {
    ffTest(
      'platform.linking-platform.smart-card.ai-summary-service-base-url',
      () => {
        //initiate with only one required config - url
        const aiSummaryService = new AISummaryService({ url });
        (aiSummaryService as any).fetchStream();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          (aiSummaryService as any).config.requestUrl,
          expect.objectContaining({
            method: 'POST',
            headers: aiSummaryServiceDefaultHeadersConfig,
            body: JSON.stringify({
              recipient_agent_named_id: 'summary_agent',
              agent_input_context: {
                content_url: url,
                content_ari: undefined,
                prompt_id: 'smart_links',
                summary_output_mimetype: 'text/markdown',
              },
            }),
          }),
        );
      },
      () => {
        //initiate with only one required config - url
        const aiSummaryService = new AISummaryService({ url });
        (aiSummaryService as any).fetchStream();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          '/gateway/api/assist/chat/v1/invoke_agent/stream',
          expect.objectContaining({
            method: 'POST',
            headers: aiSummaryServiceDefaultHeadersConfig,
            body: JSON.stringify({
              recipient_agent_named_id: 'summary_agent',
              agent_input_context: {
                content_url: url,
                content_ari: undefined,
                prompt_id: 'smart_links',
                summary_output_mimetype: 'text/markdown',
              },
            }),
          }),
        );
      },
    );
  });

  describe('Fetch the AI Summary content with custom config', () => {
    ffTest(
      'platform.linking-platform.smart-card.ai-summary-service-base-url',
      () => {
        const aiSummaryService = new AISummaryService(customConfig);
        (aiSummaryService as any).fetchStream();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          customConfig.baseUrl + 'assist/chat/v1/invoke_agent/stream',
          expect.objectContaining({
            method: 'POST',
            credentials: 'include',
            headers: {
              ...aiSummaryServiceDefaultHeadersConfig,
              ...customConfig.headers,
              'x-product': customConfig.product?.toLowerCase(),
            },
            body: JSON.stringify({
              recipient_agent_named_id: 'summary_agent',
              agent_input_context: {
                content_url: url,
                content_ari: customConfig.ari,
                prompt_id: 'smart_links',
                summary_output_mimetype: 'text/markdown',
              },
            }),
          }),
        );
      },
      () => {
        const aiSummaryService = new AISummaryService(customConfig);
        (aiSummaryService as any).fetchStream();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          '/gateway/api/assist/chat/v1/invoke_agent/stream',
          expect.objectContaining({
            method: 'POST',
            headers: {
              ...aiSummaryServiceDefaultHeadersConfig,
              ...customConfig.headers,
              'x-product': customConfig.product?.toLowerCase(),
            },
            body: JSON.stringify({
              recipient_agent_named_id: 'summary_agent',
              agent_input_context: {
                content_url: url,
                content_ari: customConfig.ari,
                prompt_id: 'smart_links',
                summary_output_mimetype: 'text/markdown',
              },
            }),
          }),
        );
      },
    );
  });

  describe('Fetch the AI Summary content with staging env key', () => {
    ffTest(
      'platform.linking-platform.smart-card.ai-summary-service-base-url',
      () => {
        const aiSummaryService = new AISummaryService({ url, envKey: 'stg' });
        (aiSummaryService as any).fetchStream();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          'https://pug.jira-dev.com/gateway/api/assist/chat/v1/invoke_agent/stream',
          expect.objectContaining({
            credentials: 'include',
          }),
        );
      },
      () => {
        const aiSummaryService = new AISummaryService({ url, envKey: 'stg' });
        (aiSummaryService as any).fetchStream();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          '/gateway/api/assist/chat/v1/invoke_agent/stream',
          expect.not.objectContaining({
            credentials: 'include',
          }),
        );
      },
    );
  });

  describe('Fetch the AI Summary content with different product types', () => {
    it('Should use confluence as the default product if not provided', () => {
      //initiate with only one required config - url
      const aiSummaryService = new AISummaryService({
        url,
        product: undefined,
      });
      (aiSummaryService as any).fetchStream();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        (aiSummaryService as any).config.requestUrl,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json;charset=UTF-8',
            'x-experience-id': 'smart-link',
            'x-product': 'confluence',
          }),
        }),
      );
    });

    test.each([
      'CONFLUENCE',
      'ATLAS',
      'BITBUCKET',
      'TRELLO',
      'ELEVATE',
    ] satisfies ProductType[])(
      'Should maintain the same x-product header for %s',
      (productType) => {
        const aiSummaryService = new AISummaryService({
          url,
          product: productType,
        });
        (aiSummaryService as any).fetchStream();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          (aiSummaryService as any).config.requestUrl,
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json;charset=UTF-8',
              'x-experience-id': 'smart-link',
              'x-product': productType.toLowerCase(),
            }),
          }),
        );
      },
    );

    // The difference cases based on `AiMateJiraXProduct`
    test.each([
      ['JSM', 'JSM'],
      ['JSW', 'JIRA-SOFTWARE'],
      ['JWM', 'JIRA-CORE'],
      ['JPD', 'JPD'],
    ] satisfies Array<
      [ProductType, ReturnType<typeof getXProductHeaderValue>]
    >)(
      "ProductType '%s' should be converted to '%s' for AI Mate x-product header",
      (originalProductType, convertedProduct) => {
        const aiSummaryService = new AISummaryService({
          url,
          product: originalProductType as ProductType,
        });
        (aiSummaryService as any).fetchStream();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          (aiSummaryService as any).config.requestUrl,
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json;charset=UTF-8',
              'x-experience-id': 'smart-link',
              'x-product': convertedProduct.toLowerCase(),
            }),
          }),
        );
      },
    );
  });

  it('should update state with the correct message content based on the FINAL_RESPONSE', async () => {
    (readStream as jest.Mock).mockImplementation(streamAnswerGenerator);
    const aiSummaryService = new AISummaryService({ url });
    await aiSummaryService.summariseUrl();

    expect(aiSummaryService.state.status).toEqual('done');
    const finalResponseContent = (
      streamAnswer.find(
        (msg) => msg.type === 'FINAL_RESPONSE',
      ) as StreamResponse
    ).message.message.content;
    expect(aiSummaryService.state.content).toEqual(finalResponseContent);
  });

  it('should update state with the correct error type', async () => {
    (readStream as jest.Mock).mockImplementation(streamErrorAnswerGenerator);
    const errorResponseMessageTemplate = (
      streamErrorAnswer.find((msg) => msg.type === 'ERROR') as StreamError
    ).message.message_template;

    const aiSummaryService = new AISummaryService({ url });
    await aiSummaryService.summariseUrl();

    expect(aiSummaryService.state.status).toEqual('error');
    expect(aiSummaryService.state.error).toEqual(errorResponseMessageTemplate);
  });

  it('should update subscribers after every stream chunk', async () => {
    (readStream as jest.Mock).mockImplementation(streamAnswerGenerator);
    const subscriber = jest.fn();

    const aiSummaryService = new AISummaryService({ url });
    aiSummaryService.subscribe(subscriber);
    await aiSummaryService.summariseUrl();

    //answer parts + final response - trace message + final update = streamAnswer.length
    expect(subscriber).toHaveBeenCalledTimes(streamAnswer.length);
  });

  it('should not return error and should update state even if no intermediate ANSWER_PART stream parts are received', async () => {
    const streamAnswerWithoutAnswerPart = streamAnswer.filter(
      (msg) => msg.type !== 'ANSWER_PART',
    );
    (readStream as jest.Mock).mockImplementation(function* () {
      yield* streamAnswerWithoutAnswerPart;
    });

    const aiSummaryService = new AISummaryService({ url });
    await aiSummaryService.summariseUrl();

    expect(aiSummaryService.state.status).toEqual('done');
    const finalResponseContent = (
      streamAnswer.find(
        (msg) => msg.type === 'FINAL_RESPONSE',
      ) as StreamResponse
    ).message.message.content;
    expect(aiSummaryService.state).toEqual({
      content: finalResponseContent,
      status: 'done',
    });
  });

  it('should append in-progress content in multiple ANSWER_PART stream parts', async () => {
    (readStream as jest.Mock).mockImplementation(streamAnswerGenerator);

    const aiSummaryService = new AISummaryService({ url });
    const subscriber = jest.fn();
    aiSummaryService.subscribe(subscriber);

    await aiSummaryService.summariseUrl();

    const streamAnswerParts = streamAnswer.filter(
      (msg) => msg.type === 'ANSWER_PART',
    ) as StreamAnswerPart[];

    // After initial TRACE and first ANSWER_PART
    expect(subscriber).toHaveBeenCalledWith({
      status: 'loading',
      content: streamAnswerParts[0].message.content,
    });

    // After second ANSWER_PART
    expect(subscriber).toHaveBeenCalledWith({
      status: 'loading',
      content:
        streamAnswerParts[0].message.content +
        streamAnswerParts[1].message.content,
    });
  });

  it('Multiple subscribers to the AI Summary state update', () => {
    const aiSummaryService = new AISummaryService({ url });
    const subscriber_1 = jest.fn();
    const subscriber_2 = jest.fn();

    aiSummaryService.subscribe(subscriber_1);
    expect((aiSummaryService as any).subscribedStateSetters.size).toEqual(1);
    aiSummaryService.subscribe(subscriber_2);
    expect((aiSummaryService as any).subscribedStateSetters.size).toEqual(2);

    //start summarising and change the aiSummaryService internal state to 'loading'
    aiSummaryService.summariseUrl();
    expect(aiSummaryService.state.status).toEqual('loading');

    //should send an update to subscribers
    expect(subscriber_1).toHaveBeenCalledWith({
      status: 'loading',
      content: '',
    });
    expect(subscriber_2).toHaveBeenCalledWith({
      status: 'loading',
      content: '',
    });
  });

  it('Unsubscribe from the AI Summary state update', () => {
    const aiSummaryService = new AISummaryService({ url });

    const subscriber = jest.fn();
    const unsubscribe = aiSummaryService.subscribe(subscriber);

    expect((aiSummaryService as any).subscribedStateSetters.size).toEqual(1);
    unsubscribe();
    expect((aiSummaryService as any).subscribedStateSetters.size).toEqual(0);

    //start summarising and change the aiSummaryService internal state to 'loading'
    aiSummaryService.summariseUrl();
    expect(subscriber).not.toHaveBeenCalled();
  });

  it('should return state when summariseUrl is completed', async () => {
    (readStream as jest.Mock).mockImplementation(streamAnswerGenerator);

    const aiSummaryService = new AISummaryService({ url });
    const state = await aiSummaryService.summariseUrl();
    expect(state).toBe(aiSummaryService.state);
  });

  it('should return error state when summariseUrl is complete', async () => {
    (readStream as jest.Mock).mockImplementation(streamErrorAnswerGenerator);

    const aiSummaryService = new AISummaryService({ url });
    const state = await aiSummaryService.summariseUrl();

    expect(state).toBe(aiSummaryService.state);
  });
});
