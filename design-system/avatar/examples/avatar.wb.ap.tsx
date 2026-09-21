import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicAvatarVrExample from './01-basic-avatar.vr.ap';
import CustomAvatarExample from './02-custom-avatar';
import BasicAvatarItemVrExample from './03-basic-avatar-item.vr.ap';
import BasicPresenceVrExample from './04-basic-presence.vr.ap';
import BasicStatusVrExample from './05-basic-status.vr.ap';
import AvatarCircleExample from './06-avatar-circle';
import AvatarSquareExample from './07-avatar-square';
import AvatarHexagonExample from './08-avatar-hexagon';
import AvatarBackgroundsExample from './09-avatar-backgrounds';
import BasicAvatarInteractiveVrExample from './10-basic-avatar-interactive.vr.ap';
import AvatarLoadingBehaviourExample from './11-avatar-loading-behaviour';
import PresenceBorderColorExample from './12-presence-border-color';
import PresenceCustomComponentExample from './13-presence-custom-component';
import PresenceSizeBehaviorExample from './14-presence-size-behavior';
import SkeletonVrExample from './15-skeleton.vr.ap';
import StatusCustomComponentExample from './17-status-custom-component';
import AccessibleAvatarUsageExample from './18-accessible-avatar-usage';
import AvatarContextExample from './19-avatar-context';
import DecorativeExample from './20-decorative';
import AvatarTriggerExample from './21-avatar-trigger';

const BasicAvatarVr: WorkbenchExample = wb(BasicAvatarVrExample);

export default BasicAvatarVr;
export const CustomAvatar: WorkbenchExample = wb(CustomAvatarExample);
// Named "BasicAvatarItem" to match the Workbench URL used by existing integration tests.
export const BasicAvatarItem: WorkbenchExample = wb(BasicAvatarItemVrExample);
export const BasicPresenceVr: WorkbenchExample = wb(BasicPresenceVrExample);
export const BasicStatusVr: WorkbenchExample = wb(BasicStatusVrExample);
export const AvatarCircle: WorkbenchExample = wb(AvatarCircleExample);
export const AvatarSquare: WorkbenchExample = wb(AvatarSquareExample);
export const AvatarHexagon: WorkbenchExample = wb(AvatarHexagonExample);
export const AvatarBackgrounds: WorkbenchExample = wb(AvatarBackgroundsExample);
export const BasicAvatarInteractiveVr: WorkbenchExample = wb(BasicAvatarInteractiveVrExample);
export const AvatarLoadingBehaviour: WorkbenchExample = wb(AvatarLoadingBehaviourExample);
export const PresenceBorderColor: WorkbenchExample = wb(PresenceBorderColorExample);
export const PresenceCustomComponent: WorkbenchExample = wb(PresenceCustomComponentExample);
export const PresenceSizeBehavior: WorkbenchExample = wb(PresenceSizeBehaviorExample);
export const SkeletonVr: WorkbenchExample = wb(SkeletonVrExample);
export const StatusCustomComponent: WorkbenchExample = wb(StatusCustomComponentExample);
export const AccessibleAvatarUsage: WorkbenchExample = wb(AccessibleAvatarUsageExample);
export const AvatarContext: WorkbenchExample = wb(AvatarContextExample);
export const Decorative: WorkbenchExample = wb(DecorativeExample);
export const AvatarTrigger: WorkbenchExample = wb(AvatarTriggerExample);
