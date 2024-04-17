import { AISummaryService } from '../';
import {
  StreamAnswerPart,
  StreamResponse,
  AISummaryServiceConfig,
} from '../types';
import { readStream } from '../readStream';
import { streamAnswer } from './__mocks__/streamAnswer';
import type { ProductType } from '@atlaskit/linking-common';

const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

/**
 * Generator function to simulate a stream of chunks from AI Mate. Used to mock the readStream function.
 */
function* streamAnswerGenerator() {
  for (let value of streamAnswer) {
    yield value;
  }
}

jest.mock('../readStream', () => ({ readStream: jest.fn() }));

const url = 'https://url-to-summarise/';

const aiSummaryServiceDefaultConfig: AISummaryServiceConfig = {
  baseUrl: '/gateway/api/assist',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'x-experience-id': 'smart-link',
    'x-product': 'confluence',
  },
};

const customConfig = {
  url: url,
  ari: 'test-ari',
  baseUrl: 'custom/base/url',
  headers: { 'custom-header': 'custom-value' },
  product: 'BITBUCKET' as ProductType,
};

describe('AI Summary Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Fetch the AI response with default config', () => {
    //initiate with only one required config - url
    const aiSummaryService = new AISummaryService({ url });
    (aiSummaryService as any).fetchStream();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      aiSummaryServiceDefaultConfig.baseUrl + '/chat/v1/invoke_agent/stream',
      expect.objectContaining({
        method: 'POST',
        headers: aiSummaryServiceDefaultConfig.headers,
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
  });

  it('Fetch the AI response with custom config', () => {
    //initiate with a custom config
    const aiSummaryService = new AISummaryService(customConfig);

    //set a custom summary style
    (aiSummaryService as any).fetchStream();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      customConfig.baseUrl + '/chat/v1/invoke_agent/stream',
      expect.objectContaining({
        method: 'POST',
        headers: {
          ...aiSummaryServiceDefaultConfig.headers,
          ...customConfig.headers,
          'x-product': customConfig.product.toLowerCase(),
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
});
