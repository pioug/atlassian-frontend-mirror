import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ColorPickerExample from '../00-color-picker.vr.ap';

export const ColorPicker: WorkbenchExample<typeof ColorPickerExample> = wb(ColorPickerExample);
