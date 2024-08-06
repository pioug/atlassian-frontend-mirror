import { defineMessages, type MessageDescriptor } from 'react-intl-next';

export type RequestAccessMessageKey =
	| 'click_to_join'
	| 'click_to_join_description'
	| 'forbidden_description'
	| 'request_access'
	| 'request_access_description'
	| 'request_access_pending'
	| 'request_access_pending_title'
	| 'request_access_pending_description'
	| 'request_denied_description'
	| 'default_no_access_title'
	| 'direct_access_title'
	| 'direct_access_description'
	| 'direct_access'
	| 'access_exists_description'
	| 'not_found_description'
	| 'not_found_title';

export type MessageKey =
	| 'assigned_to'
	| 'ai_summarize'
	| 'ai_summarized'
	| 'ai_summarized_abbreviation'
	| 'ai_summarized_info'
	| 'ai_summarized_info_short'
	| 'ai_summarizing'
	| 'ai_summary_error_generic'
	| 'ai_summary_error_acceptable_use_violation'
	| 'ai_summary_error_hipaa_content_detected'
	| 'ai_summary_error_exceeding_context_length_error'
	| 'ai_summary_action'
	| 'ai_summary_action_description'
	| 'automation_action_title'
	| 'automation_action_tooltip'
	| 'automation_action_icon_label'
	| 'automation_action_confluence_page_modal_title'
	| 'automation_action_confluence_page_modal_description'
	| 'copy_summary_action'
	| 'copy_summary_action_description'
	| 'copied_summary_action_description'
	| 'beta'
	| 'cannot_find_link'
	| 'connect_link_account_card'
	| 'connect_link_account_card_name'
	| 'connect_link_account_card_description'
	| 'connect_unauthorised_account_action'
	| 'connect_unauthorised_account_description'
	| 'connect_unauthorised_account_description_no_provider'
	| 'continue'
	| 'copy_url_to_clipboard'
	| 'copied_url_to_clipboard'
	| 'could_not_load_link'
	| 'download'
	| 'download_description'
	| 'download_file'
	| 'follow'
	| 'follow_project_description'
	| 'follow_project'
	| 'follow_goal'
	| 'follow_goal_description'
	| 'follow_project_error'
	| 'follow_goal_error'
	| 'go_back'
	| 'invalid_permissions'
	| 'invalid_permissions_description'
	| 'join_to_view'
	| 'connect_link_account'
	| 'created_by'
	| 'created_on_relative'
	| 'created_on_absolute'
	| 'check_this_link'
	| 'delete'
	| 'edit'
	| 'learn_more_about_smart_links'
	| 'learn_more_about_connecting_account'
	| 'loading'
	| 'link_safety_warning_message'
	| 'modified_by'
	| 'modified_on_relative'
	| 'modified_on_absolute'
	| 'more_actions'
	| 'not_found_title'
	| 'not_found_description'
	| 'open_issue_in_jira'
	| 'open_link_in_a_new_tab'
	| 'owned_by'
	| 'preview_description'
	| 'preview_improved'
	| 'preview_close'
	| 'preview_max_size'
	| 'preview_min_size'
	| 'priority_blocker'
	| 'priority_critical'
	| 'priority_high'
	| 'priority_highest'
	| 'priority_low'
	| 'priority_lowest'
	| 'priority_major'
	| 'priority_medium'
	| 'priority_minor'
	| 'priority_trivial'
	| 'priority_undefined'
	| 'forbidden_access'
	| 'pending_request'
	| 'read_time'
	| 'restricted_link'
	| 'request_access_to_view'
	| 'request_denied'
	| 'sent_on_relative'
	| 'sent_on_absolute'
	| 'status_change_load_error'
	| 'status_change_permission_error'
	| 'status_change_update_error'
	| 'try_again'
	| 'try_another_account'
	| 'unauthorised_account_description'
	| 'unauthorised_account_description_no_provider'
	| 'unauthorised_account_name'
	| 'unauthorised_account_name_no_provider'
	| 'unassigned'
	| 'unfollow'
	| 'unfollow_project_description'
	| 'unfollow_project'
	| 'unfollow_project_error'
	| 'unfollow_goal'
	| 'unfollow_goal_description'
	| 'unfollow_goal_error'
	| 'view'
	| 'viewIn'
	| 'viewOriginal'
	// Cannot find direct usage of the following messages,
	// but the context indicates it could be used in Smart Links.
	// Could the key be returned with JsonLd on auth flow?
	// Keep the messages until able to verify that the messages are not used.
	| 'actions'
	| 'add_account'
	| 'cancel'
	| 'close'
	| 'connect_to'
	| 'connect_account_description'
	| 'retry'
	| 'save'
	| 'unlink_account'
	| RequestAccessMessageKey
	| 'related_work_items_not_found'
	| 'last_mentioned_in'
	| 'related'
	| 'generic_error_message'
	| 'related_links_modal_error_header'
	| 'related_links_modal_error_message'
	| 'related_links_modal_unavailable_header'
	| 'related_links_modal_unavailable_message'
	| 'related_links_modal_title'
	| 'related_links_view_related_urls'
	| 'related_links_found_in'
	| 'related_links_includes_links_to'
	| 'related_links_not_found';

