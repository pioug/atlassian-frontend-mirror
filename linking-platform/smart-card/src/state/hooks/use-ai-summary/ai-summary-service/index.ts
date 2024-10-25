import uuid from 'uuid';

import { type EnvironmentsKeys, getBaseUrl } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { readStream } from './readStream';
import {
	type AISummaryServiceConfig,
	type AISummaryServiceInt,
	type AISummaryServiceProps,
	type AISummaryState,
	ChunkProcessingError,
	type PostAgentPayload,
	type StateSetter,
	type StreamMessage,
} from './types';
import { addPath, getXProductHeaderValue } from './utils';

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
		this.config = {
			requestUrl: this.getRequestUrl(props.envKey, props.baseUrl),
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'x-experience-id': 'smart-link',
				'x-product': getXProductHeaderValue(props.product)?.toLowerCase() || 'confluence',
			},
		};

		this.url = props.url;
		this.ari = props.ari;

		this.onStart = props.onStart;
		this.onSuccess = props.onSuccess;
		this.onError = props.onError;
	}

	private getRequestUrl = (envKey?: EnvironmentsKeys, baseUrlOverride?: string) => {
		const path = 'assist/chat/v1/invoke_agent/stream';

		if (baseUrlOverride || envKey) {
			const baseUrl = baseUrlOverride || getBaseUrl(envKey);
			return addPath(baseUrl, path);
		}

		return addPath('/gateway/api/', path);
	};

	private fetchStream = async <T>() => {
		const payload: PostAgentPayload = {
			recipient_agent_named_id: fg('platform-smart-card-use-ai-smartlink-summary-agent')
				? 'smartlink_summary_agent'
				: 'summary_agent',
			agent_input_context: {
				content_url: this.url,
				content_ari: this.ari,
				prompt_id: 'smart_links',
				summary_output_mimetype: 'text/markdown',
			},
		};

		const options = {
			method: 'POST',
			headers: this.config.headers,
			body: JSON.stringify(payload),
			credentials: 'include' as RequestCredentials,
		};

		const response = await fetch(this.config.requestUrl, options);

		if (!response.ok || response.status >= 400) {
			throw new Error(
				`Status: ${response.status}\n URL: ${this.url}\n StatusText ${response.statusText}`,
			);
		} else {
			return readStream<T>(response);
		}
	};

	public async summariseUrl() {
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

			const stream = await this.fetchStream<StreamMessage>();

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
					throw new ChunkProcessingError(chunk?.message?.message_template);
				}
			}

			this.onSuccess?.(id);

			this.state = {
				status: 'done',
				content: bufferContent,
			};
		} catch (err) {
			let message = err instanceof ChunkProcessingError ? err.message : 'UNEXPECTED';
			this.onError?.(id, message);
			this.state = { status: 'error', content: '', error: message };
		}

		for (const subscriber of this.subscribedStateSetters) {
			subscriber(this.state);
		}

		return this.state;
	}

	public subscribe(stateSetter: StateSetter) {
		this.subscribedStateSetters.add(stateSetter);
		return () => {
			this.subscribedStateSetters.delete(stateSetter);
		};
	}
}
