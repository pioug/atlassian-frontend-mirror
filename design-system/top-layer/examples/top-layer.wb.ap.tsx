import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicPopoverExample from './01-basic-popover';
import PlacementVrExample from './02-placement.vr.ap';
import NestedPopoversVrExample from './03-nested-popovers.vr.ap';
import BasicDialogVrExample from './04-basic-dialog.vr.ap';
import PopoverInsideDialogExample from './06-popover-inside-dialog';
import PopoverSurfaceVariantsVrExample from './08-popover-surface-variants.vr.ap';
import TestingDomOrderExample from './100-testing-dom-order';
import TestingDialogTabTrapExample from './101-testing-dialog-tab-trap';
import TestingDialogAutofocusExample from './102-testing-dialog-autofocus';
import TestingPopoverProgrammaticCloseExample from './104-testing-popover-programmatic-close';
import TestingFocusReturnNoReopenExample from './105-testing-focus-return-no-reopen';
import TestingSiblingAutoCloseExample from './106-testing-sibling-auto-close';
import TestingPopoverModeHintExample from './107-testing-popover-mode-hint';
import TestingDialogCloseTimingExample from './110-testing-dialog-close-timing';
import TestingDialogDismissedByExample from './111-testing-dialog-dismissed-by';
import TestingPopoverPositioningExample from './112-testing-popover-positioning';
import TestingPopoverFlipExample from './113-testing-popover-flip';
import TestingPopoverWidthTriggerExample from './114-testing-popover-width-trigger';
import TestingPopoverAnimationExample from './115-testing-popover-animation';
import TestingManualCoexistenceExample from './116-testing-manual-coexistence';
import TestingPopoverScrollExample from './117-testing-popover-scroll';
import TestingPopoverRapidToggleExample from './118-testing-popover-rapid-toggle';
import TestingSimpleLightDismissExample from './119-testing-simple-light-dismiss';
import TestingManualPopoverA11yExample from './120-testing-manual-popover-a11y';
import TestingPopoverDialogFocusTrapExample from './121-testing-popover-dialog-focus-trap';
import TestingPopupFocusRestoreExample from './122-testing-popup-focus-restore';
import TestingPopoverInitialFocusExample from './123-testing-popover-initial-focus';
import TestingAnimationExitExample from './125-testing-animation-exit';
import TestingAnimationReducedMotionExample from './126-testing-animation-reduced-motion';
import TestingAnimationCallbacksExample from './127-testing-animation-callbacks';
import TestingKeyboardMouseInterleavingExample from './128-testing-keyboard-mouse-interleaving';
import TestingFocusReturnRefExample from './129-testing-focus-return-ref';
import TestingFormInPopupExample from './130-testing-form-in-popup';
import TestingRapidOpenToggleExample from './131-testing-rapid-open-toggle';
import TestingNativeFocusRestorationExample from './132-testing-native-focus-restoration';
import TestingManualPopoverFocusExample from './133-testing-manual-popover-focus';
import TestingNestedFocusScopeExample from './135-testing-nested-focus-scope';
import TestingClickOutsidePassthroughExample from './138-testing-click-outside-passthrough';
import TestingHintNoCloseAutoExample from './139-testing-hint-no-close-auto';
import TestingArrowNavigationExample from './140-testing-arrow-navigation';
import TestingNestedFocusRestorationExample from './140-testing-nested-focus-restoration';
import TestingFocusableBrowserEdgeCasesExample from './141-testing-focusable-browser-edge-cases';
import TestingNativeApiTimingExample from './150-testing-native-api-timing';
import TestingComboboxPopupInitialFocusExample from './151-testing-combobox-popup-initial-focus';
import TestingDialogSsrInitialOpenVrExample from './151-testing-dialog-ssr-initial-open.vr.ap';
import TestingNestedDialogEscapeExample from './152-testing-nested-dialog-escape';
import TestingSafariFlexCollapseVrExample from './153-testing-safari-flex-collapse.vr.ap';
import TestingSafariFlexCollapseMaxHeightVrExample from './154-testing-safari-flex-collapse-max-height.vr.ap';
import TestingSafariFlexCollapseMaxHeightBugVrExample from './156-testing-safari-flex-collapse-max-height-bug.vr.ap';
import TestingPointerEventsResetExample from './157-testing-pointer-events-reset';
import TestingPopoverDragAndDropExample from './158-testing-popover-drag-and-drop';
import TestingDialogDragAndDropExample from './159-testing-dialog-drag-and-drop';
import AnimatedPopoverExample from './16-animated-popover';
import StandalonePopoverContentExample from './17-standalone-popover-content';
import AnimatedPopoverRtlExample from './18-animated-popover-rtl';
import PopoverRolesExample from './21-popover-roles';
import VrPopoverPlacementsVrExample from './80-vr-popover-placements.vr.ap';
import VrPopoverCssFallbacksVrExample from './81-vr-popover-css-fallbacks.vr.ap';
import VrSurfaceInheritanceResetVrExample from './81-vr-surface-inheritance-reset.vr.ap';
import VrPopoverJsFallbackVrExample from './82-vr-popover-js-fallback.vr.ap';
import VrSurfaceColorInheritanceVrExample from './83-vr-surface-color-inheritance.vr.ap';
import VrPopoverPlacementOffsetVrExample from './85-vr-popover-placement-offset.vr.ap';
import VrPopoverWidthFromAnchorVrExample from './86-vr-popover-width-from-anchor.vr.ap';
import VrPopoverCrossAxisShiftVrExample from './87-vr-popover-cross-axis-shift.vr.ap';
import VrPopoverMinAnchorNarrowSpanVrExample from './88-vr-popover-min-anchor-narrow-span.vr.ap';
import TestingPopoverBasicExample from './90-testing-popover-basic';
import TestingDialogBasicExample from './91-testing-dialog-basic';
import TestingPopoverEscapeExample from './92-testing-popover-escape';
import TestingDialogCloseReasonExample from './93-testing-dialog-close-reason';
import TestingNestedPopoversExample from './94-testing-nested-popovers';
import TestingFocusReturnExample from './95-testing-focus-return';
import TestingDialogFocusTrapExample from './96-testing-dialog-focus-trap';
import TestingPopoverInDialogExample from './97-testing-popover-in-dialog';
import TestingDialogScrollLockExample from './98-testing-dialog-scroll-lock';
import AllPlacementsVrExample from './all-placements.vr.ap';
import VrMultiplePopoversOnSameAnchorVrExample from './vr-multiple-popovers-on-same-anchor.vr.ap';

