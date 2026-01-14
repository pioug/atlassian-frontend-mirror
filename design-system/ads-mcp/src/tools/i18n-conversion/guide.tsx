/**
 * i18n Conversion Guide - Converting hardcoded strings to use formatMessage
 */
import type { ConversionGuide } from './types';

export const i18nConversionGuide: ConversionGuide = {
	id: 'hardcoded-string-to-formatmessage',
	title: 'Hardcoded String to formatMessage Conversion Guide',
	description:
		'Comprehensive guide for converting hardcoded strings to use formatMessage from @atlassian/jira-intl or react-intl-next',
	purpose:
		'This guide instructs LLM agents to convert hardcoded strings to use formatMessage. The import source depends on the file path: use @atlassian/jira-intl for Jira files (path contains "jira"), and react-intl-next for any non-Jira files. The goal is to find all hardcoded strings in JSX and convert them to internationalized messages.',
	scope: `**CRITICAL SCOPE**: This process should **ONLY** focus on converting hardcoded strings (literal strings in JSX, eslint-disable comments for no-literal-string-in-jsx, etc.) to use formatMessage. Do NOT modify pre-existing messages that were already in the codebase, even if they have poor descriptions, incorrect placeholder names, or other quality issues. Only convert NEW hardcoded strings.

**PATH SCOPE LIMITATION**: If a specific file, package name, or path is provided, **ONLY** find and convert hardcoded strings within that specified path. Do NOT modify files outside the provided scope.

**CRITICAL: FIX ALL VIOLATIONS IN FILE**: When a specific file is mentioned (even with line numbers like \`@file.tsx:139-142\`), you MUST find and fix **ALL** @atlassian/i18n/no-literal-string-in-jsx violations in that entire file, not just the specific lines mentioned. Scan the entire file for hardcoded strings and convert them all. The line numbers are just a reference point - the goal is to fix all i18n violations in the provided file.

**CRITICAL: STRING FILTERING**: When finding eslint-disable comments, you MUST examine the actual string content. Only convert strings that contain **user-facing English text**. Many English strings are technical/non-user-facing and should NOT be converted (e.g., product names like "Jira", URLs like "https://example.com", technical IDs, symbols). Use the ESLint ignore patterns to identify which English strings to skip - strings matching ignore patterns should be LEFT AS-IS with their eslint-disable comments intact.`,
	implementationChecklist: [
		'Create message constants using defineMessage (singular) at the top of the file - use defineMessage for each individual message, NOT defineMessages',
		'Import: Use "@atlassian/jira-intl" for Jira files or "react-intl-next" for non-Jira files',
		'**CRITICAL: i18n ID Format**: For files in `/next/packages/`, i18n ids MUST start with the package name (with dashes). Format: `{package-name}.{component-or-feature}.{message-key}`. Example: For package `comment-extension-handlers`, use `comment-extension-handlers.legacy-content-modal.close-button`. For package `rovo-ai-search`, use `rovo-ai-search.view-profile-text` or `rovo-ai-search.knowledge-cards.copy-email-address`.',
		'**CRITICAL: ai-non-final Suffix**: ALL new message IDs MUST end with `.ai-non-final` suffix. This applies to ALL newly created messages, regardless of whether existing messages in the file have this suffix. Format: `{message-key}.ai-non-final`. Example: `applinks.administration.list.applinks-table.system-label.ai-non-final`. This suffix indicates the message is AI-generated and may need review before finalization.',
		'Add useIntl hook: const { formatMessage } = useIntl();',
		'Replace hardcoded strings with formatMessage(messageKey)',
		'Add descriptions (40+ chars, unique from defaultMessage) and descriptive placeholder names',
		'Remove eslint-disable for no-literal-string-in-jsx ONLY after converting',
		'**VERIFICATION**: To verify all hardcoded strings are fixed, search for `@atlassian/i18n/no-literal-string-in-jsx` in the file. Do NOT run eslint - just search for the eslint-disable comments. If no matches are found, all hardcoded strings have been converted.',
	],
	patterns: [
		{
			title: 'Button Text and Action Labels',
			description: 'Converting hardcoded button text with variables',
			before: `<Button style={styles} onClick={onClearVersion}>
  Exit {description.join(' ')}
</Button>`,
			after: `import { useIntl, defineMessage } from '@atlassian/jira-intl';

const exitButton = defineMessage({
  id: 'rovo-ai-search.exit-button.ai-non-final',
  defaultMessage: 'Exit {version}',
  description: 'The text is shown as a button when the user needs to exit the version view. The placeholder {version} will be substituted with the version name. Used in the version header to return to the main view.',
});

export function MyComponent() {
  const { formatMessage } = useIntl();

  return (
    <Button style={styles} onClick={onClearVersion}>
      {formatMessage(exitButton, { version: description.join(' ') })}
    </Button>
  );
}`,
			explanation:
				'Convert button text with variables to use placeholders in the message. Use descriptive placeholder names that match the variable context.',
		},
		{
			title: 'Loading States and Status Messages',
			description: 'Converting hardcoded loading and status messages',
			before: `return <Box>Loading...</Box>;`,
			after: `import { useIntl, defineMessage } from '@atlassian/jira-intl';

const loading = defineMessage({
  id: 'rovo-ai-search.loading.ai-non-final',
  defaultMessage: 'Loading...',
  description: 'The text is shown as a loading indicator when work item data is being fetched from the server. Appears in the work item tab to inform users that content is loading.',
});

export function MyComponent() {
  const { formatMessage } = useIntl();

  return (
    <Box>
      {formatMessage(loading)}
    </Box>
  );
}`,
			explanation:
				'Convert simple hardcoded status messages to use defineMessage (singular). Use defineMessage for each individual message, NOT defineMessages. Ensure descriptions explain when and where the message appears.',
		},
		{
			title: 'Partial String Translation (Prefixes and Labels)',
			description: 'Translating only part of a string while preserving UI structure',
			before: `<Box xcss={styles}>
  <span>Status: {selectedOptions[0]?.label}</span>
  {selectedOptions.length > 1 && (
    <Badge appearance="primary" max={99}>
      +{selectedOptions.length - 1}
    </Badge>
  )}
</Box>`,
			after: `import { useIntl, defineMessage } from '@atlassian/jira-intl';

const statusLabel = defineMessage({
  id: 'filter.status-label.ai-non-final',
  defaultMessage: 'Status: {status}',
  description: 'The text is shown as a button label prefix for the status filter. The placeholder {status} will be substituted with the selected status label. Appears in the filter button to show the current filter state.',
});

export function MyComponent() {
  const { formatMessage } = useIntl();

  return (
    <Box xcss={styles}>
      <span>
        {formatMessage(statusLabel, {
          status: selectedOptions[0]?.label,
        })}
      </span>
      {selectedOptions.length > 1 && (
        <Badge appearance="primary" max={99}>
          +{selectedOptions.length - 1}
        </Badge>
      )}
    </Box>
  );
}`,
			explanation:
				'When only part of a string needs translation (like a prefix "Status: " or label), create a message with a placeholder for the dynamic part. Preserve the existing UI structure (components, conditional rendering, etc.) and only translate the literal string portion.',
		},
		{
			title: 'Dynamic Text Content',
			description: 'Converting conditional hardcoded strings',
			before: `<Text>{state.hasMore ? 'Show more' : 'Show less'}</Text>`,
			after: `import { useIntl, defineMessage } from '@atlassian/jira-intl';

const showMore = defineMessage({
  id: 'work-item.comments.show-more.ai-non-final',
  defaultMessage: 'Show more',
  description: 'The text is shown as a button when there are more items available to display. Used in the comments section footer to expand and show additional content.',
});

const showLess = defineMessage({
  id: 'work-item.comments.show-less.ai-non-final',
  defaultMessage: 'Show less',
  description: 'The text is shown as a button when the user wants to collapse the expanded view. Used in the comments section footer to hide additional content.',
});

export function MyComponent() {
  const { formatMessage } = useIntl();

  return (
    <Text>
      {state.hasMore
        ? formatMessage(showMore)
        : formatMessage(showLess)}
    </Text>
  );
}`,
			explanation:
				'Create separate message constants for each conditional string. Use descriptive names that reflect the context.',
		},
		{
			title: 'ICU Format for Numeric Values',
			description: 'Converting numeric placeholders to ICU plural format',
			before: `const moreMessage = \`+ \${count} more\`;`,
			after: `import { useIntl, defineMessage } from '@atlassian/jira-intl';

const moreProjectsMessage = defineMessage({
  id: 'app.more-projects.ai-non-final',
  defaultMessage: '{count, plural, one {+ # more} other {+ # more}}',
  description: 'The text is shown when there are additional projects available. The placeholder {count} will be substituted with the number of remaining projects. Uses ICU plural format for proper localization.',
});

export function MyComponent() {
  const { formatMessage } = useIntl();
  const count = 5;

  return (
    <Text>
      {formatMessage(moreProjectsMessage, { count })}
    </Text>
  );
}`,
			explanation:
				'Use ICU plural format for numeric values that may need pluralization. The # symbol represents the numeric value in ICU format.',
		},
	],
	bestPractices: [
		'Only convert NEW hardcoded strings - do NOT modify pre-existing messages',
		'**CRITICAL: Use defineMessage (singular)** - Always use defineMessage for each individual message, NOT defineMessages (plural). Each message should be defined separately: `const messageKey = defineMessage({ ... })`',
		'**CRITICAL: Always use .ai-non-final suffix** - ALL new message IDs MUST end with `.ai-non-final`. This applies even if existing messages in the file don\'t have this suffix. Format: `{message-key}.ai-non-final`. This indicates the message is AI-generated and may need review.',
		'Use descriptive names (userNameLabel not label) and placeholders (userName not value)',
		'Add descriptions (40+ chars, unique from defaultMessage)',
		'Use ICU plural format for numeric values: {count, plural, one {...} other {...}}',
		'Place message constants at top of file, use formatMessage consistently',
		'Convert arrow functions to body form if needed for hooks',
	],
	commonPitfalls: [
		'**CRITICAL**: Converting/removing eslint-disable for strings matching ignore patterns - technical/non-user-facing strings should remain hardcoded',
		'**CRITICAL: Invalid i18n ID format** - For files in `/next/packages/`, must follow `{package-name}.{component-or-feature}.{message-key}`. Common errors: (1) Not starting with package name (with dashes), (2) Missing component/feature segment, (3) Wrong message key format (must be kebab-case, not camelCase). Example correct: `comment-extension-handlers.legacy-content-modal.close-button`.',
		'**CRITICAL: Missing .ai-non-final suffix** - ALL new message IDs MUST end with `.ai-non-final`. This applies even if existing messages in the file don\'t have this suffix. Example: `applinks.administration.list.applinks-table.system-label.ai-non-final`. Do NOT omit this suffix even when existing messages don\'t have it.',
		'**CRITICAL: Using defineMessages instead of defineMessage** - Always use defineMessage (singular) for individual messages, NOT defineMessages (plural). Each message should be defined separately using defineMessage.',
		'Using wrong import path - "jira" path needs @atlassian/jira-intl (with eslint-disable), others use react-intl-next',
		'Adding eslint-disable for defineMessage in non-Jira files or forgetting it in Jira files',
		'Missing useIntl hook, generic placeholder names, or descriptions < 40 chars',
		'Modifying pre-existing messages or working outside specified path scope',
	],
	additionalResources: [
		'ESLint rule @atlassian/i18n/no-literal-string-in-jsx defines ignore patterns for technical strings (URLs, product names, symbols, etc.)',
	],
};
