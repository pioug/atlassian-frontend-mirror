import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ButtonExample from './05-button.vr.ap';
import LinkButtonsExample from './06-link-buttons.vr.ap';
import IconButtonExample from './07-icon-button.vr.ap';
import AllCombinationsExample from './10-all-combinations';
import IconButtonCombinationsExample from './11-icon-button-combinations';
import AppearancesExample from './15-appearances.vr.ap';
import SpacingExample from './20-spacing.vr.ap';
import DisabledExample from './25-disabled.vr.ap';
import ButtonsInFlexContainersExample from './26-buttons-in-flex-containers.vr.ap';
import IconBeforeAndAfterExample from './30-icon-before-and-after.vr.ap';
import ChevronIconSizingExample from './35-chevron-icon-sizing.vr.ap';
import TruncationExample from './40-truncation.vr.ap';
import ShouldFitContainerExample from './45-should-fit-container.vr.ap';
import AlignmentExample from './50-alignment.vr.ap';
import AutoFocusExample from './70-auto-focus.vr.ap';
import LoadingExample from './75-loading.vr.ap';
import LoadingButtonWithTimeoutExample from './76-loading-button-with-timeout';
import LinkButtonGlobalStylesExample from './80-link-button-global-styles.vr.ap';
import ButtonGroupExample from './90-button-group.vr.ap';
import SplitButtonNestedModalExample from './95-split-button-nested-modal.vr.ap';
import SplitButtonSlotsExample from './95-split-button-slots';
import SplitButtonExample from './95-split-button.vr.ap';
import AsDropdownTriggerExample from './98-as-dropdown-trigger';

// Explicit named export Used to generate integration-test URLs.
export const Button: WorkbenchExample = wb(ButtonExample);
// Default export required by accessibility tooling.
export default Button;

export const LinkButtons: WorkbenchExample = wb(LinkButtonsExample);
export const IconButton: WorkbenchExample = wb(IconButtonExample);
export const AllCombinations: WorkbenchExample = wb(AllCombinationsExample);
export const IconButtonCombinations: WorkbenchExample = wb(IconButtonCombinationsExample);
export const Appearances: WorkbenchExample = wb(AppearancesExample);
export const Spacing: WorkbenchExample = wb(SpacingExample);
export const Disabled: WorkbenchExample = wb(DisabledExample);
export const ButtonsInFlexContainers: WorkbenchExample = wb(ButtonsInFlexContainersExample);
export const IconBeforeAndAfter: WorkbenchExample = wb(IconBeforeAndAfterExample);
export const ChevronIconSizing: WorkbenchExample = wb(ChevronIconSizingExample);
export const Truncation: WorkbenchExample = wb(TruncationExample);
export const ShouldFitContainer: WorkbenchExample = wb(ShouldFitContainerExample);
export const Alignment: WorkbenchExample = wb(AlignmentExample);
export const AutoFocus: WorkbenchExample = wb(AutoFocusExample);
export const Loading: WorkbenchExample = wb(LoadingExample);
export const LoadingButtonWithTimeout: WorkbenchExample = wb(LoadingButtonWithTimeoutExample);
export const LinkButtonGlobalStyles: WorkbenchExample = wb(LinkButtonGlobalStylesExample);
export const ButtonGroup: WorkbenchExample = wb(ButtonGroupExample);
export const SplitButton: WorkbenchExample = wb(SplitButtonExample);
export const SplitButtonSlots: WorkbenchExample = wb(SplitButtonSlotsExample);
export const SplitButtonNestedModal: WorkbenchExample = wb(SplitButtonNestedModalExample);
export const AsDropdownTrigger: WorkbenchExample = wb(AsDropdownTriggerExample);
