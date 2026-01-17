/**
 * i18n Conversion Guide - Converting hardcoded strings to use formatMessage
 */
import type { ConversionGuide } from './types';

export const i18nConversionGuide: ConversionGuide = {
	id: 'hardcoded-string-to-formatmessage',
	title: 'Hardcoded String to formatMessage Conversion Guide',
	description:
		'Comprehensive guide for converting hardcoded strings to use formatMessage or FormattedMessage from @atlassian/jira-intl or react-intl-next',
	purpose:
		'This guide instructs LLM agents to convert hardcoded strings to use formatMessage or FormattedMessage. The import source depends on the file path: use @atlassian/jira-intl for Jira files (path contains "jira"), and react-intl-next for any non-Jira files. **CRITICAL: Check for existing imports** - If the file already imports from react-intl-next or react-intl, reuse that import. If the file already uses FormattedMessage, use FormattedMessage for consistency instead of useIntl + formatMessage. The goal is to find all hardcoded strings in JSX and convert them to internationalized messages.',
	scope: `**CRITICAL SCOPE**: This process should **ONLY** focus on converting hardcoded strings (literal strings in JSX, eslint-disable comments for no-literal-string-in-jsx, etc.) to use formatMessage. Do NOT modify pre-existing messages that were already in the codebase, even if they have poor descriptions, incorrect placeholder names, or other quality issues. Only convert NEW hardcoded strings.

**PATH SCOPE LIMITATION**: If a specific file, package name, or path is provided, **ONLY** find and convert hardcoded strings within that specified path. Do NOT modify files outside the provided scope.

**CRITICAL: ONLY CONVERT STRINGS WITH ESLINT-DISABLE**: You MUST **ONLY** convert strings that have eslint-disable comments for @atlassian/i18n/no-literal-string-in-jsx. Do NOT proactively convert strings that don't have these comments. For example, field labels like \`label="Space Name"\` that don't have eslint-disable comments should be LEFT AS-IS - they may be acceptable as-is or intentionally not internationalized. Only convert strings that explicitly have the eslint-disable comment indicating they need to be fixed.

**CRITICAL: FIX ALL VIOLATIONS IN FILE**: When a specific file is mentioned (even with line numbers like \`@file.tsx:139-142\`), you MUST find and fix **ALL** @atlassian/i18n/no-literal-string-in-jsx violations in that entire file, not just the specific lines mentioned. Scan the entire file for hardcoded strings WITH eslint-disable comments and convert them all. The line numbers are just a reference point - the goal is to fix all i18n violations (those with eslint-disable comments) in the provided file.

**CRITICAL: STRING FILTERING**: When finding eslint-disable comments, you MUST examine the actual string content. Only convert strings that contain **user-facing English text**. Many English strings are technical/non-user-facing and should NOT be converted (e.g., product names like "Jira", URLs like "https://example.com", technical IDs, symbols). Use the ESLint ignore patterns to identify which English strings to skip - strings matching ignore patterns should be LEFT AS-IS with their eslint-disable comments intact.`,
	implementationChecklist: [
		'**CRITICAL: Only convert strings with eslint-disable** - ONLY convert strings that have eslint-disable comments for @atlassian/i18n/no-literal-string-in-jsx. Do NOT convert strings without these comments (e.g., field labels like label="Space Name" without eslint-disable should remain as-is).',
		'**CRITICAL: Check for existing imports** - If the file already imports from react-intl-next or react-intl, REUSE that import. Only add a new import if none exists.',
		'**CRITICAL: Match existing pattern** - If the file already uses FormattedMessage, use FormattedMessage with inline props. If it uses useIntl + formatMessage, use defineMessage + formatMessage. Match the existing code style.',
		"**CRITICAL: When to use formatMessage() vs <FormattedMessage>** - Use formatMessage() for prop values (labels, placeholders, aria-labels), computed values, event handlers, and non-JSX contexts. Use <FormattedMessage> for JSX content where you'd otherwise write {formatMessage(...)}.",
		'Import: Use "@atlassian/jira-intl" for Jira files or "react-intl-next" for non-Jira files. Note: "react-intl" and "react-intl-next" are treated the same way - both use the same API. When adding to existing imports, maintain alphabetical order: import { defineMessage, FormattedMessage } from "react-intl-next";',
		'**CRITICAL: FormattedMessage pattern** - When using FormattedMessage, define message details directly inline: <FormattedMessage id="..." defaultMessage="..." description="..." />. NO need to use defineMessage - FormattedMessage accepts these props directly.',
		'**CRITICAL: formatMessage pattern** - When using useIntl + formatMessage, create message constants using defineMessage (singular) at the top of the file - use defineMessage for each individual message, NOT defineMessages. Then use: const { formatMessage } = useIntl(); formatMessage(messageKey)',
		'**CRITICAL: i18n ID Format**: For files in `/next/packages/`, i18n ids MUST start with the package name (with dashes). Format: `{package-name}.{component-or-feature}.{message-key}`. Example: For package `comment-extension-handlers`, use `comment-extension-handlers.legacy-content-modal.close-button`. For package `rovo-ai-search`, use `rovo-ai-search.view-profile-text` or `rovo-ai-search.knowledge-cards.copy-email-address`.',
		'**CRITICAL: ai-non-final Suffix**: ALL new message IDs MUST end with `.ai-non-final` suffix. This applies to ALL newly created messages, regardless of whether existing messages in the file have this suffix. Format: `{message-key}.ai-non-final`. Example: `applinks.administration.list.applinks-table.system-label.ai-non-final`. This suffix indicates the message is AI-generated and may need review before finalization.',
		'Replace hardcoded strings with either formatMessage(messageKey) or <FormattedMessage id="..." defaultMessage="..." description="..." /> based on existing pattern',
		'**CRITICAL: Write comprehensive descriptions** - Descriptions are instructions for translators. Include: (1) Where text is shown and the UI element (e.g., "on a button", "as an error message", "as a title", "for a link", "as a drop-down item"), (2) What it does, triggers, or prompts, (3) If there is a placeholder, explain how it will be substituted and with what, (4) If there is an ICU MessageFormat statement (not a placeholder!), provide instruction on the resolved ICU message, not on the ICU structure unless there are more than 2 plural statements, (5) Explain the purpose of the sentence in defaultMessage, (6) Propose an alternative text in Plain English only if the text contains an idiom. Descriptions must be 40+ chars and unique from defaultMessage.',
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
	description: 'This is the text on a button. The placeholder {version} will be substituted with the version name (e.g., "Exit v2.0"). After a user clicks on the button, it will exit the version view and return to the main view. Appears in the version header.',
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
	description: 'This is the text shown as a button label prefix for the status filter. The placeholder {status} will be substituted with the selected status label (e.g., "Status: In Progress"). Appears in the filter button to show the current filter state.',
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
	description: 'This is the text on a button. It appears when there are more items available to display. After a user clicks on the button, it will expand the view to show additional content. Used in the comments section footer.',
});

