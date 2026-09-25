import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AgentProfileInfoExample from './01-agent-profile-info.vr.ap';
import AgentAvatarExample from './02-agent-avatar.vr.ap';
import AgentAvatarGeneratedExample from './03-agent-avatar-generated.vr.ap';
import AgentAvatarGeneratedSpecificExample from './04-agent-avatar-generated-specific.vr.ap';
import AgentDropdownMenuExample from './05-agent-dropdown-menu';
import IconExplorerExample from './06-icon-explorer';
import AgentAvatarAdsWrapperExample from './07-agent-avatar-updated-hexagon.vr.ap';

export const AgentProfileInfo: WorkbenchExample = wb(AgentProfileInfoExample);
export const AgentAvatar: WorkbenchExample = wb(AgentAvatarExample);
export const AgentAvatarGenerated: WorkbenchExample = wb(AgentAvatarGeneratedExample);
export const AgentAvatarGeneratedSpecific: WorkbenchExample = wb(
	AgentAvatarGeneratedSpecificExample,
);
export const AgentDropdownMenu: WorkbenchExample = wb(AgentDropdownMenuExample);
export const IconExplorer: WorkbenchExample = wb(IconExplorerExample);
export const AgentAvatarAdsWrapper: WorkbenchExample = wb(AgentAvatarAdsWrapperExample);
