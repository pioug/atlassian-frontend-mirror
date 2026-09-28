import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TransformerExampleExample from './0-transformer-example';
import BitbucketHtmlExample from './1-bitbucket-html';
import BitbucketMarkdownExample from './2-bitbucket-markdown';

export const TransformerExample: WorkbenchExample<typeof TransformerExampleExample> =
	wb(TransformerExampleExample);
export const BitbucketHtml: WorkbenchExample<typeof BitbucketHtmlExample> =
	wb(BitbucketHtmlExample);
export const BitbucketMarkdown: WorkbenchExample<typeof BitbucketMarkdownExample> =
	wb(BitbucketMarkdownExample);
