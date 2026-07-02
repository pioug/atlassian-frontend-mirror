import { defineMessages, type MessageDescriptor } from 'react-intl';

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
export type RovoChatActionMessageKey =
	| 'rovo_prompt_context_generic'
	| 'rovo_prompt_context_generic_plural'
	| 'rovo_prompt_context_confluence_page'
	| 'rovo_prompt_context_jira_work_item'
	| 'rovo_prompt_message_summarize'
	| 'rovo_prompt_button_ask_rovo_anything'
	| 'rovo_prompt_message_ask_rovo_anything'
	| 'rovo_prompt_button_highlight_relevant_content'
	| 'rovo_prompt_message_highlight_relevant_content'
	| 'rovo_prompt_button_identify_key_trends'
	| 'rovo_prompt_message_identify_key_trends'
	| 'rovo_prompt_button_identify_key_points'
	| 'rovo_prompt_message_identify_key_points'
	| 'rovo_prompt_button_find_open_questions'
	| 'rovo_prompt_message_find_open_questions'
	| 'rovo_prompt_button_key_highlights'
	| 'rovo_prompt_message_key_highlights'
	| 'rovo_prompt_message_summarize_document'
	| 'rovo_prompt_message_summarize_presentation'
	| 'rovo_prompt_button_explain_code'
	| 'rovo_prompt_message_explain_code'
	| 'rovo_prompt_button_catch_up'
	| 'rovo_prompt_message_catch_up'
	| 'rovo_prompt_button_salesforce_prep'
	| 'rovo_prompt_message_salesforce_prep';
export type MessageKey =
	| 'assigned_to'
	| 'ai_summarize'
	| 'change_status'
	| 'ai_summarized_abbreviation'
	| 'ai_summarized_info'
	| 'ai_summarized_info_short'
	| 'ai_summary_error_generic_rebrand'
	| 'ai_summary_error_acceptable_use_violation'
	| 'ai_summary_error_hipaa_content_detected'
	| 'ai_summary_error_exceeding_context_length_error'
	| 'ai_summary_action_rebrand'
	| 'ai_summary_action_description'
	| 'ai_summary_action_description_rebrand'
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
	| 'compass_applied_components_count'
	| 'connect_link_account_card'
	| 'connect_link_account_card_name'
	| 'connect_link_account_card_description'
	| 'connect_link_account_embed_teaser_button_next'
	| 'connect_link_account_embed_teaser_dot_label'
	| 'connect_link_account_embed_teaser_dot_row_label'
	| 'connect_link_account_embed_teaser_slide_1_description'
	| 'connect_link_account_embed_teaser_slide_1_title'
	| 'connect_link_account_embed_teaser_slide_2_description'
	| 'connect_link_account_embed_teaser_slide_2_title'
	| 'connect_link_account_embed_teaser_slide_3_description'
	| 'connect_link_account_embed_teaser_slide_3_title'
	| 'connect_link_account_success_flag_description'
	| 'connect_link_account_success_flag_title'
	| 'connect_link_account_success_flag_title_default'
	| 'connect_unauthorised_account_action'
	| 'connect_inline_social_proof'
	| 'social_proof_inline_cta_tag_high_with_context'
	| 'social_proof_inline_cta_tag_high_no_context'
	| 'social_proof_inline_cta_tag_low_with_context'
	| 'social_proof_inline_cta_tag_low_no_context'
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
	| 'follow_project_descriptionGalaxia'
	| 'follow_project'
	| 'follow_goal'
	| 'follow_goal_description'
	| 'follow_project_error'
	| 'follow_project_errorGalaxia'
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
	| 'owned_by_override'
	| 'preview_description'
	| 'preview_improved'
	| 'preview_modal'
	| 'preview_panel'
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
	| 'rovo_actions_explore'
	| 'unassigned'
	| 'unfollow'
	| 'unfollow_project_description'
	| 'unfollow_project_descriptionGalaxia'
	| 'unfollow_project'
	| 'unfollow_project_error'
	| 'unfollow_project_errorGalaxia'
	| 'unfollow_goal'
	| 'unfollow_goal_description'
	| 'unfollow_goal_error'
	| 'user_attributes'
	| 'view'
	| 'viewIn'
	| 'viewInProvider'
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
	| 'related'
	| 'generic_error_message'
	| 'related_links_modal_error_title'
	| 'related_links_modal_error_description'
	| 'related_links_modal_unavailable_title'
	| 'related_links_modal_unavailable_description'
	| 'related_links_modal_title'
	| 'related_links_view_related_urls'
	| 'related_links_view_related_links'
	| 'related_links_found_in'
	| 'related_links_includes_links_to'
	| 'related_links_not_found'
	| 'join_to_viewIssueTermRefresh'
	| 'open_issue_in_jiraIssueTermRefresh'
	| 'request_access_to_viewIssueTermRefresh'
	| 'team_members_count'
	| 'status_change_permission_errorIssueTermRefresh'
	| 'connect_unauthorised_account_description_appify'
	| 'connect_unauthorised_account_description_no_provider_appify'
	| 'learn_more_about_connecting_account_experiment_shorter'
	| 'learn_more_about_connecting_account_appify'
	| 'rovo_summary_loading'
	| 'ai_disclaimer'
	| 'rovo_unauthorised_title'
	| 'rovo_unauthorised_title_no_provider'
	| 'rovo_unauthorised_feature_clear_link_names'
	| 'rovo_unauthorised_feature_understand_linked_docs'
	| 'rovo_unauthorised_feature_go_deeper_smart_suggestions'
	| 'rovo_unauthorised_connect_account'
	| 'rovo_unauthorised_not_now'
	| 'rovo_chat_action_section_header'
	| 'rovo_prompt_button_summarize_this'
	| 'rovo_prompt_button_ask_a_specific_question'
	| 'rovo_prompt_button_show_me_whats_relevant'
	| RovoChatActionMessageKey
	| 'pre_auth_block_social_proof_not_low'
	| 'pre_auth_block_social_proof_low';

