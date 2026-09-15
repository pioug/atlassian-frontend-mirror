import { wb, type WorkbenchExample } from '@atlassian/workbench';
import { default as ProfilecardExample } from './01-profilecard';
import { default as ProfilecardResourcedExample } from './02-profilecard-resourced';
import { default as ProfilecardOverviewVrExample } from './03-profilecard-overview.vr.ap';
import { default as ProfilecardInteractiveExample } from './04-profilecard-interactive';
import { default as ProfilecardTriggerExample } from './05-profilecard-trigger';
import { default as ProfilecardTriggerInteractiveExample } from './06-profilecard-trigger-interactive';
import { default as ProfilecardWithLinkExample } from './07-profilecard-with-link';
import { default as TeamProfilecardExample } from './08-team-profilecard';
import { default as TeamProfilecardTriggerExample } from './09-team-profilecard-trigger';
import { default as ProfilecardInlineEditExample } from './10-profilecard-inline-edit';
import { default as ProfilecardWithKudosExample } from './11-profilecard-with-kudos';
import { default as TriggerLinkTypesExample } from './11-trigger-link-types';
import { default as ProfilecardWithWorkspaceCheckExample } from './12-profilecard-with-workspace-check';
import { default as AgentProfilecardVrExample } from './13-agent-profilecard.vr.ap';
import { default as TempProfilecardCompiledComparisonExample } from './14-temp-profilecard-compiled-comparison';
import { default as TempTeamProfilecardFullExample } from './15-temp-team-profilecard-full';
import { default as ConnectedTeamsProfileCardExample } from './16-connected-teams-profile-card';
import { default as ServiceAccountProfilecardExample } from './17-service-account-profilecard';
import { default as AgentProfilecardInteractiveExample } from './18-agent-profilecard-interactive';

export const Profilecard: WorkbenchExample = wb(ProfilecardExample);
export const ProfilecardResourced: WorkbenchExample = wb(ProfilecardResourcedExample);
export const ProfilecardOverviewVr: WorkbenchExample = wb(ProfilecardOverviewVrExample);
export const ProfilecardInteractive: WorkbenchExample = wb(ProfilecardInteractiveExample);
export const ProfilecardTrigger: WorkbenchExample = wb(ProfilecardTriggerExample);
export const ProfilecardTriggerInteractive: WorkbenchExample = wb(
	ProfilecardTriggerInteractiveExample,
);
export const ProfilecardWithLink: WorkbenchExample = wb(ProfilecardWithLinkExample);
export const TeamProfilecard: WorkbenchExample = wb(TeamProfilecardExample);
export const TeamProfilecardTrigger: WorkbenchExample = wb(TeamProfilecardTriggerExample);
export const ProfilecardInlineEdit: WorkbenchExample = wb(ProfilecardInlineEditExample);
export const ProfilecardWithKudos: WorkbenchExample = wb(ProfilecardWithKudosExample);
export const TriggerLinkTypes: WorkbenchExample = wb(TriggerLinkTypesExample);
export const ProfilecardWithWorkspaceCheck: WorkbenchExample = wb(
	ProfilecardWithWorkspaceCheckExample,
);
export const AgentProfilecardVr: WorkbenchExample = wb(AgentProfilecardVrExample);
export const TempProfilecardCompiledComparison: WorkbenchExample = wb(
	TempProfilecardCompiledComparisonExample,
);
export const TempTeamProfilecardFull: WorkbenchExample = wb(TempTeamProfilecardFullExample);
export const ConnectedTeamsProfileCard: WorkbenchExample = wb(ConnectedTeamsProfileCardExample);
export const ServiceAccountProfilecard: WorkbenchExample = wb(ServiceAccountProfilecardExample);
export const AgentProfilecardInteractive: WorkbenchExample = wb(AgentProfilecardInteractiveExample);
