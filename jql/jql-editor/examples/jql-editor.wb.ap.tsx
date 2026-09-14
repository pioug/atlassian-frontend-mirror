import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicEditorExample } from './00-basic-editor';
import { default as UserNodesExample } from './01-user-nodes';
import { default as ExternalErrorsExample } from './02-external-errors';
import { default as NoSearchButtonExample } from './03-no-search-button';
import { default as CompactEditorExample } from './04-compact-editor';
import { default as SearchingExample } from './05-searching';
import { default as ReadOnlyExample } from './06-read-only';
import { default as TeamNodesExample } from './07-team-nodes.vr.ap';
import { default as AiAgentUsersExample } from './08-ai-agent-users.vr.ap';
import { default as MembersOfTeamNodesExample } from './09-membersof-team-nodes.vr.ap';
import { default as ProjectNodesExample } from './10-project-nodes.vr.ap';
import { default as GoalNodesExample } from './11-goal-nodes.vr.ap';
import { default as FunctionArgumentNodesExample } from './12-function-argument-nodes';

export const BasicEditor: WorkbenchExample = wb(BasicEditorExample);
export const UserNodes: WorkbenchExample = wb(UserNodesExample);
export const ExternalErrors: WorkbenchExample = wb(ExternalErrorsExample);
export const NoSearchButton: WorkbenchExample = wb(NoSearchButtonExample);
export const CompactEditor: WorkbenchExample = wb(CompactEditorExample);
export const Searching: WorkbenchExample = wb(SearchingExample);
export const ReadOnly: WorkbenchExample = wb(ReadOnlyExample);
export const TeamNodes: WorkbenchExample = wb(TeamNodesExample);
export const AiAgentUsers: WorkbenchExample = wb(AiAgentUsersExample);
export const MembersOfTeamNodes: WorkbenchExample = wb(MembersOfTeamNodesExample);
export const ProjectNodes: WorkbenchExample = wb(ProjectNodesExample);
export const GoalNodes: WorkbenchExample = wb(GoalNodesExample);
export const FunctionArgumentNodes: WorkbenchExample = wb(FunctionArgumentNodesExample);
