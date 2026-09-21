import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultVrExample from './01-default.vr.ap';
import SubtleVrExample from './02-subtle.vr.ap';
import TargetBlankVrExample from './03-target-blank.vr.ap';
import VisitedVrExample from './04-visited.vr.ap';
import InlineTextVrExample from './05-inline-text.vr.ap';
import IconWrappingVrExample from './06-icon-wrapping.vr.ap';
import InverseVrExample from './07-inverse.vr.ap';
import FontStyleInheritanceVrExample from './10-font-style-inheritance.vr.ap';
import AllCombinationsVrExample from './20-all-combinations.vr.ap';
import LinkConfiguredVrExample from './50-link-configured.vr.ap';

const DefaultVr: WorkbenchExample = wb(DefaultVrExample);

// Default export required by accessibility tooling.
export default DefaultVr;
export const SubtleVr: WorkbenchExample = wb(SubtleVrExample);
export const TargetBlankVr: WorkbenchExample = wb(TargetBlankVrExample);
export const VisitedVr: WorkbenchExample = wb(VisitedVrExample);
export const InlineTextVr: WorkbenchExample = wb(InlineTextVrExample);
export const IconWrappingVr: WorkbenchExample = wb(IconWrappingVrExample);
export const InverseVr: WorkbenchExample = wb(InverseVrExample);
export const FontStyleInheritanceVr: WorkbenchExample = wb(FontStyleInheritanceVrExample);
export const AllCombinationsVr: WorkbenchExample = wb(AllCombinationsVrExample);
export const LinkConfiguredVr: WorkbenchExample = wb(LinkConfiguredVrExample);
