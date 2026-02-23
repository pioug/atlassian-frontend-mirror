/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::c6459d5c7859139ba640983c40f5c40e>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen teams-app-internal-analytics
 */
export type PackageMetaDataType = {
	packageName: string;
	packageVersion: string;
};

export type ButtonClickedAnalyticsExampleAttributesType = {
	testAttribute: string;
};
export type AutomationTriggeredAnalyticsExampleAttributesType = {
	testAttribute: string;
};
export type AutomationFiredAnalyticsExampleAttributesType = {
	testAttribute: string;
};
export type AnalyticsExampleScreenViewedAttributesType = {
	testAttribute: string;
};
export type AssignTeamToASiteMessageViewedAttributesType = {};
export type AssignThisTeamToASiteClickedAttributesType = {};
export type AssignTeamToASiteModalViewedAttributesType = {};
export type AssignTeamToASiteSiteSelectedSelectedAttributesType = {
	isSuggestedSite: boolean;
};
export type AssignTeamToASiteConfirmButtonClickedAttributesType = {
	success: boolean;
};
export type AssignTeamToASiteCancelButtonClickedAttributesType = {};
export type MemberPickerErrorAttributesType = {};
export type RequestedContainersRequestedAttributesType = {
	containers: Record<string, unknown>;
};
export type TeamCreateDialogViewedAttributesType = {
	proposedMembersLength: number;
};
export type MemberSuggestedAttributesType = {};
export type TeamCreateDialogSubmittedAttributesType = {
	canCreateTeam: boolean;
	numberOfMembers: number;
	numberOfSuggestedMembers: number;
};
export type TeamCreateDialogClickedTeamLinkSuccessFlagAttributesType = {
	teamId: string;
	numberOfMembers: number;
};
export type TeamCreateDialogSucceededAttributesType = {
	teamId: string;
	numberOfMembers: number;
	numberOfSuggestedMembers: number;
	defaultTeamType: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL' | 'ORG_ADMIN_MANAGED' | null;
	chosenTeamType: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL' | 'ORG_ADMIN_MANAGED';
	teamTypeChoiceEnabled: boolean | null;
};
export type TeamCreateDialogFailedAttributesType = {
	numberOfMembers: number;
	errorMessage: string;
	errorStack: string | null;
	errorStatus: number;
	traceId: string | null;
};
export type TeamTypePickerClickedAttributesType = {
	defaultType: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL' | 'ORG_ADMIN_MANAGED' | null;
	chosenType: 'OPEN' | 'MEMBER_INVITE';
};
export type TeamCreateDialogClosedAttributesType = {};
export type InviteCapabilitiesServiceFailedAttributesType = {
	integration: string;
	products: unknown[];
};
export type AddToTeamServiceFailedAttributesType = {
	integration: string;
	message: string | null;
	errorsCount: number | null;
	errors: unknown[] | null;
};
export type TeamSuggestionsRecommendedUsersSucceededAttributesType = {
	recommendedUsers: number;
};
export type TeamSuggestionsRecommendedUsersFailedAttributesType = {
	recommendedUsers: number;
	errors: unknown[] | null;
};
export type InvitedTeamMembersAddedAttributesType = {
	numberOfMembers: number;
	members: unknown[];
	integration: string;
};
export type InviteToProductServiceFailedAttributesType = {
	integration: string;
	message: string | null;
	errorsCount: number | null;
	errors: unknown[] | null;
	result: unknown[] | null;
};
export type ContainerPermissionsSucceededAttributesType = {
	canCreateConfluenceContainer: boolean;
	canCreateJiraContainer: boolean;
	canCreateLoomContainer: boolean;
};
export type TeamWorkedOnRenderedAttributesType = {
	state: 'error' | 'empty' | 'data' | 'unknown';
};
export type TeamWorkedOnFailedAttributesType = {
	error: string | null;
	traceId: string | null;
	status: number | null;
	statusText: string | null;
};
export type TeamWorkedOnSucceededAttributesType = {
	error: string | null;
	traceId: string | null;
	status: number | null;
	statusText: string | null;
};
export type ViewAllIssuesClickedAttributesType = {
	isOpenNewTab: boolean;
	teamId: string;
};
export type TeamWorkedOnLinkClickedAttributesType = {
	isOpenNewTab: boolean;
};
export type NavigationMenuItemClickedAddPeopleNavigationMenuItemAttributesType = {
	product: string;
	integration: string;
};
export type CreateNewTeamLinkClickedAttributesType = {};
export type ViewAllPeopleDirectoryClickedAttributesType = {
	isLeftClick: boolean;
};
export type PeopleMenuLinkClickedAttributesType = {
	isLeftClick: boolean;
};
export type PeopleMenuViewedLoadingIndicatorAttributesType = {
	duration: number;
	startTime: number;
};
export type TeamMenuLinkClickedAttributesType = {
	isLeftClick: boolean;
};
export type PeopleMenuViewedAttributesType = {
	isCacheEmpty: boolean;
};
export type AddPeopleNavigationItemRenderedAttributesType = {};
export type PeopleMenuViewedNoBrowsePermissionAttributesType = {};
export type PeopleMenuSucceededAttributesType = {
	usersCount: number;
	teamsCount: number;
	duration: number;
	startTime: number;
};
export type HoverAndClickPeopleButtonMeasuredAttributesType = {
	duration: number;
	startTime: number;
};
export type PreFetchDataTriggeredAttributesType = {};
export type FetchingUsersTeamsDataMeasuredAttributesType = {
	duration: number;
	startTime: number;
};
export type PeopleMenuLinkSucceededAttributesType = {};
export type PeopleMenuLinkFailedAttributesType = {
	status: number | null;
	error: string;
};
export type TeamMenuLinkSucceededAttributesType = {};
export type TeamMenuLinkFailedAttributesType = {
	status: number | null;
	error: string;
};
export type TeamProfileBreadcrumbsItemClickedAttributesType = {
	targetTeamId: string;
};
export type HierarchyTeamLinkOutClickedAttributesType = {
	targetTeamId: string;
};
export type HierarchyFieldHoveredAttributesType = undefined;
export type ParentTeamLinkerOpenedAttributesType = {};
export type ParentTeamLinkerClosedAttributesType = {
	isCanceled: boolean;
	newParentTeamId: string;
};
export type AddParentTeamFailedAttributesType = {
	parentTeamId: string;
	error: string;
};
export type RemoveParentTeamFailedAttributesType = {
	error: string;
};
export type SubTeamLinkerOpenedAttributesType = {};
export type SubTeamListUpdatedAttributesType = {
	subTeamId: string;
	action: 'add' | 'remove';
};
export type AddSubTeamFailedAttributesType = {
	subTeamId: string;
	error: string;
};
export type RemoveSubTeamFailedAttributesType = {
	subTeamId: string;
	error: string;
};
export type FetchTeamContainersSucceededAttributesType = {
	teamId: string;
};
export type FetchTeamContainersFailedAttributesType = {
	teamId: string;
	error: Record<string, unknown>;
};
export type RefetchTeamContainersSucceededAttributesType = {
	teamId: string;
};
export type RefetchTeamContainersFailedAttributesType = {
	teamId: string;
	error: Record<string, unknown>;
};
export type FetchNumberOfConnectedTeamsSucceededAttributesType = {
	containerId: string;
	numberOfTeams: number | null;
};
export type FetchNumberOfConnectedTeamsFailedAttributesType = {
	containerId: string;
	numberOfTeams: number | null;
	error: Record<string, unknown>;
};
export type FetchConnectedTeamsSucceededAttributesType = {
	containerId: string;
	numberOfTeams: number | null;
};
export type FetchConnectedTeamsFailedAttributesType = {
	containerId: string;
	numberOfTeams: number | null;
	error: Record<string, unknown>;
};
export type ContainerClickedTeamContainerAttributesType = {
	containerSelected: Record<string, unknown>;
};
export type UnlinkContainerDialogOpenedAttributesType = {
	teamId: string;
};
export type TeamContainerUnlinkedFailedAttributesType = {};
export type TeamContainerUnlinkedSucceededAttributesType = {
	teamId: string;
	containerRemoved: Record<string, unknown>;
};
export type ButtonClickedContainerUnlinkButtonAttributesType = {
	containerSelected: Record<string, unknown> | null;
};
export type ButtonClickedContainerEditLinkButtonAttributesType = {
	containerSelected: Record<string, unknown>;
};
export type ButtonClickedContainerRemoveLinkButtonAttributesType = {
	containerSelected: Record<string, unknown>;
};
export type LinkClickedTeamMemberAttributesType = {};
export type TeamMemberClickedAttributesType = {};
export type TeamAgentClickedAttributesType = {};
export type ConnectedGroupClickedAttributesType = {};
export type TeamSettingsDialogViewedAttributesType = {};
export type DialogOpenedDeleteTeamAttributesType = {};
export type AgentProfileViewedAttributesType = {};
export type EditAgentClickedAttributesType = {};
export type DuplicateAgentClickedAttributesType = {};
export type CopyAgentClickedAttributesType = {};
export type DeleteAgentClickedAttributesType = {};
export type ChatWithAgentClickedAttributesType = {};
export type StartConversationWithAgentClickedAttributesType = {};
export type TeamMemberRemovedAttributesType = {
	teamSize: number;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type TeamInvitationAcceptedAttributesType = {
	teamId: string;
};
export type TeamInvitationDeclinedAttributesType = {
	teamId: string;
};
export type TeamProfileNameEditedAttributesType = {
	teamId: string;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type TeamProfileDescriptionEditedAttributesType = {
	teamId: string;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type TeamMembershipControlEditedAttributesType = {
	teamType: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL' | 'ORG_ADMIN_MANAGED';
	currentTeamType: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL' | 'ORG_ADMIN_MANAGED';
	isTeamNameChanged: boolean;
	avatarColour: string;
};
export type TeamJoinedAttributesType = {
	actualTransition: 'join' | 'joinRequest';
	teamId: string;
};
export type JoinRequestCreatedAttributesType = {
	actualTransition: 'join' | 'joinRequest';
	teamId: string;
};
export type TeamRemovedAttributesType = {
	teamId: string;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
	teamSize: number;
};
export type TeamLinkCategoryOpenedAttributesType = {};
export type TeamLinkCategoryClickedAttributesType = {
	linkType: string;
};
export type DialogClosedTeamDeletionAttributesType = {};
export type DialogOpenedTeamDeletionAttributesType = {};
export type ConfirmationCheckedTeamDeletionAttributesType = {
	checked: boolean;
};
export type TeamDeletionFailedAttributesType = {
	teamId: string;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
	teamSize: number;
};
export type JoinRequestAcceptedAttributesType = {
	teamId: string;
	memberId: string;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type JoinRequestClosedAttributesType = {
	teamId: string;
};
export type JoinRequestDeclinedAttributesType = {
	teamId: string;
	memberId: string;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type JoinRequestCancelFailedAttributesType = {
	status: number;
};
export type TeamInvitationSentAttributesType = {
	teamId: string;
	numberOfMembers: number;
	memberIds: unknown[] | null;
};
export type JoinRequestAcceptFailedAttributesType = {
	status: number;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type JoinRequestDeclineFailedAttributesType = {
	status: number;
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type TeamInvitationSucceededAttributesType = {
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type TeamInvitationFailedAttributesType = {
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type TeamAboutTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamAboutTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamAboutTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamAboutTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamNameTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamNameTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamNameTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamNameTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamDescriptionTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamDescriptionTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamDescriptionTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamDescriptionTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamPermissionsTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamPermissionsTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamPermissionsTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type TeamPermissionsTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type MembersTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type MembersTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type MembersTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type MembersTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type SubmitTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type SubmitTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type SubmitTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type SubmitTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type RemoveTeamMemberTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type RemoveTeamMemberTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type RemoveTeamMemberTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type RemoveTeamMemberTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type OpenDialogTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type OpenDialogTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type OpenDialogTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type OpenDialogTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type EditTeamNameOrDescriptionTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type EditTeamNameOrDescriptionTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type EditTeamNameOrDescriptionTaskAbortAttributesType = {
	abortReason: string;
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type EditTeamNameOrDescriptionTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type RecommendedProductsTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type RecommendedProductsTaskFailAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
};
export type ProjectsAndGoalsTaskStartAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
	tab: string | null;
};
export type ProjectsAndGoalsTaskSuccessAttributesType = {
	sloSatisifed: boolean;
	taskDuration: number;
	latencySlo: number;
	isStandalone: boolean;
	hasBrowsUsersPermission: boolean;
	tab: string | null;
};
export type TeamsPermissionsRequestFailedAttributesType = {
	message: string;
	status: string;
	path: string;
};
export type TeamsPermissionsRequestSucceededAttributesType = {
	canCreateTeams: boolean;
	canViewTeams: boolean;
	canAdminTeams: boolean;
};
export type TeamContainerLinkerOpenedAttributesType = {};
export type TeamContainerLinkedFailedAttributesType = {};
export type TeamContainerLinkedSuccessAttributesType = {};
export type TeamContainerLinkedViewedAttributesType = {};
export type TeamContainerLinkerViewedAttributesType = {
	screen: string;
};
export type TeamContainerLinkerResultsViewedAttributesType = {
	screen: string;
};
export type StarButtonViewedTeamAttributesType = {};
export type ConnectJiraProjectTabClickedAttributesType = {};
export type ConnectLoomSpaceTabClickedAttributesType = {};
export type ConnectConfluenceSpaceTabClickedAttributesType = {};
export type TeamProfileCardViewedAttributesType = {
	screen: string;
};
export type TeamButtonViewedAttributesType = {
	teamsCount: number;
	scope: string;
	version: string;
};
export type TeamButtonClickedAttributesType = {
	teamsCount: number;
	scope: string;
	version: string;
};
export type TeamProfileButtonClickedAttributesType = {};
export type ProfileRadarButtonClickedAttributesType = {};
export type AddTeamModalViewedAttributesType = {};
export type AddTeamModalConfirmButtonClickedAttributesType = {};
export type ManageTeamsModalViewedAttributesType = {};
export type DisconnectTeamModalViewedAttributesType = {};
export type RemoveTeamButtonClickedAttributesType = {
	screen: string;
};
export type ManageTeamsButtonClickedAttributesType = {};
export type TeamSelectorViewedAttributesType = {};
export type ManageTeamsSaveButtonClickedAttributesType = {};
export type TeamAgentAssociationSucceededAttributesType = {
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type TeamAgentAssociationFailedAttributesType = {
	orgAdminTriggered: boolean;
	memberOfTeam: boolean;
};
export type TeamAgentAssociationAddedAttributesType = {
	numberOfAgents: number;
	teamId: string;
};
export type TeamContainerCreatedAndLinkedSuccessAttributesType = {
	teamId: string;
	containerType: string;
};
export type TeamContainerCreatedAndLinkedFailedAttributesType = {
	teamId: string;
	containerType: string;
	failureReason: string;
};
export type CreateJiraContainerViewedAttributesType = {
	teamId: string;
};
export type CreateJiraContainerClickedAttributesType = {
	teamId: string;
};
export type CreateConfluenceContainerViewedAttributesType = {
	teamId: string;
};
export type CreateConfluenceContainerClickedAttributesType = {
	teamId: string;
};
export type CreateLoomContainerViewedAttributesType = {
	teamId: string;
};
export type CreateLoomContainerClickedAttributesType = {
	teamId: string;
};
export type CreateWebLinkContainerViewedAttributesType = {
	teamId: string;
};
export type CreateWebLinkContainerClickedAttributesType = {
	teamId: string;
};
export type CreateContainerFooterViewedAttributesType = {
	teamId: string;
	canCreateConfluenceContainer: boolean;
	canCreateJiraContainer: boolean;
	canCreateLoomContainer: boolean;
};
export type ShowMoreTeamActivitiesClickedAttributesType = {};
export type TeamActivityClickedAttributesType = {
	provider: string;
};
export type TeamProfileActivityTabViewedAttributesType = {
	teamId: string;
};
export type TeamProfileTabSelectedAttributesType = {
	tabId: string;
};
export type TeamConnectionItemClickedTeamProfileCardAttributesType = {
	container: 'ConfluenceSpace' | 'JiraProject' | 'LoomSpace' | 'WebLink';
};
export type ButtonClickedViewTeamProfileButtonAttributesType = {};
export type ProfilecardTriggeredAttributesType = {
	firedAt: number;
	method: 'hover' | 'click';
};
export type RovoAgentProfilecardTriggeredAttributesType = {
	firedAt: number;
	method: 'hover' | 'click';
};
export type TeamProfileCardTriggeredAttributesType = {
	firedAt: number;
	method: 'hover' | 'click';
	teamId: string;
};
export type UserTriggeredAttributesType = {
	firedAt: number;
	method: 'hover' | 'click';
};
export type ProfilecardRenderedSpinnerAttributesType = {
	firedAt: number;
};
export type TeamProfileCardRenderedSpinnerAttributesType = {
	firedAt: number;
};
export type RovoAgentProfilecardRenderedSpinnerAttributesType = {
	firedAt: number;
};
export type UserRenderedSpinnerAttributesType = {
	firedAt: number;
};
export type ProfilecardRenderedErrorAttributesType = {
	firedAt: number;
	hasRetry: boolean;
	errorType: 'default' | 'NotFound';
};
export type TeamProfileCardRenderedErrorAttributesType = {
	firedAt: number;
	duration: number;
};
export type ProfilecardClickedActionAttributesType = {
	firedAt: number;
	duration: number;
	hasHref: boolean;
	hasOnClick: boolean;
	index: number;
	actionId: string;
};
export type ProfilecardClickedReportingLinesAttributesType = {
	firedAt: number;
	duration: number;
	userType: 'manager' | 'direct-report';
};
export type ProfilecardRenderedContentAttributesType = {
	firedAt: number;
	duration: number;
	numActions: number;
};
export type RovoAgentProfilecardRenderedContentAttributesType = {
	firedAt: number;
};
export type TeamProfileCardRenderedContentAttributesType = {
	firedAt: number;
	duration: number;
	numActions: number;
	memberCount: number | null;
	includingYou: boolean | null;
	descriptionLength: number;
	titleLength: number;
};
export type ButtonClickedDeleteAgentButtonAttributesType = {
	agentId: string;
	source: string;
};
export type ButtonClickedEditAgentButtonAttributesType = {
	agentId: string;
	source: string;
};
export type ButtonClickedCopyAgentLinkButtonAttributesType = {
	agentId: string;
	source: string;
};
export type ButtonClickedDuplicateAgentButtonAttributesType = {
	agentId: string;
	source: string;
};
export type ButtonClickedViewAgentFullProfileButtonAttributesType = {
	agentId: string;
	source: string;
};
export type TeamProfileCardRenderedErrorBoundaryAttributesType = {
	firedAt: number;
	duration: number;
};
export type TeamProfileCardClickedErrorRetryAttributesType = {
	firedAt: number;
	duration: number;
};
export type ProfilecardSucceededRequestAttributesType = {
	firedAt: number;
	duration: number;
};
export type ProfilecardTriggeredRequestAttributesType = {
	firedAt: number;
};
export type ProfilecardFailedRequestAttributesType = {
	firedAt: number;
	duration: number;
	errorMessage: string;
	errorStatusCode: number | null;
	traceId: string | null;
	errorCategory: string | null;
	errorType: string | null;
	errorPath: string | null;
	errorNumber: number | null;
	isSLOFailure: boolean;
};
export type TeamProfileCardSucceededRequestAttributesType = {
	firedAt: number;
	duration: number;
	gateway: boolean;
};
export type TeamProfileCardTriggeredRequestAttributesType = {
	firedAt: number;
};
export type TeamProfileCardFailedRequestAttributesType = {
	firedAt: number;
	duration: number;
	errorMessage: string;
	errorStatusCode: number | null;
	traceId: string | null;
	errorCategory: string | null;
	errorType: string | null;
	errorPath: string | null;
	errorNumber: number | null;
	isSLOFailure: boolean;
	gateway: boolean;
	errorStack: string | null;
};
export type RovoAgentProfilecardSucceededRequestAttributesType = {
	firedAt: number;
	duration: number;
	gateway: boolean;
};
export type RovoAgentProfilecardTriggeredRequestAttributesType = {
	firedAt: number;
};
export type RovoAgentProfilecardFailedRequestAttributesType = {
	firedAt: number;
	duration: number;
	errorMessage: string;
	errorStatusCode: number | null;
	traceId: string | null;
	errorCategory: string | null;
	errorType: string | null;
	errorPath: string | null;
	errorNumber: number | null;
	isSLOFailure: boolean;
	gateway: boolean;
};
export type RovoAgentProfilecardSucceededDeleteAgentAttributesType = {
	firedAt: number;
	duration: number;
	gateway: boolean;
};
export type RovoAgentProfilecardFailedDeleteAgentAttributesType = {
	firedAt: number;
	duration: number;
	errorMessage: string;
	errorStatusCode: number | null;
	traceId: string | null;
	errorCategory: string | null;
	errorType: string | null;
	errorPath: string | null;
	errorNumber: number | null;
	isSLOFailure: boolean;
	gateway: boolean;
};
export type RovoAgentProfilecardSucceededFavouriteAttributesType = {
	firedAt: number;
	duration: number;
	gateway: boolean;
};
export type RovoAgentProfilecardTriggeredFavouriteAttributesType = {
	firedAt: number;
};
export type RovoAgentProfilecardFailedFavouriteAttributesType = {
	firedAt: number;
	duration: number;
	errorMessage: string;
	errorStatusCode: number | null;
	traceId: string | null;
	errorCategory: string | null;
	errorType: string | null;
	errorPath: string | null;
	errorNumber: number | null;
	isSLOFailure: boolean;
	gateway: boolean;
};
export type RovoAgentProfilecardSucceededUnfavouriteAttributesType = {
	firedAt: number;
	duration: number;
	gateway: boolean;
};
export type RovoAgentProfilecardTriggeredUnfavouriteAttributesType = {
	firedAt: number;
};
export type RovoAgentProfilecardFailedUnfavouriteAttributesType = {
	firedAt: number;
	duration: number;
	errorMessage: string;
	errorStatusCode: number | null;
	traceId: string | null;
	errorCategory: string | null;
	errorType: string | null;
	errorPath: string | null;
	errorNumber: number | null;
	isSLOFailure: boolean;
	gateway: boolean;
};
export type RovoAgentProfilecardSucceededGetAgentPermissionsAttributesType = {
	firedAt: number;
	duration: number;
	gateway: boolean;
};
export type RovoAgentProfilecardFailedGetAgentPermissionsAttributesType = {
	firedAt: number;
	duration: number;
	errorMessage: string;
	errorStatusCode: number | null;
	traceId: string | null;
	errorCategory: string | null;
	errorType: string | null;
	errorPath: string | null;
	errorNumber: number | null;
	isSLOFailure: boolean;
	gateway: boolean;
};
export type ProfilecardClickedMoreActionsAttributesType = {
	firedAt: number;
	duration: number;
	numActions: number;
};
export type TeamProfileCardClickedMoreActionsAttributesType = {
	firedAt: number;
	duration: number;
	numActions: number;
};
export type TeamProfileCardClickedAvatarAttributesType = {
	firedAt: number;
	duration: number;
	hasHref: boolean;
	hasOnClick: boolean;
	index: number;
};
export type TeamProfileCardClickedActionAttributesType = {
	firedAt: number;
	duration: number;
	hasHref: boolean;
	hasOnClick: boolean;
	index: number;
	actionId: string;
};
export type TeamProfileCardClickedMoreMembersAttributesType = {
	firedAt: number;
	duration: number;
	memberCount: number;
};
export type ProfileProjectsAndGoalsTabClickedAttributesType = {
	tabName: string;
};
export type ProfileProjectsAndGoalsViewedAttributesType = {
	isEmpty: boolean;
	hasGoals: boolean;
	hasProjects: boolean;
	product: string;
	workspaceUuid: string | null;
	isNewUserProfile: boolean | null;
	tab: string | null;
};
export type ProfileProjectsLinkClickedAttributesType = {
	entryIndex: number;
	isNewUserProfile: boolean | null;
	tab: string | null;
};
export type ProfileGoalsLinkClickedAttributesType = {
	entryIndex: number;
	isNewUserProfile: boolean | null;
	tab: string | null;
};
export type ButtonClickedFollowTeamProjectsGoalsButtonAttributesType = undefined;
export type ButtonClickedUnfollowTeamProjectsGoalsButtonAttributesType = undefined;
export type ErrorBoundaryTriggeredAttributesType = {
	product: string;
	boundary: string;
	error: string;
};
export type ProfileKudosViewedAttributesType = {
	isEmpty: boolean;
	isNewUserProfile: boolean | null;
	tab: string | null;
};
export type ProfileKudosTabClickedAttributesType = {
	tabName: 'given' | 'received';
};
export type ProfileKudosClickedAttributesType = {
	kudosId: string;
	tabName: 'given' | 'received';
};
export type ReportingLinesChartCollapsedAttributesType = {
	product: string;
	workspaceUuid: string | null;
};
export type ReportingLinesChartExpandedAttributesType = {
	product: string;
	workspaceUuid: string | null;
};
export type ReportingLinesChartViewedAttributesType = {
	product: string;
	workspaceUuid: string | null;
	isNewUserProfile: boolean | null;
	tab: string | null;
};
export type UiViewedAttributesType = {
	product: string;
	workspaceUuid: string | null;
};
export type ReportingLinesUserCardClickedAttributesType = {
	product: string;
	workspaceUuid: string | null;
};
export type ReportingLinesEmptyStateViewedAttributesType = {
	product: string;
	workspaceUuid: string | null;
	isAdmin: boolean;
};
export type ButtonClickedAddPeopleButtonAttributesType = {
	isPrimary: boolean;
};
export type UserMenuItemClickedLinkProfileAttributesType = undefined;
export type UserMenuItemClickedLinkManageAccountAttributesType = undefined;
export type UserMenuItemClickedLinkLogoutAttributesType = undefined;
export type UserMenuOpenedAttributesType = undefined;
export type HeaderImageStartedUserHeaderImageAttributesType = {
	actionType: 'removeHeaderImage' | 'uploadHeaderImage';
};
export type HeaderImageFailedUserHeaderImageAttributesType = {
	actionType: 'removeHeaderImage' | 'uploadHeaderImage';
};
export type HeaderImageSucceededUserHeaderImageAttributesType = {
	actionType: 'removeHeaderImage' | 'uploadHeaderImage';
};
export type HeaderImageStartedTeamHeaderImageAttributesType = {
	actionType: 'removeHeaderImage' | 'uploadHeaderImage';
	memberOfTeam: boolean;
	orgAdminTriggered: boolean;
	isVerified: boolean | null;
};
export type HeaderImageFailedTeamHeaderImageAttributesType = {
	actionType: 'removeHeaderImage' | 'uploadHeaderImage';
	memberOfTeam: boolean;
	orgAdminTriggered: boolean;
	isVerified: boolean | null;
};
export type HeaderImageSucceededTeamHeaderImageAttributesType = {
	actionType: 'removeHeaderImage' | 'uploadHeaderImage';
	memberOfTeam: boolean;
	orgAdminTriggered: boolean;
	isVerified: boolean | null;
};
export type ButtonClickedProfileHeaderMediaPickerUploadAttributesType = {
	isNewUserProfile: boolean | null;
};
export type ButtonClickedProfileHeaderRemoveAttributesType = undefined;
export type SendFeedbackClickedAttributesType = undefined;
export type ButtonClickedRemoveAvatarAttributesType = undefined;
export type DeleteAvatarFailedAttributesType = undefined;
export type DeleteAvatarSucceededAttributesType = undefined;
export type AvatarPickerClosedAttributesType = {
	hasUploadedAvatar: boolean;
};
export type AvatarPickerOpenedAttributesType = {
	hasUploadedAvatar: boolean;
	isNewUserProfile: boolean | null;
};
export type ButtonClickedChangeProfilePhotoAttributesType = {
	isNewUserProfile: boolean | null;
};
export type ButtonClickedCreateInitialsAvatarAttributesType = {
	isNewUserProfile: boolean | null;
};
export type AvatarInitialsPickerOpenedAttributesType = {
	hasUploadedAvatar: boolean;
	isNewUserProfile: boolean | null;
};
export type UploadAvatarFailedAttributesType = {
	avatarType: 'image' | 'initials';
	hasUploadedAvatar: boolean;
};
export type UploadAvatarSucceededAttributesType = {
	avatarType: 'image' | 'initials';
	hasUploadedAvatar: boolean;
};
export type ButtonClickedUpdateAvatarInitialsAttributesType = {
	isInvalid: boolean;
	color: string;
};
export type ButtonClickedCancelUpdateAvatarInitialsAttributesType = undefined;
export type AvatarInitialsPickerClosedAttributesType = undefined;
export type AvatarInitialsPickerViewedAttributesType = undefined;
export type TeamOrgMismatchFailedAttributesType = {
	currentOrgId: string;
	queryName: string;
};
export type ProfileAboutItemEditedAttributesType = {
	fieldKey: string;
};
export type UserProfileScreenAboutPanelViewedAttributesType = {
	nonEmptyFields: string;
	isNewUserProfile: boolean | null;
};
export type PrivacyPolicyLinkClickedAttributesType = undefined;
export type TeamProfileItemClickedAttributesType = {
	position: number;
	isPoweredByTWG: boolean | null;
	isNewUserProfile: boolean | null;
};
export type ShowMoreClickedAttributesType = {
	selectedUser: boolean | null;
	withSearchQuery: boolean | null;
	isNewUserProfile: boolean | null;
};
export type TeamCreateDialogTriggerButtonClickedAttributesType = {
	trigger: string;
	isNewUserProfile: boolean | null;
};
export type ButtonClickedManageAccountButtonAttributesType = {
	isNewUserProfile: boolean | null;
};
export type ButtonClickedManageAccessButtonAttributesType = undefined;
export type UserProfileScreenLoadFailedAttributesType = {
	isNewUserProfile: boolean | null;
};
export type UserProfileScreenViewedAttributesType = {
	isCurrentUser: boolean;
	isNewUserProfile: boolean | null;
	tab: string | null;
};
export type ViewAllWorkClickedAttributesType = {
	location: string;
	isNewUserProfile: boolean | null;
};
export type MoreWorkClickedAttributesType = {
	numItemsDisplayed: number;
	isNewUserProfile: boolean | null;
};
export type ActivityEntryClickedAttributesType = {
	provider: string;
	entryIndex: number;
	isNewUserProfile: boolean | null;
};
export type PlacesLinkClickedAttributesType = {
	type: string;
	isNewUserProfile: boolean | null;
};
export type ViewedTeamProfileFromRequestToJoinNotificationViewedAttributesType = {
	status: number | null;
	errorType: string | null;
	isVerified: boolean;
};
export type TeamProfileScreenViewedAttributesType = {
	teamId: string;
	membershipState: string | null;
	isViewerMember: boolean;
	isVerified: boolean;
	isSiteAdmin: boolean;
	isArchived: boolean;
	isOrgAdmin: boolean;
	orgId: string | null;
	hasContainersConnect: boolean;
	numberOfContainersConnected: number;
	numberOfWebLinksConnected: number;
	webLinksCurrentlyConnected: unknown[];
	containersCurrentlyConnected: unknown[];
};
export type TeamArchivedSucceededAttributesType = {
	teamId: string | null;
	isOrgAdmin: boolean | null;
	isMember: boolean | null;
	isVerified: boolean | null;
};
export type TeamArchivedFailedAttributesType = {
	teamId: string | null;
	isOrgAdmin: boolean | null;
	isMember: boolean | null;
	isVerified: boolean | null;
	error: string | null;
};
export type TeamUnarchivedSucceededAttributesType = {
	teamId: string | null;
	isOrgAdmin: boolean | null;
	isMember: boolean | null;
};
export type TeamUnarchivedFailedAttributesType = {
	teamId: string | null;
	isOrgAdmin: boolean | null;
	isMember: boolean | null;
	error: string | null;
};
export type GetTeamProfileSucceededAttributesType = {
	status: number;
	isVerified: boolean;
};
export type GetTeamProfileFailedAttributesType = {
	status: number | null;
};
export type AddWebLinkDialogOpenedAttributesType = {
	teamId: string;
};
export type EditWebLinkDialogOpenedAttributesType = {
	teamId: string;
};
export type LinkClickedHelpLinkAttributesType = {
	uiScreen: string;
	descriptionLength: number;
	titleLength: number;
	type: string | null;
	teamId: string | null;
	totalTags: number | null;
	numTagsMatchingSearch: number | null;
};
export type TeamsProfileHelpPointersViewedAttributesType = {
	isEmpty: boolean;
	canEdit: boolean;
	totalArticles: number;
	totalRequests: number;
};
export type ShowMoreExpandedAttributesType = {
	helpType: string;
	totalHelpPointers: number;
};
export type DialogOpenedCreateHelpPointerDialogAttributesType = {
	screen: string;
};
export type HelpPointerCreatedAttributesType = {
	screen: string;
	type: string | null;
	totalTags: number;
	descriptionLength: number;
	teamId: string | null;
	emptyProfilePage: boolean;
};
export type TagCreatedAttributesType = {
	screen: string;
	context: string;
};
export type DialogOpenedEditHelpPointerDialogAttributesType = {
	screen: string;
};
export type DialogOpenedDeleteHelpPointerDialogAttributesType = {
	screen: string;
};
export type HelpPointerDeletedAttributesType = {
	screen: string;
	type: string | null;
	totalTags: number;
	descriptionLength: number;
	teamId: string | null;
};
export type HelpPointerEditedAttributesType = {
	screen: string;
	type: string | null;
	totalTags: number;
	descriptionLength: number;
	teamId: string | null;
	createdNewTeam: boolean;
};
export type TeamLinkLinkedAttributesType = {
	linkId: string;
	teamId: string;
	linkDomain: string;
	hasWebLinksConnected: boolean;
	isMemberOfTeam: boolean;
	memberOfTeam: boolean;
	orgAdminTriggered: boolean;
	isVerified: boolean | null;
};
export type TeamLinkTypedAttributesType = {
	length: number;
	isHttp: boolean;
	isHttps: boolean;
};
export type TeamLinkClickedAddHttpButtonAttributesType = {
	previousLength: number;
};
export type TeamLinkClickedAddHttpsButtonAttributesType = {
	previousLength: number;
};
export type TeamRestoreScreenViewedAttributesType = {
	teamId: string;
	orgAdminTriggered: boolean;
};
export type ButtonClickedReactivateTeamAttributesType = {
	orgAdminTriggered: boolean;
};
export type TeamRestoreSucceededAttributesType = undefined;
export type TeamRestoreFailedAttributesType = {
	status: number | null;
};
export type GetSettingsSucceededAttributesType = undefined;
export type GetSettingsFailedAttributesType = undefined;
export type TeamLinkEditedAttributesType = {
	linkId: string;
	teamId: string;
	linkDomain: string;
	oldLinkDomain: string;
	isLinkPartOfTeamContainers: boolean;
	memberOfTeam: boolean;
	orgAdminTriggered: boolean;
	isVerified: boolean | null;
};
export type PeopleHomeViewedAttributesType = undefined;
export type UserFilterSelectedAttributesType = {
	isCurrentUser: boolean;
};
export type TeamElementClickedAttributesType = {
	entryIndex: number;
	withSearchQuery: boolean;
	isCurrentUser: boolean;
};
export type SuggestedCollaboratorsClickedAttributesType = {
	entryIndex: number;
};
export type ViewDirectoryFiltersInAtlasClickedAttributesType = {
	isAdmin: boolean;
	product: string;
	workspaceUuid: string | null;
};
export type YourTeamsClickedAttributesType = {
	entryIndex: number;
};
export type BrowseAllTeamsClickedAttributesType = undefined;
export type AddPeopleButtonClickedAttributesType = {
	trigger: string;
};
export type TeamSearchResultClickedAttributesType = {
	entryIndex: number;
	withSearchQuery: boolean;
};
export type RecentCollaboratorClickedAttributesType = {
	entryIndex: number;
	sessionId: string;
	dataSource: string;
};
export type PeopleSearchResultClickedAttributesType = {
	entryIndex: number;
	withSearchQuery: boolean;
};
export type AgentProfileAboutTeamsViewedAttributesType = {
	teamsCount: number;
};
export type UserProfileAboutTeamsViewedAttributesType = {
	teamsCount: number;
	isNewUserProfile: boolean | null;
};
export type UserProfileWorkingWithMeViewedAttributesType = undefined;
export type TeamAgentsPanelViewedAttributesType = {
	activeAgentsCount: number;
};
export type TeamAssignedTypeUpdatedAttributesType = {
	teamId: string;
	teamProfileTabIndex: number;
	consumer: string;
	typeId: string;
};
export type TeamAssignedTypePickerClickedAttributesType = {
	teamId: string;
	teamProfileTabIndex: number;
	consumer: string;
};
export type InvitePromptEligibilityCheckedAttributesType = {
	isEligible: boolean;
	ineligibilityReason: string;
};
export type InvitePromptEligibilityCheckFailedAttributesType = {
	error: string;
};
export type InvitePromptShownFlagAttributesType = {
	inviteesCount: number;
	targetApp: string;
};
export type InvitePromptClickedInviteButtonAttributesType = {
	inviteesCount: number;
	targetApp: string;
};
export type InvitePromptShownSuccessFlagAttributesType = {
	invitedCount: number;
	requestedAccessCount: number;
	variant: string;
	targetApp: string;
};
export type InvitePromptShownFailedFlagAttributesType = {
	invitedCount: number;
	failedCount: number;
	totalCount: number;
};
export type InvitePromptClickedDismissButtonAttributesType = {
	inviteesCount: number;
	targetApp: string;
};
export type FeatureExposedAttributesType = {
	flagKey: string;
	cohort: string;
};
export type InvitePromptShowContainerAddedFlagFailedAttributesType = {
	error: string;
};
export type RequestedContainersTryAgainAttributesType = {
	containers: unknown[];
	teamId: string;
};
export type RequestedContainersFailedAttributesType = {
	containers: unknown[];
	teamId: string;
	tryAgainCount: number | null;
};
export type StarredSucceededTeamAttributesType = {
	starred: boolean;
};
export type StarredFailedTeamAttributesType = {
	starred: boolean;
	errorMessage: string;
};

export type AnalyticsEventAttributes = {
	/**
	 * fired when the teams-app-internal-analytics example button is clicked */
	'ui.button.clicked.analyticsExample': ButtonClickedAnalyticsExampleAttributesType;
	/**
	 * fired when the teams-app-internal-analytics example button is clicked */
	'track.automation.triggered.analyticsExample': AutomationTriggeredAnalyticsExampleAttributesType;
	/**
	 * fired when the teams-app-internal-analytics example button is clicked */
	'operational.automation.fired.analyticsExample': AutomationFiredAnalyticsExampleAttributesType;
	/**
	 * fired when the teams-app-internal-analytics example is viewed */
	'screen.analyticsExampleScreen.viewed': AnalyticsExampleScreenViewedAttributesType;
	/**
	 * fired when the assign team to a site section message is viewed on the team profile page */
	'screen.assignTeamToASiteMessage.viewed': AssignTeamToASiteMessageViewedAttributesType;
	/**
	 * fired when the assign this team to a site action in the assign team to a site section message is clicked */
	'ui.assignThisTeamToASite.clicked': AssignThisTeamToASiteClickedAttributesType;
	/**
	 * fired when the assign team to a site modal is viewed */
	'screen.assignTeamToASiteModal.viewed': AssignTeamToASiteModalViewedAttributesType;
	/**
	 * fired when the site is selected in the assign team to a site modal */
	'track.assignTeamToASiteSiteSelected.selected': AssignTeamToASiteSiteSelectedSelectedAttributesType;
	/**
	 * fired when the confirm button is clicked in the assign team to a site modal */
	'ui.assignTeamToASiteConfirmButton.clicked': AssignTeamToASiteConfirmButtonClickedAttributesType;
	/**
	 * fired when the cancel button is clicked in the assign team to a site modal */
	'ui.assignTeamToASiteCancelButton.clicked': AssignTeamToASiteCancelButtonClickedAttributesType;
	/**
	 * fired when the member picker error is triggered */
	'track.memberPicker.error': MemberPickerErrorAttributesType;
	/**
	 * fired when the teams containers are requested */
	'track.requestedContainers.requested': RequestedContainersRequestedAttributesType;
	/**
	 * fired when the team create dialog is viewed */
	'screen.teamCreateDialog.viewed': TeamCreateDialogViewedAttributesType;
	/**
	 * fired when the member is suggested */
	'ui.member.suggested': MemberSuggestedAttributesType;
	/**
	 * fired when the team create dialog is submitted */
	'ui.teamCreateDialog.submitted': TeamCreateDialogSubmittedAttributesType;
	/**
	 * fired when the team create dialog clicked team link success flag */
	'ui.teamCreateDialog.clicked.teamLinkSuccessFlag': TeamCreateDialogClickedTeamLinkSuccessFlagAttributesType;
	/**
	 * fired when the team create dialog succeeded */
	'track.teamCreateDialog.succeeded': TeamCreateDialogSucceededAttributesType;
	/**
	 * fired when the team create dialog failed */
	'track.teamCreateDialog.failed': TeamCreateDialogFailedAttributesType;
	/**
	 * fired when the team type picker is clicked */
	'ui.teamTypePicker.clicked': TeamTypePickerClickedAttributesType;
	/**
	 * fired when the team create dialog is closed */
	'ui.teamCreateDialog.closed': TeamCreateDialogClosedAttributesType;
	/**
	 * fired when the invite capabilities service failed */
	'operational.inviteCapabilitiesService.failed': InviteCapabilitiesServiceFailedAttributesType;
	/**
	 * fired when the add to team service failed */
	'track.addToTeamService.failed': AddToTeamServiceFailedAttributesType;
	/**
	 * fired when the team suggestions recommended users API call succeeded */
	'operational.teamSuggestionsRecommendedUsers.succeeded': TeamSuggestionsRecommendedUsersSucceededAttributesType;
	/**
	 * fired when the team suggestions recommended users API call failed */
	'operational.teamSuggestionsRecommendedUsers.failed': TeamSuggestionsRecommendedUsersFailedAttributesType;
	/**
	 * fired when the invited team members are added */
	'track.invitedTeamMembers.added': InvitedTeamMembersAddedAttributesType;
	/**
	 * fired when the invite to product service failed */
	'track.inviteToProductService.failed': InviteToProductServiceFailedAttributesType;
	/**
	 * fired when the container permissions are succeeded */
	'track.containerPermissions.succeeded': ContainerPermissionsSucceededAttributesType;
	/**
	 * fired when the team worked on is rendered */
	'ui.teamWorkedOn.rendered': TeamWorkedOnRenderedAttributesType;
	/**
	 * fired when the team worked on failed */
	'operational.teamWorkedOn.failed': TeamWorkedOnFailedAttributesType;
	/**
	 * fired when the team worked on failed */
	'operational.teamWorkedOn.succeeded': TeamWorkedOnSucceededAttributesType;
	/**
	 * fired when the view all issues is clicked */
	'ui.viewAllIssues.clicked': ViewAllIssuesClickedAttributesType;
	/**
	 * fired when the team worked on link is clicked */
	'ui.teamWorkedOnLink.clicked': TeamWorkedOnLinkClickedAttributesType;
	/**
	 * fired when the additional menu link is clicked */
	'ui.navigationMenuItem.clicked.addPeopleNavigationMenuItem': NavigationMenuItemClickedAddPeopleNavigationMenuItemAttributesType;
	/**
	 * fired when the create new team link is clicked */
	'ui.createNewTeamLink.clicked': CreateNewTeamLinkClickedAttributesType;
	/**
	 * fired when the view all people directory is clicked */
	'ui.viewAllPeopleDirectory.clicked': ViewAllPeopleDirectoryClickedAttributesType;
	/**
	 * fired when the people menu link is clicked */
	'ui.peopleMenuLink.clicked': PeopleMenuLinkClickedAttributesType;
	/**
	 * fired when the people menu is viewed and loading indicator is shown */
	'ui.peopleMenu.viewed.loadingIndicator': PeopleMenuViewedLoadingIndicatorAttributesType;
	/**
	 * fired when the team menu link is clicked */
	'ui.teamMenuLink.clicked': TeamMenuLinkClickedAttributesType;
	/**
	 * fired when the people menu is viewed and no browse permission is shown */
	'screen.peopleMenu.viewed': PeopleMenuViewedAttributesType;
	/**
	 * fired when the people menu is succeeded */
	'ui.addPeopleNavigationItem.rendered': AddPeopleNavigationItemRenderedAttributesType;
	/**
	 * fired when the people menu is viewed and no browse permission is shown */
	'ui.peopleMenu.viewed.noBrowsePermission': PeopleMenuViewedNoBrowsePermissionAttributesType;
	/**
	 * fired when the people menu is succeeded */
	'track.peopleMenu.succeeded': PeopleMenuSucceededAttributesType;
	/**
	 * fired when the hover and click people button is measured */
	'track.hoverAndClickPeopleButton.measured': HoverAndClickPeopleButtonMeasuredAttributesType;
	/**
	 * fired when the pre fetch data is triggered */
	'track.preFetchData.triggered': PreFetchDataTriggeredAttributesType;
	/**
	 * fired when the fetching users and teams data is measured */
	'track.fetchingUsersTeamsData.measured': FetchingUsersTeamsDataMeasuredAttributesType;
	/**
	 * fired when the people menu link is succeeded */
	'operational.peopleMenuLink.succeeded': PeopleMenuLinkSucceededAttributesType;
	/**
	 * fired when the people menu link is failed */
	'operational.peopleMenuLink.failed': PeopleMenuLinkFailedAttributesType;
	/**
	 * fired when the people menu link is succeeded */
	'operational.teamMenuLink.succeeded': TeamMenuLinkSucceededAttributesType;
	/**
	 * fired when the people menu link is failed */
	'operational.teamMenuLink.failed': TeamMenuLinkFailedAttributesType;
	/**
	 * fired when the team profile breadcrumbs item is clicked */
	'ui.teamProfileBreadcrumbsItem.clicked': TeamProfileBreadcrumbsItemClickedAttributesType;
	/**
	 * fired when the hierarchy team link out is clicked */
	'ui.hierarchyTeamLinkOut.clicked': HierarchyTeamLinkOutClickedAttributesType;
	/**
	 * fired when the hierarchy field is hovered */
	'ui.hierarchyField.hovered': HierarchyFieldHoveredAttributesType;
	/**
	 * fired when the parent team field is clicked */
	'ui.parentTeamLinker.opened': ParentTeamLinkerOpenedAttributesType;
	/**
	 * fired when the parent team linker is closed */
	'ui.parentTeamLinker.closed': ParentTeamLinkerClosedAttributesType;
	/**
	 * fired when the add parent team operation fails */
	'operational.addParentTeam.failed': AddParentTeamFailedAttributesType;
	/**
	 * fired when the remove parent team operation fails */
	'operational.removeParentTeam.failed': RemoveParentTeamFailedAttributesType;
	/**
	 * fired when the sub team linker is viewed */
	'ui.subTeamLinker.opened': SubTeamLinkerOpenedAttributesType;
	/**
	 * fired when the sub team linker is closed */
	'ui.subTeamList.updated': SubTeamListUpdatedAttributesType;
	/**
	 * fired when the add sub team operation fails */
	'operational.addSubTeam.failed': AddSubTeamFailedAttributesType;
	/**
	 * fired when the remove sub team operation fails */
	'operational.removeSubTeam.failed': RemoveSubTeamFailedAttributesType;
	/**
	 * fired when the fetchTeamContainers succeeded */
	'operational.fetchTeamContainers.succeeded': FetchTeamContainersSucceededAttributesType;
	/**
	 * fired when the fetchTeamContainers failed */
	'operational.fetchTeamContainers.failed': FetchTeamContainersFailedAttributesType;
	/**
	 * fired when the fetchTeamContainers succeeded */
	'operational.refetchTeamContainers.succeeded': RefetchTeamContainersSucceededAttributesType;
	/**
	 * fired when the fetchTeamContainers failed */
	'operational.refetchTeamContainers.failed': RefetchTeamContainersFailedAttributesType;
	/**
	 * fired when the fetchNumberOfConnectedTeams succeeded */
	'operational.fetchNumberOfConnectedTeams.succeeded': FetchNumberOfConnectedTeamsSucceededAttributesType;
	/**
	 * fired when the fetchNumberOfConnectedTeams failed */
	'operational.fetchNumberOfConnectedTeams.failed': FetchNumberOfConnectedTeamsFailedAttributesType;
	/**
	 * fired when the fetchConnectedTeams succeeded */
	'operational.fetchConnectedTeams.succeeded': FetchConnectedTeamsSucceededAttributesType;
	/**
	 * fired when the fetchConnectedTeams failed */
	'operational.fetchConnectedTeams.failed': FetchConnectedTeamsFailedAttributesType;
	/**
	 * fired when the team container is clicked */
	'ui.container.clicked.teamContainer': ContainerClickedTeamContainerAttributesType;
	/**
	 * fired when the unlink container dialog is opened */
	'track.unlinkContainerDialog.opened': UnlinkContainerDialogOpenedAttributesType;
	/**
	 * fired when the team container unlink failed */
	'track.teamContainerUnlinked.failed': TeamContainerUnlinkedFailedAttributesType;
	/**
	 * fired when the team container unlink succeeded */
	'track.teamContainerUnlinked.succeeded': TeamContainerUnlinkedSucceededAttributesType;
	/**
	 * fired when the container unlink button is clicked */
	'ui.button.clicked.containerUnlinkButton': ButtonClickedContainerUnlinkButtonAttributesType;
	/**
	 * fired when the container edit link button is clicked */
	'ui.button.clicked.containerEditLinkButton': ButtonClickedContainerEditLinkButtonAttributesType;
	/**
	 * fired when the container remove link button is clicked */
	'ui.button.clicked.containerRemoveLinkButton': ButtonClickedContainerRemoveLinkButtonAttributesType;
	/**
	 * fired when the link picker is successfully submitted */
	'ui.link.clicked.teamMember': LinkClickedTeamMemberAttributesType;
	/**
	 * fired when the link picker is successfully submitted */
	'ui.teamMember.clicked': TeamMemberClickedAttributesType;
	/**
	 * fired when the link picker is successfully submitted */
	'ui.teamAgent.clicked': TeamAgentClickedAttributesType;
	/**
	 * fired when connected group name is clicked */
	'ui.connectedGroup.clicked': ConnectedGroupClickedAttributesType;
	/**
	 * teamSettingsDialog */
	'screen.teamSettingsDialog.viewed': TeamSettingsDialogViewedAttributesType;
	/**
	 * fired when the delete team dialog is opened */
	'ui.dialog.opened.deleteTeam': DialogOpenedDeleteTeamAttributesType;
	/**
	 * fired when agent profile viewed */
	'screen.agentProfile.viewed': AgentProfileViewedAttributesType;
	/**
	 * fired when the edit agent menuItem is clicked */
	'ui.editAgent.clicked': EditAgentClickedAttributesType;
	/**
	 * fired when the duplicate agent menuItem is clicked */
	'ui.duplicateAgent.clicked': DuplicateAgentClickedAttributesType;
	/**
	 * fired when the copy agent menuItem is clicked */
	'ui.copyAgent.clicked': CopyAgentClickedAttributesType;
	/**
	 * fired when the delete agent menuItem is clicked */
	'ui.deleteAgent.clicked': DeleteAgentClickedAttributesType;
	/**
	 * fired when the chat button is clicked */
	'ui.chatWithAgent.clicked': ChatWithAgentClickedAttributesType;
	/**
	 * fired when the agent conversation starter is clicked */
	'ui.startConversationWithAgent.clicked': StartConversationWithAgentClickedAttributesType;
	/**
	 * teamMember removed */
	'track.teamMember.removed': TeamMemberRemovedAttributesType;
	/**
	 * teamInvitation accepted */
	'track.teamInvitation.accepted': TeamInvitationAcceptedAttributesType;
	/**
	 * teamInvitation declined */
	'track.teamInvitation.declined': TeamInvitationDeclinedAttributesType;
	/**
	 * teamProfileName edited */
	'track.teamProfileName.edited': TeamProfileNameEditedAttributesType;
	/**
	 * teamProfileDescription edited */
	'track.teamProfileDescription.edited': TeamProfileDescriptionEditedAttributesType;
	/**
	 * teamMembershipControl edited */
	'track.teamMembershipControl.edited': TeamMembershipControlEditedAttributesType;
	/**
	 * team joined */
	'track.team.joined': TeamJoinedAttributesType;
	/**
	 * joinRequest created */
	'track.joinRequest.created': JoinRequestCreatedAttributesType;
	/**
	 * team removed */
	'track.team.removed': TeamRemovedAttributesType;
	/**
	 * fired when the team link is opened */
	'ui.teamLinkCategory.opened': TeamLinkCategoryOpenedAttributesType;
	/**
	 * fired when the team link is clicked */
	'ui.teamLinkCategory.clicked': TeamLinkCategoryClickedAttributesType;
	/**
	 * fired when the delete team dialog is closed */
	'ui.dialog.closed.teamDeletion': DialogClosedTeamDeletionAttributesType;
	/**
	 * fired when the delete team dialog is opened */
	'ui.dialog.opened.teamDeletion': DialogOpenedTeamDeletionAttributesType;
	/**
	 * fired when the delete team dialog is successfully submitted */
	'ui.confirmation.checked.teamDeletion': ConfirmationCheckedTeamDeletionAttributesType;
	/**
	 * team removed */
	'track.teamDeletion.failed': TeamDeletionFailedAttributesType;
	/**
	 * joinRequest accepted */
	'track.joinRequest.accepted': JoinRequestAcceptedAttributesType;
	/**
	 * joinRequest closed */
	'track.joinRequest.closed': JoinRequestClosedAttributesType;
	/**
	 * joinRequest declined */
	'track.joinRequest.declined': JoinRequestDeclinedAttributesType;
	/**
	 * joinRequestCancel failed */
	'operational.joinRequestCancel.failed': JoinRequestCancelFailedAttributesType;
	/**
	 * teamInvitation sent */
	'track.teamInvitation.sent': TeamInvitationSentAttributesType;
	/**
	 * joinRequestAccept failed */
	'operational.joinRequestAccept.failed': JoinRequestAcceptFailedAttributesType;
	/**
	 * joinRequestDecline failed */
	'operational.joinRequestDecline.failed': JoinRequestDeclineFailedAttributesType;
	/**
	 * teamInvitation succeeded */
	'operational.teamInvitation.succeeded': TeamInvitationSucceededAttributesType;
	/**
	 * teamInvitation failed */
	'operational.teamInvitation.failed': TeamInvitationFailedAttributesType;
	/** */
	'operational.teamAbout.taskStart': TeamAboutTaskStartAttributesType;
	/** */
	'operational.teamAbout.taskSuccess': TeamAboutTaskSuccessAttributesType;
	/** */
	'operational.teamAbout.taskAbort': TeamAboutTaskAbortAttributesType;
	/** */
	'operational.teamAbout.taskFail': TeamAboutTaskFailAttributesType;
	/** */
	'operational.teamName.taskStart': TeamNameTaskStartAttributesType;
	/** */
	'operational.teamName.taskSuccess': TeamNameTaskSuccessAttributesType;
	/** */
	'operational.teamName.taskAbort': TeamNameTaskAbortAttributesType;
	/** */
	'operational.teamName.taskFail': TeamNameTaskFailAttributesType;
	/** */
	'operational.teamDescription.taskStart': TeamDescriptionTaskStartAttributesType;
	/** */
	'operational.teamDescription.taskSuccess': TeamDescriptionTaskSuccessAttributesType;
	/** */
	'operational.teamDescription.taskAbort': TeamDescriptionTaskAbortAttributesType;
	/** */
	'operational.teamDescription.taskFail': TeamDescriptionTaskFailAttributesType;
	/** */
	'operational.teamPermissions.taskStart': TeamPermissionsTaskStartAttributesType;
	/** */
	'operational.teamPermissions.taskSuccess': TeamPermissionsTaskSuccessAttributesType;
	/** */
	'operational.teamPermissions.taskAbort': TeamPermissionsTaskAbortAttributesType;
	/** */
	'operational.teamPermissions.taskFail': TeamPermissionsTaskFailAttributesType;
	/** */
	'operational.members.taskStart': MembersTaskStartAttributesType;
	/** */
	'operational.members.taskSuccess': MembersTaskSuccessAttributesType;
	/** */
	'operational.members.taskAbort': MembersTaskAbortAttributesType;
	/** */
	'operational.members.taskFail': MembersTaskFailAttributesType;
	/** */
	'operational.submit.taskStart': SubmitTaskStartAttributesType;
	/** */
	'operational.submit.taskSuccess': SubmitTaskSuccessAttributesType;
	/** */
	'operational.submit.taskAbort': SubmitTaskAbortAttributesType;
	/** */
	'operational.submit.taskFail': SubmitTaskFailAttributesType;
	/** */
	'operational.removeTeamMember.taskStart': RemoveTeamMemberTaskStartAttributesType;
	/** */
	'operational.removeTeamMember.taskSuccess': RemoveTeamMemberTaskSuccessAttributesType;
	/** */
	'operational.removeTeamMember.taskAbort': RemoveTeamMemberTaskAbortAttributesType;
	/** */
	'operational.removeTeamMember.taskFail': RemoveTeamMemberTaskFailAttributesType;
	/** */
	'operational.openDialog.taskStart': OpenDialogTaskStartAttributesType;
	/** */
	'operational.openDialog.taskSuccess': OpenDialogTaskSuccessAttributesType;
	/** */
	'operational.openDialog.taskAbort': OpenDialogTaskAbortAttributesType;
	/** */
	'operational.openDialog.taskFail': OpenDialogTaskFailAttributesType;
	/** */
	'operational.editTeamNameOrDescription.taskStart': EditTeamNameOrDescriptionTaskStartAttributesType;
	/** */
	'operational.editTeamNameOrDescription.taskSuccess': EditTeamNameOrDescriptionTaskSuccessAttributesType;
	/** */
	'operational.editTeamNameOrDescription.taskAbort': EditTeamNameOrDescriptionTaskAbortAttributesType;
	/** */
	'operational.editTeamNameOrDescription.taskFail': EditTeamNameOrDescriptionTaskFailAttributesType;
	/** */
	'operational.recommendedProducts.taskSuccess': RecommendedProductsTaskSuccessAttributesType;
	/** */
	'operational.recommendedProducts.taskFail': RecommendedProductsTaskFailAttributesType;
	/** */
	'operational.projectsAndGoals.taskStart': ProjectsAndGoalsTaskStartAttributesType;
	/** */
	'operational.projectsAndGoals.taskSuccess': ProjectsAndGoalsTaskSuccessAttributesType;
	/** */
	'operational.teamsPermissionsRequest.failed': TeamsPermissionsRequestFailedAttributesType;
	/** */
	'operational.teamsPermissionsRequest.succeeded': TeamsPermissionsRequestSucceededAttributesType;
	/**
	 * fired when the team container linker is opened */
	'ui.teamContainerLinker.opened': TeamContainerLinkerOpenedAttributesType;
	/** */
	'track.teamContainerLinked.failed': TeamContainerLinkedFailedAttributesType;
	/** */
	'ui.teamContainerLinked.success': TeamContainerLinkedSuccessAttributesType;
	/** */
	'ui.teamContainerLinked.viewed': TeamContainerLinkedViewedAttributesType;
	/** */
	'ui.teamContainerLinker.viewed': TeamContainerLinkerViewedAttributesType;
	/** */
	'ui.teamContainerLinkerResults.viewed': TeamContainerLinkerResultsViewedAttributesType;
	/**
	 * fired when the star team button is viewed */
	'ui.starButton.viewed.team': StarButtonViewedTeamAttributesType;
	/** */
	'ui.connectJiraProjectTab.clicked': ConnectJiraProjectTabClickedAttributesType;
	/** */
	'ui.connectLoomSpaceTab.clicked': ConnectLoomSpaceTabClickedAttributesType;
	/** */
	'ui.connectConfluenceSpaceTab.clicked': ConnectConfluenceSpaceTabClickedAttributesType;
	/** */
	'ui.teamProfileCard.viewed': TeamProfileCardViewedAttributesType;
	/**
	 * fired when the team button is viewed */
	'ui.teamButton.viewed': TeamButtonViewedAttributesType;
	/**
	 * fired when the team button is clicked */
	'ui.teamButton.clicked': TeamButtonClickedAttributesType;
	/**
	 * fired when the team profile button is clicked */
	'ui.teamProfileButton.clicked': TeamProfileButtonClickedAttributesType;
	/**
	 * fired when the profile radar button is clicked */
	'ui.profileRadarButton.clicked': ProfileRadarButtonClickedAttributesType;
	/**
	 * fired when the add team modal is viewed */
	'screen.addTeamModal.viewed': AddTeamModalViewedAttributesType;
	/**
	 * fired when the add team modal confirm button is clicked */
	'ui.addTeamModalConfirmButton.clicked': AddTeamModalConfirmButtonClickedAttributesType;
	/**
	 * fired when the manage teams modal is viewed */
	'screen.manageTeamsModal.viewed': ManageTeamsModalViewedAttributesType;
	/**
	 * fired when the disconnect team confirmation modal is viewed */
	'screen.disconnectTeamModal.viewed': DisconnectTeamModalViewedAttributesType;
	/**
	 * fired when the remove (unlink) team button is clicked */
	'ui.removeTeamButton.clicked': RemoveTeamButtonClickedAttributesType;
	/**
	 * fired when the manage teams button is clicked */
	'ui.manageTeamsButton.clicked': ManageTeamsButtonClickedAttributesType;
	/**
	 * fired when the team selector popup is viewed */
	'screen.teamSelector.viewed': TeamSelectorViewedAttributesType;
	/**
	 * fired when the save button from the manage teams modal is clicked */
	'ui.manageTeamsSaveButton.clicked': ManageTeamsSaveButtonClickedAttributesType;
	/**
	 * add agent to team succeeded */
	'operational.teamAgentAssociation.succeeded': TeamAgentAssociationSucceededAttributesType;
	/**
	 * add agent to team failed */
	'operational.teamAgentAssociation.failed': TeamAgentAssociationFailedAttributesType;
	/**
	 * add agent to team succeeded */
	'track.teamAgentAssociation.added': TeamAgentAssociationAddedAttributesType;
	/**
	 * container is created and linked to a team */
	'track.teamContainerCreatedAndLinked.success': TeamContainerCreatedAndLinkedSuccessAttributesType;
	/**
	 * container is created and linked to a team */
	'track.teamContainerCreatedAndLinked.failed': TeamContainerCreatedAndLinkedFailedAttributesType;
	/**
	 * the "create jira project" button is viewed */
	'ui.createJiraContainer.viewed': CreateJiraContainerViewedAttributesType;
	/**
	 * the "create jira space" button is clicked */
	'ui.createJiraContainer.clicked': CreateJiraContainerClickedAttributesType;
	/**
	 * the "create confluence space" button is viewed */
	'ui.createConfluenceContainer.viewed': CreateConfluenceContainerViewedAttributesType;
	/**
	 * the "create confluence space" button is clicked */
	'ui.createConfluenceContainer.clicked': CreateConfluenceContainerClickedAttributesType;
	/**
	 * the "create loom space" button is viewed */
	'ui.createLoomContainer.viewed': CreateLoomContainerViewedAttributesType;
	/**
	 * the "create loom space" button is clicked */
	'ui.createLoomContainer.clicked': CreateLoomContainerClickedAttributesType;
	/**
	 * the "create web link" button is viewed */
	'ui.createWebLinkContainer.viewed': CreateWebLinkContainerViewedAttributesType;
	/**
	 * the "create web link" button is clicked */
	'ui.createWebLinkContainer.clicked': CreateWebLinkContainerClickedAttributesType;
	/**
	 * the create container component is viewed */
	'ui.createContainerFooter.viewed': CreateContainerFooterViewedAttributesType;
	/**
	 * fired when the Show more button is clicked in the Team activities tab */
	'ui.showMoreTeamActivities.clicked': ShowMoreTeamActivitiesClickedAttributesType;
	/**
	 * fired when the team activity is clicked in the Team activities tab */
	'ui.teamActivity.clicked': TeamActivityClickedAttributesType;
	/**
	 * fired when the team profile activity tab is successfully viewed */
	'screen.teamProfileActivityTab.viewed': TeamProfileActivityTabViewedAttributesType;
	/**
	 * fired when a tab profile tab is selected */
	'track.teamProfileTab.selected': TeamProfileTabSelectedAttributesType;
	/**
	 * fired when the team connection item is clicked */
	'ui.teamConnectionItem.clicked.teamProfileCard': TeamConnectionItemClickedTeamProfileCardAttributesType;
	/**
	 * fired when the view team profile button is clicked */
	'ui.button.clicked.viewTeamProfileButton': ButtonClickedViewTeamProfileButtonAttributesType;
	/**
	 * fired when the profilecard is triggered */
	'ui.profilecard.triggered': ProfilecardTriggeredAttributesType;
	/**
	 * fired when the rovo agent profilecard is triggered */
	'ui.rovoAgentProfilecard.triggered': RovoAgentProfilecardTriggeredAttributesType;
	/**
	 * fired when the team profilecard is triggered */
	'ui.teamProfileCard.triggered': TeamProfileCardTriggeredAttributesType;
	/**
	 * fired when an unknown profilecard is triggered */
	'ui.user.triggered': UserTriggeredAttributesType;
	/**
	 * fired when the profilecard is rendered and is loading */
	'ui.profilecard.rendered.spinner': ProfilecardRenderedSpinnerAttributesType;
	/**
	 * fired when the team profilecard is rendered and is loading */
	'ui.teamProfileCard.rendered.spinner': TeamProfileCardRenderedSpinnerAttributesType;
	/**
	 * fired when the rovo agent profilecard is rendered and is loading */
	'ui.rovoAgentProfilecard.rendered.spinner': RovoAgentProfilecardRenderedSpinnerAttributesType;
	/**
	 * fired when an unknown profilecard is rendered and is loading */
	'ui.user.rendered.spinner': UserRenderedSpinnerAttributesType;
	/**
	 * fired when the profilecard is rendered and is error */
	'ui.profilecard.rendered.error': ProfilecardRenderedErrorAttributesType;
	/**
	 * fired when the team profilecard is rendered and is error */
	'ui.teamProfileCard.rendered.error': TeamProfileCardRenderedErrorAttributesType;
	/**
	 * fired when the profilecard is clicked */
	'ui.profilecard.clicked.action': ProfilecardClickedActionAttributesType;
	/**
	 * fired when the profilecard is clicked */
	'ui.profilecard.clicked.reportingLines': ProfilecardClickedReportingLinesAttributesType;
	/**
	 * fired when the profilecard is rendered and has content */
	'ui.profilecard.rendered.content': ProfilecardRenderedContentAttributesType;
	/**
	 * fired when the profilecard is rendered and has content */
	'ui.rovoAgentProfilecard.rendered.content': RovoAgentProfilecardRenderedContentAttributesType;
	/**
	 * fired when the team profilecard is rendered and has content */
	'ui.teamProfileCard.rendered.content': TeamProfileCardRenderedContentAttributesType;
	/**
	 * fired when the delete agent button is clicked */
	'ui.button.clicked.deleteAgentButton': ButtonClickedDeleteAgentButtonAttributesType;
	/**
	 * fired when the edit agent button is clicked */
	'ui.button.clicked.editAgentButton': ButtonClickedEditAgentButtonAttributesType;
	/**
	 * fired when the copy agent link button is clicked */
	'ui.button.clicked.copyAgentLinkButton': ButtonClickedCopyAgentLinkButtonAttributesType;
	/**
	 * fired when the duplicate agent button is clicked */
	'ui.button.clicked.duplicateAgentButton': ButtonClickedDuplicateAgentButtonAttributesType;
	/**
	 * fired when the edit agent button is clicked */
	'ui.button.clicked.viewAgentFullProfileButton': ButtonClickedViewAgentFullProfileButtonAttributesType;
	/**
	 * fired when the team profilecard is rendered and is error boundary */
	'ui.teamProfileCard.rendered.errorBoundary': TeamProfileCardRenderedErrorBoundaryAttributesType;
	/**
	 * fired when the team profilecard is rendered and is error boundary */
	'ui.teamProfileCard.clicked.errorRetry': TeamProfileCardClickedErrorRetryAttributesType;
	/**
	 * fired when the profilecard request is succeeded */
	'operational.profilecard.succeeded.request': ProfilecardSucceededRequestAttributesType;
	/**
	 * fired when the profilecard request is triggered */
	'operational.profilecard.triggered.request': ProfilecardTriggeredRequestAttributesType;
	/**
	 * fired when the profilecard request is failed */
	'operational.profilecard.failed.request': ProfilecardFailedRequestAttributesType;
	/**
	 * fired when the team profilecard request is succeeded */
	'operational.teamProfileCard.succeeded.request': TeamProfileCardSucceededRequestAttributesType;
	/**
	 * fired when the team profilecard request is triggered */
	'operational.teamProfileCard.triggered.request': TeamProfileCardTriggeredRequestAttributesType;
	/**
	 * fired when the team profilecard request is failed */
	'operational.teamProfileCard.failed.request': TeamProfileCardFailedRequestAttributesType;
	/**
	 * fired when the rovo agent profilecard request is succeeded */
	'operational.rovoAgentProfilecard.succeeded.request': RovoAgentProfilecardSucceededRequestAttributesType;
	/**
	 * fired when the rovo agent profilecard request is triggered */
	'operational.rovoAgentProfilecard.triggered.request': RovoAgentProfilecardTriggeredRequestAttributesType;
	/**
	 * fired when the rovo agent profilecard request is failed */
	'operational.rovoAgentProfilecard.failed.request': RovoAgentProfilecardFailedRequestAttributesType;
	/**
	 * fired when the rovo agent profilecard deleteAgent is succeeded */
	'operational.rovoAgentProfilecard.succeeded.deleteAgent': RovoAgentProfilecardSucceededDeleteAgentAttributesType;
	/**
	 * fired when the rovo agent profilecard deleteAgent is failed */
	'operational.rovoAgentProfilecard.failed.deleteAgent': RovoAgentProfilecardFailedDeleteAgentAttributesType;
	/**
	 * fired when the rovo agent profilecard favourite is succeeded */
	'operational.rovoAgentProfilecard.succeeded.favourite': RovoAgentProfilecardSucceededFavouriteAttributesType;
	/**
	 * fired when the rovo agent profilecard favourite is triggered */
	'operational.rovoAgentProfilecard.triggered.favourite': RovoAgentProfilecardTriggeredFavouriteAttributesType;
	/**
	 * fired when the rovo agent profilecard favourite is failed */
	'operational.rovoAgentProfilecard.failed.favourite': RovoAgentProfilecardFailedFavouriteAttributesType;
	/**
	 * fired when the rovo agent profilecard unfavourite is succeeded */
	'operational.rovoAgentProfilecard.succeeded.unfavourite': RovoAgentProfilecardSucceededUnfavouriteAttributesType;
	/**
	 * fired when the rovo agent profilecard unfavourite is triggered */
	'operational.rovoAgentProfilecard.triggered.unfavourite': RovoAgentProfilecardTriggeredUnfavouriteAttributesType;
	/**
	 * fired when the rovo agent profilecard unfavourite is failed */
	'operational.rovoAgentProfilecard.failed.unfavourite': RovoAgentProfilecardFailedUnfavouriteAttributesType;
	/**
	 * fired when the rovo agent profilecard getAgentPermissions is succeeded */
	'operational.rovoAgentProfilecard.succeeded.getAgentPermissions': RovoAgentProfilecardSucceededGetAgentPermissionsAttributesType;
	/**
	 * fired when the rovo agent profilecard getAgentPermissions is failed */
	'operational.rovoAgentProfilecard.failed.getAgentPermissions': RovoAgentProfilecardFailedGetAgentPermissionsAttributesType;
	/**
	 * fired when the more actions is clicked */
	'ui.profilecard.clicked.moreActions': ProfilecardClickedMoreActionsAttributesType;
	/**
	 * fired when the more actions is clicked */
	'ui.teamProfileCard.clicked.moreActions': TeamProfileCardClickedMoreActionsAttributesType;
	/**
	 * fired when the avatar is clicked */
	'ui.teamProfileCard.clicked.avatar': TeamProfileCardClickedAvatarAttributesType;
	/**
	 * fired when the action is clicked */
	'ui.teamProfileCard.clicked.action': TeamProfileCardClickedActionAttributesType;
	/**
	 * fired when the more members is clicked */
	'ui.teamProfileCard.clicked.moreMembers': TeamProfileCardClickedMoreMembersAttributesType;
	/**
	 * fired when the profile projects and goals tab is clicked */
	'ui.ProfileProjectsAndGoalsTab.clicked': ProfileProjectsAndGoalsTabClickedAttributesType;
	/**
	 * fired when the profile projects and goals is viewed */
	'ui.ProfileProjectsAndGoals.viewed': ProfileProjectsAndGoalsViewedAttributesType;
	/**
	 * fired when the profile projects link is clicked */
	'ui.ProfileProjectsLink.clicked': ProfileProjectsLinkClickedAttributesType;
	/**
	 * fired when the profile goals link is clicked */
	'ui.ProfileGoalsLink.clicked': ProfileGoalsLinkClickedAttributesType;
	/**
	 * fired when the follow team projects and goals button is clicked */
	'ui.button.clicked.followTeamProjectsGoalsButton': ButtonClickedFollowTeamProjectsGoalsButtonAttributesType;
	/**
	 * fired when the unfollow team projects and goals button is clicked */
	'ui.button.clicked.unfollowTeamProjectsGoalsButton': ButtonClickedUnfollowTeamProjectsGoalsButtonAttributesType;
	/**
	 * fired when an error boundary is triggered */
	'operational.errorBoundary.triggered': ErrorBoundaryTriggeredAttributesType;
	/**
	 * fired when the profile kudos is viewed */
	'ui.ProfileKudos.viewed': ProfileKudosViewedAttributesType;
	/**
	 * fired when the profile kudos tab is clicked */
	'ui.ProfileKudosTab.clicked': ProfileKudosTabClickedAttributesType;
	/**
	 * fired when a kudos item is clicked */
	'ui.ProfileKudos.clicked': ProfileKudosClickedAttributesType;
	/**
	 * fired when the reporting lines chart is collapsed */
	'ui.ReportingLinesChart.collapsed': ReportingLinesChartCollapsedAttributesType;
	/**
	 * fired when the reporting lines chart is expanded */
	'ui.ReportingLinesChart.expanded': ReportingLinesChartExpandedAttributesType;
	/**
	 * fired when the reporting lines chart is viewed */
	'ui.ReportingLinesChart.viewed': ReportingLinesChartViewedAttributesType;
	/**
	 * fired when the reporting lines chart is viewed - used for Atlas MAU */
	'ui.ui.viewed': UiViewedAttributesType;
	/**
	 * fired when the reporting lines user card is clicked */
	'ui.ReportingLinesUserCard.clicked': ReportingLinesUserCardClickedAttributesType;
	/**
	 * fired when the reporting lines empty state is viewed */
	'ui.ReportingLinesEmptyState.viewed': ReportingLinesEmptyStateViewedAttributesType;
	/**
	 * fired when the add people button is clicked */
	'ui.button.clicked.addPeopleButton': ButtonClickedAddPeopleButtonAttributesType;
	/**
	 * fired when the link profile button is clicked */
	'ui.userMenuItem.clicked.linkProfile': UserMenuItemClickedLinkProfileAttributesType;
	/**
	 * fired when the link manage account button is clicked */
	'ui.userMenuItem.clicked.linkManageAccount': UserMenuItemClickedLinkManageAccountAttributesType;
	/**
	 * fired when the link logout button is clicked */
	'ui.userMenuItem.clicked.linkLogout': UserMenuItemClickedLinkLogoutAttributesType;
	/**
	 * fired when the user menu is opened */
	'track.userMenu.opened': UserMenuOpenedAttributesType;
	/**
	 * fired when the header image action is triggered */
	'operational.headerImage.started.userHeaderImage': HeaderImageStartedUserHeaderImageAttributesType;
	/**
	 * fired when the header image action is failed */
	'operational.headerImage.failed.userHeaderImage': HeaderImageFailedUserHeaderImageAttributesType;
	/**
	 * fired when the header image action is succeeded */
	'operational.headerImage.succeeded.userHeaderImage': HeaderImageSucceededUserHeaderImageAttributesType;
	/**
	 * fired when the header image action is triggered */
	'operational.headerImage.started.teamHeaderImage': HeaderImageStartedTeamHeaderImageAttributesType;
	/**
	 * fired when the header image action is failed */
	'operational.headerImage.failed.teamHeaderImage': HeaderImageFailedTeamHeaderImageAttributesType;
	/**
	 * fired when the header image action is succeeded */
	'operational.headerImage.succeeded.teamHeaderImage': HeaderImageSucceededTeamHeaderImageAttributesType;
	/**
	 * fired when the media picker upload button is clicked */
	'ui.button.clicked.profileHeaderMediaPickerUpload': ButtonClickedProfileHeaderMediaPickerUploadAttributesType;
	/**
	 * fired when the remove header image button is clicked */
	'ui.button.clicked.profileHeaderRemove': ButtonClickedProfileHeaderRemoveAttributesType;
	/**
	 * fired when the send feedback button is clicked */
	'ui.sendFeedback.clicked': SendFeedbackClickedAttributesType;
	/**
	 * fired when the remove avatar button is clicked */
	'ui.button.clicked.removeAvatar': ButtonClickedRemoveAvatarAttributesType;
	/**
	 * fired when the delete avatar action is failed */
	'track.deleteAvatar.failed': DeleteAvatarFailedAttributesType;
	/**
	 * fired when the delete avatar action is succeeded */
	'track.deleteAvatar.succeeded': DeleteAvatarSucceededAttributesType;
	/**
	 * fired when the avatar picker is closed */
	'track.avatarPicker.closed': AvatarPickerClosedAttributesType;
	/**
	 * fired when the avatar picker is opened */
	'track.avatarPicker.opened': AvatarPickerOpenedAttributesType;
	/**
	 * fired when the change profile photo button is clicked */
	'ui.button.clicked.changeProfilePhoto': ButtonClickedChangeProfilePhotoAttributesType;
	/**
	 * fired when the create initials avatar button is clicked */
	'ui.button.clicked.createInitialsAvatar': ButtonClickedCreateInitialsAvatarAttributesType;
	/**
	 * fired when the avatar initials picker is opened */
	'track.avatarInitialsPicker.opened': AvatarInitialsPickerOpenedAttributesType;
	/**
	 * fired when the upload avatar action is failed */
	'track.uploadAvatar.failed': UploadAvatarFailedAttributesType;
	/**
	 * fired when the upload avatar action is succeeded */
	'track.uploadAvatar.succeeded': UploadAvatarSucceededAttributesType;
	/**
	 * fired when the update avatar initials button is clicked */
	'ui.button.clicked.updateAvatarInitials': ButtonClickedUpdateAvatarInitialsAttributesType;
	/**
	 * fired when the cancel update avatar initials button is clicked */
	'ui.button.clicked.cancelUpdateAvatarInitials': ButtonClickedCancelUpdateAvatarInitialsAttributesType;
	/**
	 * fired when the avatar initials picker is closed */
	'track.avatarInitialsPicker.closed': AvatarInitialsPickerClosedAttributesType;
	/**
	 * fired when the avatar initials picker is viewed */
	'screen.avatarInitialsPicker.viewed': AvatarInitialsPickerViewedAttributesType;
	/**
	 * fired when the team org mismatch is failed */
	'operational.TeamOrgMismatch.failed': TeamOrgMismatchFailedAttributesType;
	/**
	 * fired when the profile about item is edited */
	'track.profileAboutItem.edited': ProfileAboutItemEditedAttributesType;
	/**
	 * fired when the user profile screen about panel is viewed */
	'track.userProfileScreenAboutPanel.viewed': UserProfileScreenAboutPanelViewedAttributesType;
	/**
	 * fired when the privacy policy link is clicked */
	'ui.privacyPolicyLink.clicked': PrivacyPolicyLinkClickedAttributesType;
	/**
	 * fired when the team profile item is clicked */
	'ui.teamProfileItem.clicked': TeamProfileItemClickedAttributesType;
	/**
	 * fired when the show more button is clicked */
	'ui.showMore.clicked': ShowMoreClickedAttributesType;
	/**
	 * fired when the team create dialog trigger button is clicked */
	'ui.teamCreateDialogTriggerButton.clicked': TeamCreateDialogTriggerButtonClickedAttributesType;
	/**
	 * fired when the manage account button is clicked */
	'ui.button.clicked.manageAccountButton': ButtonClickedManageAccountButtonAttributesType;
	/**
	 * fired when the manage access button is clicked */
	'ui.button.clicked.manageAccessButton': ButtonClickedManageAccessButtonAttributesType;
	/**
	 * fired when the user profile screen load fails */
	'track.userProfileScreenLoad.failed': UserProfileScreenLoadFailedAttributesType;
	/**
	 * fired when the user profile screen is viewed */
	'screen.userProfileScreen.viewed': UserProfileScreenViewedAttributesType;
	/**
	 * fired when the view all work button is clicked */
	'ui.viewAllWork.clicked': ViewAllWorkClickedAttributesType;
	/**
	 * fired when the more work button is clicked */
	'ui.moreWork.clicked': MoreWorkClickedAttributesType;
	/**
	 * fired when the activity entry is clicked */
	'ui.activityEntry.clicked': ActivityEntryClickedAttributesType;
	/**
	 * fired when the places link is clicked */
	'ui.placesLink.clicked': PlacesLinkClickedAttributesType;
	/**
	 * fired when the team profile is viewed from the request to join notification */
	'track.ViewedTeamProfileFromRequestToJoinNotification.viewed': ViewedTeamProfileFromRequestToJoinNotificationViewedAttributesType;
	/**
	 * fired when the team profile screen is viewed */
	'screen.teamProfileScreen.viewed': TeamProfileScreenViewedAttributesType;
	/**
	 * team archived successfully */
	'track.teamArchived.succeeded': TeamArchivedSucceededAttributesType;
	/**
	 * team archival failed */
	'track.teamArchived.failed': TeamArchivedFailedAttributesType;
	/**
	 * team unarchived successfully */
	'track.teamUnarchived.succeeded': TeamUnarchivedSucceededAttributesType;
	/**
	 * team unarchival failed */
	'track.teamUnarchived.failed': TeamUnarchivedFailedAttributesType;
	/**
	 * fired when the get team profile request is succeeded */
	'operational.GetTeamProfile.succeeded': GetTeamProfileSucceededAttributesType;
	/**
	 * fired when the get team profile request is failed */
	'operational.GetTeamProfile.failed': GetTeamProfileFailedAttributesType;
	/**
	 * fired when the add weblink dialog is opened */
	'track.addWebLinkDialog.opened': AddWebLinkDialogOpenedAttributesType;
	/**
	 * fired when the edit weblink dialog is opened */
	'track.editWebLinkDialog.opened': EditWebLinkDialogOpenedAttributesType;
	/**
	 * fired when the help link is clicked */
	'ui.link.clicked.helpLink': LinkClickedHelpLinkAttributesType;
	/**
	 * fired when the help pointers are viewed */
	'ui.TeamsProfileHelpPointers.viewed': TeamsProfileHelpPointersViewedAttributesType;
	/**
	 * fired when the show more button is clicked to expand the help pointers list */
	'ui.ShowMore.expanded': ShowMoreExpandedAttributesType;
	/**
	 * fired when the create help pointer dialog is opened */
	'ui.dialog.opened.createHelpPointerDialog': DialogOpenedCreateHelpPointerDialogAttributesType;
	/**
	 * fired when a help pointer is successfully created */
	'track.helpPointer.created': HelpPointerCreatedAttributesType;
	/**
	 * fired when a tag is successfully created */
	'track.tag.created': TagCreatedAttributesType;
	/**
	 * fired when the edit help pointer dialog is opened */
	'ui.dialog.opened.editHelpPointerDialog': DialogOpenedEditHelpPointerDialogAttributesType;
	/**
	 * fired when the delete help pointer dialog is opened */
	'ui.dialog.opened.deleteHelpPointerDialog': DialogOpenedDeleteHelpPointerDialogAttributesType;
	/**
	 * fired when a help pointer is successfully deleted */
	'track.helpPointer.deleted': HelpPointerDeletedAttributesType;
	/**
	 * fired when a help pointer is successfully edited */
	'track.helpPointer.edited': HelpPointerEditedAttributesType;
	/**
	 * fired when a team is successfully linked to a container */
	'track.teamLink.linked': TeamLinkLinkedAttributesType;
	/**
	 * fired when a link is typed in the add link dialog */
	'ui.teamLink.typed': TeamLinkTypedAttributesType;
	/**
	 * fired when the add http button is clicked in the add link dialog */
	'ui.teamLink.clicked.addHttpButton': TeamLinkClickedAddHttpButtonAttributesType;
	/**
	 * fired when the add https button is clicked in the add link dialog */
	'ui.teamLink.clicked.addHttpsButton': TeamLinkClickedAddHttpsButtonAttributesType;
	/**
	 * fired when the team restore screen is viewed */
	'screen.teamRestoreScreen.viewed': TeamRestoreScreenViewedAttributesType;
	/**
	 * fired when the reactivate team button is clicked */
	'ui.button.clicked.reactivateTeam': ButtonClickedReactivateTeamAttributesType;
	/**
	 * fired when the team is successfully restored */
	'operational.teamRestore.succeeded': TeamRestoreSucceededAttributesType;
	/**
	 * fired when the team restore action fails */
	'operational.teamRestore.failed': TeamRestoreFailedAttributesType;
	/**
	 * fired when the get settings request is succeeded */
	'operational.GetSettings.succeeded': GetSettingsSucceededAttributesType;
	/**
	 * fired when the get settings request fails */
	'operational.GetSettings.failed': GetSettingsFailedAttributesType;
	/**
	 * fired when a team link is successfully edited */
	'track.teamLink.edited': TeamLinkEditedAttributesType;
	/**
	 * fired when the people home is viewed */
	'screen.peopleHome.viewed': PeopleHomeViewedAttributesType;
	/**
	 * fired when a user filter is selected */
	'ui.userFilter.selected': UserFilterSelectedAttributesType;
	/**
	 * fired when a team element is clicked */
	'ui.teamElement.clicked': TeamElementClickedAttributesType;
	/**
	 * fired when a suggested collaborator is clicked */
	'ui.suggestedCollaborators.clicked': SuggestedCollaboratorsClickedAttributesType;
	/**
	 * fired when the view directory filters in atlas is clicked */
	'ui.ViewDirectoryFiltersInAtlas.clicked': ViewDirectoryFiltersInAtlasClickedAttributesType;
	/**
	 * fired when the your teams is clicked */
	'ui.yourTeams.clicked': YourTeamsClickedAttributesType;
	/**
	 * fired when the browse all teams is clicked */
	'ui.browseAllTeams.clicked': BrowseAllTeamsClickedAttributesType;
	/**
	 * fired when the add people button is clicked */
	'ui.addPeopleButton.clicked': AddPeopleButtonClickedAttributesType;
	/**
	 * fired when the team search result is clicked */
	'ui.teamSearchResult.clicked': TeamSearchResultClickedAttributesType;
	/**
	 * fired when the recent collaborator is clicked */
	'ui.recentCollaborator.clicked': RecentCollaboratorClickedAttributesType;
	/**
	 * fired when the people search result is clicked */
	'ui.peopleSearchResult.clicked': PeopleSearchResultClickedAttributesType;
	/**
	 * fired when agent profile about teams section is viewed */
	'screen.agentProfileAboutTeams.viewed': AgentProfileAboutTeamsViewedAttributesType;
	/**
	 * fired when user profile about teams section is viewed */
	'screen.userProfileAboutTeams.viewed': UserProfileAboutTeamsViewedAttributesType;
	/**
	 * fired when user profile working with me section is viewed (only when section has content) */
	'screen.userProfileWorkingWithMe.viewed': UserProfileWorkingWithMeViewedAttributesType;
	/**
	 * fired when team agents panel is viewed */
	'screen.teamAgentsPanel.viewed': TeamAgentsPanelViewedAttributesType;
	/**
	 * fired when team assigned type is updated */
	'ui.teamAssignedType.updated': TeamAssignedTypeUpdatedAttributesType;
	/**
	 * fired when team assigned type picker is clicked */
	'ui.teamAssignedTypePicker.clicked': TeamAssignedTypePickerClickedAttributesType;
	/**
	 * Fired when eligibility check is performed for twcg_640_invite_prompt_on_teams_page_links */
	'operational.invitePrompt.eligibilityChecked': InvitePromptEligibilityCheckedAttributesType;
	/**
	 * Fired when eligibility check is for twcg_640_invite_prompt_on_teams_page_links failes for whatever reason */
	'operational.invitePrompt.eligibilityCheckFailed': InvitePromptEligibilityCheckFailedAttributesType;
	/**
	 * Fired when the invite prompt flag is displayed to the user */
	'ui.invitePrompt.shown.flag': InvitePromptShownFlagAttributesType;
	/**
	 * Fired when the user clicks on Invite X team members / Invite X */
	'ui.invitePrompt.clicked.inviteButton': InvitePromptClickedInviteButtonAttributesType;
	/**
	 * Fired when the invitation action is successfully completed and the success flag is shown to the user */
	'ui.invitePrompt.shown.successFlag': InvitePromptShownSuccessFlagAttributesType;
	/**
	 * Fired when the invite action fails and we shown an error flag to the user */
	'ui.invitePrompt.shown.failedFlag': InvitePromptShownFailedFlagAttributesType;
	/**
	 * Fired when the users dismisses the invite prompt flag */
	'ui.invitePrompt.clicked.dismissButton': InvitePromptClickedDismissButtonAttributesType;
	/**
	 * Fired when a flag is exposed to a user */
	'track.feature.exposed': FeatureExposedAttributesType;
	/**
	 * Fired when something fails horribly inside of showContainerAddedFlagFailed */
	'operational.invitePrompt.showContainerAddedFlagFailed': InvitePromptShowContainerAddedFlagFailedAttributesType;
	/**
	 * Fired when the user tries to add requested containers again */
	'track.requestedContainers.tryAgain': RequestedContainersTryAgainAttributesType;
	/**
	 * Fired when the user fails to add requested containers */
	'track.requestedContainers.failed': RequestedContainersFailedAttributesType;
	/**
	 * fired when a team is starred or unstarred succeeds */
	'track.starred.succeeded.team': StarredSucceededTeamAttributesType;
	/**
	 * fired when starring or unstarring a team fails */
	'track.starred.failed.team': StarredFailedTeamAttributesType;
};

export type EventKey = keyof AnalyticsEventAttributes;
