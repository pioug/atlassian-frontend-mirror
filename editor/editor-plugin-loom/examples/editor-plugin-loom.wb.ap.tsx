import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ComposableEditorWithLoomExample from './1-composable-editor-with-loom';
import LoomWithoutInitialisationByDefaultExample from './2-loom-without-initialisation-by-default.tsx';

export const ComposableEditorWithLoom: WorkbenchExample = wb(ComposableEditorWithLoomExample);
export const LoomWithoutInitialisationByDefault: WorkbenchExample = wb(
	LoomWithoutInitialisationByDefaultExample,
);