const BasicPopover: WorkbenchExample = wb(BasicPopoverExample);

export default BasicPopover;
export const PlacementVr: WorkbenchExample = wb(PlacementVrExample);
export const NestedPopoversVr: WorkbenchExample = wb(NestedPopoversVrExample);
export const BasicDialogVr: WorkbenchExample = wb(BasicDialogVrExample);
export const PopoverInsideDialog: WorkbenchExample = wb(PopoverInsideDialogExample);
export const PopoverSurfaceVariantsVr: WorkbenchExample = wb(PopoverSurfaceVariantsVrExample);
export const TestingDomOrder: WorkbenchExample = wb(TestingDomOrderExample);
export const TestingDialogTabTrap: WorkbenchExample = wb(TestingDialogTabTrapExample);
export const TestingDialogAutofocus: WorkbenchExample = wb(TestingDialogAutofocusExample);
export const TestingPopoverProgrammaticClose: WorkbenchExample = wb(
	TestingPopoverProgrammaticCloseExample,
);
export const TestingFocusReturnNoReopen: WorkbenchExample = wb(TestingFocusReturnNoReopenExample);
export const TestingSiblingAutoClose: WorkbenchExample = wb(TestingSiblingAutoCloseExample);
export const TestingPopoverModeHint: WorkbenchExample = wb(TestingPopoverModeHintExample);
export const TestingDialogCloseTiming: WorkbenchExample = wb(TestingDialogCloseTimingExample);
export const TestingDialogDismissedBy: WorkbenchExample = wb(TestingDialogDismissedByExample);
export const TestingPopoverPositioning: WorkbenchExample = wb(TestingPopoverPositioningExample);
export const TestingPopoverFlip: WorkbenchExample = wb(TestingPopoverFlipExample);
export const TestingPopoverWidthTrigger: WorkbenchExample = wb(TestingPopoverWidthTriggerExample);
export const TestingPopoverAnimation: WorkbenchExample = wb(TestingPopoverAnimationExample);
export const TestingManualCoexistence: WorkbenchExample = wb(TestingManualCoexistenceExample);
export const TestingPopoverScroll: WorkbenchExample = wb(TestingPopoverScrollExample);
export const TestingPopoverRapidToggle: WorkbenchExample = wb(TestingPopoverRapidToggleExample);
export const TestingSimpleLightDismiss: WorkbenchExample = wb(TestingSimpleLightDismissExample);
export const TestingManualPopoverA11y: WorkbenchExample = wb(TestingManualPopoverA11yExample);
export const TestingPopoverDialogFocusTrap: WorkbenchExample = wb(
	TestingPopoverDialogFocusTrapExample,
);
export const TestingPopupFocusRestore: WorkbenchExample = wb(TestingPopupFocusRestoreExample);
export const TestingPopoverInitialFocus: WorkbenchExample = wb(TestingPopoverInitialFocusExample);
export const TestingAnimationExit: WorkbenchExample = wb(TestingAnimationExitExample);
export const TestingAnimationReducedMotion: WorkbenchExample = wb(
	TestingAnimationReducedMotionExample,
);
export const TestingAnimationCallbacks: WorkbenchExample = wb(TestingAnimationCallbacksExample);
export const TestingKeyboardMouseInterleaving: WorkbenchExample = wb(
	TestingKeyboardMouseInterleavingExample,
);
export const TestingFocusReturnRef: WorkbenchExample = wb(TestingFocusReturnRefExample);
export const TestingFormInPopup: WorkbenchExample = wb(TestingFormInPopupExample);
export const TestingRapidOpenToggle: WorkbenchExample = wb(TestingRapidOpenToggleExample);
export const TestingNativeFocusRestoration: WorkbenchExample = wb(
	TestingNativeFocusRestorationExample,
);
export const TestingManualPopoverFocus: WorkbenchExample = wb(TestingManualPopoverFocusExample);
export const TestingNestedFocusScope: WorkbenchExample = wb(TestingNestedFocusScopeExample);
export const TestingClickOutsidePassthrough: WorkbenchExample = wb(
	TestingClickOutsidePassthroughExample,
);
export const TestingHintNoCloseAuto: WorkbenchExample = wb(TestingHintNoCloseAutoExample);
export const TestingArrowNavigation: WorkbenchExample = wb(TestingArrowNavigationExample);
export const TestingNestedFocusRestoration: WorkbenchExample = wb(
	TestingNestedFocusRestorationExample,
);
export const TestingFocusableBrowserEdgeCases: WorkbenchExample = wb(
	TestingFocusableBrowserEdgeCasesExample,
);
export const TestingNativeApiTiming: WorkbenchExample = wb(TestingNativeApiTimingExample);
export const TestingComboboxPopupInitialFocus: WorkbenchExample = wb(
	TestingComboboxPopupInitialFocusExample,
);
export const TestingDialogSsrInitialOpenVr: WorkbenchExample = wb(
	TestingDialogSsrInitialOpenVrExample,
);
export const TestingNestedDialogEscape: WorkbenchExample = wb(TestingNestedDialogEscapeExample);
export const TestingSafariFlexCollapseVr: WorkbenchExample = wb(TestingSafariFlexCollapseVrExample);
export const TestingSafariFlexCollapseMaxHeightVr: WorkbenchExample = wb(
	TestingSafariFlexCollapseMaxHeightVrExample,
);
export const TestingSafariFlexCollapseMaxHeightBugVr: WorkbenchExample = wb(
	TestingSafariFlexCollapseMaxHeightBugVrExample,
);
export const TestingPointerEventsReset: WorkbenchExample = wb(TestingPointerEventsResetExample);
export const TestingPopoverDragAndDrop: WorkbenchExample = wb(TestingPopoverDragAndDropExample);
export const TestingDialogDragAndDrop: WorkbenchExample = wb(TestingDialogDragAndDropExample);
export const AnimatedPopover: WorkbenchExample = wb(AnimatedPopoverExample);
export const StandalonePopoverContent: WorkbenchExample = wb(StandalonePopoverContentExample);
export const AnimatedPopoverRtl: WorkbenchExample = wb(AnimatedPopoverRtlExample);
export const PopoverRoles: WorkbenchExample = wb(PopoverRolesExample);
export const VrPopoverPlacementsVr: WorkbenchExample = wb(VrPopoverPlacementsVrExample);
export const VrPopoverCssFallbacksVr: WorkbenchExample = wb(VrPopoverCssFallbacksVrExample);
export const VrSurfaceInheritanceResetVr: WorkbenchExample = wb(VrSurfaceInheritanceResetVrExample);
export const VrPopoverJsFallbackVr: WorkbenchExample = wb(VrPopoverJsFallbackVrExample);
export const VrSurfaceColorInheritanceVr: WorkbenchExample = wb(VrSurfaceColorInheritanceVrExample);
export const VrPopoverPlacementOffsetVr: WorkbenchExample = wb(VrPopoverPlacementOffsetVrExample);
export const VrPopoverWidthFromAnchorVr: WorkbenchExample = wb(VrPopoverWidthFromAnchorVrExample);
export const VrPopoverCrossAxisShiftVr: WorkbenchExample = wb(VrPopoverCrossAxisShiftVrExample);
export const VrPopoverMinAnchorNarrowSpanVr: WorkbenchExample = wb(
	VrPopoverMinAnchorNarrowSpanVrExample,
);
export const TestingPopoverBasic: WorkbenchExample = wb(TestingPopoverBasicExample);
export const TestingDialogBasic: WorkbenchExample = wb(TestingDialogBasicExample);
export const TestingPopoverEscape: WorkbenchExample = wb(TestingPopoverEscapeExample);
export const TestingDialogCloseReason: WorkbenchExample = wb(TestingDialogCloseReasonExample);
export const TestingNestedPopovers: WorkbenchExample = wb(TestingNestedPopoversExample);
export const TestingFocusReturn: WorkbenchExample = wb(TestingFocusReturnExample);
export const TestingDialogFocusTrap: WorkbenchExample = wb(TestingDialogFocusTrapExample);
export const TestingPopoverInDialog: WorkbenchExample = wb(TestingPopoverInDialogExample);
export const TestingDialogScrollLock: WorkbenchExample = wb(TestingDialogScrollLockExample);
export const AllPlacementsVr: WorkbenchExample = wb(AllPlacementsVrExample);
export const VrMultiplePopoversOnSameAnchorVr: WorkbenchExample = wb(
	VrMultiplePopoversOnSameAnchorVrExample,
);
