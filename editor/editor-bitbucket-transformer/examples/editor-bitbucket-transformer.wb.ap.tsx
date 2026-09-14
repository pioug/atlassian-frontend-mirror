import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TransformerExampleExample from './0-transformer-example';
import BitbucketHtmlExample from './1-bitbucket-html';
import BitbucketMarkdownExample from './2-bitbucket-markdown';

export const TransformerExample: WorkbenchExample = wb(TransformerExampleExample);
export const BitbucketHtml: WorkbenchExample = wb(BitbucketHtmlExample);
export const BitbucketMarkdown: WorkbenchExample = wb(BitbucketMarkdownExample);
