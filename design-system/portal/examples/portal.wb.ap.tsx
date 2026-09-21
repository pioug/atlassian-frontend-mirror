import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ComplexLayeringVrExample from './1-complex-layering.vr.ap';
import StackingContextVrExample from './2-stacking-context.vr.ap';
import BasicPortalExample from './3-basic-portal';
import PortalReRenderVrExample from './4-portal-re-render.vr.ap';
import SubTreeThemedPortalVrExample from './sub-tree-themed-portal.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const ComplexLayering: WorkbenchExample = wb(ComplexLayeringVrExample);

// Default export required by accessibility tooling.
export default ComplexLayering;
export const StackingContextVr: WorkbenchExample = wb(StackingContextVrExample);
export const BasicPortal: WorkbenchExample = wb(BasicPortalExample);
export const PortalReRenderVr: WorkbenchExample = wb(PortalReRenderVrExample);
export const SubTreeThemedPortalVr: WorkbenchExample = wb(SubTreeThemedPortalVrExample);
