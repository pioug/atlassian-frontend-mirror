import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicUsageExample from '../00-basic-usage';
import ClickThroughExample from '../01-click-through';
import BlanketWithChildrenExample from '../03-blanket-with-children';
import VariantsExample from '../04-variants';

export const BasicUsage: WorkbenchExample = wb(BasicUsageExample);

export const ClickThrough: WorkbenchExample = wb(ClickThroughExample);
export const BlanketWithChildren: WorkbenchExample = wb(BlanketWithChildrenExample);
export const Variants: WorkbenchExample = wb(VariantsExample);
