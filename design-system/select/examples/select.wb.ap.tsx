import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SingleSelectVrExample from './00-single-select.vr.ap';
import MultiSelectExample from './01-multi-select';
import RadioSelectExample from './02-radio-select';
import CheckboxSelectVrExample from './03-checkbox-select.vr.ap';
import CountrySelectExample from './04-country-select';
import ValidationVrExample from './05-validation.vr.ap';
import AsyncSelectWithCallbackExample from './06-async-select-with-callback';
import AsyncSelectWithPromisesExample from './07-async-select-with-promises';
import WithIsSearchableFalseExample from './07-with-isSearchable-false';
import AsyncCreatableSelectExample from './08-async-creatable-select';
import CreatableSelectExample from './09-creatable-select';
import SelectInModalDialogExample from './11-select-in-modal-dialog';
import WithCustomGetOptionLabelExample from './12-with-custom-get-option-label';
import WithMaxHeightExample from './13-with-max-height';
import WithGroupHeadingExample from './14-with-group-heading';
import WithCustomStylesExample from './15-with-custom-styles';
import MultiLineSearchTextInputExample from './16-multi-line-search-text-input';
import CompactMultiSelectExample from './17-compact-multi-select';
import CompactSingleSelectExample from './17-compact-single-select';
import ElementBeforeExample from './18-element-before';
import PopupSelectVrExample from './18-popup-select.vr.ap';
import FilterValuesExample from './20-filter-values';
import OptionsWithDescriptionExample from './21-options-with-description';
import PopupMultiSelectExample from './22-popup-multi-select';
import PopupSelectInModalsExample from './23-popup-select-in-modals';
import DisabledVrExample from './24-disabled.vr.ap';
import CustomComponentsExample from './25-custom-components';
import AppearanceVrExample from './26-appearance.vr.ap';
import PopupSelectSearchExample from './26-popup-select-search';
import PopupSelectMinimalExample from './30-popup-select-minimal';
import ValidationOnBlurExample from './31-validation-on-blur';
import ControlledGroupVrExample from './32-controlled-group.vr.ap';
import UnsafeIsExperimentalGenericExample from './33-unsafe-is-experimental-generic';
import SelectMultiCustomValueTagLikeExample from './34-select-multi-custom-value-tag-like';
import DropdownIndicatorConstrainedWidthVrExample from './35-dropdown-indicator-constrained-width.vr.ap';
import PersistentInlineMenuExample from './36-persistent-inline-menu';
import TestingInitialFocusMatrixExample from './97-testing-initial-focus-matrix';
import TestingInitialFocusDefaultOpenExample from './98-testing-initial-focus-default-open';
import TestingPersistentInlineSelectPopoversExample from './99-testing-persistent-inline-select-popovers';

const SingleSelectVr: WorkbenchExample = wb(SingleSelectVrExample);

export default SingleSelectVr;
export const MultiSelect: WorkbenchExample = wb(MultiSelectExample);
export const RadioSelect: WorkbenchExample = wb(RadioSelectExample);
export const CheckboxSelectVr: WorkbenchExample = wb(CheckboxSelectVrExample);
export const CountrySelect: WorkbenchExample = wb(CountrySelectExample);
export const ValidationVr: WorkbenchExample = wb(ValidationVrExample);
export const AsyncSelectWithCallback: WorkbenchExample = wb(AsyncSelectWithCallbackExample);
export const AsyncSelectWithPromises: WorkbenchExample = wb(AsyncSelectWithPromisesExample);
export const WithIsSearchableFalse: WorkbenchExample = wb(WithIsSearchableFalseExample);
export const AsyncCreatableSelect: WorkbenchExample = wb(AsyncCreatableSelectExample);
export const CreatableSelect: WorkbenchExample = wb(CreatableSelectExample);
export const SelectInModalDialog: WorkbenchExample = wb(SelectInModalDialogExample);
export const WithCustomGetOptionLabel: WorkbenchExample = wb(WithCustomGetOptionLabelExample);
export const WithMaxHeight: WorkbenchExample = wb(WithMaxHeightExample);
export const WithGroupHeading: WorkbenchExample = wb(WithGroupHeadingExample);
export const WithCustomStyles: WorkbenchExample = wb(WithCustomStylesExample);
export const MultiLineSearchTextInput: WorkbenchExample = wb(MultiLineSearchTextInputExample);
export const CompactMultiSelect: WorkbenchExample = wb(CompactMultiSelectExample);
export const CompactSingleSelect: WorkbenchExample = wb(CompactSingleSelectExample);
export const ElementBefore: WorkbenchExample = wb(ElementBeforeExample);
export const PopupSelectVr: WorkbenchExample = wb(PopupSelectVrExample);
export const FilterValues: WorkbenchExample = wb(FilterValuesExample);
export const OptionsWithDescription: WorkbenchExample = wb(OptionsWithDescriptionExample);
export const PopupMultiSelect: WorkbenchExample = wb(PopupMultiSelectExample);
export const PopupSelectInModals: WorkbenchExample = wb(PopupSelectInModalsExample);
export const DisabledVr: WorkbenchExample = wb(DisabledVrExample);
export const CustomComponents: WorkbenchExample = wb(CustomComponentsExample);
export const AppearanceVr: WorkbenchExample = wb(AppearanceVrExample);
export const PopupSelectSearch: WorkbenchExample = wb(PopupSelectSearchExample);
export const PopupSelectMinimal: WorkbenchExample = wb(PopupSelectMinimalExample);
export const ValidationOnBlur: WorkbenchExample = wb(ValidationOnBlurExample);
export const ControlledGroupVr: WorkbenchExample = wb(ControlledGroupVrExample);
export const UnsafeIsExperimentalGeneric: WorkbenchExample = wb(UnsafeIsExperimentalGenericExample);
export const SelectMultiCustomValueTagLike: WorkbenchExample = wb(
	SelectMultiCustomValueTagLikeExample,
);
export const DropdownIndicatorConstrainedWidthVr: WorkbenchExample = wb(
	DropdownIndicatorConstrainedWidthVrExample,
);
export const PersistentInlineMenu: WorkbenchExample = wb(PersistentInlineMenuExample);
export const TestingInitialFocusMatrix: WorkbenchExample = wb(TestingInitialFocusMatrixExample);
export const TestingInitialFocusDefaultOpen: WorkbenchExample = wb(
	TestingInitialFocusDefaultOpenExample,
);
export const TestingPersistentInlineSelectPopovers: WorkbenchExample = wb(
	TestingPersistentInlineSelectPopoversExample,
);
