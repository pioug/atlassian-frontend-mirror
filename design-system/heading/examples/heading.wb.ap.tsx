import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './00-basic.vr.ap';
import ContextExample from './01-context';
import InverseVrExample from './02-inverse.vr.ap';
import SpecificityExample from './03-specificity';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const Context: WorkbenchExample = wb(ContextExample);
export const InverseVr: WorkbenchExample = wb(InverseVrExample);
export const Specificity: WorkbenchExample = wb(SpecificityExample);
