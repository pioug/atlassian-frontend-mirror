import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultTabsVrExample from './00-default-tabs.vr.ap';
import ControlledVrExample from './10-controlled.vr.ap';
import CustomTabComponentsExample from './20-custom-tab-components';
import CustomTabPanelComponentVrExample from './30-custom-tab-panel-component.vr.ap';
import WithManyVrExample from './50-with-many.vr.ap';
import WithFlexContentVrExample from './60-with-flex-content.vr.ap';
import NoSpaceForTabsVrExample from './70-no-space-for-tabs.vr.ap';
import OverflowVrExample from './80-overflow.vr.ap';
import TestingVrExample from './99-testing.vr.ap';

const DefaultTabsVr: WorkbenchExample = wb(DefaultTabsVrExample);

export default DefaultTabsVr;
export const ControlledVr: WorkbenchExample = wb(ControlledVrExample);
export const CustomTabComponents: WorkbenchExample = wb(CustomTabComponentsExample);
export const CustomTabPanelComponentVr: WorkbenchExample = wb(CustomTabPanelComponentVrExample);
export const WithManyVr: WorkbenchExample = wb(WithManyVrExample);
export const WithFlexContentVr: WorkbenchExample = wb(WithFlexContentVrExample);
export const NoSpaceForTabsVr: WorkbenchExample = wb(NoSpaceForTabsVrExample);
export const OverflowVr: WorkbenchExample = wb(OverflowVrExample);
export const TestingVr: WorkbenchExample = wb(TestingVrExample);
