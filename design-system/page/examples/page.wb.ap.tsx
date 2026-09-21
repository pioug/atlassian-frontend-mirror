import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicUsageVrExample from './00-basic-usage.vr.ap';
import LayoutExampleVrExample from './01-layout-example.vr.ap';
import NestedGridExampleVrExample from './02-nested-grid-example.vr.ap';
import SpacingExampleVrExample from './03-spacing-example.vr.ap';
import ColumnsVrExample from './05-columns.vr.ap';
import FixedLayoutVrExample from './06-fixed-layout.vr.ap';
import FluidLayoutVrExample from './07-fluid-layout.vr.ap';
import EdgeCasesVrExample from './08-edge-cases.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const BasicUsage: WorkbenchExample = wb(BasicUsageVrExample);

// Default export required by accessibility tooling.
export default BasicUsage;
export const LayoutExampleVr: WorkbenchExample = wb(LayoutExampleVrExample);
export const NestedGridExampleVr: WorkbenchExample = wb(NestedGridExampleVrExample);
export const SpacingExampleVr: WorkbenchExample = wb(SpacingExampleVrExample);
export const ColumnsVr: WorkbenchExample = wb(ColumnsVrExample);
export const FixedLayoutVr: WorkbenchExample = wb(FixedLayoutVrExample);
export const FluidLayoutVr: WorkbenchExample = wb(FluidLayoutVrExample);
export const EdgeCasesVr: WorkbenchExample = wb(EdgeCasesVrExample);
