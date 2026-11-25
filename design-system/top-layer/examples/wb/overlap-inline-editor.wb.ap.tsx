import { wb, type WorkbenchExample } from '@atlassian/workbench';

import InlineEditorExample from '../overlap-inline-editor';

/**
 * Registers the inline editor example in Workbench.
 */
export const InlineEditor: WorkbenchExample<typeof InlineEditorExample> = wb(InlineEditorExample);
