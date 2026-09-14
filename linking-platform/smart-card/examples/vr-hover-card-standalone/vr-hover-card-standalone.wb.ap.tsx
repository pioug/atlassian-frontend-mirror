import { wb, type WorkbenchExample } from '@atlassian/workbench';
import VrHoverCardConfluenceExample from './vr-hover-card-confluence.vr.ap';
import VrHoverCardForSlackMessageExample from './vr-hover-card-for-slack-message.vr.ap';
import VrHoverCardForbiddenJiraExample from './vr-hover-card-forbidden-jira.vr.ap';
import VrHoverCardJiraAssignedIssueExample from './vr-hover-card-jira-assigned-issue.vr.ap';
import VrHoverCardJiraProjectExample from './vr-hover-card-jira-project.vr.ap';
import VrHoverCardJiraUnassignedIssueExample from './vr-hover-card-jira-unassigned-issue.vr.ap';
import VrHoverCardLayoutExample from './vr-hover-card-layout.vr.ap';
import VrHoverCardWithImagePreviewExample from './vr-hover-card-with-image-preview.vr.ap';

export const VrHoverCardConfluence: WorkbenchExample = wb(VrHoverCardConfluenceExample);
export const VrHoverCardForSlackMessage: WorkbenchExample = wb(VrHoverCardForSlackMessageExample);
export const VrHoverCardForbiddenJira: WorkbenchExample = wb(VrHoverCardForbiddenJiraExample);
export const VrHoverCardJiraAssignedIssue: WorkbenchExample = wb(
	VrHoverCardJiraAssignedIssueExample,
);
export const VrHoverCardJiraProject: WorkbenchExample = wb(VrHoverCardJiraProjectExample);
export const VrHoverCardJiraUnassignedIssue: WorkbenchExample = wb(
	VrHoverCardJiraUnassignedIssueExample,
);
export const VrHoverCardLayout: WorkbenchExample = wb(VrHoverCardLayoutExample);
export const VrHoverCardWithImagePreview: WorkbenchExample = wb(VrHoverCardWithImagePreviewExample);
