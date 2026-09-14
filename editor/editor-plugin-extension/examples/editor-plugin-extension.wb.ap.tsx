import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ConfigPanelExtensionsExample from './1-config-panel-extensions';
import ConfigPanelFieldPickerExample from './1-config-panel-field-picker';
import ConfigPanelStatesExample from './1-config-panel-states';
import ConfigPanelWithParametersExample from './1-config-panel-with-parameters';

export const ConfigPanelExtensions: WorkbenchExample = wb(ConfigPanelExtensionsExample);
export const ConfigPanelFieldPicker: WorkbenchExample = wb(ConfigPanelFieldPickerExample);
export const ConfigPanelStates: WorkbenchExample = wb(ConfigPanelStatesExample);
export const ConfigPanelWithParameters: WorkbenchExample = wb(ConfigPanelWithParametersExample);
