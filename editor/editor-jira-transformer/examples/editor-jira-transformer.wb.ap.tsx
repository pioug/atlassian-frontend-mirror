import { wb, type WorkbenchExample } from '@atlassian/workbench';

import JiraTransformerExample from './0-jira-transformer';
import JiraHtmlInputExample from './1-jira-html-input';
import JiraHtmlOutputExample from './2-jira-html-output';
import JiraHtmlToAdfExample from './3-jira-html-to-adf';

export const JiraTransformer: WorkbenchExample<typeof JiraTransformerExample> =
	wb(JiraTransformerExample);
export const JiraHtmlInput: WorkbenchExample<typeof JiraHtmlInputExample> =
	wb(JiraHtmlInputExample);
export const JiraHtmlOutput: WorkbenchExample<typeof JiraHtmlOutputExample> =
	wb(JiraHtmlOutputExample);
export const JiraHtmlToAdf: WorkbenchExample<typeof JiraHtmlToAdfExample> =
	wb(JiraHtmlToAdfExample);
