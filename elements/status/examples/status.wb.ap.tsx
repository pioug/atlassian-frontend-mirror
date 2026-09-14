import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SimpleBoldStatusExample from './00-simple-bold-status.vr.ap';
import SimpleStatusExample from './00-simple-status.vr.ap';
import StatusPickerExample from './01-status-picker.vr.ap';

export const SimpleBoldStatus: WorkbenchExample = wb(SimpleBoldStatusExample);
export const SimpleStatus: WorkbenchExample = wb(SimpleStatusExample);
export const StatusPicker: WorkbenchExample = wb(StatusPickerExample);