type Messages = {
	[K in MessageKey]: MessageDescriptor;
};
export const messages: Messages = defineMessages({
	actions: {
		id: 'fabric.linking.actions',
		defaultMessage: 'Actions',
		description: 'Title for a section or menu containing available actions for a resource.',
	},
	add_account: {
		id: 'fabric.linking.add_account',
		defaultMessage: 'Add account',
		description: 'Button label that allows the user to add and connect a new external account',
	},
	ai_summarize: {
		id: 'fabric.linking.ai_summarize',
		defaultMessage: 'Summarize',
		description: 'Action to summarize link resource content with AI',
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
	ai_summary_error_generic_rebrand: {
		id: 'fabric.linking.ai_summary_error_generic_rebrand',
		defaultMessage: 'Rovo isn’t responding. Try again later or <a>check the status of AI</a>.',
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
	change_status: {
		id: 'fabric.linking.change_status',
		defaultMessage: 'Change status: {status}',
		description: 'Aria label for the button to change the status of a linked resource.',
	},
	automation_action_title: {
		id: 'fabric.linking.automation-action.title',
		defaultMessage: 'View automation rules',
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
		description: 'Cancel the current action or close the modal.',
	},
	beta: {
		id: 'fabric.linking.beta',
		defaultMessage: 'Beta',
		description:
			'Text shown in a lozenge badge on a smart link or card to indicate the feature is currently in beta.',
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
		description:
			'Label for a button or icon that closes the currently open modal dialog or overlay screen.',
	},
	check_this_link: {
		id: 'fabric.linking.check_this_link',
		defaultMessage: 'Check this link',
		description:
			'Heading shown at the top of the link safety warning modal, prompting the user to verify a potentially unsafe link before proceeding.',
	},
	compass_applied_components_count: {
		id: 'compass.applied_components_count.non-final',
		defaultMessage:
			'Applied to {numberOfComponents, plural, one {{numberOfComponents, number} component}  other {{numberOfComponents, number} components}}',
		description: 'Indicates the number of components the resource is applied to.',
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
	connect_link_account_embed_teaser_dot_label: {
		id: 'fabric.linking.connect_link_account_embed_teaser_dot_label.non-final',
		defaultMessage: 'Go to slide {index} of {total}',
		description:
			'Accessible label for a dot indicator button in the teaser carousel, describing which slide it navigates to',
	},
	connect_link_account_embed_teaser_dot_row_label: {
		id: 'fabric.linking.connect_link_account_embed_teaser_dot_row_label.non-final',
		defaultMessage: 'Slides',
		description: 'Accessible label for the group of dot indicator buttons in the teaser carousel',
	},
	connect_link_account_embed_teaser_button_next: {
		id: 'fabric.linking.connect_link_account_embed_teaser_button_next.non-final',
		defaultMessage: 'Next',
		description:
			'A button to view next teaser on benefit of connecting account on Smart Link embed',
	},
	connect_link_account_embed_teaser_slide_1_description: {
		id: 'fabric.linking.connect_link_account_embed_teaser_slide_1_description.non-final',
		defaultMessage:
			'Connect your account to preview {context} files and documents directly inside Atlassian. No more context switching.',
		description:
			'A description on a teaser slide 1 on benefit of connecting account on Smart Link embed',
	},
	connect_link_account_embed_teaser_slide_1_title: {
		id: 'fabric.linking.connect_link_account_embed_teaser_slide_1_title.non-final',
		defaultMessage: 'See your {context} work without leaving Atlassian',
		description: 'A title on a teaser slide 1 on benefit of connecting account on Smart Link embed',
	},
	connect_link_account_embed_teaser_slide_2_title: {
		id: 'fabric.linking.connect_link_account_embed_teaser_slide_2_title.non-final',
		defaultMessage: 'Search once, find it everywhere',
		description: 'A title on a teaser slide 2 on benefit of connecting account on Smart Link embed',
	},
	connect_link_account_embed_teaser_slide_2_description: {
		id: 'fabric.linking.connect_link_account_embed_teaser_slide_2_description.non-final',
		defaultMessage:
			'Search relevant {context} files alongside your Confluence pages and Jira issues, always respecting your {context} permissions.',
		description:
			'A description on a teaser slide 2 on benefit of connecting account on Smart Link embed',
	},
	connect_link_account_embed_teaser_slide_3_title: {
		id: 'fabric.linking.connect_link_account_embed_teaser_slide_3_title.non-final',
		defaultMessage: 'Get help from Rovo',
		description: 'A title on a teaser slide 3 on benefit of connecting account on Smart Link embed',
	},
	connect_link_account_embed_teaser_slide_3_description: {
		id: 'fabric.linking.connect_link_account_embed_teaser_slide_3_description.non-final',
		defaultMessage:
			"Rovo uses your {context} content to answer questions, summarise docs, and draft updates using the work you've already done.",
		description:
			'A description on a teaser slide 3 on benefit of connecting account on Smart Link embed',
	},
	connect_link_account_success_flag_description: {
		id: 'fabric.linking.connect_link_account_success_flag_description',
		defaultMessage: 'Shared links now display rich previews.',
		description:
			'Shown in a flag after user successfully connect 3P account and Smart Link reload with metadata',
	},
	connect_link_account_success_flag_title: {
		id: 'fabric.linking.connect_link_account_success_flag_title',
		defaultMessage: '{context} is connected',
		description:
			'Shown in a flag after user successfully connect 3P account. {context} is the name of link provider, e.g. Google, Figma, etc.',
	},
	connect_link_account_success_flag_title_default: {
		id: 'fabric.linking.connect_link_account_success_flag_title_default',
		defaultMessage: 'Smart Link',
		description:
			'Default context for connect_link_account_success_flag_title when link provider name (Google, Figma, etc.) is not provided',
	},
	connect_unauthorised_account_action: {
		id: 'fabric.linking.connect_unauthorised_account_action',
		defaultMessage: 'Connect to {context}',
		description: 'Shown on a button to connect user external account to their Atlassian account.',
	},
	connect_inline_social_proof: {
		id: 'fabric.linking.connect_inline_social_proof',
		defaultMessage: 'Connect',
		description:
			'Shown on a button for unauthorised inline smart links when the social proof inline CTA experiment is active. Replaces the longer "Connect your {context} account" label.',
	},
	social_proof_inline_cta_tag_high_with_context: {
		id: 'fabric.linking.social_proof_inline_cta_tag_high_with_context',
		defaultMessage: '<b>{connectedPct}%</b> of your team sees {context} previews',
		description:
			'Social-proof tag pill beside the shortcut "Connect" on an unauthorised inline smart link when adoption is not in the exploratory range. {connectedPct} is the approximate share seeing previews for the integration; {context} is the provider display name.',
	},
	social_proof_inline_cta_tag_high_no_context: {
		id: 'fabric.linking.social_proof_inline_cta_tag_high_no_context',
		defaultMessage: '<b>{connectedPct}%</b> of your team sees richer previews',
		description:
			'Social-proof tag pill when adoption is above the exploratory threshold and no provider display name is available; {connectedPct} is the approximate share seeing richer previews.',
	},
	social_proof_inline_cta_tag_low_with_context: {
		id: 'fabric.linking.social_proof_inline_cta_tag_low_with_context',
		defaultMessage: 'Your team sees richer {context} previews',
		description:
			'Social-proof tag pill when share is below the percentage headline threshold; shown only when a provider display name is available. Omit the pill entirely when personalization is unavailable or the provider name is unknown.',
	},
	social_proof_inline_cta_tag_low_no_context: {
		id: 'fabric.linking.social_proof_inline_cta_tag_low_no_context',
		defaultMessage: 'Your team sees richer previews',
		description:
			'Social-proof tag pill for the case when neither percentage nor provider display name are available.',
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
		description:
			'Label for a button that advances the user to the next step, e.g. in the link safety warning modal flow.',
	},
	copy_url_to_clipboard: {
		id: 'fabric.linking.copy_url_to_clipboard',
		defaultMessage: 'Copy link',
		description: 'Action to copy the URL of the link to the clipboard.',
	},
	copied_url_to_clipboard: {
		id: 'fabric.linking.copied_url_to_clipboard',
		defaultMessage: 'Copied!',
		description:
			'Confirmation text shown briefly after the user copies a URL to the clipboard using the copy link action.',
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
		description:
			'Label for the delete action in a smart link or card action menu, allowing the user to remove the linked item.',
	},
	download: {
		id: 'fabric.linking.download',
		defaultMessage: 'Download',
		description:
			'Label for the download action in a smart link or card action menu, initiating a file download.',
	},
	download_description: {
		id: 'fabric.linking.download_description',
		defaultMessage: 'Download this file into your local storage',
		description:
			"Tooltip or description text for the download action, explaining it saves the file to the user's local storage.",
	},
	download_file: {
		id: 'fabric.linking.download_file',
		defaultMessage: 'Download file',
		description:
			'Label for the download file action in a smart link or card action menu, allowing the user to save the linked file locally.',
	},
	ai_summary_action_rebrand: {
		id: 'fabric.linking.ai_summary_action_rebrand',
		defaultMessage: 'Summarize with Rovo',
		description:
			'Label for the AI summarize action in a smart link or hover card action menu, allowing the user to generate an AI summary of the linked content.',
	},
	ai_summary_action_description: {
		id: 'fabric.linking.ai_summary_action_description',
		defaultMessage: 'Summarize the content of this link using Atlassian Intelligence.',
		description: 'Description of what the summarize link with AI action does',
	},
	ai_summary_action_description_rebrand: {
		id: 'fabric.linking.ai_summary_action_description_rebrand',
		defaultMessage: 'Summarize the content of this link using Rovo.',
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
		description:
			'Label for the edit action in a smart link or card action menu, allowing the user to modify the linked item.',
	},
	follow: {
		id: 'fabric.linking.follow',
		defaultMessage: 'Follow',
		description:
			'Label for the follow button on a smart link card, allowing the user to subscribe to updates for the linked project or resource.',
	},
	follow_project_description: {
		id: 'fabric.linking.follow_project_description',
		defaultMessage: 'Follow to get notifications on this project',
		description:
			'Tooltip or description text for the follow project button, explaining that clicking it enables notifications for the project.',
	},
	follow_project: {
		id: 'fabric.linking.follow_project',
		defaultMessage: 'Follow project',
		description:
			'Label for the follow project button on a smart link card, allowing the user to subscribe to updates for the linked Atlassian project.',
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
		description:
			'Tooltip or description text for the follow goal button, explaining that clicking it enables notifications for updates to the goal.',
	},
	follow_goal: {
		id: 'fabric.linking.follow_goal',
		defaultMessage: 'Follow goal',
		description:
			'Label for the follow goal button on a smart link card, allowing the user to subscribe to updates for the linked Atlas goal.',
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
		description:
			'Label for a navigation button that returns the user to the previous step or screen in a modal flow.',
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
		description:
			'Label for the action button on a smart link card that opens the linked Jira issue in Jira.',
	},
	open_link_in_a_new_tab: {
		id: 'fabric.linking.open_link_in_a_new_tab',
		defaultMessage: 'Open link in a new tab',
		description:
			'Label for the action button on a smart link card that opens the linked resource in a new browser tab.',
	},
	owned_by: {
		id: 'fabric.linking.owned_by',
		defaultMessage: 'Owned by {context}',
		description: 'Indicates the person or entity that owns or maintains the resource.',
	},
	owned_by_override: {
		id: 'fabric.linking.owned_by_override',
		defaultMessage: 'By {context}',
		description: 'Indicates the person or entity that owns or maintains the resource.',
	},
	preview_description: {
		id: 'fabric.linking.preview_description',
		defaultMessage: 'Open a full screen preview of this link',
		description:
			'Tooltip or description text for the preview action on a smart link card, explaining it opens a full-screen embed preview of the linked content.',
	},
	preview_improved: {
		id: 'fabric.linking.preview_improved',
		defaultMessage: 'Open preview',
		description: 'Click to view a richer view of your content, without needing to navigate to it.',
	},
	preview_modal: {
		id: 'fabric.linking.preview_modal',
		defaultMessage: 'Open preview modal',
		description:
			'Button used to view a modal view of your content without needing to navigate to it.',
	},
	preview_panel: {
		id: 'fabric.linking.preview_panel',
		defaultMessage: 'Open preview panel',
		description:
			'Button used to view a side panel view of your content without needing to navigate to it.',
	},
	preview_close: {
		id: 'fabric.linking.preview_close',
		defaultMessage: 'Close preview',
		description:
			'Label for the button that closes the embed preview modal dialog on a smart link card.',
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
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Blocker priority.',
	},
	priority_critical: {
		id: 'fabric.linking.priority_critical',
		defaultMessage: 'Critical',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Critical priority.',
	},
	priority_high: {
		id: 'fabric.linking.priority_high',
		defaultMessage: 'High',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has High priority.',
	},
	priority_highest: {
		id: 'fabric.linking.priority_highest',
		defaultMessage: 'Highest',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Highest priority.',
	},
	priority_low: {
		id: 'fabric.linking.priority_low',
		defaultMessage: 'Low',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Low priority.',
	},
	priority_lowest: {
		id: 'fabric.linking.priority_lowest',
		defaultMessage: 'Lowest',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Lowest priority.',
	},
	priority_major: {
		id: 'fabric.linking.priority_major',
		defaultMessage: 'Major',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Major priority.',
	},
	priority_medium: {
		id: 'fabric.linking.priority_medium',
		defaultMessage: 'Medium',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Medium priority.',
	},
	priority_minor: {
		id: 'fabric.linking.priority_minor',
		defaultMessage: 'Minor',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Minor priority.',
	},
	priority_trivial: {
		id: 'fabric.linking.priority_trivial',
		defaultMessage: 'Trivial',
		description:
			'Label for a priority badge on a Jira issue smart link card indicating the issue has Trivial priority.',
	},
	priority_undefined: {
		id: 'fabric.linking.priority_undefined',
		defaultMessage: 'Undefined',
		description:
			'Label for a priority badge on a Jira issue smart link card when the priority level is not defined or unknown.',
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
		description:
			'Text shown on a smart link card displaying the estimated reading time. The placeholder {context} is substituted with the number of minutes.',
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
		description:
			'Label for a retry button shown on a smart link card after an error, allowing the user to attempt the failed action again.',
	},
	save: {
		id: 'fabric.linking.save',
		defaultMessage: 'Save',
		description:
			"Label for a save button on a smart link card or action, confirming and persisting the user's changes.",
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
		description:
			'Label for a button shown on a smart link error state, prompting the user to retry the failed load or action.',
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
		description:
			'Warning message shown in the link safety modal. The placeholder {unsafeLinkText} is substituted with the suspicious link text, and <a> wraps the actual destination URL.',
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
	rovo_actions_explore: {
		id: 'fabric.linking.rovo_actions_explore-non-final',
		defaultMessage: 'Explore',
		description:
			'Label for the Rovo Actions button that allows users to explore AI actions for a link',
	},
	unassigned: {
		id: 'fabric.linking.unassigned',
		defaultMessage: 'Unassigned',
		description: 'Shown as a tooltip text for a default unassigned fallback avatar',
	},
	unfollow: {
		id: 'fabric.linking.unfollow',
		defaultMessage: 'Unfollow',
		description:
			'Label for the unfollow button on a smart link card, allowing the user to stop receiving updates for the linked project or resource.',
	},
	unfollow_project_description: {
		id: 'fabric.linking.unfollow_project_description',
		defaultMessage: 'Unfollow to stop receiving project notifications',
		description:
			'Tooltip or description for the unfollow project button, explaining that clicking it stops project update notifications.',
	},
	unfollow_project: {
		id: 'fabric.linking.unfollow_project',
		defaultMessage: 'Unfollow project',
		description:
			'Label for the unfollow project button on a smart link card, allowing the user to stop following the linked Atlassian project.',
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
		description:
			'Tooltip or description for the unfollow goal button, explaining that clicking it stops notifications for the linked Atlas goal.',
	},
	unfollow_goal: {
		id: 'fabric.linking.unfollow_goal',
		defaultMessage: 'Unfollow goal',
		description:
			'Label for the unfollow goal button on a smart link card, allowing the user to stop following the linked Atlas goal.',
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
	viewInProvider: {
		id: 'fabric.linking.viewinprovider',
		defaultMessage: 'View in {providerName}',
		description:
			'We have a link in our preview modals to the original document. This text tells the user where it will open',
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
	related: {
		id: 'fabric.linking.related',
		defaultMessage: 'Related',
		description: 'Informs the user about related resources',
	},
	generic_error_message: {
		id: 'fabric.linking.generic_error_message',
		defaultMessage: 'An error occurred',
		description:
			'Generic error message shown on a smart link card when an unspecified error occurs and no more specific message is available.',
	},
	related_links_modal_title: {
		id: 'fabric.linking.related_links_modal_title',
		defaultMessage: 'Related links',
		description: 'Shown as the title for the related links modal',
	},
	related_links_view_related_urls: {
		id: 'fabric.linking.related_links_view_related_urls',
		defaultMessage: 'View recent links',
		description: 'Action to view related links to the given resource',
	},
	related_links_view_related_links: {
		id: 'fabric.linking.related_links_view_related_links',
		defaultMessage: 'View related links',
		description: 'Action to view related links to the given resource',
	},
	related_links_found_in: {
		id: 'fabric.linking.related_links_found_in',
		defaultMessage: 'Found in',
		description: 'Informs the user of the resources are found in the given url',
	},
	related_links_not_found: {
		id: 'fabric.linking.related_links_not_found',
		defaultMessage: "We didn't find any links to show here.",
		description: 'Informs the user that there are no related resources for the given url',
	},
	related_links_includes_links_to: {
		id: 'fabric.linking.related_links_includes_links_to',
		defaultMessage: 'Includes links to',
		description: 'Informs the user of the resources the url links to',
	},
	related_links_modal_error_title: {
		id: 'fabric.linking.related_links_modal_error_title',
		defaultMessage: `We're having trouble loading related links`,
		description:
			'Heading shown in the related links modal when related links fail to load due to a network or server error.',
	},
	related_links_modal_unavailable_title: {
		id: 'fabric.linking.related_links_modal_unavailable_title',
		defaultMessage: `We couldn't find any related links`,
		description:
			'Heading shown in the related links modal when no related links are available for the current resource.',
	},
	related_links_modal_error_description: {
		id: 'fabric.linking.related_links_modal_error_description',
		defaultMessage: 'Check your connection or refresh the page to try again',
		description: 'Informs the user that there was a problem loading related links',
	},
	related_links_modal_unavailable_description: {
		id: 'fabric.linking.related_links_modal_unavailable_description',
		defaultMessage:
			'We continuously review and add related links for updated pages or other content types',
		description: 'Informs the user that there was a problem loading related links',
	},
	join_to_viewIssueTermRefresh: {
		id: 'fabric.linking.join_to_view-issue-term-refresh',
		defaultMessage: 'Join {context} to view this work item',
		description: 'Allows the user join the product or service immediately',
	},
	open_issue_in_jiraIssueTermRefresh: {
		id: 'fabric.linking.open_issue_in_jira-issue-term-refresh',
		defaultMessage: 'Open work item in Jira',
		description:
			'Label for the action button on a smart link card that opens the linked Jira work item in Jira (issue term refresh variant).',
	},
	request_access_to_viewIssueTermRefresh: {
		id: 'fabric.linking.request_access_to_view-issue-term-refresh',
		defaultMessage: 'Request access to {context} to view this work item',
		description: 'Allows the user to request access to a product or service',
	},
	status_change_permission_errorIssueTermRefresh: {
		id: 'fabric.linking.status_change_permission_error-issue-term-refresh',
		defaultMessage: 'You don’t have permission to transition this work item. ',
		description: 'Informs the user that they do not have enough permissions to update a status',
	},
	team_members_count: {
		id: 'fabric.linking.team_members_count',
		defaultMessage: '{context} members',
		description:
			'Text shown on a smart link card displaying the number of members in a team. The placeholder {context} is substituted with the member count.',
	},
	user_attributes: {
		id: 'fabric.linking.user_attributes',
		// eslint-disable-next-line @atlassian/i18n/no-useless-message
		defaultMessage: '{context}',
		description: 'Displays user attributes like role, department, location, and pronouns',
	},
	follow_project_descriptionGalaxia: {
		id: 'fabric.linking.follow_project_description-galaxia',
		defaultMessage: 'Follow to get notifications on this space',
		description:
			'Tooltip or description for the follow space button (Galaxia variant), explaining that clicking it enables notifications for the Confluence space.',
	},
	follow_project_errorGalaxia: {
		id: 'fabric.linking.follow_project_error-galaxia',
		defaultMessage:
			'We encountered an error while trying to follow the space. Check your connection or refresh the page and try again.',
		description: 'Shown when an unknown error occurs when following an Atlas project',
	},
	unfollow_project_descriptionGalaxia: {
		id: 'fabric.linking.unfollow_project_description-galaxia',
		defaultMessage: 'Unfollow to stop receiving space notifications',
		description:
			'Tooltip or description for the unfollow space button (Galaxia variant), explaining that clicking it stops notifications for the Confluence space.',
	},
	unfollow_project_errorGalaxia: {
		id: 'fabric.linking.unfollow_project_error-galaxia',
		defaultMessage:
			'We encountered an error while trying to unfollow the space. Check your connection or refresh the page and try again.',
		description: 'Shown when an unknown error occurs when unfollowing an Atlas project',
	},
	connect_unauthorised_account_description_appify: {
		id: 'fabric.linking.connect_unauthorised_account_description-appify',
		defaultMessage: 'Connect your {context} account to collaborate on work across Atlassian apps.',
		description:
			'Shown when a user does not have access to a link, but can connect their external account to view the link on card view.',
	},
	connect_unauthorised_account_description_no_provider_appify: {
		id: 'fabric.linking.connect_unauthorised_account_description_no_provider-appify',
		defaultMessage: 'Connect your account to collaborate on work across Atlassian apps.',
		description:
			'Shown when a user does not have access to a link, but can connect their external account to view the link on card view and we do not have the providers name.',
	},
	learn_more_about_connecting_account_appify: {
		id: 'fabric.linking.learn_more_about_connecting_account-appify',
		defaultMessage: 'Learn more about connecting your account to Atlassian apps.',
		description:
			'An anchor link to redirect user to a page about authorization with 3rd party accounts.',
	},
	learn_more_about_connecting_account_experiment_shorter: {
		id: 'fabric.linking.learn_more_about_connecting_account_experiment_short',
		defaultMessage: 'Turn your URLs into rich, interactive previews.',
		description:
			'An anchor link to redirect user to a page about authorization with 3rd party accounts.',
	},
	rovo_summary_loading: {
		id: 'fabric.linking.rovo_summary.loading.non-final',
		defaultMessage: 'Rovo is thinking',
		description:
			'Shown when a Rovo summary is loading, indicating that the AI is generating a summary for the user.',
	},
	ai_disclaimer: {
		id: 'fabric.linking.rovo_summary.ai_disclaimer.non-final',
		defaultMessage: 'Uses AI. Verify Results.',
		description:
			'Shown on a Rovo summary to indicate that the summary was generated by AI and should be verified by the user for accuracy.',
	},
	rovo_unauthorised_title: {
		id: 'fabric.linking.rovo_unauthorised.title',
		defaultMessage: 'Get smarter workflows by connecting your {context} account',
		description:
			'Banner headline in Rovo unauthorised hover card header. {context} is the third-party provider name (e.g. Google).',
	},
	rovo_unauthorised_title_no_provider: {
		id: 'fabric.linking.rovo_unauthorised.title_no_provider',
		defaultMessage: 'Get smarter workflows by connecting your account',
		description:
			'Banner headline in Rovo unauthorised hover card header when the provider name is unknown.',
	},
	rovo_unauthorised_feature_clear_link_names: {
		id: 'fabric.linking.rovo_unauthorised.feature.clear_link_names',
		defaultMessage: 'Turn long URLs into clear link names',
		description: 'First feature bullet in Rovo unauthorised hover card.',
	},
	rovo_unauthorised_feature_understand_linked_docs: {
		id: 'fabric.linking.rovo_unauthorised.feature.understand_linked_docs',
		defaultMessage: 'Understand linked docs in seconds',
		description: 'Second feature bullet in Rovo unauthorised hover card.',
	},
	rovo_unauthorised_feature_go_deeper_smart_suggestions: {
		id: 'fabric.linking.rovo_unauthorised.feature.go_deeper_smart_suggestions',
		defaultMessage: 'Go deeper with smart suggestions',
		description: 'Third feature bullet in Rovo unauthorised hover card.',
	},
	rovo_unauthorised_connect_account: {
		id: 'fabric.linking.rovo_unauthorised.connect_account',
		defaultMessage: 'Connect',
		description: 'Primary action button in Rovo unauthorised hover card.',
	},
	rovo_unauthorised_not_now: {
		id: 'fabric.linking.rovo_unauthorised.not_now',
		defaultMessage: 'Maybe later',
		description: 'Secondary action in Rovo unauthorised hover card.',
	},
	rovo_prompt_context_generic: {
		id: 'fabric.linking.rovo_prompt_context_confluence_page.non-final',
		defaultMessage: 'page',
		description:
			'The location the user see Smart Link in, to be used as the {context} for Rovo prompt message',
	},
	rovo_prompt_context_generic_plural: {
		id: 'fabric.linking.rovo_prompt_context_confluence_page.non-final',
		defaultMessage: 'pages',
		description:
			'The site-wide location the user see Smart Link in, to be used as the {context} for Rovo prompt message',
	},
	rovo_prompt_context_confluence_page: {
		id: 'fabric.linking.rovo_prompt_context_confluence_page.non-final',
		defaultMessage: 'Confluence page',
		description:
			'The Confluence page the user see Smart Link in, to be used as the {context} for Rovo prompt message',
	},
	rovo_prompt_context_jira_work_item: {
		id: 'fabric.linking.rovo_prompt_context_jira_work_item.non-final',
		defaultMessage: 'Jira work item',
		description:
			'The Jira work item the user see Smart Link in, to be used as the {context} for Rovo prompt message',
	},
	rovo_prompt_message_summarize: {
		id: 'fabric.linking.rovo_prompt_message_summarize.non-final',
		defaultMessage:
			'<p>Summarize the main ideas and key points of <a>{url}</a> in 3-5 clear, complete bullet points (markdown list).</p><p>Preserve important details such as names, dates, and key decisions.</p>',
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_button_ask_rovo_anything: {
		id: 'fabric.linking.rovo_prompt_button_ask_rovo.non-final',
		defaultMessage: 'Ask Rovo',
		description:
			'The name of the action to open Rovo Chat and ask a question in relation to current Smart Link',
	},
	rovo_prompt_message_ask_rovo_anything: {
		id: 'fabric.linking.rovo_prompt_message_ask_rovo_anything.non-final',
		defaultMessage: '`I have a question about this linked item` {url}',
		description:
			'The placeholder prompt message pre-filled in Rovo Chat input. {url} refers to the Smart Link URL. This is not auto-submitted — the user types their question.',
	},
	rovo_prompt_button_highlight_relevant_content: {
		id: 'fabric.linking.rovo_prompt_button_highlight_relevant_content.non-final',
		defaultMessage: `Highlight what's relevant`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_highlight_relevant_content: {
		id: 'fabric.linking.rovo_prompt_message_highlight_relevant_content.non-final',
		defaultMessage:
			"<p>Based on this linked item (<a>{url}</a>) and the {context} I'm currently viewing, highlight the parts of the linked content that are most relevant to this work. Explain briefly why each part is relevant.</p>",
		description:
			'The prompt message to send to Rovo Chat. {context} refers to the content the user triggered from, e.g. Confluence page or Jira work item. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_button_identify_key_trends: {
		id: 'fabric.linking.rovo_prompt_button_identify_key_trends.non-final',
		defaultMessage: `Identify key trends`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_identify_key_trends: {
		id: 'fabric.linking.rovo_prompt_message_identify_key_trends.non-final',
		defaultMessage:
			'<p>From this <a>{url}</a>, identify the key trends, anomalies, and headline numbers. Call out anything increasing/decreasing significantly, noteworthy comparisons, and any risks or opportunities the data suggests.</p>',
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_button_identify_key_points: {
		id: 'fabric.linking.rovo_prompt_button_identify_key_points.non-final',
		defaultMessage: `Identify key points`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_identify_key_points: {
		id: 'fabric.linking.rovo_prompt_message_identify_key_points.non-final',
		defaultMessage:
			'<p>From this <a>{url}</a>, identify the key points, proposals, and decisions. Focus on what someone skimming the deck should know in order to understand the main message.</p>',
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_button_find_open_questions: {
		id: 'fabric.linking.rovo_prompt_button_find_open_questions.non-final',
		defaultMessage: `Find open questions`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_find_open_questions: {
		id: 'fabric.linking.rovo_prompt_message_find_open_questions.non-final',
		defaultMessage:
			'<p>Look at this <a>{url}</a> and list any open questions, unresolved decisions, or asks that still need follow‑up. Group them by owner if possible and keep it concise.</p>',
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_button_key_highlights: {
		id: 'fabric.linking.rovo_prompt_button_find_open_questions.non-final',
		defaultMessage: `Key highlights`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_key_highlights: {
		id: 'fabric.linking.rovo_prompt_message_find_open_questions.non-final',
		defaultMessage:
			'<p>Based on this <a>{url}</a> and the page or ticket I’m currently viewing, highlight the parts of the linked content that are most relevant to this work. Explain briefly why each part is relevant.</p>',
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_chat_action_section_header: {
		id: 'fabric.linking.rovo_chat_action_section_header.non-final',
		defaultMessage: 'Ask Rovo',
		description:
			'Heading shown above the Rovo prompt action buttons in the smart link hover card, alongside the Rovo logo, to introduce the AI prompt suggestions.',
	},
	rovo_prompt_button_summarize_this: {
		id: 'fabric.linking.rovo_prompt_button_summarize_this.non-final',
		defaultMessage: 'Summarize this for me',
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_button_ask_a_specific_question: {
		id: 'fabric.linking.rovo_prompt_button_ask_a_specific_question.non-final',
		defaultMessage: 'Ask a specific question',
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_button_show_me_whats_relevant: {
		id: 'fabric.linking.rovo_prompt_button_show_me_whats_relevant.non-final',
		defaultMessage: `Show me what's relevant`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_summarize_document: {
		id: 'fabric.linking.rovo_prompt_message_summarize_document.non-final',
		defaultMessage: `<p>Summarize this doc <a>{url}</a> into a concise, easy-to-scan overview. Adapt to whatever the content is and focus on the main ideas, important decisions, key updates, and next steps, only include these if they exist; don't mention their absence. Avoid unnecessary detail, repetition, or formatting commentary. Write in plain language and optimize for a quick 5–10 second read</p>`,
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_message_summarize_presentation: {
		id: 'fabric.linking.rovo_prompt_message_summarize_presentation.non-final',
		defaultMessage: `<p>Summarize this Google Slides deck <a>{url}</a> into a concise executive overview. Focus on the tldr, key findings, decisions, metrics, risks, and next steps, if there are any. Use a short executive summary followed by 2-3 bullet points. Avoid slide-by-slide narration, design details, repetition, and filler.</p>`,
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_button_explain_code: {
		id: 'fabric.linking.rovo_prompt_button_explain_code.non-final',
		defaultMessage: `Explain`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_explain_code: {
		id: 'fabric.linking.rovo_prompt_message_explain_code.non-final',
		defaultMessage: `<p>Explain this code, pull request, or commit <a>{url}</a> in clear, plain language for a non-technical audience.</p><p>Cover:</p><ol><li><strong>Purpose</strong> — What problem does it solve or what goal does it achieve?</li><li><strong>How it works</strong> — High-level mechanics (no implementation detail unless critical to understanding).</li><li><strong>Why</strong> — Motivation for the change or design choice.</li><li><strong>Impact</strong> — Key behavior changes, risks, or downstream effects worth noting.</li></ol><p>Constraints:</p><ul><li>3–5 sentences or 100–150 words max.</li><li>Omit sections with nothing meaningful to say.</li><li>Prefer concrete language over abstract descriptions (e.g., "speeds up page load by caching results" over "improves performance").</li></ul>`,
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_button_catch_up: {
		id: 'fabric.linking.rovo_prompt_button_catch_up.non-final',
		defaultMessage: `Catch up`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_catch_up: {
		id: 'fabric.linking.rovo_prompt_message_catch_up.non-final',
		defaultMessage: `<p>Catch me up on the latest {provider} conversations or channel activity in <a>{url}</a> from the last two weeks. If there's no activity in the past two weeks, expand the window to the most recent 30 days (or until meaningful activity is found). Summarize the most important updates, decisions, and discussions so the user can quickly understand what they missed. Focus on key changes, unresolved questions, and any action items or follow-ups. Prioritize recent messages with the most activity. Keep the response concise — ideally 80–150 words or a short set of 3–5 key bullets.</p>`,
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. {provider} is the 3P app name (Please make sure all html tags remain the same.)',
	},
	rovo_prompt_button_salesforce_prep: {
		id: 'fabric.linking.rovo_prompt_button_salesforce_prep.non-final',
		defaultMessage: `Prep`,
		description:
			'The name of the action to send prompt message to Rovo Chat in relation to current Smart Link',
	},
	rovo_prompt_message_salesforce_prep: {
		id: 'fabric.linking.rovo_prompt_message_salesforce_prep.non-final',
		defaultMessage: `<p>Prep me for this Salesforce record <a>{url}</a>. What's the current state, what's the recent activity, what risks or opportunities should I be aware of, and what would be useful to know before a conversation about it?</p>`,
		description:
			'The prompt message to send to Rovo Chat. {url} refers to Smart Link that the user triggers this action from. (Please make sure all html tags remain the same.)',
	},
	// TODO: remove when social-proof-3p-unauth-block-fg is cleaned up
	pre_auth_block_social_proof_not_low: {
		id: 'fabric.linking.pre_auth_block_social_proof_not_low',
		defaultMessage: '<b>{percentage}%</b> of your team sees <b>{provider}</b> previews.',
		description:
			'Social proof message shown on unauthorized 3P block cards when 30% or more of the tenant has connected the provider. {percentage} is a number, {provider} is the 3P app name (e.g. OneDrive).',
	},
	pre_auth_block_social_proof_low: {
		id: 'fabric.linking.pre_auth_block_social_proof_low',
		defaultMessage: 'Your team sees richer <b>{provider}</b> previews.',
		description:
			'Social proof message shown on unauthorized 3P block cards when less than 30% of the tenant has connected the provider. {provider} is the 3P app name (e.g. OneDrive).',
	},
});
