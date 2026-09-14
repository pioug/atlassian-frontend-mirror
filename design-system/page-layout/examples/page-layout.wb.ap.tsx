import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CustomizablePageLayoutExample from './00-customizable-page-layout';
import BasicPageLayoutExample from './01-basic-page-layout';
import IntegrationExampleSource from './03-integration-example';
import ResizeSidebarExample from './10-resize-sidebar';
import ResizeSidebarWithIframeExample from './10-resize-sidebar-with-iframe';
import ResizeSidebarWithLotsOfContentExample from './10-resize-sidebar-with-lots-of-content';
import StickiedElementExample from './15-stickied-element';
import ControlledLeftSidebarExample from './20-controlled-left-sidebar';
import ServerRenderedExample from './25-server-rendered';
import CustomSkipLinksExample from './30-custom-skip-links';
import LockedSidebarExample from './35-locked-sidebar';
import SidebarControllerExample from './40-sidebar-controller';

const CustomizablePageLayout: WorkbenchExample = wb(CustomizablePageLayoutExample);

export default CustomizablePageLayout;
export const BasicPageLayout: WorkbenchExample = wb(BasicPageLayoutExample);
export const IntegrationExample: WorkbenchExample = wb(IntegrationExampleSource);
export const ResizeSidebar: WorkbenchExample = wb(ResizeSidebarExample);
export const ResizeSidebarWithIframe: WorkbenchExample = wb(ResizeSidebarWithIframeExample);
export const ResizeSidebarWithLotsOfContent: WorkbenchExample = wb(
	ResizeSidebarWithLotsOfContentExample,
);
export const StickiedElement: WorkbenchExample = wb(StickiedElementExample);
export const ControlledLeftSidebar: WorkbenchExample = wb(ControlledLeftSidebarExample);
export const ServerRendered: WorkbenchExample = wb(ServerRenderedExample);
export const CustomSkipLinks: WorkbenchExample = wb(CustomSkipLinksExample);
export const LockedSidebar: WorkbenchExample = wb(LockedSidebarExample);
export const SidebarController: WorkbenchExample = wb(SidebarControllerExample);
