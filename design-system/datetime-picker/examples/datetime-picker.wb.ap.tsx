import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './00-basic.vr.ap';
import I18nExample from './01-i18n';
import UsingFieldExample from './02-using-field';
import RequiredExample from './03-required';
import DisabledVrExample from './04-disabled.vr.ap';
import DatePickerStatesExample from './10-date-picker-states';
import DatepickerCustomParserExample from './11-datepicker-custom-parser';
import DatePickerDisabledExample from './12-date-picker-disabled';
import DatePickerRangeExample from './13-date-picker-range';
import DatePickerTabcheckExample from './14-date-picker-tabcheck';
import CalendarButtonLabelingExample from './15-calendar-button-labeling';
import ModalExample from './16-modal';
import DatetimePickerStatesExample from './20-datetime-picker-states';
import TimePickerStatesExample from './30-time-picker-states';
import OpenStatesExample from './35-open-states';
import FixedWidthExample from './40-fixed-width';
import DefaultPropsExample from './50-default-props';
import SettingValueExternallyExample from './60-setting-value-externally';
import BoundaryBehaviourExample from './70-boundary-behaviour';
import InvalidExample from './80-invalid';
import FormatExample from './90-format';
import FormatEditableExample from './99-format-editable';
import TimesExample from './100-times';
import TimezoneCompatExample from './110-timezone-compat';
import DatepickerFormatDisplayLabelExample from './120-datepicker-format-display-label';
import DateTimeLabelExamplesVrExample from './130-date-time-label-examples.vr.ap';
import OverflowVrExample from './140-overflow.vr.ap';
import ComponentsOverrideVrExample from './150-components-override.vr.ap';
import ValueSwitchingBugfixVrExample from './160-value-switching-bugfix.vr.ap';
import DisableToggleExample from './999-disable-toggle';
import TestingTopLayerFocusExample from './testing-top-layer-focus';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);

// Default export required by accessibility tooling.
export default Basic;
export const I18n: WorkbenchExample = wb(I18nExample);
export const UsingField: WorkbenchExample = wb(UsingFieldExample);
export const Required: WorkbenchExample = wb(RequiredExample);
export const DisabledVr: WorkbenchExample = wb(DisabledVrExample);
export const DatePickerStates: WorkbenchExample = wb(DatePickerStatesExample);
export const Times: WorkbenchExample = wb(TimesExample);
export const DatepickerCustomParser: WorkbenchExample = wb(DatepickerCustomParserExample);
export const TimezoneCompat: WorkbenchExample = wb(TimezoneCompatExample);
export const DatePickerDisabled: WorkbenchExample = wb(DatePickerDisabledExample);
export const DatepickerFormatDisplayLabel: WorkbenchExample = wb(
	DatepickerFormatDisplayLabelExample,
);
export const DatePickerRange: WorkbenchExample = wb(DatePickerRangeExample);
export const DateTimeLabelExamplesVr: WorkbenchExample = wb(DateTimeLabelExamplesVrExample);
export const DatePickerTabcheck: WorkbenchExample = wb(DatePickerTabcheckExample);
// Named "Overflow" to match the Workbench URL used by existing integration tests.
export const Overflow: WorkbenchExample = wb(OverflowVrExample);
export const CalendarButtonLabeling: WorkbenchExample = wb(CalendarButtonLabelingExample);
export const ComponentsOverrideVr: WorkbenchExample = wb(ComponentsOverrideVrExample);
export const Modal: WorkbenchExample = wb(ModalExample);
export const ValueSwitchingBugfixVr: WorkbenchExample = wb(ValueSwitchingBugfixVrExample);
export const DatetimePickerStates: WorkbenchExample = wb(DatetimePickerStatesExample);
export const TimePickerStates: WorkbenchExample = wb(TimePickerStatesExample);
export const OpenStates: WorkbenchExample = wb(OpenStatesExample);
export const FixedWidth: WorkbenchExample = wb(FixedWidthExample);
export const DefaultProps: WorkbenchExample = wb(DefaultPropsExample);
export const SettingValueExternally: WorkbenchExample = wb(SettingValueExternallyExample);
export const BoundaryBehaviour: WorkbenchExample = wb(BoundaryBehaviourExample);
export const Invalid: WorkbenchExample = wb(InvalidExample);
export const Format: WorkbenchExample = wb(FormatExample);
export const FormatEditable: WorkbenchExample = wb(FormatEditableExample);
export const DisableToggle: WorkbenchExample = wb(DisableToggleExample);
export const TestingTopLayerFocus: WorkbenchExample = wb(TestingTopLayerFocusExample);
