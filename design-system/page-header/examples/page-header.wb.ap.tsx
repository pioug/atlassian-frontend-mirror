import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultVrExample from './01-default.vr.ap';
import ComplexExample from './02-complex';
import CustomTitleExample from './03-custom-title';
import ComplexTruncationExample from './04-complex-truncation';
import FocusHeadingExample from './05-focus-heading';
import ResponsiveWrappingVrExample from './06-responsive-wrapping.vr.ap';

const DefaultVr: WorkbenchExample = wb(DefaultVrExample);

// Default export required by accessibility tooling.
export default DefaultVr;
export const Complex: WorkbenchExample = wb(ComplexExample);
export const CustomTitle: WorkbenchExample = wb(CustomTitleExample);
export const ComplexTruncation: WorkbenchExample = wb(ComplexTruncationExample);
export const FocusHeading: WorkbenchExample = wb(FocusHeadingExample);
export const ResponsiveWrappingVr: WorkbenchExample = wb(ResponsiveWrappingVrExample);
