import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicAvatarGroupVrExample from '../02-basic-avatar-group.vr.ap';
import NonInteractiveAvatarGroupExample from '../02-non-interactive-avatar-group';
import AvatarGroupBorderColorVrExample from '../03-avatar-group-border-color.vr.ap';
import AvatarGroupWithCustomAvatarExample from '../05-avatar-group-with-custom-avatar';
import AvatarGroupPlaygroundVrExample from '../10-avatar-group-playground.vr.ap';
import AvatarGroupIndexingExample from '../20-avatar-group-indexing';
import AvatarGroupWithCustomKeyPassedExample from '../30-avatar-group-with-custom-key-passed';
import OverridesExample from '../30-overrides';
import OverridesAvatarExample from '../30-overrides-avatar';
import OverridesMoreIndicatorVrExample from '../30-overrides-more-indicator.vr.ap';
import WithinModalExample from '../40-within-modal';
import TestingTopLayerFocusExample from '../testing-top-layer-focus';
import VrAvatarGroupSizesVrExample from '../vr-avatar-group-sizes.vr.ap';
import VrStackingContextVrExample from '../vr-stacking-context.vr.ap';

export const BasicAvatarGroup: WorkbenchExample<typeof BasicAvatarGroupVrExample> =
	wb(BasicAvatarGroupVrExample);
export const NonInteractiveAvatarGroup: WorkbenchExample<typeof NonInteractiveAvatarGroupExample> =
	wb(NonInteractiveAvatarGroupExample);
export const AvatarGroupBorderColorVr: WorkbenchExample<typeof AvatarGroupBorderColorVrExample> =
	wb(AvatarGroupBorderColorVrExample);
export const AvatarGroupWithCustomAvatar: WorkbenchExample<
	typeof AvatarGroupWithCustomAvatarExample
> = wb(AvatarGroupWithCustomAvatarExample);
export const AvatarGroupPlaygroundVr: WorkbenchExample<typeof AvatarGroupPlaygroundVrExample> = wb(
	AvatarGroupPlaygroundVrExample,
);
export const AvatarGroupIndexing: WorkbenchExample<typeof AvatarGroupIndexingExample> = wb(
	AvatarGroupIndexingExample,
);
export const AvatarGroupWithCustomKeyPassed: WorkbenchExample<
	typeof AvatarGroupWithCustomKeyPassedExample
> = wb(AvatarGroupWithCustomKeyPassedExample);
export const Overrides: WorkbenchExample<typeof OverridesExample> = wb(OverridesExample);
export const OverridesAvatar: WorkbenchExample<typeof OverridesAvatarExample> =
	wb(OverridesAvatarExample);
export const OverridesMoreIndicatorVr: WorkbenchExample<typeof OverridesMoreIndicatorVrExample> =
	wb(OverridesMoreIndicatorVrExample);
export const WithinModal: WorkbenchExample<typeof WithinModalExample> = wb(WithinModalExample);
export const TestingTopLayerFocus: WorkbenchExample<typeof TestingTopLayerFocusExample> = wb(
	TestingTopLayerFocusExample,
);
export const VrAvatarGroupSizesVr: WorkbenchExample<typeof VrAvatarGroupSizesVrExample> = wb(
	VrAvatarGroupSizesVrExample,
);
export const VrStackingContextVr: WorkbenchExample<typeof VrStackingContextVrExample> = wb(
	VrStackingContextVrExample,
);
