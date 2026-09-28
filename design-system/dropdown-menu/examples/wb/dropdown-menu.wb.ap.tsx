import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultDropdownMenuExample from '../01-default-dropdown-menu';
import ComplexDropdownMenuExample from '../02-complex-dropdown-menu';
import StatelessDropdownMenuExample from '../03-stateless-dropdown-menu';
import DropdownItemExample from '../04-dropdown-item';
import DropdownItemCheckboxExample from '../05-dropdown-item-checkbox';
import DropdownItemGroupsExample from '../06-dropdown-item-groups';
import DropdownItemRadioExample from '../07-dropdown-item-radio';
import DropdownItemWithAvatarsExample from '../08-dropdown-item-with-avatars';
import DisabledButtonTriggerExample from '../09-disabled-button-trigger';
import DropdownSpacingVrExample from '../10-dropdown-spacing.vr.ap';
import CustomTriggersExample from '../11-custom-triggers';
import NestedDropdownExample from '../12-nested-dropdown';
import WithKeyboardInteractionExample from '../14-with-keyboard-interaction';
import JiraStatusDropdownExample from '../15-jira-status-dropdown';
import RenderInParentDropdownExample from '../16-render-in-parent-dropdown';
import CustomTriggerWithOnclickExample from '../17-custom-trigger-with-onclick';
import ShouldFitContainerVrExample from '../18-should-fit-container.vr.ap';
import DropdownMenuMixedExample from '../19-dropdown-menu-mixed';
import SettingZIndexVrExample from '../20-setting-z-index.vr.ap';
import DropdownmenuFocusToRefOnCloseExample from '../21-dropdownmenu-focus-to-ref-on-close';
import DropdownmenuFocusWhenRefNotProvidedExample from '../22-dropdownmenu-focus-when-ref-not-provided';
import DropdownmenuFocusOnCustomTriggerExample from '../23-dropdownmenu-focus-on-custom-trigger';
import DropdownTriggerFocusClickOutsideExample from '../30-dropdown-trigger-focus-click-outside';
import TestingShouldPreventEscapePropagationExample from '../88-testing-should-prevent-escape-propagation';
import TestingKeyboardNavigationDisabledItemsExample from '../89-testing-keyboard-navigation-disabled-items';
import TestingReturnFocusRefRenderedInParentExample from '../90-testing-return-focus-ref-rendered-in-parent';
import TestingReturnFocusRefRenderedInPortalExample from '../90-testing-return-focus-ref-rendered-in-portal';
import TestingNestedKeyboardNavigationExample from '../91-testing-nested-keyboard-navigation';
import TestingKeyboardNavigationExample from '../92-testing-keyboard-navigation';
import TestingIsLoadingRepositionVrExample from '../93-testing-is-loading-reposition.vr.ap';
import TestingNestedKeyboardNavigationTopLayerExample from '../93-testing-nested-keyboard-navigation-top-layer';
import TestingCheckboxStatelessExample from '../94-testing-checkbox-stateless';
import TestingCheckboxExample from '../95-testing-checkbox';
import TestingDefaultOpenComboboxTriggerExample from '../96-testing-default-open-combobox-trigger';
import TestingRadioExample from '../96-testing-radio';
import TestingDdmStatelessExample from '../97-testing-ddm-stateless';
import TestingDdmDefaultExample from '../98-testing-ddm-default';
import TestingComplexDropdownMenuVrExample from '../99-testing-complex-dropdown-menu.vr.ap';
import TestingPlacementsVrExample from '../99-testing-placements.vr.ap';
import TestingVrExample from '../99-testing.vr.ap';
import SelectionStatesVrExample from '../selection-states.vr.ap';
import TestingTopLayerFocusExample from '../testing-top-layer-focus';

export const DefaultDropdownMenu: WorkbenchExample<typeof DefaultDropdownMenuExample> = wb(
	DefaultDropdownMenuExample,
);

export const ComplexDropdownMenu: WorkbenchExample<typeof ComplexDropdownMenuExample> = wb(
	ComplexDropdownMenuExample,
);
export const StatelessDropdownMenu: WorkbenchExample<typeof StatelessDropdownMenuExample> = wb(
	StatelessDropdownMenuExample,
);
export const DropdownItem: WorkbenchExample<typeof DropdownItemExample> = wb(DropdownItemExample);
export const DropdownItemCheckbox: WorkbenchExample<typeof DropdownItemCheckboxExample> = wb(
	DropdownItemCheckboxExample,
);
export const DropdownItemGroups: WorkbenchExample<typeof DropdownItemGroupsExample> =
	wb(DropdownItemGroupsExample);
export const DropdownItemRadio: WorkbenchExample<typeof DropdownItemRadioExample> =
	wb(DropdownItemRadioExample);
export const DropdownItemWithAvatars: WorkbenchExample<typeof DropdownItemWithAvatarsExample> = wb(
	DropdownItemWithAvatarsExample,
);
export const DisabledButtonTrigger: WorkbenchExample<typeof DisabledButtonTriggerExample> = wb(
	DisabledButtonTriggerExample,
);
export const DropdownSpacingVr: WorkbenchExample<typeof DropdownSpacingVrExample> =
	wb(DropdownSpacingVrExample);
export const CustomTriggers: WorkbenchExample<typeof CustomTriggersExample> =
	wb(CustomTriggersExample);
