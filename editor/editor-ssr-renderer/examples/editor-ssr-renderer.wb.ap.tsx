import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AllNodesExample from './0-all-nodes';
import CodeBlocksExample from './10-code-blocks';
import TextExample from './10-text';

export const AllNodes: WorkbenchExample = wb(AllNodesExample);
export const CodeBlocks: WorkbenchExample = wb(CodeBlocksExample);
export const Text: WorkbenchExample = wb(TextExample);
