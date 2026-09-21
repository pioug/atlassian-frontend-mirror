import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './00-basic.vr.ap';
import ContextExample from './01-context';
import InverseVrExample from './02-inverse.vr.ap';
import SpecificityExample from './03-specificity';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);

// Default export required by accessibility tooling.
export default Basic;
export const Context: WorkbenchExample = wb(ContextExample);
export const InverseVr: WorkbenchExample = wb(InverseVrExample);
export const Specificity: WorkbenchExample = wb(SpecificityExample);
