import uuid from 'uuid';
import {
  type AISummaryServiceConfig,
  type AISummaryServiceProps,
  type AISummaryServiceInt,
  type AISummaryState,
  type StreamMessage,
  type StateSetter,
  type PostAgentPayload,
  type SummaryStyle,
  errorMessages,
  ErrorMessage,
} from './types';
import { readStream, addPath } from './utils';

export class AISummaryService implements AISummaryServiceInt {
  public state: AISummaryState = {
    content: '',
    status: 'ready',
  };
  private config: AISummaryServiceConfig;
  private url: string;
  private ari?: string;
  private subscribedStateSetters = new Set<StateSetter>();

  private onStart?: AISummaryServiceProps['onStart'];
  private onSuccess?: AISummaryServiceProps['onSuccess'];
  private onError?: AISummaryServiceProps['onError'];

  constructor(props: AISummaryServiceProps) {
    const defaultConfig: AISummaryServiceConfig = {
      baseUrl: '/gateway/api/assist',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'x-experience-id': 'smart-link',
        //TODO: EDM-9337 - Remove the hardcoded Confluence product name and find a way to populate the product name here
        'x-product': props.product || 'confluence',
      },
    };

    this.config = {
      baseUrl: props.baseUrl || defaultConfig.baseUrl,
      headers: {
        ...(props.headers || defaultConfig.headers),
      },
    };

    this.url = props.url;
    this.ari = props.ari;

    this.onStart = props.onStart;
    this.onSuccess = props.onSuccess;
    this.onError = props.onError;
  }

  private fetchStream = async <T>(summaryStyle: SummaryStyle) => {
    const payload: PostAgentPayload = {
      recipient_agent_named_id: 'summary_agent',
      agent_input_context: {
        content_url: this.url,
        content_ari: this.ari,
        summary_style: summaryStyle,
        summary_output_mimetype: 'text/markdown',
      },
    };

    const options = {
      method: 'POST',
      headers: this.config.headers,
      body: JSON.stringify(payload),
    };

    const path = 'chat/v1/invoke_agent/stream';
    const requestUrl = addPath(this.config.baseUrl, path);

    const response = await fetch(requestUrl, options);
    if (!response.ok || response.status >= 400) {
      throw new Error(
        `Status: ${response.status}\n URL: ${this.url}\n StatusText ${response.statusText}`,
      );
    } else {
      return readStream<T>(response);
    }
  };

  public async summariseUrl(summaryStyle: SummaryStyle = 'medium') {
    this.state = {
      status: 'loading',
      content: '',
    };

    for (const subscriber of this.subscribedStateSetters) {
      subscriber(this.state);
    }

    const id = uuid();
    try {
      this.onStart?.(id);

      const stream = await this.fetchStream<StreamMessage>(summaryStyle);

      let bufferContent = '';
      for await (const chunk of stream) {
        if (chunk.type === 'ANSWER_PART') {
          bufferContent += chunk.message.content;

          for (const subscriber of this.subscribedStateSetters) {
            subscriber({ ...this.state, content: bufferContent });
          }
        }

        //if AI Mate service returns cached summary we get the summary text in one piece as the last message
        if (chunk.type === 'FINAL_RESPONSE') {
          bufferContent = chunk.message.message.content;
        }

        if (chunk.type === 'ERROR') {
          throw new Error(chunk?.message?.message_template);
        }
      }

      this.onSuccess?.(id);

      this.state = {
        status: 'done',
        content: bufferContent,
      };
    } catch (err) {
      let message =
        err instanceof Error && this.isExpectedError(err.message)
          ? err.message
          : 'UNEXPECTED';

      this.onError?.(id, message);
      this.state = { status: 'error', content: '', error: message };
    }

    for (const subscriber of this.subscribedStateSetters) {
      subscriber(this.state);
    }
  }

  private isExpectedError(value: unknown): value is ErrorMessage {
    return typeof value === 'string' && errorMessages.some((a) => a === value);
  }

  public subscribe(stateSetter: StateSetter) {
    this.subscribedStateSetters.add(stateSetter);
    return () => {
      this.subscribedStateSetters.delete(stateSetter);
    };
  }
}
