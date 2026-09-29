import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ExampleCommentHighlightedExample from '../10-example-comment-highlighted';

export const ExampleCommentHighlighted: WorkbenchExample<typeof ExampleCommentHighlightedExample> =
	wb(ExampleCommentHighlightedExample);
