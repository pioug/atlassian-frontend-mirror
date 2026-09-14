import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultDropdownMenuExample from './01-default-dropdown-menu';
import ComplexDropdownMenuExample from './02-complex-dropdown-menu';
import StatelessDropdownMenuExample from './03-stateless-dropdown-menu';
import DropdownItemExample from './04-dropdown-item';
import DropdownItemCheckboxExample from './05-dropdown-item-checkbox';
import DropdownItemGroupsExample from './06-dropdown-item-groups';
import DropdownItemRadioExample from './07-dropdown-item-radio';
import DropdownItemWithAvatarsExample from './08-dropdown-item-with-avatars';
import DisabledButtonTriggerExample from './09-disabled-button-trigger';
import DropdownSpacingVrExample from './10-dropdown-spacing.vr.ap';
import CustomTriggersExample from './11-custom-triggers';
import NestedDropdownExample from './12-nested-dropdown';
import WithKeyboardInteractionExample from './14-with-keyboard-interaction';
import JiraStatusDropdownExample from './15-jira-status-dropdown';
import RenderInParentDropdownExample from './16-render-in-parent-dropdown';
import CustomTriggerWithOnclickExample from './17-custom-trigger-with-onclick';
import ShouldFitContainerVrExample from './18-should-fit-container.vr.ap';
import DropdownMenuMixedExample from './19-dropdown-menu-mixed';
import SettingZIndexVrExample from './20-setting-z-index.vr.ap';
import DropdownmenuFocusToRefOnCloseExample from './21-dropdownmenu-focus-to-ref-on-close';
import DropdownmenuFocusWhenRefNotProvidedExample from './22-dropdownmenu-focus-when-ref-not-provided';
import DropdownmenuFocusOnCustomTriggerExample from './23-dropdownmenu-focus-on-custom-trigger';
import DropdownTriggerFocusClickOutsideExample from './30-dropdown-trigger-focus-click-outside';
import TestingShouldPreventEscapePropagationExample from './88-testing-should-prevent-escape-propagation';
import TestingKeyboardNavigationDisabledItemsExample from './89-testing-keyboard-navigation-disabled-items';
import TestingReturnFocusRefRenderedInParentExample from './90-testing-return-focus-ref-rendered-in-parent';
import TestingReturnFocusRefRenderedInPortalExample from './90-testing-return-focus-ref-rendered-in-portal';
import TestingNestedKeyboardNavigationExample from './91-testing-nested-keyboard-navigation';
import TestingKeyboardNavigationExample from './92-testing-keyboard-navigation';
import TestingIsLoadingRepositionVrExample from './93-testing-is-loading-reposition.vr.ap';
import TestingNestedKeyboardNavigationTopLayerExample from './93-testing-nested-keyboard-navigation-top-layer';
import TestingCheckboxStatelessExample from './94-testing-checkbox-stateless';
import TestingCheckboxExample from './95-testing-checkbox';
import TestingDefaultOpenComboboxTriggerExample from './96-testing-default-open-combobox-trigger';
import TestingRadioExample from './96-testing-radio';
import TestingDdmStatelessExample from './97-testing-ddm-stateless';
import TestingDdmDefaultExample from './98-testing-ddm-default';
import TestingComplexDropdownMenuVrExample from './99-testing-complex-dropdown-menu.vr.ap';
import TestingPlacementsVrExample from './99-testing-placements.vr.ap';
import TestingVrExample from './99-testing.vr.ap';
import SelectionStatesVrExample from './selection-states.vr.ap';
import TestingTopLayerFocusExample from './testing-top-layer-focus';

const DefaultDropdownMenu: WorkbenchExample = wb(DefaultDropdownMenuExample);

