import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './basic';
import ForgeAndConnectDropdownExample from './forge-and-connect-dropdown';
import ResponsiveContainerPresetsExample from './responsive-container-presets';
import ToolbarUiExample from './toolbar-ui';

export const Basic: WorkbenchExample = wb(BasicExample);
export const ForgeAndConnectDropdown: WorkbenchExample = wb(ForgeAndConnectDropdownExample);
export const ResponsiveContainerPresets: WorkbenchExample = wb(ResponsiveContainerPresetsExample);
export const ToolbarUi: WorkbenchExample = wb(ToolbarUiExample);
