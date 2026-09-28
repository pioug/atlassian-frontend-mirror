import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupVrExample from '../10-popup.vr.ap';
import AsynchronousPopupExample from '../11-asynchronous-popup';
import MultiplePopupsExample from '../12-multiple-popups';
import SettingFocusExample from '../13-setting-focus';
import DoublePopupExample from '../14-double-popup';
import PopupWithSelectVrExample from '../15-popup-with-select.vr.ap';
import PopupCompositionExample from '../16-popup-composition';
import PopupWithA11yPropsExample from '../16-popup-with-a11y-props';
import ExperimentalExample from '../17-experimental';
import ShouldFitContainerVrExample from '../18-should-fit-container.vr.ap';
import PopupRoleDialogVrExample from '../19-popup-role-dialog.vr.ap';
import PopupShouldCloseOnTabExample from '../20-popup-should-close-on-tab';
import PopupShouldRenderToParentExample from '../21-popup-should-render-to-parent';
import ModalPopupCompositionVrExample from '../22-modal-popup-composition.vr.ap';
import ModalPopupVrExample from '../22-modal-popup.vr.ap';
import PopupCompositionTopLayerVrExample from '../23-popup-composition-top-layer.vr.ap';
import TestingInitialFocusMatrixExample from '../97-testing-initial-focus-matrix';
import TestingFitViewportExample from '../98-testing-fit-viewport';
import ColorInheritanceVrExample from '../color-inheritance.vr.ap';
import ContentUpdatesExample from '../content-updates';
import ContentWithoutPortalExample from '../content-without-portal';
import CustomExample from '../custom';
import DefaultExample from '../default';
import FocusManagementLazyLoadedContentExample from '../focus-management-lazy-loaded-content';
import NestedExample from '../nested';
import PopupDisableAutofocusExample from '../popup-disable-autofocus';
import PopupDisableAutofocusVrExample from '../popup-disable-autofocus-vr';
import PopupOpenedOnkeydownVrExample from '../popup-opened-onkeydown.vr.ap';
import ShouldFitViewportExample from '../should-fit-viewport';
import ShouldNotReturnFocusExample from '../should-not-return-focus';
import SurfaceDetectionVrExample from '../surface-detection.vr.ap';
import TestingDropdownInsidePopupExample from '../testing-dropdown-inside-popup';
import TestingModalExample from '../testing-modal';
import TestingModalInsidePopupInsideDropdownExample from '../testing-modal-inside-popup-inside-dropdown';
import TestingNestedExample from '../testing-nested';
import TestingPageExample from '../testing-page';
import TestingPopupWithDatetimePickerEscapeExample from '../testing-popup-with-datetime-picker-escape';
import TestingPopupWithDropdownEscapeExample from '../testing-popup-with-dropdown-escape';
import TriggerlessExample from '../triggerless';

export const Popup: WorkbenchExample<typeof PopupVrExample> = wb(PopupVrExample);

export const AsynchronousPopup: WorkbenchExample<typeof AsynchronousPopupExample> =
	wb(AsynchronousPopupExample);
export const MultiplePopups: WorkbenchExample<typeof MultiplePopupsExample> =
	wb(MultiplePopupsExample);
export const SettingFocus: WorkbenchExample<typeof SettingFocusExample> = wb(SettingFocusExample);
export const DoublePopup: WorkbenchExample<typeof DoublePopupExample> = wb(DoublePopupExample);
export const PopupWithSelectVr: WorkbenchExample<typeof PopupWithSelectVrExample> =
	wb(PopupWithSelectVrExample);
export const PopupComposition: WorkbenchExample<typeof PopupCompositionExample> =
	wb(PopupCompositionExample);
export const PopupWithA11yProps: WorkbenchExample<typeof PopupWithA11yPropsExample> =
	wb(PopupWithA11yPropsExample);
export const Experimental: WorkbenchExample<typeof ExperimentalExample> = wb(ExperimentalExample);
// Named "ShouldFitContainer" to match the Workbench URL used by existing integration tests.
export const ShouldFitContainer: WorkbenchExample<typeof ShouldFitContainerVrExample> = wb(
	ShouldFitContainerVrExample,
);
// Named "PopupRoleDialog" to match the Workbench URL used by existing integration tests.
export const PopupRoleDialog: WorkbenchExample<typeof PopupRoleDialogVrExample> =
	wb(PopupRoleDialogVrExample);
