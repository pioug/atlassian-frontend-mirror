import { wb, type WorkbenchExample } from '@atlassian/workbench';

import JiraTransformerExample from './0-jira-transformer';
import JiraHtmlInputExample from './1-jira-html-input';
import JiraHtmlOutputExample from './2-jira-html-output';
import JiraHtmlToAdfExample from './3-jira-html-to-adf';

export const JiraTransformer: WorkbenchExample = wb(JiraTransformerExample);
export const JiraHtmlInput: WorkbenchExample = wb(JiraHtmlInputExample);
export const JiraHtmlOutput: WorkbenchExample = wb(JiraHtmlOutputExample);
export const JiraHtmlToAdf: WorkbenchExample = wb(JiraHtmlToAdfExample);