export default DefaultDropdownMenu;
export const ComplexDropdownMenu: WorkbenchExample = wb(ComplexDropdownMenuExample);
export const StatelessDropdownMenu: WorkbenchExample = wb(StatelessDropdownMenuExample);
export const DropdownItem: WorkbenchExample = wb(DropdownItemExample);
export const DropdownItemCheckbox: WorkbenchExample = wb(DropdownItemCheckboxExample);
export const DropdownItemGroups: WorkbenchExample = wb(DropdownItemGroupsExample);
export const DropdownItemRadio: WorkbenchExample = wb(DropdownItemRadioExample);
export const DropdownItemWithAvatars: WorkbenchExample = wb(DropdownItemWithAvatarsExample);
export const DisabledButtonTrigger: WorkbenchExample = wb(DisabledButtonTriggerExample);
export const DropdownSpacingVr: WorkbenchExample = wb(DropdownSpacingVrExample);
export const CustomTriggers: WorkbenchExample = wb(CustomTriggersExample);
export const NestedDropdown: WorkbenchExample = wb(NestedDropdownExample);
export const WithKeyboardInteraction: WorkbenchExample = wb(WithKeyboardInteractionExample);
export const JiraStatusDropdown: WorkbenchExample = wb(JiraStatusDropdownExample);
export const RenderInParentDropdown: WorkbenchExample = wb(RenderInParentDropdownExample);
export const CustomTriggerWithOnclick: WorkbenchExample = wb(CustomTriggerWithOnclickExample);
export const ShouldFitContainerVr: WorkbenchExample = wb(ShouldFitContainerVrExample);
export const DropdownMenuMixed: WorkbenchExample = wb(DropdownMenuMixedExample);
export const SettingZIndexVr: WorkbenchExample = wb(SettingZIndexVrExample);
export const DropdownmenuFocusToRefOnClose: WorkbenchExample = wb(
	DropdownmenuFocusToRefOnCloseExample,
);
export const DropdownmenuFocusWhenRefNotProvided: WorkbenchExample = wb(
	DropdownmenuFocusWhenRefNotProvidedExample,
);
export const DropdownmenuFocusOnCustomTrigger: WorkbenchExample = wb(
	DropdownmenuFocusOnCustomTriggerExample,
);
export const DropdownTriggerFocusClickOutside: WorkbenchExample = wb(
	DropdownTriggerFocusClickOutsideExample,
);
export const TestingShouldPreventEscapePropagation: WorkbenchExample = wb(
	TestingShouldPreventEscapePropagationExample,
);
export const TestingKeyboardNavigationDisabledItems: WorkbenchExample = wb(
	TestingKeyboardNavigationDisabledItemsExample,
);
export const TestingReturnFocusRefRenderedInParent: WorkbenchExample = wb(
	TestingReturnFocusRefRenderedInParentExample,
);
export const TestingReturnFocusRefRenderedInPortal: WorkbenchExample = wb(
	TestingReturnFocusRefRenderedInPortalExample,
);
export const TestingNestedKeyboardNavigation: WorkbenchExample = wb(
	TestingNestedKeyboardNavigationExample,
);
export const TestingKeyboardNavigation: WorkbenchExample = wb(TestingKeyboardNavigationExample);
export const TestingIsLoadingRepositionVr: WorkbenchExample = wb(
	TestingIsLoadingRepositionVrExample,
);
export const TestingNestedKeyboardNavigationTopLayer: WorkbenchExample = wb(
	TestingNestedKeyboardNavigationTopLayerExample,
);
export const TestingCheckboxStateless: WorkbenchExample = wb(TestingCheckboxStatelessExample);
export const TestingCheckbox: WorkbenchExample = wb(TestingCheckboxExample);
export const TestingDefaultOpenComboboxTrigger: WorkbenchExample = wb(
	TestingDefaultOpenComboboxTriggerExample,
);
export const TestingRadio: WorkbenchExample = wb(TestingRadioExample);
export const TestingDdmStateless: WorkbenchExample = wb(TestingDdmStatelessExample);
export const TestingDdmDefault: WorkbenchExample = wb(TestingDdmDefaultExample);
export const TestingComplexDropdownMenuVr: WorkbenchExample = wb(
	TestingComplexDropdownMenuVrExample,
);
export const TestingPlacementsVr: WorkbenchExample = wb(TestingPlacementsVrExample);
export const TestingVr: WorkbenchExample = wb(TestingVrExample);
export const SelectionStatesVr: WorkbenchExample = wb(SelectionStatesVrExample);
export const TestingTopLayerFocus: WorkbenchExample = wb(TestingTopLayerFocusExample);
