import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AllFlagsVrExample from './00-all-flags.vr.ap';
import AllFlagsDefaultIconsVrExample from './01-all-flags-default-icons.vr.ap';
import AllFlagsLegacyIconsVrExample from './02-all-flags-legacy-icons.vr.ap';
import FlagChangingAppearanceAndContentExample from './06-flag-changing-appearance-and-content';
import FlagWithADescriptionContainingALinkExample from './08-flag-with-a-description-containing-a-link';
import ProgramaticallyDismissingAFlagExample from './09-programatically-dismissing-a-flag';
import FlagAutoDismissExample from './10-flag-auto-dismiss';
import FlagGroupInDrawerExample from './11-flag-group-in-drawer';
import FlagGroupExample from './12-flag-group';
import FlagWithHrefActionsExample from './13-flag-with-href-actions';
import FlagsProviderExample from './14-flags-provider';
import FlagLongTitleVrExample from './15-flag-long-title.vr.ap';
import FlagLongContentVrExample from './16-flag-long-content.vr.ap';
import FlagWithCustomHeadingLevelExample from './17-flag-with-custom-heading-level';
import DifferentIconsVrExample from './18-different-icons.vr.ap';
import ExplicitFontStylesVrExample from './19-explicit-font-styles.vr.ap';
import FlagGroupInModalDialogVrExample from './20-flag-group-in-modal-dialog.vr.ap';
import FlagsProviderHideFlagExample from './21-flags-provider-hide-flag';
import FlagKeyboardDismissFromInputExample from './22-flag-keyboard-dismiss-from-input';
import TestingExample from './99-testing';
import FlagShouldRenderToParentTopLayerExample from './flag-should-render-to-parent-top-layer';
import TestingTopLayerFocusExample from './testing-top-layer-focus';
import VrFlagGroupTopLayerVrExample from './vr-flag-group-top-layer.vr.ap';

const AllFlagsVr: WorkbenchExample = wb(AllFlagsVrExample);

export default AllFlagsVr;
export const AllFlagsDefaultIconsVr: WorkbenchExample = wb(AllFlagsDefaultIconsVrExample);
export const AllFlagsLegacyIconsVr: WorkbenchExample = wb(AllFlagsLegacyIconsVrExample);
export const FlagChangingAppearanceAndContent: WorkbenchExample = wb(
	FlagChangingAppearanceAndContentExample,
);
export const FlagWithADescriptionContainingALink: WorkbenchExample = wb(
	FlagWithADescriptionContainingALinkExample,
);
export const ProgramaticallyDismissingAFlag: WorkbenchExample = wb(
	ProgramaticallyDismissingAFlagExample,
);
export const FlagAutoDismiss: WorkbenchExample = wb(FlagAutoDismissExample);
export const FlagGroupInDrawer: WorkbenchExample = wb(FlagGroupInDrawerExample);
export const FlagGroup: WorkbenchExample = wb(FlagGroupExample);
export const FlagWithHrefActions: WorkbenchExample = wb(FlagWithHrefActionsExample);
export const FlagsProvider: WorkbenchExample = wb(FlagsProviderExample);
export const FlagLongTitleVr: WorkbenchExample = wb(FlagLongTitleVrExample);
export const FlagLongContentVr: WorkbenchExample = wb(FlagLongContentVrExample);
export const FlagWithCustomHeadingLevel: WorkbenchExample = wb(FlagWithCustomHeadingLevelExample);
export const DifferentIconsVr: WorkbenchExample = wb(DifferentIconsVrExample);
export const ExplicitFontStylesVr: WorkbenchExample = wb(ExplicitFontStylesVrExample);
export const FlagGroupInModalDialogVr: WorkbenchExample = wb(FlagGroupInModalDialogVrExample);
export const FlagsProviderHideFlag: WorkbenchExample = wb(FlagsProviderHideFlagExample);
export const FlagKeyboardDismissFromInput: WorkbenchExample = wb(
	FlagKeyboardDismissFromInputExample,
);
export const Testing: WorkbenchExample = wb(TestingExample);
export const FlagShouldRenderToParentTopLayer: WorkbenchExample = wb(
	FlagShouldRenderToParentTopLayerExample,
);
export const TestingTopLayerFocus: WorkbenchExample = wb(TestingTopLayerFocusExample);
export const VrFlagGroupTopLayerVr: WorkbenchExample = wb(VrFlagGroupTopLayerVrExample);
