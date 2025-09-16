/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::e2b988fe2930f12f420d7e421a16585a>>
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
	defaultTeamType: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL' | null;
	chosenTeamType: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL';
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
	defaultType: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL' | null;
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
};

export type EventKey = keyof AnalyticsEventAttributes;
