import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './0-basic';
import SizesExample from './1-sizes';
import WithInteractionContextExample from './2-with-interaction-context';
import TestingExample from './99-testing';
import AnimatedExitExample from './animated-exit';
import BaselineAlignmentExample from './baseline-alignment';
import DelayingExample from './delaying';
import SpinnerInButtonExample from './spinner-in-button';
import VrBasicVrExample from './vr-basic.vr.ap';
import VrSizesVrExample from './vr-sizes.vr.ap';
import VrTableCellAlignmentVrExample from './vr-table-cell-alignment.vr.ap';
import VrTextAlignmentVrExample from './vr-text-alignment.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicExample);
// Default export required by accessibility tooling.
export default Basic;

export const Sizes: WorkbenchExample = wb(SizesExample);
export const WithInteractionContext: WorkbenchExample = wb(WithInteractionContextExample);
export const Testing: WorkbenchExample = wb(TestingExample);
export const AnimatedExit: WorkbenchExample = wb(AnimatedExitExample);
export const BaselineAlignment: WorkbenchExample = wb(BaselineAlignmentExample);
export const Delaying: WorkbenchExample = wb(DelayingExample);
export const SpinnerInButton: WorkbenchExample = wb(SpinnerInButtonExample);
export const VrBasicVr: WorkbenchExample = wb(VrBasicVrExample);
export const VrSizesVr: WorkbenchExample = wb(VrSizesVrExample);
export const VrTableCellAlignmentVr: WorkbenchExample = wb(VrTableCellAlignmentVrExample);
export const VrTextAlignmentVr: WorkbenchExample = wb(VrTextAlignmentVrExample);