type Messages = {
	[K in MessageKey]: MessageDescriptor;
};

export const messages: Messages = defineMessages({
	actions: {
		id: 'fabric.linking.actions',
		defaultMessage: 'Actions',
		description: '',
	},
	add_account: {
		id: 'fabric.linking.add_account',
		defaultMessage: 'Add account',
		description: 'Allows to add a new account',
	},
	ai_summarize: {
		id: 'fabric.linking.ai_summarize',
		defaultMessage: 'Summarize',
		description: 'Action to summarize link resource content with AI',
	},
	ai_summarized: {
		id: 'fabric.linking.ai_summarized',
		defaultMessage: 'Summarized by Atlassian Intelligence',
		description: 'Shown with the content summarised by AI.',
	},
	ai_summarized_abbreviation: {
		id: 'fabric.linking.ai_summarized_abbreviation',
		defaultMessage: 'Summarized by AI',
		description:
			'Shown with the content summarised by AI. AI is in abbreviation form to reduce space.',
	},
	ai_summarized_info: {
		id: 'fabric.linking.ai_summarized_info',
		defaultMessage: 'Information quality may vary. <a>Learn more</a>',
		description: 'Additional info about the content summarised by AI.',
	},
	ai_summarized_info_short: {
		id: 'fabric.linking.ai_summarized_info_short',
		defaultMessage: 'Content quality may vary',
		description: 'Additional info about the content summarised by AI.',
	},
	ai_summarizing: {
		id: 'fabric.linking.ai_summarizing',
		defaultMessage: 'Atlassian Intelligence is working...',
		description: 'Shown when AI summary is summarising the link resource content.',
	},
	ai_summary_error_generic: {
		id: 'fabric.linking.ai_summary_error_generic',
		defaultMessage:
			'Atlassian Intelligence (AI) isn’t responding. Try again later or <a>check the status of AI</a>.',
		description:
			'Shown when AI Summary encountered an unexpected error while summarizing the linked resource content.',
	},
	ai_summary_error_acceptable_use_violation: {
		id: 'fabric.linking.ai_summary_error_acceptable_use_violation',
		defaultMessage:
			"We cannot show the results of this summary as it goes against <a>Atlassian's Acceptable Use Policy</a>.",
		description:
			'Shown when AI summary is summarising the link resource content and the content violates atlassians acceptable use policy.',
	},
	ai_summary_error_hipaa_content_detected: {
		id: 'fabric.linking.ai_summary_error_hipaa_content_detected',
		defaultMessage:
			'Atlassian Intelligence was unable to process your request as your content contains links to HIPAA restricted content.',
		description:
			'Shown when the AI summary is summarising the link resource content and the content contains HIPAA restricted content.',
	},
	ai_summary_error_exceeding_context_length_error: {
		id: 'fabric.linking.ai_summary_error_exceeding_context_length_error',
		defaultMessage:
			"Atlassian Intelligence can't generate a summary for you right now as there is too much content to summarize.",
		description:
			'Shown when the AI summary is summarising the link resource content and the content is too large to summarize.',
	},
	assigned_to: {
		id: 'fabric.linking.assigned_to',
		defaultMessage: 'Assigned to {context}',
		description: 'Indicates the person or entity that the resource is assigned to.',
	},
	automation_action_title: {
		id: 'fabric.linking.automation-action.title',
		defaultMessage: 'View automation rules...',
		description:
			'The title of the button in a hover card to open an automation menu for a given SmartLink.',
	},
	automation_action_icon_label: {
		id: 'fabric.linking.automation-action.icon.label',
		defaultMessage: 'Automation icon',
		description:
			'The label for the automation icon inside of the button opening the automation menu.',
	},
	automation_action_tooltip: {
		id: 'fabric.linking.automation-action.tooltip',
		defaultMessage: 'Select an automation rule to run',
		description:
			'The tooltip for the automation action indicating that a button will open an automation modal.',
	},
	automation_action_confluence_page_modal_title: {
		id: 'fabric.linking.automation-action.confluence.page.modal.title',
		defaultMessage: 'Page automations',
		description: 'The title of the automation modal when the SmartLink is a Confluence page',
	},
	automation_action_confluence_page_modal_description: {
		id: 'fabric.linking.automation-action.confluence.page.modal.description',
		defaultMessage:
			'Apply an automation to <b>{name}</b>.{br}The available selections are controlled by Confluence and space administrators.',
		description:
			'The description in the automation modal when the SmartLink is a Confluence page. Indicating which page the automation will apply to, and who controls the available automations.',
	},
	cancel: {
		id: 'fabric.linking.cancel',
		defaultMessage: 'Cancel',
		description: 'cancel',
	},
	beta: {
		id: 'fabric.linking.beta',
		defaultMessage: 'Beta',
		description: 'Indicates a beta phase of the feature.',
	},
	cannot_connect: {
		id: 'fabric.linking.cannot_connect',
		defaultMessage: "Can't connect, try again",
		description: 'Error for when a provided link is not found.',
	},
	cannot_find_link: {
		id: 'fabric.linking.cannot_find_link',
		defaultMessage: "Can't find link",
		description: 'Error for when a provided link is not found.',
	},
	click_to_join: {
		id: 'fabric.linking.click_to_join',
		defaultMessage: 'Join {context}',
		description: 'Allows the user join the product or service immediately',
	},
	click_to_join_description: {
		id: 'fabric.linking.click_to_join_description',
		defaultMessage: "You've been approved, so you can join {context} right away.",
		description:
			'Informs the user that they have access to this product, and can sign up or join right away.',
	},
	close: {
		id: 'fabric.linking.close',
		defaultMessage: 'Close',
		description: '',
	},
	check_this_link: {
		id: 'fabric.linking.check_this_link',
		defaultMessage: 'Check this link',
		description: 'Link safety warning modal header',
	},
	connect_to: {
		id: 'fabric.linking.connect_to',
		defaultMessage: 'Connect to {name}',
		description: 'Allows the user to connect with different types of external services',
	},
	connect_account_description: {
		id: 'fabric.linking.connect_account_description',
		defaultMessage: "We'll open a new page to help you connect your {name} account",
		description: 'Explains what will happen when the users connects to a new account',
	},
	connect_link_account: {
		id: 'fabric.linking.connect_link_account',
		defaultMessage: 'Connect to preview',
		description:
			'Shown when a user does not have access to a link, but can connect their external account to view the link.',
	},
	connect_link_account_card: {
		id: 'fabric.linking.connect_link_account_card_view',
		defaultMessage: 'Connect',
		description:
			'Shown when a user does not have access to a link, but can connect their external account to view the link on card view.',
	},
	connect_link_account_card_name: {
		id: 'fabric.linking.connect_link_account_card_view_name',
		defaultMessage: 'Connect your {context} account',
		description:
			'Shown when a user does not have access to a link, but can connect their external account to view the link on card view. Displayed in title.',
	},
	connect_link_account_card_description: {
		id: 'fabric.linking.connect_link_account_card_view_description',
		defaultMessage: 'To show a preview of this link, connect your {context} account.',
		description:
			'Shown when a user does not have access to a link, but can connect their external account to view the link on card view. Displayed in byline.',
	},
	connect_unauthorised_account_action: {
		id: 'fabric.linking.connect_unauthorised_account_action',
		defaultMessage: 'Connect to {context}',
		description: 'Shown on a button to connect user external account to their Atlassian account.',
	},
	connect_unauthorised_account_description: {
		id: 'fabric.linking.connect_unauthorised_account_description',
		defaultMessage:
			'Connect your {context} account to collaborate on work across Atlassian products.',
		description:
			'Shown when a user does not have access to a link, but can connect their external account to view the link on card view.',
	},
	connect_unauthorised_account_description_no_provider: {
		id: 'fabric.linking.connect_unauthorised_account_description_no_provider',
		defaultMessage: 'Connect your account to collaborate on work across Atlassian products.',
		description:
			'Shown when a user does not have access to a link, but can connect their external account to view the link on card view and we do not have the providers name.',
	},
	continue: {
		id: 'fabric.linking.continue',
		defaultMessage: 'Continue',
		description: 'continue',
	},
	copy_url_to_clipboard: {
		id: 'fabric.linking.copy_url_to_clipboard',
		defaultMessage: 'Copy link',
		description: '',
	},
	copied_url_to_clipboard: {
		id: 'fabric.linking.copied_url_to_clipboard',
		defaultMessage: 'Copied!',
		description: 'Url has been copied to the clipboard',
	},
	could_not_load_link: {
		id: 'fabric.linking.couldnt_load_link',
		defaultMessage: "We couldn't load this link for an unknown reason.",
		description: 'Error case for card view - link could not be loaded.',
	},
	created_by: {
		id: 'fabric.linking.created_by',
		defaultMessage: 'Created by {context}',
		description: 'Indicates the person or entity that created the resource.',
	},
	created_on_relative: {
		id: 'fabric.linking.create_on_relative',
		defaultMessage: 'Created {context}',
		description: 'Indicated when entity was created (relative form)',
	},
	created_on_absolute: {
		id: 'fabric.linking.create_on_absolute',
		defaultMessage: 'Created on {context}',
		description: 'Indicated when entity was created (absolute form)',
	},
	delete: {
		id: 'fabric.linking.delete',
		defaultMessage: 'Delete',
		description: 'Allow a user to delete a link',
	},
	download: {
		id: 'fabric.linking.download',
		defaultMessage: 'Download',
		description: '',
	},
	download_description: {
		id: 'fabric.linking.download_description',
		defaultMessage: 'Download this file into your local storage',
		description: 'Description on what Download does',
	},
	download_file: {
		id: 'fabric.linking.download_file',
		defaultMessage: 'Download file',
		description: 'Allow a user to download a file',
	},
	ai_summary_action: {
		id: 'fabric.linking.ai_summary_action',
		defaultMessage: 'Summarize with AI',
		description: 'Allow a user to summarize a link',
	},
	ai_summary_action_description: {
		id: 'fabric.linking.ai_summary_action_description',
		defaultMessage: 'Summarize the content of this link using Atlassian Intelligence.',
		description: 'Description of what the summarize link with AI action does',
	},
	copy_summary_action: {
		id: 'fabric.linking.copy_summary_action',
		defaultMessage: 'Copy summary',
		description: 'Allow a user to copy a generated summary',
	},
	copy_summary_action_description: {
		id: 'fabric.linking.copy_summary_action_description',
		defaultMessage: 'Copy summary',
		description: 'Description of what the copy summary AI action does',
	},
	copied_summary_action_description: {
		id: 'fabric.linking.copied_summary_action_description',
		defaultMessage: 'Copied summary to clipboard',
		description: 'Confirmation to the user that the summry has been copied',
	},
	edit: {
		id: 'fabric.linking.edit',
		defaultMessage: 'Edit',
		description: 'Allow a user to edit a link',
	},
	follow: {
		id: 'fabric.linking.follow',
		defaultMessage: 'Follow',
		description: 'Click to follow a project.',
	},
	follow_project_description: {
		id: 'fabric.linking.follow_project_description',
		defaultMessage: 'Follow to get notifications on this project',
		description: 'Description on what Follow does',
	},
	follow_project: {
		id: 'fabric.linking.follow_project',
		defaultMessage: 'Follow project',
		description: 'Click to follow a project.',
	},
	follow_project_error: {
		id: 'fabric.linking.follow_project_error',
		defaultMessage:
			'We encountered an error while trying to follow the project. Check your connection or refresh the page and try again.',
		description: 'Shown when an unknown error occurs when following an Atlas project',
	},
	follow_goal_description: {
		id: 'fabric.linking.follow_goal_description',
		defaultMessage: 'Follow this goal to get notifications on updates',
		description: 'Description on what Follow does',
	},
	follow_goal: {
		id: 'fabric.linking.follow_goal',
		defaultMessage: 'Follow goal',
		description: 'Click to follow a project.',
	},
	follow_goal_error: {
		id: 'fabric.linking.follow_goal_error',
		defaultMessage:
			'We encountered an error while trying to follow the goal. Check your connection or refresh the page and try again.',
		description: 'Shown when an unknown error occurs when following an Atlas goal',
	},
	go_back: {
		id: 'fabric.linking.go_back',
		defaultMessage: 'Go back',
		description: 'go back',
	},
	invalid_permissions: {
		id: 'fabric.linking.invalid_permissions',
		defaultMessage: 'Restricted content',
		description: 'Message shown when a user does not have permissions to view an item',
	},
	invalid_permissions_description: {
		id: 'fabric.linking.invalid_permissions_description',
		defaultMessage:
			"You'll need to request access or try a different account to view this preview.",
		description:
			'Message shown when a user does not have permissions to view an item. Displayed as description.',
	},
	join_to_view: {
		id: 'fabric.linking.join_to_view',
		defaultMessage: 'Join {context} to view this issue',
		description: 'Allows the user join the product or service immediately',
	},
	learn_more_about_smart_links: {
		id: 'fabric.linking.learn_more_about_smart_links',
		defaultMessage: 'Learn more about Smart Links.',
		description: 'An anchor link to redirect user to a page about Smart Links.',
	},
	learn_more_about_connecting_account: {
		id: 'fabric.linking.learn_more_about_connecting_account',
		defaultMessage: 'Learn more about connecting your account to Atlassian products.',
		description:
			'An anchor link to redirect user to a page about authorization with 3rd party accounts.',
	},
	loading: {
		id: 'fabric.linking.loading',
		defaultMessage: 'Loading...',
		description: 'Indicates an element on a page is loading.',
	},
	modified_by: {
		id: 'fabric.linking.updated_by',
		defaultMessage: 'Modified by {context}',
		description: 'Indicates the person or entity that modified the resource.',
	},
	modified_on_relative: {
		id: 'fabric.linking.modified_on_relative',
		defaultMessage: 'Updated {context}',
		description: 'Indicated when entity was modified (relative form)',
	},
	modified_on_absolute: {
		id: 'fabric.linking.modified_on_absolute',
		defaultMessage: 'Updated on {context}',
		description: 'Indicated when entity was modified (absolute form)',
	},
	more_actions: {
		id: 'fabric.linking.more_actions',
		defaultMessage: 'More actions',
		description: 'Allows the users to see more link actions',
	},
	open_issue_in_jira: {
		id: 'fabric.linking.open_issue_in_jira',
		defaultMessage: 'Open issue in Jira',
		description: 'Click to open link in Jira',
	},
	open_link_in_a_new_tab: {
		id: 'fabric.linking.open_link_in_a_new_tab',
		defaultMessage: 'Open link in a new tab',
		description: 'Click to open link in a new tab',
	},
	owned_by: {
		id: 'fabric.linking.owned_by',
		defaultMessage: 'Owned by {context}',
		description: 'Indicates the person or entity that owns or maintains the resource.',
	},
	preview_description: {
		id: 'fabric.linking.preview_description',
		defaultMessage: 'Open a full screen preview of this link',
		description: 'Description on what Preview does',
	},
	preview_improved: {
		id: 'fabric.linking.preview_improved',
		defaultMessage: 'Open preview',
		description: 'Click to view a richer view of your content, without needing to navigate to it.',
	},
	preview_close: {
		id: 'fabric.linking.preview_close',
		defaultMessage: 'Close preview',
		description: 'Click to close embed preview modal.',
	},
	preview_max_size: {
		id: 'fabric.linking.preview_max_size',
		defaultMessage: 'View full screen',
		description: 'Click to increase embed preview modal size to a maximum viewing size.',
	},
	preview_min_size: {
		id: 'fabric.linking.preview_min_size',
		defaultMessage: 'Close full screen',
		description: 'Click to decrease embed preview modal size to a minimum viewing size.',
	},
	priority_blocker: {
		id: 'fabric.linking.priority_blocker',
		defaultMessage: 'Blocker',
		description: 'Indicated priority as blocker',
	},
	priority_critical: {
		id: 'fabric.linking.priority_critical',
		defaultMessage: 'Critical',
		description: 'Indicated priority as critical',
	},
	priority_high: {
		id: 'fabric.linking.priority_high',
		defaultMessage: 'High',
		description: 'Indicated priority as high',
	},
	priority_highest: {
		id: 'fabric.linking.priority_highest',
		defaultMessage: 'Highest',
		description: 'Indicated priority as highest',
	},
	priority_low: {
		id: 'fabric.linking.priority_low',
		defaultMessage: 'Low',
		description: 'Indicated priority as low',
	},
	priority_lowest: {
		id: 'fabric.linking.priority_lowest',
		defaultMessage: 'Lowest',
		description: 'Indicated priority as lowest',
	},
	priority_major: {
		id: 'fabric.linking.priority_major',
		defaultMessage: 'Major',
		description: 'Indicated priority as major',
	},
	priority_medium: {
		id: 'fabric.linking.priority_medium',
		defaultMessage: 'Medium',
		description: 'Indicated priority as medium',
	},
	priority_minor: {
		id: 'fabric.linking.priority_minor',
		defaultMessage: 'Minor',
		description: 'Indicated priority as minor',
	},
	priority_trivial: {
		id: 'fabric.linking.priority_trivial',
		defaultMessage: 'Trivial',
		description: 'Indicated priority as trivial',
	},
	priority_undefined: {
		id: 'fabric.linking.priority_undefined',
		defaultMessage: 'Undefined',
		description: 'Indicated priority as unknown',
	},
	forbidden_access: {
		id: 'fabric.linking.forbidden_access',
		defaultMessage: 'Your access is forbidden',
		description: 'Shown when a user does not have access to a resource behind the link.',
	},
	pending_request: {
		id: 'fabric.linking.pending_request',
		defaultMessage: 'Your access request is pending',
		description: 'Shown when a user has requested an access but status is pending.',
	},
	read_time: {
		id: 'fabric.linking.read_time',
		defaultMessage: '{context} min read',
		description: 'Estimated time to read this resource',
	},
	restricted_link: {
		id: 'fabric.linking.restricted_link',
		defaultMessage: 'Restricted link, try another account',
		description: 'Message shown when a user does not have permissions to view an item',
	},
	request_access_to_view: {
		id: 'fabric.linking.request_access_to_view',
		defaultMessage: 'Request access to {context} to view this issue',
		description: 'Allows the user to request access to a product or service',
	},
	request_denied: {
		id: 'fabric.linking.request_denied',
		defaultMessage: 'Your access request was denied',
		description: 'The user had request access but the request was denied by a product or service',
	},
	retry: {
		id: 'fabric.linking.retry',
		defaultMessage: 'Retry',
		description: 'Allows user to perform an action again',
	},
	save: {
		id: 'fabric.linking.save',
		defaultMessage: 'Save',
		description: 'Just the "save" word',
	},
	sent_on_relative: {
		id: 'fabric.linking.sent_on_relative',
		defaultMessage: 'Sent {context}',
		description: 'Indicated when entity was sent (relative form)',
	},
	sent_on_absolute: {
		id: 'fabric.linking.sent_on_absolute',
		defaultMessage: 'Sent on {context}',
		description: 'Indicated when entity was sent (absolute form)',
	},
	status_change_load_error: {
		id: 'fabric.linking.status_change_load_error',
		defaultMessage: 'We couldn’t load the statuses and transitions',
		description: 'Informs the user that the loading of status transitions failed',
	},
	status_change_permission_error: {
		id: 'fabric.linking.status_change_permission_error',
		defaultMessage: 'You don’t have permission to transition this issue. ',
		description: 'Informs the user that they do not have enough permissions to update a status',
	},
	status_change_update_error: {
		id: 'fabric.linking.status_change_update_error',
		defaultMessage: 'We couldn’t update the status',
		description: "Occurs when a user tries to update an issue's status but fails to do so",
	},
	try_again: {
		id: 'fabric.linking.try_again',
		defaultMessage: 'Try again',
		description: 'Allow the user to try an action again',
	},
	try_another_account: {
		id: 'fabric.linking.try_another_account',
		defaultMessage: 'Try another account',
		description: 'Allows the user to try an action again with a different account',
	},
	link_safety_warning_message: {
		id: 'fabric.linking.link_safety_warning_message',
		defaultMessage:
			'The link {unsafeLinkText} is taking you to a different site, <a>actual link here</a>',
		description: 'Link safety check warning message',
	},
	unauthorised_account_description: {
		id: 'fabric.linking.unauthorised_account_description',
		defaultMessage:
			"You're trying to preview a link to a private {context} page. We recommend you review the URL or contact the page owner.",
		description: 'Explains that user does not have access to a link.',
	},
	unauthorised_account_description_no_provider: {
		id: 'fabric.linking.unauthorised_account_description_no_provider',
		defaultMessage:
			"You're trying to preview a link to a private page. We recommend you review the URL or contact the page owner.",
		description: 'Explains that user does not have access to a link.',
	},
	unauthorised_account_name: {
		id: 'fabric.linking.unauthorised_account_name',
		defaultMessage: "We can't display private pages from {context}",
		description: 'Shown when a user does not have access to a link.',
	},
	unauthorised_account_name_no_provider: {
		id: 'fabric.linking.unauthorised_account_name_no_provider',
		defaultMessage: "We can't display private pages",
		description: 'Shown when a user does not have access to a link.',
	},
	unassigned: {
		id: 'fabric.linking.unassigned',
		defaultMessage: 'Unassigned',
		description: 'Shown as a tooltip text for a default unassigned fallback avatar',
	},
	unfollow: {
		id: 'fabric.linking.unfollow',
		defaultMessage: 'Unfollow',
		description: 'Click to unfollow a project.',
	},
	unfollow_project_description: {
		id: 'fabric.linking.unfollow_project_description',
		defaultMessage: 'Unfollow to stop receiving project notifications',
		description: 'Description on what Unfollow does',
	},
	unfollow_project: {
		id: 'fabric.linking.unfollow_project',
		defaultMessage: 'Unfollow project',
		description: 'Click to unfollow a project.',
	},
	unfollow_project_error: {
		id: 'fabric.linking.unfollow_project_error',
		defaultMessage:
			'We encountered an error while trying to unfollow the project. Check your connection or refresh the page and try again.',
		description: 'Shown when an unknown error occurs when unfollowing an Atlas project',
	},
	unfollow_goal_description: {
		id: 'fabric.linking.unfollow_goal_description',
		defaultMessage: 'Unfollow to stop receiving notifications for this goal',
		description: 'Description on what Unfollow does',
	},
	unfollow_goal: {
		id: 'fabric.linking.unfollow_goal',
		defaultMessage: 'Unfollow goal',
		description: 'Click to unfollow a project.',
	},
	unfollow_goal_error: {
		id: 'fabric.linking.unfollow_goal_error',
		defaultMessage:
			'We encountered an error while trying to unfollow the goal. Check your connection or refresh the page and try again.',
		description: 'Shown when an unknown error occurs when unfollowing an Atlas goal',
	},
	unlink_account: {
		id: 'fabric.linking.unlink_account',
		defaultMessage: 'Unlink Account',
		description: 'Allows to remove a connected account from the user',
	},
	view: {
		id: 'fabric.linking.view',
		defaultMessage: 'View',
		description: 'Go through to a piece of content to view it in its original context.',
	},
	viewIn: {
		id: 'fabric.linking.srclink',
		defaultMessage: 'View in',
		description:
			'We have a link in our preview modals to the original document. This text goes before the provider name',
	},
	viewOriginal: {
		id: 'fabric.linking.srclinkunknown',
		defaultMessage: 'View Original',
		description:
			"We have a link in our preview modals to the original document. This is for when we don't know the provider name",
	},
	default_no_access_title: {
		id: 'fabric.linking.no_access_title',
		defaultMessage: 'Join {product} to view this content',
		description: 'Informs the user that they dont have access to certain content',
	},

	direct_access_title: {
		id: 'fabric.linking.direct_access_title',
		defaultMessage: 'Join {product} to view this content',
		description:
			'Informs the user that they have access to this product, and can sign up or join right away.',
	},
	direct_access_description: {
		id: 'fabric.linking.direct_access_description',
		defaultMessage:
			'Your team uses {product} to collaborate and you can start using it right away!',
		description:
			'Informs the user that they have access to this product, and can sign up or join right away.',
	},
	direct_access: {
		id: 'fabric.linking.direct_access',
		defaultMessage: 'Join now',
		description: 'Allows the user join the product or service immediately',
	},

	request_access_description: {
		id: 'fabric.linking.request_access_description',
		defaultMessage:
			'Your team uses {product} to collaborate. Send your admin a request for access.',
		description:
			'Informs the user to request access to a product by talking to the website administrator',
	},
	request_access: {
		id: 'fabric.linking.request_access',
		defaultMessage: 'Request access',
		description: 'Allows the user to request access to a product or service',
	},

	request_access_pending_title: {
		id: 'fabric.linking.request_access_pending_title',
		defaultMessage: 'Access to {product} is pending',
		description: 'Informs the user that their request to view this content is pending',
	},
	request_access_pending_description: {
		id: 'fabric.linking.request_access_pending_description',
		defaultMessage: 'Your request to access {hostname} is awaiting admin approval.',
		description:
			'Informs the user that their request to view this content is pending website administrator approval',
	},
	request_access_pending: {
		id: 'fabric.linking.request_access_pending',
		defaultMessage: 'Pending approval',
		description: 'Informs the user that their request to view this content is pending',
	},

	request_denied_description: {
		id: 'fabric.linking.request_denied_description',
		defaultMessage:
			"Your admin didn't approve your request to view {product} pages from {hostname}.",
		description: 'Informs the user that their request to view this content was denied',
	},

	access_exists_description: {
		id: 'fabric.linking.access_exists_description',
		defaultMessage: 'Request access to view this content from {hostname}.',
		description:
			'Informs the user to contact the website administrator to request access to a product',
	},

	not_found_description: {
		id: 'fabric.linking.not_found_description',
		defaultMessage: "The page doesn't exist or it may have changed after this link was added.",
		description: 'Error case for when a provided item is not found within the list of items',
	},
	not_found_title: {
		id: 'fabric.linking.not_found_title',
		defaultMessage: "We can't show you this {product} page",
		description: 'Error case for when a provided link is not found',
	},

	forbidden_title: {
		id: 'fabric.linking.forbidden_title',
		defaultMessage: "You don't have access to this content",
		description: 'Informs the user that they do not have access to the linked content.',
	},
	forbidden_description: {
		id: 'fabric.linking.forbidden_description',
		defaultMessage: 'Contact your admin to request access to {hostname}.',
		description: 'Informs the user that they must contact the site administrator for access.',
	},
	related_work_items_not_found: {
		id: 'fabric.linking.related_work_items_not_found',
		defaultMessage: 'This link is not mentioned anywhere else.',
		description: 'Informs the user that there are no related resources for a given url',
	},
	last_mentioned_in: {
		id: 'fabric.linking.last_mentioned_in',
		defaultMessage: 'Last mentioned in',
		description: 'Informs the user about where the resource was last mentioned in',
	},
	related: {
		id: 'fabric.linking.related',
		defaultMessage: 'Related',
		description: 'Informs the user about related resources',
	},
	generic_error_message: {
		id: 'fabric.linking.generic_error_message',
		defaultMessage: 'An error occurred',
		description: 'A generic error message to the user',
	},
	related_links_modal_title: {
		id: 'fabric.linking.related_links_modal_title',
		defaultMessage: 'Recent links',
		description: 'Shown as the title for the related links modal',
	},
	related_links_view_related_urls: {
		id: 'fabric.linking.related_links_view_related_urls.nonfinal',
		defaultMessage: 'View recent links...',
		description: 'Action to view related links to the given resource',
	},
	related_links_found_in: {
		id: 'fabric.linking.related_links_found_in',
		defaultMessage: 'Found In',
		description: 'Informs the user of the resources are found in the given url',
	},
	related_links_not_found: {
		id: 'fabric.linking.related_links_not_found',
		defaultMessage: "We didn't find any links to show here.",
		description: 'Informs the user that there are no related resources for the given url',
	},
	related_links_includes_links_to: {
		id: 'fabric.linking.related_links_includes_links_to',
		defaultMessage: 'Includes Links To',
		description: 'Informs the user of the resources the url links to',
	},
	related_links_modal_error_header: {
		id: 'fabric.linking.related_links_modal_error_header',
		defaultMessage: 'Something went wrong',
		description: 'Title for related links error',
	},
	related_links_modal_error_message: {
		id: 'fabric.linking.related_links_modal_error_message',
		defaultMessage:
			'We ran into an issue trying to load recent links. Check your connection or refresh to try again.',
		description: 'Informs the user that there was a problem loading related links',
	},
	related_links_modal_unavailable_header: {
		id: 'fabric.linking.related_links_modal_unavailable_header',
		defaultMessage: 'No recent links',
		description: 'Title for related links being unavailable',
	},
	related_links_modal_unavailable_message: {
		id: 'fabric.linking.related_links_modal_unavailable_message',
		defaultMessage:
			"We didn't find any links to show here. We continuously review and add recent links for updated pages or other content types.",
		description:
			'Informs the user that related links were not found but may be available in the future',
	},
});
