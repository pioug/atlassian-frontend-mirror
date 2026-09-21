import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupVrExample from './10-popup.vr.ap';
import AsynchronousPopupExample from './11-asynchronous-popup';
import MultiplePopupsExample from './12-multiple-popups';
import SettingFocusExample from './13-setting-focus';
import DoublePopupExample from './14-double-popup';
import PopupWithSelectVrExample from './15-popup-with-select.vr.ap';
import PopupCompositionExample from './16-popup-composition';
import PopupWithA11yPropsExample from './16-popup-with-a11y-props';
import ExperimentalExample from './17-experimental';
import ShouldFitContainerVrExample from './18-should-fit-container.vr.ap';
import PopupRoleDialogVrExample from './19-popup-role-dialog.vr.ap';
import PopupShouldCloseOnTabExample from './20-popup-should-close-on-tab';
import PopupShouldRenderToParentExample from './21-popup-should-render-to-parent';
import ModalPopupCompositionVrExample from './22-modal-popup-composition.vr.ap';
import ModalPopupVrExample from './22-modal-popup.vr.ap';
import PopupCompositionTopLayerVrExample from './23-popup-composition-top-layer.vr.ap';
import TestingInitialFocusMatrixExample from './97-testing-initial-focus-matrix';
import TestingFitViewportExample from './98-testing-fit-viewport';
import ColorInheritanceVrExample from './color-inheritance.vr.ap';
import ContentUpdatesExample from './content-updates';
import ContentWithoutPortalExample from './content-without-portal';
import CustomExample from './custom';
import DefaultExample from './default';
import FocusManagementLazyLoadedContentExample from './focus-management-lazy-loaded-content';
import NestedExample from './nested';
import PopupDisableAutofocusExample from './popup-disable-autofocus';
import PopupDisableAutofocusVrExample from './popup-disable-autofocus-vr';
import PopupOpenedOnkeydownVrExample from './popup-opened-onkeydown.vr.ap';
import ShouldFitViewportExample from './should-fit-viewport';
import ShouldNotReturnFocusExample from './should-not-return-focus';
import SurfaceDetectionVrExample from './surface-detection.vr.ap';
import TestingDropdownInsidePopupExample from './testing-dropdown-inside-popup';
import TestingModalExample from './testing-modal';
import TestingModalInsidePopupInsideDropdownExample from './testing-modal-inside-popup-inside-dropdown';
import TestingNestedExample from './testing-nested';
import TestingPageExample from './testing-page';
import TestingPopupWithDatetimePickerEscapeExample from './testing-popup-with-datetime-picker-escape';
import TestingPopupWithDropdownEscapeExample from './testing-popup-with-dropdown-escape';
import TriggerlessExample from './triggerless';

// Explicit named export Used to generate integration-test URLs.
export const Popup: WorkbenchExample = wb(PopupVrExample);

// Default export required by accessibility tooling.
export default Popup;
export const AsynchronousPopup: WorkbenchExample = wb(AsynchronousPopupExample);
export const MultiplePopups: WorkbenchExample = wb(MultiplePopupsExample);
export const SettingFocus: WorkbenchExample = wb(SettingFocusExample);
export const DoublePopup: WorkbenchExample = wb(DoublePopupExample);
export const PopupWithSelectVr: WorkbenchExample = wb(PopupWithSelectVrExample);
export const PopupComposition: WorkbenchExample = wb(PopupCompositionExample);
export const PopupWithA11yProps: WorkbenchExample = wb(PopupWithA11yPropsExample);
export const Experimental: WorkbenchExample = wb(ExperimentalExample);
// Named "ShouldFitContainer" to match the Workbench URL used by existing integration tests.
export const ShouldFitContainer: WorkbenchExample = wb(ShouldFitContainerVrExample);
// Named "PopupRoleDialog" to match the Workbench URL used by existing integration tests.
export const PopupRoleDialog: WorkbenchExample = wb(PopupRoleDialogVrExample);
export const PopupShouldCloseOnTab: WorkbenchExample = wb(PopupShouldCloseOnTabExample);
export const PopupShouldRenderToParent: WorkbenchExample = wb(PopupShouldRenderToParentExample);
export const ModalPopupCompositionVr: WorkbenchExample = wb(ModalPopupCompositionVrExample);
export const ModalPopupVr: WorkbenchExample = wb(ModalPopupVrExample);
export const PopupCompositionTopLayerVr: WorkbenchExample = wb(PopupCompositionTopLayerVrExample);
export const TestingFitViewport: WorkbenchExample = wb(TestingFitViewportExample);
export const TestingInitialFocusMatrix: WorkbenchExample = wb(TestingInitialFocusMatrixExample);
export const ColorInheritanceVr: WorkbenchExample = wb(ColorInheritanceVrExample);
export const ContentUpdates: WorkbenchExample = wb(ContentUpdatesExample);
export const ContentWithoutPortal: WorkbenchExample = wb(ContentWithoutPortalExample);
export const Custom: WorkbenchExample = wb(CustomExample);
export const Default: WorkbenchExample = wb(DefaultExample);
export const FocusManagementLazyLoadedContent: WorkbenchExample = wb(
	FocusManagementLazyLoadedContentExample,
);
export const Nested: WorkbenchExample = wb(NestedExample);
export const PopupDisableAutofocus: WorkbenchExample = wb(PopupDisableAutofocusExample);
export const PopupDisableAutofocusVr: WorkbenchExample = wb(PopupDisableAutofocusVrExample);
export const PopupOpenedOnkeydownVr: WorkbenchExample = wb(PopupOpenedOnkeydownVrExample);
export const ShouldFitViewport: WorkbenchExample = wb(ShouldFitViewportExample);
export const ShouldNotReturnFocus: WorkbenchExample = wb(ShouldNotReturnFocusExample);
export const SurfaceDetectionVr: WorkbenchExample = wb(SurfaceDetectionVrExample);
export const TestingDropdownInsidePopup: WorkbenchExample = wb(TestingDropdownInsidePopupExample);
export const TestingModal: WorkbenchExample = wb(TestingModalExample);
export const TestingModalInsidePopupInsideDropdown: WorkbenchExample = wb(
	TestingModalInsidePopupInsideDropdownExample,
);
export const TestingNested: WorkbenchExample = wb(TestingNestedExample);
export const TestingPage: WorkbenchExample = wb(TestingPageExample);
export const TestingPopupWithDatetimePickerEscape: WorkbenchExample = wb(
	TestingPopupWithDatetimePickerEscapeExample,
);
export const TestingPopupWithDropdownEscape: WorkbenchExample = wb(
	TestingPopupWithDropdownEscapeExample,
);
export const Triggerless: WorkbenchExample = wb(TriggerlessExample);
