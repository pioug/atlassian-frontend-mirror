import type {
  AISummaryServiceConfig,
  AISummaryServiceProps,
  AISummaryServiceInt,
  AISummaryState,
  StreamMessage,
  StateSetter,
  PostAgentPayload,
  SummaryStyle,
} from './types';
import { readStream, addPath } from './utils';

export class AISummaryService implements AISummaryServiceInt {
  public state: AISummaryState = {
    content: '',
    status: 'ready',
  };
  private config: AISummaryServiceConfig;
  private url: string;
  private subscribedStateSetters = new Set<StateSetter>();

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
  }

  private fetchStream = async <T>(summaryStyle: SummaryStyle) => {
    const payload: PostAgentPayload = {
      recipient_agent_named_id: 'summary_agent',
      agent_input: {
        urls: [this.url],
        summary_style: summaryStyle,
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
    return readStream<T>(response);
  };

  public async summariseUrl(summaryStyle: SummaryStyle = 'short') {
    this.state = {
      ...this.state,
      status: 'loading',
    };

    for (const subscriber of this.subscribedStateSetters) {
      subscriber(this.state);
    }

    const stream = await this.fetchStream<StreamMessage>(summaryStyle);

    let bufferContent = '';
    for await (const chunk of stream) {
      if (chunk.type === 'ANSWER_PART') {
        bufferContent += chunk.message.content;

        for (const subscriber of this.subscribedStateSetters) {
          subscriber({ ...this.state, content: bufferContent });
        }
      }
    }

    this.state = {
      status: 'done',
      content: bufferContent,
    };

    for (const subscriber of this.subscribedStateSetters) {
      subscriber(this.state);
    }
  }

  public subscribe(stateSetter: StateSetter) {
    this.subscribedStateSetters.add(stateSetter);
    return () => {
      this.subscribedStateSetters.delete(stateSetter);
    };
  }
}
