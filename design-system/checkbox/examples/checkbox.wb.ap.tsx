import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicUsageVrExample from './00-basic-usage.vr.ap';
import ControlledExample from './01-controlled';
import UncontrolledExample from './02-uncontrolled';
import IndeterminateVrExample from './03-indeterminate.vr.ap';
import CheckboxFormExample from './04-checkbox-form';
import DefaultCheckedExample from './05-default-checked';
import CheckboxGroupsExample from './06-checkbox-groups';
import InFormExample from './07-in-form';
import MultilineLabelVrExample from './09-multiline-label.vr.ap';
import TestingExample from './99-testing';

// Explicit named export Used to generate integration-test URLs.
export const BasicUsage: WorkbenchExample = wb(BasicUsageVrExample);
// Default export required by accessibility tooling.
export default BasicUsage;
export const Controlled: WorkbenchExample = wb(ControlledExample);
export const Uncontrolled: WorkbenchExample = wb(UncontrolledExample);
export const IndeterminateVr: WorkbenchExample = wb(IndeterminateVrExample);
export const CheckboxForm: WorkbenchExample = wb(CheckboxFormExample);
export const DefaultChecked: WorkbenchExample = wb(DefaultCheckedExample);
export const CheckboxGroups: WorkbenchExample = wb(CheckboxGroupsExample);
export const InForm: WorkbenchExample = wb(InFormExample);
export const MultilineLabelVr: WorkbenchExample = wb(MultilineLabelVrExample);
export const Testing: WorkbenchExample = wb(TestingExample);
