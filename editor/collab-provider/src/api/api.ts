import type { Config } from '../types';
import { getProduct, getSubProduct, createLogger } from '../helpers/utils';
import type { Channel } from '../channel';
import type { DocumentService } from '../document/document-service';
import { getActiveTraceHttpRequestHeaders } from '@atlaskit/react-ufo/experience-trace-id-context';

const logger = createLogger('Api', 'blue');

interface Step {
	stepType: string;
}

class AddCommentError extends Error {
	status: number;
	meta: unknown;

	constructor(message: string, status: number, meta?: unknown) {
		super(message);
		this.name = 'AddCommentError';
		this.status = status;
		this.meta = meta;
	}
}

/**
 * We create this API component, and export it under collab provider (e.g. provider.api.sendComment())
 * From a design perspective, this makes it more disitinctive, and less confusing.
 * Collab provider follows a state machine philosophy, whereas this new component does CRUD function calls
 * In future we can add to this api class without adding complexity to provider
 *
 */
export class Api {
	private readonly config: Config;
	private documentService: DocumentService;
	private readonly channel: Channel;

	constructor(config: Config, documentService: DocumentService, channel: Channel) {
		this.config = config;
		this.documentService = documentService;
		this.channel = channel;
	}

	async addComment(steps: Step[]): Promise<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		message: any;
	}> {
		const stepVersion = this.documentService.getCurrentPmVersion();

		try {
			const response = await this.submitComment(steps, stepVersion);
			const status = response.status;
			const { message, meta } = await response.json();

			// If the HTTP status code is 201, then the operation was successful
			if (status === 201) {
				logger(`NCS response: ${message}`);
				return { message };
			}
			// If the HTTP status code is between 400 and 499, then there was a client error
			if (status >= 400 && status <= 499) {
				logger(`NCS error meta: ${JSON.stringify(meta)}`);
				// Include details in error response
				throw new AddCommentError(
					`Failed to add comment - Client error: ${message}`,
					status,
					JSON.stringify(meta),
				);
			}
			// If the code execution reaches this point, then there was a server error
			throw new AddCommentError(`Failed to add comment - Server error`, status);
		} catch (err) {
			if (err instanceof AddCommentError) {
				throw err;
			} else {
				throw new Error(`Error submitting comment: ${err}`);
			}
		}
	}

	private submitComment = async (steps: Step[], version: number): Promise<Response> => {
		const reqBody = JSON.stringify({
			productId: 'ccollab',
			version,
			steps,
		});

		const url = `${this.config.url}/document/${encodeURIComponent(
			this.config.documentAri,
		)}/comment`;
		logger(`Request url: `, url);

		const tracingHeaders = getActiveTraceHttpRequestHeaders(url);

		const fetchOptions: RequestInit = {
			credentials: 'include',
			headers: {
				...(this.config.permissionTokenRefresh
					? {
						'x-token': await this.channel.getChannelToken(),
					}
					: {}),
				'x-product': getProduct(this.config.productInfo),
				'x-subproduct': getSubProduct(this.config.productInfo),
				'Content-Type': 'application/json',
				...tracingHeaders,
			},
			method: 'POST',
			body: reqBody,
		};
		return await fetch(url, fetchOptions);
	};
}