export const NestedDropdown: WorkbenchExample<typeof NestedDropdownExample> =
	wb(NestedDropdownExample);
export const WithKeyboardInteraction: WorkbenchExample<typeof WithKeyboardInteractionExample> = wb(
	WithKeyboardInteractionExample,
);
export const JiraStatusDropdown: WorkbenchExample<typeof JiraStatusDropdownExample> =
	wb(JiraStatusDropdownExample);
export const RenderInParentDropdown: WorkbenchExample<typeof RenderInParentDropdownExample> = wb(
	RenderInParentDropdownExample,
);
export const CustomTriggerWithOnclick: WorkbenchExample<typeof CustomTriggerWithOnclickExample> =
	wb(CustomTriggerWithOnclickExample);
export const ShouldFitContainerVr: WorkbenchExample<typeof ShouldFitContainerVrExample> = wb(
	ShouldFitContainerVrExample,
);
export const DropdownMenuMixed: WorkbenchExample<typeof DropdownMenuMixedExample> =
	wb(DropdownMenuMixedExample);
export const SettingZIndexVr: WorkbenchExample<typeof SettingZIndexVrExample> =
	wb(SettingZIndexVrExample);
export const DropdownmenuFocusToRefOnClose: WorkbenchExample<
	typeof DropdownmenuFocusToRefOnCloseExample
> = wb(DropdownmenuFocusToRefOnCloseExample);
export const DropdownmenuFocusWhenRefNotProvided: WorkbenchExample<
	typeof DropdownmenuFocusWhenRefNotProvidedExample
> = wb(DropdownmenuFocusWhenRefNotProvidedExample);
export const DropdownmenuFocusOnCustomTrigger: WorkbenchExample<
	typeof DropdownmenuFocusOnCustomTriggerExample
> = wb(DropdownmenuFocusOnCustomTriggerExample);
export const DropdownTriggerFocusClickOutside: WorkbenchExample<
	typeof DropdownTriggerFocusClickOutsideExample
> = wb(DropdownTriggerFocusClickOutsideExample);
export const TestingShouldPreventEscapePropagation: WorkbenchExample<
	typeof TestingShouldPreventEscapePropagationExample
> = wb(TestingShouldPreventEscapePropagationExample);
export const TestingKeyboardNavigationDisabledItems: WorkbenchExample<
	typeof TestingKeyboardNavigationDisabledItemsExample
> = wb(TestingKeyboardNavigationDisabledItemsExample);
export const TestingReturnFocusRefRenderedInParent: WorkbenchExample<
	typeof TestingReturnFocusRefRenderedInParentExample
> = wb(TestingReturnFocusRefRenderedInParentExample);
export const TestingReturnFocusRefRenderedInPortal: WorkbenchExample<
	typeof TestingReturnFocusRefRenderedInPortalExample
> = wb(TestingReturnFocusRefRenderedInPortalExample);
export const TestingNestedKeyboardNavigation: WorkbenchExample<
	typeof TestingNestedKeyboardNavigationExample
> = wb(TestingNestedKeyboardNavigationExample);
export const TestingKeyboardNavigation: WorkbenchExample<typeof TestingKeyboardNavigationExample> =
	wb(TestingKeyboardNavigationExample);
export const TestingIsLoadingRepositionVr: WorkbenchExample<
	typeof TestingIsLoadingRepositionVrExample
> = wb(TestingIsLoadingRepositionVrExample);
export const TestingNestedKeyboardNavigationTopLayer: WorkbenchExample<
	typeof TestingNestedKeyboardNavigationTopLayerExample
> = wb(TestingNestedKeyboardNavigationTopLayerExample);
export const TestingCheckboxStateless: WorkbenchExample<typeof TestingCheckboxStatelessExample> =
	wb(TestingCheckboxStatelessExample);
export const TestingCheckbox: WorkbenchExample<typeof TestingCheckboxExample> =
	wb(TestingCheckboxExample);
export const TestingDefaultOpenComboboxTrigger: WorkbenchExample<
	typeof TestingDefaultOpenComboboxTriggerExample
> = wb(TestingDefaultOpenComboboxTriggerExample);
export const TestingRadio: WorkbenchExample<typeof TestingRadioExample> = wb(TestingRadioExample);
export const TestingDdmStateless: WorkbenchExample<typeof TestingDdmStatelessExample> = wb(
	TestingDdmStatelessExample,
);
export const TestingDdmDefault: WorkbenchExample<typeof TestingDdmDefaultExample> =
	wb(TestingDdmDefaultExample);
export const TestingComplexDropdownMenuVr: WorkbenchExample<
	typeof TestingComplexDropdownMenuVrExample
> = wb(TestingComplexDropdownMenuVrExample);
export const TestingPlacementsVr: WorkbenchExample<typeof TestingPlacementsVrExample> = wb(
	TestingPlacementsVrExample,
);
export const TestingVr: WorkbenchExample<typeof TestingVrExample> = wb(TestingVrExample);
export const SelectionStatesVr: WorkbenchExample<typeof SelectionStatesVrExample> =
	wb(SelectionStatesVrExample);
export const TestingTopLayerFocus: WorkbenchExample<typeof TestingTopLayerFocusExample> = wb(
	TestingTopLayerFocusExample,
);
