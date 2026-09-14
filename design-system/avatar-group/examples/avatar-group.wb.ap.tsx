import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicAvatarGroupVrExample from './02-basic-avatar-group.vr.ap';
import NonInteractiveAvatarGroupExample from './02-non-interactive-avatar-group';
import AvatarGroupBorderColorVrExample from './03-avatar-group-border-color.vr.ap';
import AvatarGroupWithCustomAvatarExample from './05-avatar-group-with-custom-avatar';
import AvatarGroupPlaygroundVrExample from './10-avatar-group-playground.vr.ap';
import AvatarGroupIndexingExample from './20-avatar-group-indexing';
import AvatarGroupWithCustomKeyPassedExample from './30-avatar-group-with-custom-key-passed';
import OverridesExample from './30-overrides';
import OverridesAvatarExample from './30-overrides-avatar';
import OverridesMoreIndicatorVrExample from './30-overrides-more-indicator.vr.ap';
import WithinModalExample from './40-within-modal';
import TestingTopLayerFocusExample from './testing-top-layer-focus';
import VrAvatarGroupSizesVrExample from './vr-avatar-group-sizes.vr.ap';
import VrStackingContextVrExample from './vr-stacking-context.vr.ap';

const BasicAvatarGroupVr: WorkbenchExample = wb(BasicAvatarGroupVrExample);

export default BasicAvatarGroupVr;
export const NonInteractiveAvatarGroup: WorkbenchExample = wb(NonInteractiveAvatarGroupExample);
export const AvatarGroupBorderColorVr: WorkbenchExample = wb(AvatarGroupBorderColorVrExample);
export const AvatarGroupWithCustomAvatar: WorkbenchExample = wb(AvatarGroupWithCustomAvatarExample);
export const AvatarGroupPlaygroundVr: WorkbenchExample = wb(AvatarGroupPlaygroundVrExample);
export const AvatarGroupIndexing: WorkbenchExample = wb(AvatarGroupIndexingExample);
export const AvatarGroupWithCustomKeyPassed: WorkbenchExample = wb(
	AvatarGroupWithCustomKeyPassedExample,
);
export const Overrides: WorkbenchExample = wb(OverridesExample);
export const OverridesAvatar: WorkbenchExample = wb(OverridesAvatarExample);
export const OverridesMoreIndicatorVr: WorkbenchExample = wb(OverridesMoreIndicatorVrExample);
export const WithinModal: WorkbenchExample = wb(WithinModalExample);
export const TestingTopLayerFocus: WorkbenchExample = wb(TestingTopLayerFocusExample);
export const VrAvatarGroupSizesVr: WorkbenchExample = wb(VrAvatarGroupSizesVrExample);
export const VrStackingContextVr: WorkbenchExample = wb(VrStackingContextVrExample);
