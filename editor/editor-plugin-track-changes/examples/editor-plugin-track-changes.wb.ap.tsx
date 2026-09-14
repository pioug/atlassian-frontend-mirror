import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicComposableExample from './1-basic-composable';
import ShowDiffExample from './2-show-diff';

export const BasicComposable: WorkbenchExample = wb(BasicComposableExample);
export const ShowDiff: WorkbenchExample = wb(ShowDiffExample);
