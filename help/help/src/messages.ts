import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  help_loading: {
    id: 'help.loading',
    defaultMessage: 'Loading',
    description: 'Loading text',
  },
  help_header: {
    id: 'help.header',
    defaultMessage: 'Help',
    description: 'Header text',
  },
  help_header_whats_new: {
    id: 'help.header_whats_new',
    defaultMessage: `What's new`,
    description: `Header text in "What's New" mode`,
  },
  help_close: {
    id: 'help.close',
    defaultMessage: 'Close',
    description: 'Close text',
  },
  help_navigation_back: {
    id: 'help.navigation.back',
    defaultMessage: 'Back',
    description: 'Back text',
  },
  help_search_placeholder: {
    id: 'help.search.placeholder',
    defaultMessage: 'Search help articles',
    description: 'Place holder text for search input',
  },
  help_article_rating_title: {
    id: 'help.article_rating.title',
    defaultMessage: 'Was this helpful?',
    description: 'Rating article title text',
  },
  help_article_rating_option_yes: {
    id: 'help.article_rating.option.yes',
    defaultMessage: 'Yes',
    description: '"Yes" text used in the article rating options',
  },
  help_article_rating_option_no: {
    id: 'help.article_rating.option.no',
    defaultMessage: 'No',
    description: '"No" text used in the article rating options',
  },
  help_article_rating_form_title: {
    id: 'help.article_rating.form.title',
    defaultMessage: 'Tell us why you gave this rating',
    description: 'Title for the article rating form',
  },
  help_article_rating_accurate: {
    id: 'help.article_rating.accurate',
    defaultMessage: `It isn't accurate`,
    description: `Text for the "isn't accurate" option of the article rating form`,
  },
  help_article_rating_clear: {
    id: 'help.article_rating.clear',
    defaultMessage: `It isn't clear`,
    description: `Text for the "isn't clear" option of the article rating form`,
  },
  help_article_rating_relevant: {
    id: 'help.article_rating.relevant',
    defaultMessage: `It isn't relevant`,
    description: `Text for the "isn't relevant" option of the article rating form`,
  },
  help_article_rating_form_submit: {
    id: 'help.article_rating.form.submit',
    defaultMessage: `Submit`,
    description: `Text for the submit button in the article rating form`,
  },
  help_article_rating_form_Success: {
    id: 'help.article_rating.form.success',
    defaultMessage: `Thanks!`,
    description: 'Success message for the article rating form',
  },
  help_article_rating_form_failed: {
    id: 'help.article_rating.form.failed',
    defaultMessage: `We couldn't submit your feedback.`,
    description: 'Error message for the article rating form',
  },
  help_article_rating_form_failed_try_again: {
    id: 'help.article_rating.form.failed.try_again',
    defaultMessage: `Try again`,
    description: `Text for the "Try again" button of the article rating form`,
  },
  help_article_rating_form_cancel: {
    id: 'help.article_rating.form.cancel',
    defaultMessage: `Cancel`,
    description: `Text for the cancel button in the article rating form`,
  },
  help_article_rating_form_contact_me: {
    id: 'help.article_rating.form.contact_me',
    defaultMessage: `Atlassian can contact me about this feedback`,
    description:
      'Text for the "Contact me" checkbox in the article rating form',
  },
  help_article_list_item_type_whats_new: {
    id: 'help.article_list_item.type.whats_new',
    defaultMessage: `WHAT'S NEW`,
    description: `"What's new" article type title`,
  },
  help_article_list_item_type_help_article: {
    id: 'help.article_list_item.type.help-article',
    defaultMessage: `HELP ARTICLE`,
    description: 'Help article article type title',
  },
  help_related_article_title: {
    id: 'help.related_article.title',
    defaultMessage: 'Related articles',
    description: 'Title of the related articles list',
  },
  help_related_article_endpoint_error_title: {
    id: 'help.related_article.endpoint-error.title',
    defaultMessage: `We're having some trouble`,
    description:
      'Title for the message displayed when the related articles fetching fails',
  },
  help_related_article_endpoint_error_description: {
    id: 'help.related_article.endpoint-error.description',
    defaultMessage: `It's taking us longer than expected to show this content. It's provably a temporary problem.`,
    description:
      'Body for the message displayed when the related articles fetching fails',
  },
  help_related_article_endpoint_error_button_label: {
    id: 'help.related_article.endpoint-error.button-label',
    defaultMessage: `Try Again`,
    description:
      'text for the retry button displayed when the related articles fetching fails',
  },
  help_search_results_search_external_site: {
    id: 'help.search_results.search_external_site',
    defaultMessage: `Can't find what you're looking for? Try again with a different term or `,
    description:
      'Text for the button displayed at the end of the search result used to open an external search site',
  },
  help_search_results_no_results: {
    id: 'help.search_results.no_results',
    defaultMessage: `We can't find anything matching your search`,
    description: `Message displayed when the search doesn't return any results (line 1)`,
  },
  help_search_results_no_results_line_two: {
    id: 'help.search_results.no_results_line_two',
    defaultMessage: `Try again with a different term or `,
    description: `Message displayed when the search doesn't return any results (line 2)`,
  },
  help_search_results_external_site_link: {
    id: 'help.search_results.external_site_link',
    defaultMessage: `search all online help articles.`,
    description: `Text for the button used to open an external search site`,
  },
  help_article_error_title: {
    id: 'help.article_error.title',
    defaultMessage: `Something's gone wrong`,
    description: `Error message title for article loading`,
  },
  help_article_error_text: {
    id: 'help.article_error.text',
    defaultMessage: `Something prevented the page from loading. We will try to reconect automatically`,
    description: `Error message body for article loading`,
  },
  help_article_error_button_label: {
    id: 'help.article_error.button_label',
    defaultMessage: `Try now`,
    description:
      'text for the retry button displayed when an article fetching fails',
  },
  help_search_error: {
    id: 'help.search_error',
    defaultMessage: `We are having some trouble`,
    description: `Error message for article search loading (line 1)`,
  },
  help_search_error_line_two: {
    id: 'help.search_error_line_two',
    defaultMessage: `It's taking us longer than expected to show this content. It's probably a temporary problem.`,
    description: `Error message for article search loading (line 2)`,
  },
  help_search_error_button_label: {
    id: 'help.search_error.button_label',
    defaultMessage: `Retry`,
    description: 'text for the retry button displayed when the search fails',
  },
  help_whats_new_button_label: {
    id: 'help.whats_new.button_label',
    defaultMessage: `What's new`,
    description: `text for the "What's New" button`,
  },
  help_whats_new_filter_select_option_all: {
    id: 'help.whats_new.filter_select_option_all',
    defaultMessage: `All release types`,
    description: `text for the "Release types" dropdown`,
  },
  help_whats_new_filter_select_option_new: {
    id: 'help.whats_new.filter_select_option_new',
    defaultMessage: `New`,
    description: `text for the "Release types" dropdown option "New"`,
  },
  help_whats_new_filter_select_option_improvement: {
    id: 'help.whats_new.filter_select_option_improvement',
    defaultMessage: `Improvement`,
    description: `text for the "Release types" dropdown option "Improvement"`,
  },
  help_whats_new_filter_select_option_fix: {
    id: 'help.whats_new.filter_select_option_fix',
    defaultMessage: `Fix`,
    description: `text for the "Release types" dropdown option "Fix"`,
  },
  help_whats_new_filter_select_option_removed: {
    id: 'help.whats_new.filter_select_option_removed',
    defaultMessage: `Removed`,
    description: `text for the "Release types" dropdown option "Removed"`,
  },
  help_whats_new_filter_select_option_experiment: {
    id: 'help.whats_new.filter_select_option_experiment',
    defaultMessage: `Experiment`,
    description: `text for the "Release types" dropdown option "Experiment"`,
  },
  help_whats_new_related_link_support: {
    id: 'help.whats_new.related_links.support',
    defaultMessage: `Support documentation`,
    description: `text for the "Support documentation" link in the related links section of "what's new" articles`,
  },
  help_whats_new_related_link_community: {
    id: 'help.whats_new.related_links.community',
    defaultMessage: `Discuss with community`,
    description: `text for the "Discuss with community" link in the related links section of "what's new" articles`,
  },
  help_show_more_button_label_more: {
    id: 'help.show_more_button.label_more',
    defaultMessage: 'Show {numberOfItemsLeft} more {itemsType}',
    description: '"Show more" text',
  },
  help_show_more_button_label_less: {
    id: 'help.show_more_button.label_less',
    defaultMessage: 'Show less',
    description: '"Show less" text',
  },
});
