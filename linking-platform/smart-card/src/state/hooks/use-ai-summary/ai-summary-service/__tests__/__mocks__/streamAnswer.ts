import { StreamMessage } from '../../types';

export const streamAnswer: StreamMessage[] = [
  {
    type: 'TRACE',
    message: {
      message_template: 'ANALYSING_QUERY',
      content: 'Analyzing: Reviewing your question.',
      user_query:
        "{'urls': ['https://test-link'], 'user_intent': '', 'is_summary': 'true', 'summary_style': 'GENERAL', 'retrieve_history': 'false'}",
    },
    millisOffset: 82,
    metadata: {
      run_id: '',
      request_id: 'f925f9c995a34912a9bf7c87cd299ab7',
    },
  },
  {
    type: 'ANSWER_PART',
    message: {
      content: 'Part 1 of 2',
      role: 'ASSISTANT',
    },
    millisOffset: 1854,
  },
  {
    type: 'ANSWER_PART',
    message: {
      content: 'Part 2 of 2',
      role: 'ASSISTANT',
    },
    millisOffset: 1254,
  },
  {
    type: 'FINAL_RESPONSE',
    message: {
      message: {
        content: 'Part 1 of 1 Part 2 of 2',
        content_mime_type: 'text/markdown',
        role: 'ASSISTANT',
        appendices: [],
        experience_id: 'ai-mate',
        plugin_invocations: [],
        id: -1,
        time_created: '2024-08-04T00:00:00.000Z',
        user_ari: '',
      },
    },
  },
];
