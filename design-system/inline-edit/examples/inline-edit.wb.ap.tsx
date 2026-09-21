import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicUsageExample from './00-basic-usage';
import TextareaUsageExample from './01-textarea-usage';
import SelectUsageExample from './02-select-usage';
import ValidationExample from './03-validation';
import InlineEditableTextfieldExample from './04-inline-editable-textfield';
import LargerTextExample from './06-larger-text';
import NoActionButtonsExample from './07-no-action-buttons';
import StartWithEditExample from './08-start-with-edit';
import MandatoryFieldExample from './09-mandatory-field';
import CompactExample from './10-compact';
import StatelessExample from './11-stateless';
import HeadingLineHeightExample from './12-heading-line-height';
import InlineEditWithDatepickerExample from './13-inline-edit-with-datepicker';
import ReactNodeLabelExample from './14-react-node-label';

// Explicit named export Used to generate integration-test URLs.
export const BasicUsage: WorkbenchExample = wb(BasicUsageExample);
// Default export required by accessibility tooling.
export default BasicUsage;

export const TextareaUsage: WorkbenchExample = wb(TextareaUsageExample);
export const SelectUsage: WorkbenchExample = wb(SelectUsageExample);
export const Validation: WorkbenchExample = wb(ValidationExample);
export const InlineEditableTextfield: WorkbenchExample = wb(InlineEditableTextfieldExample);
export const LargerText: WorkbenchExample = wb(LargerTextExample);
export const NoActionButtons: WorkbenchExample = wb(NoActionButtonsExample);
export const StartWithEdit: WorkbenchExample = wb(StartWithEditExample);
export const MandatoryField: WorkbenchExample = wb(MandatoryFieldExample);
export const Compact: WorkbenchExample = wb(CompactExample);
export const Stateless: WorkbenchExample = wb(StatelessExample);
export const HeadingLineHeight: WorkbenchExample = wb(HeadingLineHeightExample);
export const InlineEditWithDatepicker: WorkbenchExample = wb(InlineEditWithDatepickerExample);
export const ReactNodeLabel: WorkbenchExample = wb(ReactNodeLabelExample);
