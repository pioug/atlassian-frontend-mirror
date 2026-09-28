import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SlackMarkdownExample from './0-slack-markdown';

export const SlackMarkdown: WorkbenchExample<typeof SlackMarkdownExample> =
	wb(SlackMarkdownExample);