export const PopupShouldCloseOnTab: WorkbenchExample<typeof PopupShouldCloseOnTabExample> = wb(
	PopupShouldCloseOnTabExample,
);
export const PopupShouldRenderToParent: WorkbenchExample<typeof PopupShouldRenderToParentExample> =
	wb(PopupShouldRenderToParentExample);
export const ModalPopupCompositionVr: WorkbenchExample<typeof ModalPopupCompositionVrExample> = wb(
	ModalPopupCompositionVrExample,
);
export const ModalPopupVr: WorkbenchExample<typeof ModalPopupVrExample> = wb(ModalPopupVrExample);
export const PopupCompositionTopLayerVr: WorkbenchExample<
	typeof PopupCompositionTopLayerVrExample
> = wb(PopupCompositionTopLayerVrExample);
export const TestingFitViewport: WorkbenchExample<typeof TestingFitViewportExample> =
	wb(TestingFitViewportExample);
export const TestingInitialFocusMatrix: WorkbenchExample<typeof TestingInitialFocusMatrixExample> =
	wb(TestingInitialFocusMatrixExample);
export const ColorInheritanceVr: WorkbenchExample<typeof ColorInheritanceVrExample> =
	wb(ColorInheritanceVrExample);
export const ContentUpdates: WorkbenchExample<typeof ContentUpdatesExample> =
	wb(ContentUpdatesExample);
export const ContentWithoutPortal: WorkbenchExample<typeof ContentWithoutPortalExample> = wb(
	ContentWithoutPortalExample,
);
export const Custom: WorkbenchExample<typeof CustomExample> = wb(CustomExample);
export const Default: WorkbenchExample<typeof DefaultExample> = wb(DefaultExample);
export const FocusManagementLazyLoadedContent: WorkbenchExample = wb(
	FocusManagementLazyLoadedContentExample,
);
export const Nested: WorkbenchExample<typeof NestedExample> = wb(NestedExample);
export const PopupDisableAutofocus: WorkbenchExample<typeof PopupDisableAutofocusExample> = wb(
	PopupDisableAutofocusExample,
);
export const PopupDisableAutofocusVr: WorkbenchExample<typeof PopupDisableAutofocusVrExample> = wb(
	PopupDisableAutofocusVrExample,
);
export const PopupOpenedOnkeydownVr: WorkbenchExample<typeof PopupOpenedOnkeydownVrExample> = wb(
	PopupOpenedOnkeydownVrExample,
);
export const ShouldFitViewport: WorkbenchExample<typeof ShouldFitViewportExample> =
	wb(ShouldFitViewportExample);
export const ShouldNotReturnFocus: WorkbenchExample<typeof ShouldNotReturnFocusExample> = wb(
	ShouldNotReturnFocusExample,
);
export const SurfaceDetectionVr: WorkbenchExample<typeof SurfaceDetectionVrExample> =
	wb(SurfaceDetectionVrExample);
export const TestingDropdownInsidePopup: WorkbenchExample<
	typeof TestingDropdownInsidePopupExample
> = wb(TestingDropdownInsidePopupExample);
export const TestingModal: WorkbenchExample<typeof TestingModalExample> = wb(TestingModalExample);
export const TestingModalInsidePopupInsideDropdown: WorkbenchExample = wb(
	TestingModalInsidePopupInsideDropdownExample,
);
export const TestingNested: WorkbenchExample<typeof TestingNestedExample> =
	wb(TestingNestedExample);
export const TestingPage: WorkbenchExample<typeof TestingPageExample> = wb(TestingPageExample);
export const TestingPopupWithDatetimePickerEscape: WorkbenchExample = wb(
	TestingPopupWithDatetimePickerEscapeExample,
);
export const TestingPopupWithDropdownEscape: WorkbenchExample = wb(
	TestingPopupWithDropdownEscapeExample,
);
export const Triggerless: WorkbenchExample<typeof TriggerlessExample> = wb(TriggerlessExample);
