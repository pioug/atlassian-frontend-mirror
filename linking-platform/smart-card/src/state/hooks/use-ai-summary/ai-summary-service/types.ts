export interface AISummaryServiceInt {
  summariseUrl: () => Promise<void>;
  state: AISummaryState;
  subscribe: (stateSetter: StateSetter) => () => void;
}

export type AISummaryServiceProps = {
  baseUrl?: string;
  headers?: Record<string, string>;
  onError?: (id: string, reason?: string) => void;
  onStart?: (id: string) => void;
  onSuccess?: (id: string) => void;
  product?: ProductType;
  url: string;
};

export type AISummaryServiceConfig = {
  baseUrl: string;
  headers: Record<string, string>;
};

export type AISummaryStatus = 'ready' | 'loading' | 'error' | 'done';

export type ProductType =
  | 'confluence'
  | 'atlas'
  | 'jpd'
  | 'jsm'
  | 'jsw'
  | 'jwm'
  | 'bitbucket'
  | 'trello';

export type PostAgentPayload = {
  recipient_agent_named_id: string;
  agent_input: AgentInput;
  user_intent?: string;
};

export type AgentInput = {
  urls: Array<string>;
  summary_style?: SummaryStyle;
};

export type SummaryStyle = 'short' | 'medium' | 'long';

export type AISummaryState = {
  content: string;
  status: AISummaryStatus;
};

export type StateSetter = (state: AISummaryState) => any;

export type StreamMessage =
  | StreamTrace
  | StreamAnswerPart
  | StreamResponse
  | StreamError;

export type StreamResponse = {
  type: 'FINAL_RESPONSE';
  message: {
    message: Message;
  };
  millisOffset?: number;
  metadata?: {
    request_id?: string;
  };
};

export type StreamError = {
  type: 'ERROR';
  message: {
    content: string;
    status_code?: number;
    message_template?: string;
  };
  millisOffset: number;
  metadata: null | {
    error_message?: string;
    request_id?: string;
    timeout?: number;
  };
};

export type StreamAnswerPart = {
  type: 'ANSWER_PART';
  message: { content: string; role: 'ASSISTANT' };
  millisOffset: number;
  metadata?: {
    run_id?: string;
    request_id?: string;
  };
};

export type StreamTrace = {
  type: 'TRACE';
  message: { content: string };
  millisOffset: number;
  metadata?: {
    run_id: string;
    request_id: string;
    plugin_name?: string;
    plugin_input?: string;
  };
};

export type Usage = {
  model_usage: {
    [key: string]: ModelUsage;
  };
  total: ModelUsage;
};

export type ModelUsage = {
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  request_count: number;
  total_cost: number;
  duration: number;
};

export type Durations = {
  events: {
    [key: string]: number;
  };
  total: number;
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
  experience_id: ExpirienceID;
  message_metadata?: Metadata;
  plugin_invocations: PluginInvocationMessage[];
  role: Role;
  id: number;
  time_created: string;
  user_ari: string;
  sources?: Sources;
};

export type ContentType = 'text/markdown';

export type ExpirienceID = 'ai-mate';

export type Role = 'ASSISTANT';

export type Appendices = Array<Appendix>;

export type Appendix = {
  type: 'requestForm' | 'helpDesk';
  content: string;
  appendix_sources?: Sources;
};

export type Sources = Array<Source>;

export type Source = {
  ari: string;
  title: string;
  type: string;
  url: string;
  lastModified: string;
  message_id: number;
  id: number;
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
