import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicAvatarVrExample from '../01-basic-avatar.vr.ap';
import CustomAvatarExample from '../02-custom-avatar';
import BasicAvatarItemVrExample from '../03-basic-avatar-item.vr.ap';
import BasicPresenceVrExample from '../04-basic-presence.vr.ap';
import BasicStatusVrExample from '../05-basic-status.vr.ap';
import AvatarCircleExample from '../06-avatar-circle';
import AvatarSquareExample from '../07-avatar-square';
import AvatarHexagonExample from '../08-avatar-hexagon';
import AvatarBackgroundsExample from '../09-avatar-backgrounds';
import BasicAvatarInteractiveVrExample from '../10-basic-avatar-interactive.vr.ap';
import AvatarLoadingBehaviourExample from '../11-avatar-loading-behaviour';
import PresenceBorderColorExample from '../12-presence-border-color';
import PresenceCustomComponentExample from '../13-presence-custom-component';
import PresenceSizeBehaviorExample from '../14-presence-size-behavior';
import SkeletonVrExample from '../15-skeleton.vr.ap';
import StatusCustomComponentExample from '../17-status-custom-component';
import AccessibleAvatarUsageExample from '../18-accessible-avatar-usage';
import AvatarContextExample from '../19-avatar-context';
import DecorativeExample from '../20-decorative';
import AvatarTriggerExample from '../21-avatar-trigger';

export const BasicAvatarVr: WorkbenchExample<typeof BasicAvatarVrExample> =
	wb(BasicAvatarVrExample);

export const CustomAvatar: WorkbenchExample<typeof CustomAvatarExample> = wb(CustomAvatarExample);
// Named "BasicAvatarItem" to match the Workbench URL used by existing integration tests.
export const BasicAvatarItem: WorkbenchExample<typeof BasicAvatarItemVrExample> =
	wb(BasicAvatarItemVrExample);
export const BasicPresenceVr: WorkbenchExample<typeof BasicPresenceVrExample> =
	wb(BasicPresenceVrExample);
export const BasicStatusVr: WorkbenchExample<typeof BasicStatusVrExample> =
	wb(BasicStatusVrExample);
export const AvatarCircle: WorkbenchExample<typeof AvatarCircleExample> = wb(AvatarCircleExample);
export const AvatarSquare: WorkbenchExample<typeof AvatarSquareExample> = wb(AvatarSquareExample);
export const AvatarHexagon: WorkbenchExample<typeof AvatarHexagonExample> =
	wb(AvatarHexagonExample);
export const AvatarBackgrounds: WorkbenchExample<typeof AvatarBackgroundsExample> =
	wb(AvatarBackgroundsExample);
export const BasicAvatarInteractiveVr: WorkbenchExample<typeof BasicAvatarInteractiveVrExample> =
	wb(BasicAvatarInteractiveVrExample);
export const AvatarLoadingBehaviour: WorkbenchExample<typeof AvatarLoadingBehaviourExample> = wb(
	AvatarLoadingBehaviourExample,
);
export const PresenceBorderColor: WorkbenchExample<typeof PresenceBorderColorExample> = wb(
	PresenceBorderColorExample,
);
export const PresenceCustomComponent: WorkbenchExample<typeof PresenceCustomComponentExample> = wb(
	PresenceCustomComponentExample,
);
export const PresenceSizeBehavior: WorkbenchExample<typeof PresenceSizeBehaviorExample> = wb(
	PresenceSizeBehaviorExample,
);
export const SkeletonVr: WorkbenchExample<typeof SkeletonVrExample> = wb(SkeletonVrExample);
export const StatusCustomComponent: WorkbenchExample<typeof StatusCustomComponentExample> = wb(
	StatusCustomComponentExample,
);
export const AccessibleAvatarUsage: WorkbenchExample<typeof AccessibleAvatarUsageExample> = wb(
	AccessibleAvatarUsageExample,
);
export const AvatarContext: WorkbenchExample<typeof AvatarContextExample> =
	wb(AvatarContextExample);
export const Decorative: WorkbenchExample<typeof DecorativeExample> = wb(DecorativeExample);
export const AvatarTrigger: WorkbenchExample<typeof AvatarTriggerExample> =
	wb(AvatarTriggerExample);
