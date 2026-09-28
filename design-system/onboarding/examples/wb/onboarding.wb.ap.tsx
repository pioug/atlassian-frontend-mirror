import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DifferentSpotlightsVrExample from '../00-different-spotlights.vr.ap';
import NewFeaturePatternExample from '../00-new-feature-pattern';
import NewUserPatternExample from '../00-new-user-pattern';
import SpotlightBasicExample from '../10-spotlight-basic';
import SpotlightBasicChildrenFunctionVrExample from '../11-spotlight-basic-children-function.vr.ap';
import SpotlightTargetNodeExample from '../15-spotlight-target-node';
import SpotlightAutoscrollExample from '../20-spotlight-autoscroll';
import SpotlightDialogPlacementVrExample from '../30-spotlight-dialog-placement.vr.ap';
import SpotlightDialogWidthExample from '../40-spotlight-dialog-width';
import SpotlightTargetBackgroundExample from '../50-spotlight-target-background';
import SpotlightTargetRadiusExample from '../60-spotlight-target-radius';
import SpotlightTargetReplacementExample from '../70-spotlight-target-replacement';
import SpotlightBlanketTintExample from '../80-spotlight-blanket-tint';
import SpotlightButtonAppearanceVrExample from '../90-spotlight-button-appearance.vr.ap';
import SpotlightTargetFixedPositionExample from '../95-spotlight-target-fixed-position';
import SpotlightWithoutPulseVrExample from '../96-spotlight-without-pulse.vr.ap';
import SpotlightPulseExample from '../97-spotlight-pulse';
import ModalBasicVrExample from '../99-modal-basic.vr.ap';
import ModalUsingModalDialogExample from '../99-modal-using-modal-dialog';
import SpotlightRelativeTargetExample from '../100-spotlight-relative-target';
import ModalWideButtonTextVrExample from '../101-modal-wide-button-text.vr.ap';
import SpotlightWithConditionalTargetsExample from '../102-spotlight-with-conditional-targets';
import CustomThemedButtonsExample from '../103-custom-themed-buttons';
import SpotlightTargetHeightVrExample from '../104-spotlight-target-height.vr.ap';
import SpotlightTargetTabsExample from '../105-spotlight-target-tabs';
import SpotlightDropdownExample from '../106-spotlight-dropdown';
import SpotlightBasicWithLabelExample from '../107-spotlight-basic-with-label';

export const DifferentSpotlightsVr: WorkbenchExample<typeof DifferentSpotlightsVrExample> = wb(
	DifferentSpotlightsVrExample,
);

export const NewFeaturePattern: WorkbenchExample<typeof NewFeaturePatternExample> =
	wb(NewFeaturePatternExample);
export const NewUserPattern: WorkbenchExample<typeof NewUserPatternExample> =
	wb(NewUserPatternExample);
export const SpotlightBasic: WorkbenchExample<typeof SpotlightBasicExample> =
	wb(SpotlightBasicExample);
export const SpotlightRelativeTarget: WorkbenchExample<typeof SpotlightRelativeTargetExample> = wb(
	SpotlightRelativeTargetExample,
);
export const ModalWideButtonTextVr: WorkbenchExample<typeof ModalWideButtonTextVrExample> = wb(
	ModalWideButtonTextVrExample,
);
export const SpotlightWithConditionalTargets: WorkbenchExample<
	typeof SpotlightWithConditionalTargetsExample
> = wb(SpotlightWithConditionalTargetsExample);
export const CustomThemedButtons: WorkbenchExample<typeof CustomThemedButtonsExample> = wb(
	CustomThemedButtonsExample,
);
export const SpotlightTargetHeightVr: WorkbenchExample<typeof SpotlightTargetHeightVrExample> = wb(
	SpotlightTargetHeightVrExample,
);
export const SpotlightTargetTabs: WorkbenchExample<typeof SpotlightTargetTabsExample> = wb(
	SpotlightTargetTabsExample,
);
export const SpotlightDropdown: WorkbenchExample<typeof SpotlightDropdownExample> =
	wb(SpotlightDropdownExample);
export const SpotlightBasicWithLabel: WorkbenchExample<typeof SpotlightBasicWithLabelExample> = wb(
	SpotlightBasicWithLabelExample,
);
export const SpotlightBasicChildrenFunctionVr: WorkbenchExample<
	typeof SpotlightBasicChildrenFunctionVrExample
> = wb(SpotlightBasicChildrenFunctionVrExample);
export const SpotlightTargetNode: WorkbenchExample<typeof SpotlightTargetNodeExample> = wb(
	SpotlightTargetNodeExample,
);
export const SpotlightAutoscroll: WorkbenchExample<typeof SpotlightAutoscrollExample> = wb(
	SpotlightAutoscrollExample,
);
export const SpotlightDialogPlacementVr: WorkbenchExample<
	typeof SpotlightDialogPlacementVrExample
> = wb(SpotlightDialogPlacementVrExample);
export const SpotlightDialogWidth: WorkbenchExample<typeof SpotlightDialogWidthExample> = wb(
	SpotlightDialogWidthExample,
);
export const SpotlightTargetBackground: WorkbenchExample<typeof SpotlightTargetBackgroundExample> =
	wb(SpotlightTargetBackgroundExample);
export const SpotlightTargetRadius: WorkbenchExample<typeof SpotlightTargetRadiusExample> = wb(
	SpotlightTargetRadiusExample,
);
export const SpotlightTargetReplacement: WorkbenchExample<
	typeof SpotlightTargetReplacementExample
> = wb(SpotlightTargetReplacementExample);
export const SpotlightBlanketTint: WorkbenchExample<typeof SpotlightBlanketTintExample> = wb(
	SpotlightBlanketTintExample,
);
export const SpotlightButtonAppearanceVr: WorkbenchExample<
	typeof SpotlightButtonAppearanceVrExample
> = wb(SpotlightButtonAppearanceVrExample);
export const SpotlightTargetFixedPosition: WorkbenchExample<
	typeof SpotlightTargetFixedPositionExample
> = wb(SpotlightTargetFixedPositionExample);
export const SpotlightWithoutPulseVr: WorkbenchExample<typeof SpotlightWithoutPulseVrExample> = wb(
	SpotlightWithoutPulseVrExample,
);
export const SpotlightPulse: WorkbenchExample<typeof SpotlightPulseExample> =
	wb(SpotlightPulseExample);
export const ModalBasicVr: WorkbenchExample<typeof ModalBasicVrExample> = wb(ModalBasicVrExample);
export const ModalUsingModalDialog: WorkbenchExample<typeof ModalUsingModalDialogExample> = wb(
	ModalUsingModalDialogExample,
);
