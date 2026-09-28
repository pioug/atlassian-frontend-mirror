import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicUsageVrExample from '../00-basic-usage.vr.ap';
import ControlledExample from '../01-controlled';
import UncontrolledExample from '../02-uncontrolled';
import IndeterminateVrExample from '../03-indeterminate.vr.ap';
import CheckboxFormExample from '../04-checkbox-form';
import DefaultCheckedExample from '../05-default-checked';
import CheckboxGroupsExample from '../06-checkbox-groups';
import InFormExample from '../07-in-form';
import MultilineLabelVrExample from '../09-multiline-label.vr.ap';
import TestingExample from '../99-testing';

export const BasicUsage: WorkbenchExample<typeof BasicUsageVrExample> = wb(BasicUsageVrExample);
export const Controlled: WorkbenchExample<typeof ControlledExample> = wb(ControlledExample);
export const Uncontrolled: WorkbenchExample<typeof UncontrolledExample> = wb(UncontrolledExample);
export const IndeterminateVr: WorkbenchExample<typeof IndeterminateVrExample> =
	wb(IndeterminateVrExample);
export const CheckboxForm: WorkbenchExample<typeof CheckboxFormExample> = wb(CheckboxFormExample);
export const DefaultChecked: WorkbenchExample<typeof DefaultCheckedExample> =
	wb(DefaultCheckedExample);
export const CheckboxGroups: WorkbenchExample<typeof CheckboxGroupsExample> =
	wb(CheckboxGroupsExample);
export const InForm: WorkbenchExample<typeof InFormExample> = wb(InFormExample);
export const MultilineLabelVr: WorkbenchExample<typeof MultilineLabelVrExample> =
	wb(MultilineLabelVrExample);
export const Testing: WorkbenchExample<typeof TestingExample> = wb(TestingExample);
