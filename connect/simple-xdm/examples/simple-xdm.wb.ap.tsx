import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PluginExample from './plugin';
import ResizeExample from './resize';
import SizeExample from './size';

export const Plugin: WorkbenchExample = wb(PluginExample);
export const Resize: WorkbenchExample = wb(ResizeExample);
export const Size: WorkbenchExample = wb(SizeExample);
