import type { EnvironmentsKeys, ProductType } from '@atlaskit/linking-common';

export interface AISummaryServiceInt {
	state: AISummaryState;
	subscribe: (stateSetter: StateSetter) => () => void;
	summariseUrl: () => Promise<AISummaryState>;
}
export class ChunkProcessingError extends Error {
	constructor(error: any) {
		super(error);
	}
}

export type AISummaryServiceProps = {
	/**
	 * we should always include the ARI if possible
	 */
	ari?: string;
	baseUrl?: string;
	envKey?: EnvironmentsKeys;
	locale?: string;
	onError?: (id: string, reason?: string) => void;
	onStart?: (id: string) => void;
	onSuccess?: (id: string) => void;
	product?: ProductType;
	url: string;
};

export type AISummaryServiceConfig = {
	headers: Record<string, string>;
	requestUrl: string;
};

export type AISummaryStatus = 'ready' | 'loading' | 'error' | 'done';

export type PostAgentPayload = {
	agent_input_context: AgentInputContext;
	ai_feature_input?: FeatureInputContext;
	/**
	 * Which agent in `assistance_service` to use.
	 */
	recipient_agent_named_id: 'smartlink_summary_agent';
	user_intent?: string;
};

export type AgentInputContext = {
	content_ari?: string;
	content_url: string;
	locale?: string;
	prompt_id: PromptId;
	summary_output_mimetype?: SummaryOutputMimeType;
};

export type FeatureInputContext = {
	content_ari?: string;
	content_url: string;
	locale?: string;
};

export type PromptId = 'smart_links';

export type SummaryOutputMimeType = 'text/adf' | 'text/markdown' | 'text/json';

export const errorMessages = [
	'NETWORK_ERROR',
	'NO_ANSWER',
	'RATE_LIMIT',
	'NO_AGENT',
	'PLUGIN_ERRORED',
	'OPENAI_RATE_LIMIT_USER_ABUSE',
	'ACCEPTABLE_USE_VIOLATIONS',
	'AI_DISABLED',
	'UNEXPECTED',
	'HIPAA_CONTENT_DETECTED',
	'EXCEEDING_CONTEXT_LENGTH_ERROR',
] as const;

export type ErrorMessage = (typeof errorMessages)[number];

export type AISummaryState = {
	content: string;
	error?: string;
	status: AISummaryStatus;
};

export type StateSetter = (state: AISummaryState) => any;

export type StreamMessage = StreamTrace | StreamAnswerPart | StreamResponse | StreamError;

export type StreamResponse = {
	message: {
		content: string;
		message: Message;
	};
	metadata?: {
		request_id?: string;
	};
	millisOffset?: number;
	type: 'FINAL_RESPONSE';
};

export type StreamError = {
	message: {
		content: string;
		message_template?: ErrorMessage;
		status_code?: number;
	};
	metadata: null | {
		error_message?: string;
		request_id?: string;
		timeout?: number;
	};
	millisOffset: number;
	type: 'ERROR';
};

export type StreamAnswerPart = {
	message: { content: string; role: 'ASSISTANT' };
	metadata?: {
		request_id?: string;
		run_id?: string;
	};
	millisOffset: number;
	type: 'ANSWER_PART';
};

export type StreamTrace = {
	message: {
		content: string;
		message_template: string;
		user_query: string;
	};
	metadata?: {
		plugin_input?: string;
		plugin_name?: string;
		request_id: string;
		run_id: string;
	};
	millisOffset: number;
	type: 'TRACE';
};

export type Usage = {
	model_usage: {
		[key: string]: ModelUsage;
	};
	total: ModelUsage;
};

export type ModelUsage = {
	completion_tokens: number;
	duration: number;
	prompt_tokens: number;
	request_count: number;
	total_cost: number;
	total_tokens: number;
};

export type Metadata = {
	// Unified Help Only
	bm25Variant?: string;
	confidenceScore?: number;
	isFallbackMessage?: boolean;
	originalQuery?: string;
	semanticSearchLocationVariant?: string;
	semanticSearchVariant?: string;
};

export type Message = {
	appendices?: Appendices;
	author?: {
		actor_type: string;
		ari: string | null;
		id: string;
		name: string;
		named_id: string;
	};
	author_id?: string;
	content: string;
	content_mime_type: ContentType;
	conversation_channel_id?: string;
	experience_id: ExperienceId;
	id: number;
	message_metadata?: Metadata;
	plugin_invocations: PluginInvocationMessage[];
	role: Role;
	sources?: Sources;
	time_created: string;
	user_ari: string;
};

export type ContentType = 'text/markdown';

export type ExperienceId = 'ai-mate' | 'smart-link';

export type Role = 'ASSISTANT';

export type Appendices = Array<Appendix>;

export type Appendix = {
	appendix_sources?: Sources;
	content: string;
	type: 'requestForm' | 'helpDesk';
};

export type Sources = Array<Source>;

export type Source = {
	ari: string;
	id: number;
	lastModified: string;
	message_id: number;
	title: string;
	type: string;
	url: string;
};

export type PluginInvocation = {
	id: number | null;
	plugin_description: string | null;
	plugin_error_message: string | null;
	plugin_extra_info: string | null;
	plugin_input: string | null;
	plugin_invocation_duration: number | null;
	plugin_invocation_id: string | null;
	plugin_invocation_status: `PLUGIN_STARTED` | `PLUGIN_FINISHED` | null;
	plugin_invocation_time: string | null;
	plugin_name: string | null;
	plugin_output: string | null;
};

export type PluginInvocationMessage = PluginInvocation & {
	message_id: number | null;
};
