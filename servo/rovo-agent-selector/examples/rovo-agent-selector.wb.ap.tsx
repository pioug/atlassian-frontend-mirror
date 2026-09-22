import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './basic.vr.ap';
import CustomWidthExample from './custom-width';
import SelectedExample from './selected';

export const Basic: WorkbenchExample = wb(BasicExample);
export const CustomWidth: WorkbenchExample = wb(CustomWidthExample);
export const Selected: WorkbenchExample = wb(SelectedExample);