const showLess = defineMessage({
  id: 'work-item.comments.show-less.ai-non-final',
  defaultMessage: 'Show less',
	description: 'This is the text on a button. It appears when the user wants to collapse the expanded view. After a user clicks on the button, it will hide the additional content that was previously expanded. Used in the comments section footer.',
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
	description: 'This is the text shown when there are additional projects available. The variable {count} will be substituted with the number of remaining projects, and the message will display accordingly (e.g., "+ 5 more" or "+ 1 more"). Appears to indicate how many more items can be viewed.',
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
		{
			title: 'Using FormattedMessage',
			description: 'Reusing existing FormattedMessage pattern and using with placeholders',
			before: `import { FormattedMessage } from 'react-intl-next';

export function MyComponent() {
  const version = 'v2.0';
  return (
    <Box>
      <FormattedMessage {...existingMessage} />
      <Button>Save changes</Button>
      <Button>
        Exit {version}
      </Button>
    </Box>
  );
}`,
			after: `import { FormattedMessage } from 'react-intl-next';

export function MyComponent() {
  const version = 'v2.0';
  return (
    <Box>
      <FormattedMessage {...existingMessage} />
      <Button>
        <FormattedMessage
          id="my-component.save-button.ai-non-final"
          defaultMessage="Save changes"
          description="This is the text on a button. After a user clicks on the button, it will initiate the form being submitted. Appears in the form footer to save changes."
        />
      </Button>
      <Button>
        <FormattedMessage
          id="my-component.exit-button.ai-non-final"
          defaultMessage="Exit {version}"
          description="This is the text on a button. The placeholder {version} will be substituted with the version name (e.g., "Exit v2.0"). After a user clicks on the button, it will exit the version view and return to the main view."
          values={{ version }}
        />
      </Button>
    </Box>
  );
}`,
			explanation:
				'When FormattedMessage is already used in the file, reuse the existing import. Define message details directly inline in FormattedMessage component props (id, defaultMessage, description). No need to use defineMessage - FormattedMessage accepts these props directly. For dynamic values, use the values prop - the placeholder names in defaultMessage must match the keys in the values object.',
		},
		{
			title: 'formatMessage() vs <FormattedMessage> - When to Use Each',
			description: 'Choosing between formatMessage() and FormattedMessage based on context',
			before: `<Field name="spaceName" label="Space Name" placeholder="Enter space name" />
<Button aria-label="Create space">Create space</Button>
<Box>Welcome message</Box>`,
			after: `import { defineMessage, FormattedMessage, useIntl } from 'react-intl-next';

const spaceNameLabel = defineMessage({
  id: 'my-component.space-name-label.ai-non-final',
  defaultMessage: 'Space Name',
  description: 'This is the text shown as a label for the space name input field. Appears above the input field to identify what information should be entered.',
});

const spaceNamePlaceholder = defineMessage({
  id: 'my-component.space-name-placeholder.ai-non-final',
  defaultMessage: 'Enter space name',
  description: 'This is the placeholder text shown inside the space name input field when it is empty. Provides guidance to users on what to enter in the field.',
});

const createSpaceAriaLabel = defineMessage({
  id: 'my-component.create-space-aria-label.ai-non-final',
  defaultMessage: 'Create space',
  description: 'This is the accessible label for the create space button. Used by screen readers to announce the button purpose. The button will create a new space when clicked.',
});

export function MyComponent() {
  const { formatMessage } = useIntl();

  return (
    <>
      <Field
        name="spaceName"
        label={formatMessage(spaceNameLabel)}
        placeholder={formatMessage(spaceNamePlaceholder)}
      />
      <Button aria-label={formatMessage(createSpaceAriaLabel)}>
        <FormattedMessage
          id="my-component.create-space-button.ai-non-final"
          defaultMessage="Create space"
          description="This is the text on a button. After a user clicks on the button, it will create a new space. Appears as the primary action button in the form."
        />
      </Button>
      <Box>
        <FormattedMessage
          id="my-component.welcome-message.ai-non-final"
          defaultMessage="Welcome message"
          description="This is the text shown as a welcome message. Appears in the main content area to greet users when they first visit the page."
        />
      </Box>
    </>
  );
}`,
			explanation:
				"Use formatMessage() for prop values (labels, placeholders, aria-labels), computed values, event handlers, and non-JSX contexts. Use <FormattedMessage> for JSX content where you'd otherwise write {formatMessage(...)}. In this example, label and placeholder props use formatMessage(), while button text and content use FormattedMessage.",
		},
	],
	bestPractices: [
		'Use descriptive names (userNameLabel not label) and placeholders (userName not value)',
		'Use ICU plural format for numeric values: {count, plural, one {...} other {...}}',
		'When using formatMessage pattern: Place message constants at top of file. When using FormattedMessage pattern: Define messages inline in JSX.',
		"Use formatMessage() for prop values (labels, placeholders, aria-labels), computed values, event handlers, and non-JSX contexts. Use <FormattedMessage> for JSX content where you'd otherwise write {formatMessage(...)}.",
		'Convert arrow functions to body form if needed for hooks',
	],
	commonPitfalls: [
		"**CRITICAL**: Converting strings that don't have eslint-disable comments - only convert strings with @atlassian/i18n/no-literal-string-in-jsx eslint-disable comments. Field labels and other strings without these comments should remain as-is.",
		'**CRITICAL**: Converting/removing eslint-disable for strings matching ignore patterns - technical/non-user-facing strings should remain hardcoded',
		'**CRITICAL**: Forgetting to remove eslint-disable comments after conversion - once a string is converted to use formatMessage/FormattedMessage, the eslint-disable comment must be removed',
		'Using wrong import path - "jira" path needs @atlassian/jira-intl (with eslint-disable), others use react-intl-next',
		'Adding eslint-disable for defineMessage in non-Jira files or forgetting it in Jira files',
		'Missing useIntl hook when using formatMessage pattern, generic placeholder names, descriptions < 40 chars, or descriptions that do not follow the translator guidelines (missing UI element location, missing action explanation, etc.)',
		'Using placeholder names that don\'t match variable names - placeholder names in defaultMessage must exactly match the keys in the values object or formatMessage parameters',
		'Modifying pre-existing messages or working outside specified path scope',
	],
	additionalResources: [
		'ESLint rule @atlassian/i18n/no-literal-string-in-jsx defines ignore patterns for technical strings (URLs, product names, symbols, etc.)',
	],
};
