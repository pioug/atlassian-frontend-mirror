# i18n Conversion Implementation Guide for LLM Agents

## Purpose

This guide instructs LLM agents to convert hardcoded strings to use `formatMessage` from
`@atlassian/jira-intl`. The goal is to find all hardcoded strings in JSX and convert them to
internationalized messages.

**⚠️ CRITICAL SCOPE**: This process should **ONLY** focus on converting hardcoded strings (literal
strings in JSX, eslint-disable comments for no-literal-string-in-jsx, etc.) to use `formatMessage`.
Do NOT modify pre-existing messages that were already in the codebase, even if they have poor
descriptions, incorrect placeholder names, or other quality issues. Only convert NEW hardcoded
strings.

**⚠️ PATH SCOPE LIMITATION**: If a specific file, package name, or path is provided, **ONLY** find
and convert hardcoded strings within that specified path. Do NOT modify files outside the provided
scope.

- **If a file path is provided**:
  - Only work on that specific file
  - Example: `src/packages/applinks/administration/src/ui/list/index.tsx` → only convert strings in
    this file
- **If a package name is provided**:
  - Only work on files within that package directory
  - Example: `applinks` → only convert strings in `src/packages/applinks/**/*.tsx`
- **If a directory path is provided**:
  - Only work on files within that directory and its subdirectories
  - Example: `src/packages/applinks/administration` → only convert strings in files under this
    directory
- **If no path is specified**:
  - Work on all files provided or requested by the user

## Implementation Checklist

**⚠️ CRITICAL FIRST STEP**: Find all hardcoded strings in the file that need to be converted. Look
for:

- ESLint disable comments for `@atlassian/i18n/no-literal-string-in-jsx` (search for the rule name)
- Literal strings in JSX (e.g., `<Text>Hello</Text>`, `label="Submit"`)
- Template literals with hardcoded text
- String concatenation with hardcoded text

### 0. Find Hardcoded Strings

**⚠️ EFFICIENCY NOTE**: If the user provides specific violation lines (file paths + line numbers
with code snippets, or JSON violation reports), use those directly. This is more efficient than
searching yourself. Only search if violations are not provided.

- [ ] **Check if violations are provided**: If user provides specific violation lines or JSON
      reports, use those directly
  - Example format 1: `src/packages/admin-pages/.../SaveDialog.tsx:272` with code snippet showing
    the violation
  - Example format 2: JSON violation report with `filePath`, `violations` array containing `line`,
    `column`, `ruleId`, `message`, `severity`
  - This is the preferred and most efficient approach - no searching needed
- [ ] **If violations NOT provided, search for eslint-disable comments FIRST**: This is the most
      efficient way to find violations
  - Search for: `@atlassian/i18n/no-literal-string-in-jsx` (the eslint rule name)
  - This will find all eslint-disable comments that suppress this rule
  - Read the code immediately after each disable comment to see the violation
  - This is more reliable than searching for template literals or string concatenation
- [ ] **If violations NOT provided and no eslint-disable comments found, scan for literal strings in
      JSX**: Find hardcoded strings in JSX elements
  - Look for: `<Text>Hardcoded text</Text>`, `label="Hardcoded"`, `title="Hardcoded"`, etc.
- [ ] **If violations NOT provided, also check for template literals**: Find template literals with
      hardcoded text (only if they contain hardcoded text)
  - Look for: `` `Text ${variable}` ``, `` `Text ${variable} more text` ``
  - Note: Only convert if they contain hardcoded text, not if they're already properly using
    variables
- [ ] **If violations NOT provided, also check for string concatenation**: Find string concatenation
      with hardcoded text (only if it contains hardcoded text)
  - Look for: `"Text " + variable`, `variable + " more text"`
  - Note: Only convert if they contain hardcoded text, not if they're already properly using
    variables
- [ ] **Identify context**: For each hardcoded string, identify:
  - Where it appears (button, label, tooltip, error message, etc.)
  - What component/function it's in
  - Whether it has variables that need placeholders

### 1. Convert Hardcoded Strings

- [ ] **Create message constants**: For each hardcoded string, create a `defineMessage` constant
  - Place constants at the top of the file (after imports, before component)
  - Use context-aware naming (see section 5 for naming guidelines)
  - Format:
    `const messageKey = defineMessage({ id: '...', defaultMessage: '...', description: '...' })`
- [ ] **Replace hardcoded strings**: Replace each hardcoded string with `formatMessage(messageKey)`
  - Remove eslint-disable comments after conversion
  - Convert template literals to messages with placeholders
  - Convert string concatenation to messages with placeholders
- [ ] **Add useIntl hook**: Ensure component has `const { formatMessage } = useIntl();` or
      `const intl = useIntl();`
  - Add hook if missing (see section 3 for hook usage)
- [ ] **Add imports**: Add required imports (`useIntl`, `defineMessage`) if missing (see section 2)

### 2. Import Statements

**CRITICAL**: Add required imports when converting hardcoded strings. Missing imports will cause
runtime errors.

- [ ] **Add imports when converting**: When converting hardcoded strings, add the required imports
  - **If converting strings**: Add `import { useIntl, defineMessage } from '@atlassian/jira-intl';`
  - **If using multiple messages**: Can use `defineMessages` instead of multiple `defineMessage`
    calls
  - **Add eslint-disable**: Add `// eslint-disable-next-line jira/deprecations/ban-identifiers`
    above the import if it includes `defineMessage` or `defineMessages`
- [ ] **Import placement**: Place imports at the top of the file, before message constants
  - `@atlassian/jira-intl` imports should come before type imports (`import type`)
  - `@atlassian/jira-intl` imports should come before relative imports
- [ ] **Example import**:
  ```typescript
  // eslint-disable-next-line jira/deprecations/ban-identifiers
  import { useIntl, defineMessage } from '@atlassian/jira-intl';
  ```
- [ ] **Add `useIntl` import**: If `formatMessage` is used, add
      `import { useIntl } from '@atlassian/jira-intl'`
  - **Action**: Search for `formatMessage(` in the file, then add `import { useIntl }` if missing
- [ ] **Add `defineMessage` import**: If `defineMessage` is used anywhere in the file, add the
      import
  - **CRITICAL**: If you use `defineMessage(` anywhere in the file, you MUST import it
  - **Action**: Search for `defineMessage(` in the file, then add `import { defineMessage }` if
    missing
  - **Common mistake**: File uses `defineMessage({...})` but forgets to import it → **MUST ADD**
  - **Example**: If you see `const myMessage = defineMessage({...})`, add
    `import { defineMessage } from '@atlassian/jira-intl';`
  - **Note**: Messages are now colocated directly in component files using `defineMessage` calls
  - Each message is defined as: `const messageKey = defineMessage({...})`
- [ ] **Add ESLint disable for import**: Add
      `// eslint-disable-next-line jira/deprecations/ban-identifiers` above the import statement
      that includes `defineMessage`
  - **When needed**: The import of `defineMessage` may trigger the
    `jira/deprecations/ban-identifiers` rule
  - **How to add**: Add `// eslint-disable-next-line jira/deprecations/ban-identifiers` directly
    above the import line
  - **Example**:
    ```typescript
    // eslint-disable-next-line jira/deprecations/ban-identifiers
    import { useIntl, defineMessages, defineMessage } from '@atlassian/jira-intl';
    ```
  - **Note**: This should be added even if individual message constants don't trigger the rule, as
    the import itself may be flagged
  - No `messages.tsx` file imports needed - messages are defined in the same file
- [ ] **Add `defineMessages` import**: If `defineMessages` is used, add the import
  - **Action**: Search for `defineMessages({` in the file, then add `import { defineMessages }` if
    missing
- [ ] **Remove duplicate imports**: Remove any duplicate `useIntl` or `defineMessage` imports
  - ❌ Bad: `import { useIntl } from '@atlassian/jira-intl';` appears twice
  - ✅ Good: Single import statement:
    `import { useIntl, defineMessage } from '@atlassian/jira-intl';`
- [ ] **Add semicolons**: Ensure import statements have proper semicolons
- [ ] **Fix import ordering**: Follow project linting rules for import order
  - `@atlassian/jira-intl` imports should come before type imports (`import type`)
  - `@atlassian/jira-intl` imports should come before relative imports
  - Example correct order:
    ```typescript
    import { useIntl, defineMessage } from '@atlassian/jira-intl';
    import type { SomeType } from '../types.tsx';
    import { SomeComponent } from './SomeComponent';
    ```
- [ ] **Remove unused imports**: Remove `useIntl` import if component receives `intl` as prop
  - If props include `intl: IntlShape`, remove `useIntl` import
  - Component should use `intl.formatMessage(...)` from props, not hook

### 3. Hook Usage & formatMessage Extraction

**CRITICAL**: This is the most important step - ensure `formatMessage` is properly extracted from
`useIntl()`.

- [ ] **Find all `formatMessage` usages**: Scan the file for all occurrences of
      `formatMessage(messageConstant)` where `messageConstant` is a `defineMessage` constant
- [ ] **Add hook if missing**: For each component using `formatMessage`, add
      `const { formatMessage } = useIntl();` or `const intl = useIntl();` if missing
- [ ] **Identify component scope**: For each `formatMessage` usage, identify the React component
      function where it's used
  - Look for `function ComponentName`, `const ComponentName = () =>`, or
    `const ComponentName = (props) =>`
  - Check if it's a class component (rare) or function component
- [ ] **Insert hook at correct location**:
  - Find the component function body (after opening `{`)
  - Insert `const { formatMessage } = useIntl();` right after:
    - Props destructuring (if present): `const Component = ({ prop1, prop2 }) => {`
    - Function signature: `function Component() {`
    - Opening brace for arrow function: `const Component = () => {`
  - **Example insertion point**:
    ```typescript
    const MyComponent = ({ title }: Props) => {
    	const { formatMessage } = useIntl(); // ← Insert here
    	// ... rest of component
    };
    ```
- [ ] **Convert arrow function expressions**: If component uses arrow function expression, convert
      to body form
  - **Before**: `const Component = () => <div>{formatMessage(...)}</div>`
  - **After**:
    ```typescript
    const Component = () => {
      const { formatMessage } = useIntl();
      return <div>{formatMessage(...)}</div>;
    }
    ```
  - This is REQUIRED to use hooks - expressions can't contain hook calls
- [ ] **Add hook to custom hooks**: Custom hooks (functions starting with `use`) also need hook
      extraction
  - Example: `export const useDashboard = () => { const { formatMessage } = useIntl(); ... }`
  - Same rules apply - extract hook at the top of the hook function body
- [ ] **Check parent components**: If `formatMessage` is used in a nested component/function, check
      if parent already has it
  - If parent component has `formatMessage`, don't add it again in nested component
  - If `formatMessage` is passed as prop, don't add hook
- [ ] **Ensure consistency**: Use either `formatMessage` OR `intl.formatMessage` consistently
      throughout the file
  - If using `formatMessage`, extract: `const { formatMessage } = useIntl();`
  - If using `intl.formatMessage`, extract: `const intl = useIntl();`
- [ ] **Remove duplicate hooks**: Ensure hook is not added multiple times in the same component
- [ ] **Fix hook in props**: Hook should NOT be inside props destructuring - move it to function
      body: `const Component = ({ const { formatMessage } = useIntl() }) => {` ❌

### 4. Consistency

- [ ] **Standardize usage pattern**: Use either `formatMessage` OR `intl.formatMessage` consistently
      throughout the file
- [ ] **Remove mixed patterns**: Don't mix both patterns in the same file - choose one and use it
      everywhere
- [ ] **Ensure camelCase**: Ensure all message constant names follow camelCase naming convention

### 5. Message Constants Implementation (Context-Aware)

**IMPORTANT**: Create message constants with full context awareness when converting hardcoded
strings. Do NOT modify pre-existing message constants that were already in the codebase.

- [ ] **Create message constants**: For each hardcoded string being converted, create a
      `defineMessage` constant
  - Create: `const messageKey = defineMessage({...})` at the top of the file (after imports, before
    component)
  - **CRITICAL**: Messages are colocated directly in the component file as separate constants
  - **NO `messages.tsx` files**: Messages are NOT in separate `messages.tsx` files
  - Each message is a separate constant: `const myMessage = defineMessage({...})`
  - Usage: `formatMessage(myMessage)` NOT `formatMessage(messages.myMessage)`
- [ ] **CRITICAL: Always use .ai-non-final suffix**: ALL new message IDs MUST end with `.ai-non-final` suffix
  - **REQUIRED**: Every newly created message ID must end with `.ai-non-final`
  - Format: `{message-key}.ai-non-final`
  - Example: `applinks.administration.list.applinks-table.system-label.ai-non-final`
  - **This applies even if existing messages in the file don't have this suffix** - new messages must always include it
  - The suffix indicates the message is AI-generated and may need review before finalization
  - ❌ Bad: `id: 'applinks.administration.list.applinks-table.system-label'` (missing suffix)
  - ✅ Good: `id: 'applinks.administration.list.applinks-table.system-label.ai-non-final'` (has suffix)
- [ ] **Reuse existing constants**: Before creating new message constants, check if similar ones
      exist in the same file
  - Look for existing `defineMessage` calls at the top of the file that might match the use case
  - Reuse existing constants when appropriate (e.g., if "Loading..." already exists, reuse it)
  - All messages are in the same file as the component (colocated pattern)
- [ ] **Improve constant naming**: Rename message constants to be context-aware:
  - **No component name needed**: Since messages are colocated in the component file, don't include
    the component name in the constant name or message ID
    - ❌ Bad: `onboardingwizardinnerLoading` (includes component name unnecessarily)
    - ❌ Bad: `id: 'admin.pages.onboarding-hub-wizard.onboardingwizardinner-loading.ai-non-final'` (includes
      component name in ID)
    - ✅ Good: `loading` (simple, context is already clear from file location)
    - ✅ Good: `id: 'admin.pages.onboarding-hub-wizard.loading.ai-non-final'` (no component name in ID)
  - **Component context**: Look at component name, file path, and surrounding code for understanding
    context, but don't duplicate it in the key name
  - **Example**: In `UserProfile.tsx`, a key like `userName` is better than `name`, but don't use
    `userProfileUserName`
  - **File path context**: Use file path to understand domain (e.g., `project-pages/...` → keys
    should relate to projects), but don't include full path in key name
  - **Function context**: If message is in a specific function, consider function name in key
    - Example: `handleSubmit` function → key could be `submitButtonLabel` not just `buttonLabel`
    - But don't use `handleSubmitSubmitButtonLabel` (don't duplicate function name)
- [ ] **Make keys descriptive**: Ensure keys are self-documenting
  - ❌ Bad: `text`, `label`, `message` (too generic, not context-aware) → Rename to be more specific
  - ❌ Bad: `productsjswstoragemanagementStorageManagement` (too long, not camelCase properly) →
    Simplify
  - ✅ Good: `userNameLabel`, `submitButtonText`, `deleteConfirmation` (descriptive, context-aware)
  - ✅ Good: `pageHeaderTitle` (follows pattern of other keys like `documentTitle`)
  - **Note**: Keys are constants (e.g., `const userNameLabel = defineMessage({...})`), NOT
    `messages.userNameLabel`
- [ ] **Follow package naming patterns**: Check other component files in the same package for
      `defineMessage` naming conventions
  - Use similar naming conventions (e.g., if package uses `componentAction`, follow that)
  - **Consistency within file**: If file has `documentTitle`, `tableHeaderIssue`, use similar
    patterns like `pageHeaderTitle` not `productsjswstoragemanagementStorageManagement`
- [ ] **Use hierarchical naming**: Consider hierarchical naming for related messages
  - Example: `dialog.title`, `dialog.confirmButton`, `dialog.cancelButton`
- [ ] **Ensure key uniqueness**: Remove duplicate constant names - ensure all keys are unique
- [ ] **Fix camelCase**: Convert all keys to camelCase (not kebab-case or snake_case)
  - ❌ `user-name`, `user_name` (kebab-case or snake_case) → Convert to `userName`
  - ✅ `userName` (camelCase)
  - **Note**: Keys are constant names (e.g., `const userName = defineMessage({...})`), NOT
    `messages.userName`
- [ ] **Fix empty keys**: Fix any empty or undefined constant names (`const = defineMessage({...})`
      or `const undefined = defineMessage({...})`)
- [ ] **Add ESLint disable for banned identifiers**: If a message constant name triggers the
      `jira/deprecations/ban-identifiers` rule, add the eslint-disable comment above the constant -
      **When needed**: Some identifier names (like `loading`, `error`, etc.) may be banned by
      project linting rules - **How to add**: Add
      `// eslint-disable-next-line jira/deprecations/ban-identifiers` directly above the `const`
      declaration - **Example**:
      `typescript       // eslint-disable-next-line jira/deprecations/ban-identifiers       const loading = defineMessage({         id: 'app.loading.ai-non-final',         defaultMessage: 'Loading...',         description: 'The text is shown as a loading indicator when data is being fetched.',       });       ` -
      **Note**: Only add this comment if the linter actually flags the identifier name. Don't add it
      preemptively.
- [ ] **Fix defaultMessage formatting** (for NEW messages only): Normalize `defaultMessage` values
      to proper formatting
  - **Multiline text**: When text spans multiple lines in JSX, it should be normalized to a single
    line with spaces
    - ❌ Bad:
      `defaultMessage: 'Text line 1\n                    line 2\n                    line 3'` (has
      newlines and extra whitespace)
    - ❌ Bad: `defaultMessage: \`Text line 1\n line 2\`` (template literal with newlines and
      indentation)
    - ✅ Good: `defaultMessage: 'Text line 1 line 2 line 3'` (single line, normalized whitespace)
    - ✅ Good:
      `defaultMessage: 'Application links let you integrate Jira with another Atlassian product or external application so they can exchange information, resources, and functionalities. What exactly is exchanged will depend on the applications you link.'`
  - **Whitespace normalization**: Multiple spaces, tabs, and newlines should be collapsed to single
    spaces
  - **No trailing/leading whitespace**: Text should be trimmed
  - **How to fix**: If you find multiline text with newlines or extra whitespace, normalize it to a
    single-line string with proper spacing
    - Convert newlines (`\n`) to spaces
    - Collapse multiple consecutive spaces/tabs to a single space
    - Trim leading and trailing whitespace
  - **Note**: Only fix formatting for NEW generated messages. Pre-existing messages should be left
    unchanged even if they have formatting issues

### 5.5. Message Description Implementation

**CRITICAL**: Add proper descriptions for **NEW `defineMessage` calls created when converting
hardcoded strings**. Do NOT modify pre-existing messages that were already in the codebase.

**Scope**: Only add/improve descriptions for messages created when converting hardcoded strings.
Pre-existing messages with poor descriptions should be left as-is.

- [ ] **Add descriptions**: Every **NEW** `defineMessage` or `defineMessages` call created when
      converting hardcoded strings must have a `description` field
  - ❌ Bad: Missing `description` field → Add description
  - ✅ Good: `description: 'The text is shown as...'`
  - ⚠️ **Note**: If a message already existed in the codebase and has a poor description, leave it
    unchanged
- [ ] **Extend short descriptions**: Descriptions must be at least 40 characters long
  - ❌ Bad: `description: 'Button text'` (too short, less than 40 characters) → Expand to 40+
    characters
  - ✅ Good:
    `description: 'The text is shown as a button when the user needs to submit a form. Used in the form footer to save user input.'`
    (40+ characters)
- [ ] **Make descriptions unique**: Description must be different from `defaultMessage`
  - ❌ Bad: `defaultMessage: 'Save'`, `description: 'Save'` (same as defaultMessage) → Change
    description
  - ✅ Good: `defaultMessage: 'Save'`,
    `description: 'The text is shown as a button when the user needs to save their changes. Located in the form footer.'`
- [ ] **Follow template format**: Update descriptions to follow the standard template structure:

  ```
  The text is shown as [context] when [condition]. [Additional context about placeholders/usage].
  ```

  - **Context**: What type of UI element (e.g., "a button", "a label", "a tooltip", "an error
    message")
  - **Condition**: When or where it appears (e.g., "when the user submits", "in the form footer",
    "when validation fails")
  - **Additional Context**: Information about placeholders, usage location, or special behavior

- [ ] **Analyze code context**: When implementing descriptions, analyze the surrounding code to
      understand:
  - **Component Type**: Button, label, tooltip, error message, notification, header, etc.
  - **Usage Location**: Where in the UI (form footer, header, modal, sidebar, etc.)
  - **User Flow**: When the user sees this (on page load, after action, during validation, etc.)
  - **Placeholders**: What dynamic values are substituted (document each placeholder)
- [ ] **Document placeholders**: If message contains placeholders, document them in the description
  - ✅ Good:
    `description: 'The text is shown as a greeting message when the user logs in. The placeholder {userName} will be substituted with the user\'s display name. Appears in the application header.'`
  - ❌ Bad: `description: 'Greeting message'` (doesn't mention placeholder) → Add placeholder
    documentation
- [ ] **Add usage location**: Specify where the message appears when relevant
  - Form locations: "in the form footer", "above the input field", "below the submit button"
  - Page locations: "in the page header", "in the sidebar", "in the navigation bar"
  - Modal locations: "in the modal footer", "as the modal title", "in the confirmation dialog"
  - Component locations: "in the dropdown menu", "in the tooltip", "in the notification banner"

**Description Templates by Component Type**:

- **Buttons**:
  `'The text is shown as a button when [action context]. Used in [location] to [purpose].'`
- **Labels**:
  `'The text is shown as a label for the [field/component] in [context]. Appears [location].'`
- **Tooltips**:
  `'The text is shown as a tooltip when the user [trigger action]. Provides [information/guidance].'`
- **Error Messages**:
  `'The text is shown as an error message when [validation/error condition]. [Placeholder documentation if applicable]. Displayed [location].'`
- **Notifications**:
  `'The text is shown as a notification when [event/condition]. Informs the user that [information]. Appears [location].'`
- **Headers/Titles**: `'The text is shown as a [header/title] in [context]. Appears [location].'`

**Examples**:

```typescript
// ✅ Good: Button with proper description
const submitButton = defineMessage({
	id: 'form.submit.button.ai-non-final',
	defaultMessage: 'Submit',
	description:
		'The text is shown as a button when the user needs to submit a form. Used in the form footer to save user input.',
});

// ✅ Good: Label with placeholder documentation
const emailLabel = defineMessage({
	id: 'form.email.label.ai-non-final',
	defaultMessage: 'Email address',
	description:
		'The text is shown as a label for the email input field in the user registration form. Appears above the input field.',
});

// ✅ Good: Error message with placeholder
const validationError = defineMessage({
	id: 'form.validation.error.ai-non-final',
	defaultMessage: 'Please enter a valid {fieldName}',
	description:
		'The text is shown as an error message when form validation fails. The placeholder {fieldName} will be substituted with the name of the invalid field. Displayed below the input field.',
});

// ❌ Bad: Missing description
const greeting = defineMessage({
	id: 'app.greeting.ai-non-final',
	defaultMessage: 'Hello, {name}!',
	// Missing description
});

// ❌ Bad: Description too short
const greeting = defineMessage({
	id: 'app.greeting.ai-non-final',
	defaultMessage: 'Hello, {name}!',
	description: 'Greeting', // Too short (less than 40 characters)
});

// ❌ Bad: Description same as defaultMessage
const greeting = defineMessage({
	id: 'app.greeting.ai-non-final',
	defaultMessage: 'Hello, {name}!',
	description: 'Hello, {name}!', // Same as defaultMessage
});

// ❌ Bad: Description without context
const saveButton = defineMessage({
	id: 'button.save.ai-non-final',
	defaultMessage: 'Save',
	description: 'Save button text', // Lacks context about when/where it appears
});
```

**When implementing descriptions**:

1. **Identify if message is NEW**: Determine if the `defineMessage` call was created when converting
   hardcoded strings or existed before
   - **NEW messages**: Created when converting hardcoded strings - add proper descriptions
   - **Pre-existing messages**: Already existed in codebase - leave unchanged
2. **For NEW messages only**:
   - Read the component code to understand where and when the message is used
   - Identify the UI component type (button, label, tooltip, etc.)
   - Document placeholders if the message has variables
   - Ensure description length (40+ characters)
   - Ensure description is different from defaultMessage
   - Follow template format: "The text is shown as [context] when [condition]. [Additional
     context]."
3. **Do NOT modify**: Pre-existing messages, even if they have poor descriptions or missing
   descriptions

### 6. Placeholder Names Implementation

**CRITICAL**: Use descriptive placeholder names in **NEW messages created when converting hardcoded
strings** with variables. Do NOT modify placeholders in pre-existing messages.

- [ ] **Create placeholders**: When converting hardcoded strings with variables, create placeholders
      in the message
  - Template literals: `` `Hello ${userName}` `` → `defaultMessage: 'Hello {userName}'`
  - String concatenation: `"Count: " + count` → `defaultMessage: 'Count: {count}'`
  - Format: `formatMessage(messageConstant, { placeholder: value })`
- [ ] **Improve placeholder names**: Rename each placeholder to be clear and descriptive:
  - **Variable context**: Look at the variable name being passed
    - Example: `formatMessage(greetingMessage, { name: userName })` → placeholder `name` is good
    - Example: `formatMessage(greetingMessage, { x: userName })` → should be `name` not `x`
    - **Note**: `greetingMessage` is a `defineMessage` constant, NOT `messages.greeting`
  - **Meaningful names**: Placeholders should describe what they represent
    - ❌ Bad: `{ value }`, `{ data }`, `{ item }`, `{ temp }`, `{ value0 }`, `{ value1 }`, `{ x }`
    - ✅ Good: `{ userName }`, `{ itemCount }`, `{ projectName }`, `{ date }`, `{ count }`,
      `{ total }`
    - **Example improvement**: `{ value0 }` → `{ count }` (when representing a count/number)
  - **Type hints**: Use names that hint at the type/content
    - Numbers: `{ count }`, `{ total }`, `{ index }`
    - Strings: `{ name }`, `{ title }`, `{ description }`
    - Dates: `{ date }`, `{ time }`, `{ timestamp }`
- [ ] **Ensure consistency**: Use consistent placeholder names across related messages
  - If multiple messages use the same concept, use the same placeholder name
  - Example: All user-related messages use `{ userName }` not `{ name }` in some and `{ user }` in
    others
- [ ] **Apply context-aware naming**: Consider the message content when naming placeholders
  - Example: `"Welcome {name}"` → placeholder should be `name` or `userName`
  - Example: `"Delete {item}?"` → placeholder should be `item` or `itemName`, not `value`
- [ ] **Convert to ICU Format for Numeric Placeholders**: Convert numeric placeholders to ICU plural
      format
  - **When to use**: When a placeholder represents a count/number that may need pluralization
  - **Format**: `{count, plural, one {# item} other {# items}}`
  - ❌ Bad: `defaultMessage: '+ {count} more'` (simple placeholder) → Convert to ICU format
  - ✅ Good: `defaultMessage: '{count, plural, one {+ # more} other {+ # more}}'` (ICU plural
    format)
  - **Why**: ICU format allows proper pluralization for different locales (e.g., some languages have
    different plural rules)
  - **Note**: Use `#` in ICU format to represent the numeric value
- [ ] **Update both places**: When creating placeholders, ensure they match in both places:
  1. The `formatMessage` call: `formatMessage(messageConstant, { placeholderName: value })`
  2. The `defineMessage` definition: `defaultMessage: 'Text {placeholderName} more text'`
  - If using ICU format for numeric values:
    `defaultMessage: '{count, plural, one {...} other {...}}'`
  - ⚠️ **Note**: Only create/update NEW messages. Do NOT modify `defaultMessage` values in
    pre-existing messages
- [ ] **Verify placeholder consistency**: Ensure placeholder names match between:
  - Message definition (`defaultMessage: 'Hello {userName}'` or ICU format) in the `defineMessage`
    call
  - Usage (`formatMessage(greetingMessage, { userName: user.name })`)
  - **Note**: Messages are individual constants (e.g.,
    `const greetingMessage = defineMessage({...})`) defined in the same file, NOT
    `messages.greeting` from a separate file

### 7. Code Quality

- [ ] **Remove ESLint suppressions**: Remove
      `eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx` comments after converting
      hardcoded strings
- [ ] **Clean up code**: Remove unnecessary empty lines and commented-out code
- [ ] **Ensure formatting**: Ensure formatting is consistent throughout the file
- [ ] **Remove unused variables**: Remove unused imports/variables if any

**Note on Linting Errors**:

- **Do NOT fix linting errors** as part of the i18n conversion process
- Common linting errors that may appear but should be ignored:
  - Import ordering issues (e.g., `@atlassian/jira-intl` import order)
  - Primitive component suggestions (e.g., using `<span>` instead of `<Text>`)
  - Other style/formatting linting rules
- Focus only on converting hardcoded strings to i18n format
- Linting errors can be fixed separately in a follow-up PR if needed

### 8. Edge Cases

- [ ] **Preserve HTML entities**: When converting, ensure HTML entities (like `&nbsp;`) are
      preserved in the `defaultMessage`
- [ ] **Convert template literals**: Convert template literals with variables to messages with
      placeholders
  - `` `Hello ${userName}` `` → `defaultMessage: 'Hello {userName}'`
- [ ] **Convert composite strings**: Convert composite strings (text + variable + text) to messages
      with placeholders
  - `"Count: " + count + " items"` → `defaultMessage: 'Count: {count} items'`
- [ ] **Convert attribute values**: Convert attribute values (aria-label, title, etc.) when
      converting hardcoded strings
- [ ] **Include formatting characters**: Ensure formatting characters (%, parentheses, currency
      symbols) are part of messages, not hardcoded
- [ ] **Use formatNumber**: Use `intl.formatNumber()` for numbers, percentages, and currencies when
      appropriate
- [ ] **Use ICU Format for numeric values**: Use ICU plural format for counts/quantities
  - **When**: Counts, quantities, or any numeric value that may need pluralization
  - **Format**: `{count, plural, one {# item} other {# items}}`
  - **Example**:
    - Hardcoded: `"+ " + count + " more"`
    - Convert to: `defaultMessage: '{count, plural, one {+ # more} other {+ # more}}'`
  - **Benefits**: Proper pluralization support for different locales
  - **Note**: The `#` symbol represents the numeric value in ICU format

## Common Patterns and Real-World Examples

### Pattern 1: Form Labels and Field Descriptions

**Bad Code ❌**:

```typescript
<TaskIcon label="Task" color={token('color.icon.accent.blue')} />
{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
<Text>No summary</Text>
```

**Good Code ✅**:

```typescript
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const taskLabel = defineMessage({
  id: 'work-item.field.time-tracking.task-label.ai-non-final',
  defaultMessage: 'Task',
  description: 'The text is shown as a label for the task icon in the time tracking field. Appears next to the task icon to identify the work item type.',
});

const noSummary = defineMessage({
  id: 'work-item.table.no-summary.ai-non-final',
  defaultMessage: 'No summary',
  description: 'The text is shown as a placeholder message when a work item has no summary text. Displayed in the work item table to indicate missing summary information.',
});

export function MyComponent() {
  const intl = useIntl();

  return (
    <>
      <TaskIcon
        label={intl.formatMessage(taskLabel)}
        color={token('color.icon.accent.blue')}
      />
      <Text>
        {intl.formatMessage(noSummary)}
      </Text>
    </>
  );
}
```

---

### Pattern 2: Button Text and Action Labels

**Bad Code ❌**:

```typescript
<Button style={styles} onClick={onClearVersion}>
  Exit {description.join(' ')}
</Button>
```

**Good Code ✅**:

```typescript
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const exitButton = defineMessage({
  id: 'whiteboard.version.exit-button.ai-non-final',
  defaultMessage: 'Exit {version}',
  description: 'The text is shown as a button when the user needs to exit the version view. The placeholder {version} will be substituted with the version name. Used in the version header to return to the main view.',
});

export function MyComponent() {
  const intl = useIntl();

  return (
    <Button style={styles} onClick={onClearVersion}>
      {intl.formatMessage(exitButton, { version: description.join(' ') })}
    </Button>
  );
}
```

---

### Pattern 3: Loading States and Status Messages

**Bad Code ❌**:

```typescript
return <Box>Loading...</Box>;
```

**Good Code ✅**:

```typescript
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const loading = defineMessage({
  id: 'work-item.tab.loading.ai-non-final',
  defaultMessage: 'Loading...',
  description: 'The text is shown as a loading indicator when work item data is being fetched from the server. Appears in the work item tab to inform users that content is loading.',
});

export function MyComponent() {
  const intl = useIntl();

  return (
    <Box>
      {intl.formatMessage(loading)}
    </Box>
  );
}
```

---

### Pattern 4: Error Messages

**Bad Code ❌**:

```typescript
{state.error && (
  <Box xcss={commentsStyles.error}>
    <Text>{state.error}</Text>
  </Box>
)}
```

**Good Code ✅**:

```typescript
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const errorMessage = defineMessage({
  id: 'work-item.comments.error.ai-non-final',
  defaultMessage: 'Error: {errorMessage}',
  description: 'The text is shown as an error message when loading or saving comments fails. The placeholder {errorMessage} will be substituted with the specific error details. Displayed in the comments section to inform users of the issue.',
});

export function MyComponent() {
  const intl = useIntl();

  return (
    <>
      {state.error && (
        <Box xcss={commentsStyles.error}>
          <Text>
            {intl.formatMessage(errorMessage, { errorMessage: state.error })}
          </Text>
        </Box>
      )}
    </>
  );
}
```

---

### Pattern 5: Interactive Elements (Button Labels)

**Bad Code ❌**:

```typescript
<Button
  spacing="compact"
  icon={EditIcon}
  label="Edit summary"
  isTooltipDisabled={false}
  onClick={(e) => {
    // ...
  }}
>
```

**Good Code ✅**:

```typescript
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const editSummaryLabel = defineMessage({
  id: 'work-item.table.edit-summary-label.ai-non-final',
  defaultMessage: 'Edit summary',
  description: 'The text is shown as a button label when the user wants to edit the work item summary. Used in the work item table row to trigger the edit mode for the summary field.',
});

export function MyComponent() {
  const intl = useIntl();

  return (
    <Button
      spacing="compact"
      icon={EditIcon}
      label={intl.formatMessage(editSummaryLabel)}
      isTooltipDisabled={false}
      onClick={(e) => {
        // ...
      }}
    />
  );
}
```

---

### Pattern 6: Dynamic Text Content

**Bad Code ❌**:

```typescript
<Text>{state.isLoadingMore ? 'Loading...' : 'Load more comments'}</Text>
```

**Good Code ✅**:

```typescript
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const loadingMore = defineMessage({
  id: 'work-item.comments.loading-more.ai-non-final',
  defaultMessage: 'Loading...',
  description: 'The text is shown as a loading indicator when additional comments are being fetched from the server. Appears in the comments section to inform users that more content is loading.',
});

const loadMoreComments = defineMessage({
  id: 'work-item.comments.load-more.ai-non-final',
  defaultMessage: 'Load more comments',
  description: 'The text is shown as a button when there are more comments available to load. Used in the comments section footer to fetch and display additional comments.',
});

export function MyComponent() {
  const intl = useIntl();

  return (
    <Text>
      {state.isLoadingMore
        ? intl.formatMessage(loadingMore)
        : intl.formatMessage(loadMoreComments)}
    </Text>
  );
}
```

---

### Pattern 7: Formatting Characters and Symbols

#### Percentages

**Bad Code ❌**:

```typescript
{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
<ScorecardScore>{totalScore}%</ScorecardScore>
```

**Explanation**: The `%` symbol might vary by locale (e.g., French adds a space: `{totalScore} %`).

**Good Code ✅** (Option 1 - Using formatNumber):

```typescript
<ScorecardScore>
  {intl.formatNumber(totalScore / 100, { style: 'percent' })}
</ScorecardScore>
```

**Good Code ✅** (Option 2 - Using FormattedMessage with ICU):

```typescript
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const scorePercentage = defineMessage({
  id: 'scorecard.score.percentage.ai-non-final',
  defaultMessage: 'Your score is {value, number, percent}',
  description: 'Score displayed as percentage',
});

export function MyComponent() {
  const intl = useIntl();

  return (
    <ScorecardScore>
      {intl.formatMessage(scorePercentage, {
        value: intl.formatNumber(totalScore / 100, { style: 'percent' })
      })}
    </ScorecardScore>
  );
}
```

**Note**: Use `intl.formatNumber()` for decimal, percent, currency, or unit values with proper
locale formatting.

#### Parentheses

**Bad Code ❌**:

```typescript
{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
<ContentDateLabel>{`(${getDateFromTimestamp(date)})`}</ContentDateLabel>
```

**Explanation**: Parentheses should be part of the message, not hardcoded.

**Good Code ✅**:

```typescript
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const dateFormat = defineMessage({
  id: 'timeline.key-dates.date-format.ai-non-final',
  defaultMessage: '({formattedDate})',
  description: 'Format for displaying dates in parentheses',
});

export function MyComponent() {
  const intl = useIntl();

  return (
    <ContentDateLabel>
      {intl.formatMessage(dateFormat, {
        formattedDate: getDateFromTimestamp(date)
      })}
    </ContentDateLabel>
  );
}
```

---

## Common Conversion Patterns

### Pattern 1: Converting Simple Hardcoded Strings

**Problem**: Hardcoded string in JSX needs to be converted

**How to Convert**:

1. Find the hardcoded string (e.g., `<Text>Hello</Text>`)
2. Create a `defineMessage` constant at the top of the file
3. Replace the hardcoded string with `formatMessage(messageConstant)`
4. Add `useIntl` hook if missing
5. Add imports if missing

**Example**:

```typescript
// Before (missing hook)
const welcomeMessage = defineMessage({
  id: 'app.welcome.ai-non-final',
  defaultMessage: 'Welcome',
});

const MyComponent = ({ title }: Props) => {
  return <div>{formatMessage(welcomeMessage)}</div>;
}

// After (hook added)
const welcomeMessage = defineMessage({
  id: 'app.welcome.ai-non-final',
  defaultMessage: 'Welcome',
});

const MyComponent = ({ title }: Props) => {
  const { formatMessage } = useIntl();
  return <div>{formatMessage(welcomeMessage)}</div>;
}
```

**Special Cases**:

- **Nested components**: If `formatMessage` is used in a nested function/component, check if parent
  already has it
- **Props**: If `formatMessage` is passed as prop, don't add hook
- **Class components**: Use `const intl = useIntl();` and access via `intl.formatMessage(...)`

### Pattern 2: Converting Strings with Variables

**Problem**: Hardcoded string with variables needs to be converted (e.g., template literals or
concatenation)

**How to Convert**:

1. Find the hardcoded string with variables (e.g., `` `Hello ${userName}` `` or `"Count: " + count`)
2. Create a `defineMessage` constant with placeholders
3. Replace with `formatMessage(messageConstant, { placeholder: value })`
4. Ensure placeholder names match between `defaultMessage` and `formatMessage` call

**Example**:

```typescript
// Before
const textMessage = defineMessage({
  id: 'app.text.ai-non-final',
  defaultMessage: 'Text',
});

const Component = () => {
  useIntl();
  return <div>{formatMessage(textMessage)}</div>;
}

// After
const textMessage = defineMessage({
  id: 'app.text.ai-non-final',
  defaultMessage: 'Text',
});

const Component = () => {
  const { formatMessage } = useIntl();
  return <div>{formatMessage(textMessage)}</div>;
}
```

### Pattern 3: Converting Attribute Values

**Problem**: Hardcoded string in attribute (e.g., `label="Submit"`, `aria-label="Close"`)

**How to Convert**:

1. Find the hardcoded attribute value
2. Create a `defineMessage` constant
3. Replace with `label={formatMessage(messageConstant)}` or
   `aria-label={formatMessage(messageConstant)}`
4. Add `useIntl` hook and imports if missing

**Examples**:

```typescript
// File uses formatMessage but missing import
// ❌ Bad: No import, but formatMessage is used
const Component = () => {
  return <div>{formatMessage(myMessage)}</div>; // ERROR: formatMessage is not defined
}

// ✅ Good: Import added with eslint-disable
// eslint-disable-next-line jira/deprecations/ban-identifiers
import { useIntl, defineMessage } from '@atlassian/jira-intl';

const myMessage = defineMessage({
  id: 'app.message.ai-non-final',
  defaultMessage: 'Hello',
});

const Component = () => {
  const { formatMessage } = useIntl();
  return <div>{formatMessage(myMessage)}</div>;
}
```

**Import Examples**:

```typescript
// Missing useIntl import - add this if formatMessage is used
import { useIntl } from '@atlassian/jira-intl';

// Missing defineMessage import - add this if defineMessage is used
// eslint-disable-next-line jira/deprecations/ban-identifiers
import { defineMessage } from '@atlassian/jira-intl';

// Missing defineMessages import - add this if defineMessages is used
// eslint-disable-next-line jira/deprecations/ban-identifiers
import { defineMessages } from '@atlassian/jira-intl';

// Combined import (preferred when multiple are needed)
// eslint-disable-next-line jira/deprecations/ban-identifiers
import { useIntl, defineMessage } from '@atlassian/jira-intl';
// or
// eslint-disable-next-line jira/deprecations/ban-identifiers
import { useIntl, defineMessages } from '@atlassian/jira-intl';
// or
// eslint-disable-next-line jira/deprecations/ban-identifiers
import { useIntl, defineMessage, defineMessages } from '@atlassian/jira-intl';

// Example with eslint-disable for banned identifiers
// eslint-disable-next-line jira/deprecations/ban-identifiers
const loading = defineMessage({
	id: 'app.loading.ai-non-final',
	defaultMessage: 'Loading...',
	description:
		'The text is shown as a loading indicator when data is being fetched from the server.',
});
```

**Note**: Messages are colocated as individual constants in the component file, not imported from
`messages.tsx`

**Important Note**: Messages are colocated in component files using individual `defineMessage`
calls:

- Each message is defined as a separate constant: `const messageKey = defineMessage({...})`
- Messages are defined at the top of the file (after imports, before component)
- Usage: `formatMessage(messageKey)` NOT `formatMessage(messages.messageKey)`
- **NO `messages.tsx` files**: Messages are NOT in separate `messages.tsx` files
- **NO `messages` import**: Do not import from `messages.tsx` - messages are in the same file

**Duplicate Import Issue**:

- ❌ Bad: `import { useIntl } from '@atlassian/jira-intl';` appears multiple times
- ✅ Good: Single import statement: `import { useIntl, defineMessage } from '@atlassian/jira-intl';`

### Pattern 4: Converting Conditional Strings

**Problem**: Conditional hardcoded strings (e.g., `{isLoading ? 'Loading...' : 'Load more'}`)

**How to Convert**:

1. Create separate `defineMessage` constants for each string
2. Replace with conditional:
   `{isLoading ? formatMessage(loadingMessage) : formatMessage(loadMoreMessage)}`
3. Add `useIntl` hook and imports if missing

**Example**:

```typescript
// Bad (nested)
const greetingMessage = defineMessage({...});
const nameMessage = defineMessage({...});
formatMessage(greetingMessage{formatMessage(nameMessage)})

// Good (separate or with placeholder)
const greetingMessage = defineMessage({
  id: 'app.greeting.ai-non-final',
  defaultMessage: 'Hello {name}',
});
formatMessage(greetingMessage, { name: userName })
```

### Pattern 5: Converting Arrow Function Components

**Problem**: Arrow function expression component with hardcoded strings needs hook

**How to Convert**:

1. Convert arrow function expression to body form
2. Add `useIntl` hook
3. Convert hardcoded strings to `formatMessage` calls

**Example**:

```typescript
// Inconsistent
const text1Message = defineMessage({...});
const text2Message = defineMessage({...});

const Component = () => {
  const { formatMessage } = useIntl();
  const intl = useIntl();
  return (
    <div>
      {formatMessage(text1Message)}
      {intl.formatMessage(text2Message)} {/* Inconsistent! */}
    </div>
  );
}

// Consistent
const text1Message = defineMessage({...});
const text2Message = defineMessage({...});

const Component = () => {
  const { formatMessage } = useIntl();
  return (
    <div>
      {formatMessage(text1Message)}
      {formatMessage(text2Message)}
    </div>
  );
}
```

### Pattern 6: Naming Message Constants

**Problem**: Need to create context-aware names for message constants when converting hardcoded
strings

**How to Name**:

1. **Create constant**: Create `defineMessage` call in the same file
   - Create: `const messageKey = defineMessage({...})` at the top of the file (after imports, before
     component)
   - Messages are colocated in the component file as separate constants
   - Usage: `formatMessage(messageKey)` NOT `formatMessage(messages.messageKey)`
   - **NO `messages.tsx` files**: Messages are NOT in separate `messages.tsx` files
2. **Analyze context**: Look at:
   - Component name (e.g., `UserProfile` → constants should relate to users)
   - File path (e.g., `project-pages/...` → constants should relate to projects)
   - Function name (e.g., `handleDelete` → constant could be `deleteConfirmation`)
   - Surrounding code and variable names
   - **Other constants in the same file**: Follow the naming pattern of existing constants
3. **Create descriptive names**:
   - ❌ `text`, `label`, `message` (too generic)
   - ❌ `productsjswstoragemanagementStorageManagement` (too long, inconsistent)
   - ❌ `onboardingwizardinnerLoading` (includes component name unnecessarily)
   - ✅ `userNameLabel`, `deleteButtonText`, `confirmDialogTitle`
   - ✅ `pageHeaderTitle` (matches pattern of `documentTitle`, `tableHeaderIssue`)
   - ✅ `loading` (simple, context is clear from file location)
   - **Note**: Since messages are colocated in component files, don't include component name in
     constant name or message ID
4. **Follow package patterns**: Look at other component files in the same package for naming
   conventions
5. **Consistency within file**: If file has constants like `documentTitle`, `tableHeaderIssue`, use
   similar patterns
   - Example: If you see `documentTitle`, use `pageHeaderTitle` not
     `productsjswstoragemanagementStorageManagement`

**Example**:

```typescript
// Before (non-context-aware)
// In UserProfile.tsx component
const label = defineMessage({...});
formatMessage(label); // What label?

// After (context-aware, but don't include component name)
const userNameLabel = defineMessage({...});
formatMessage(userNameLabel); // Clear it's a user name label
// Note: Don't use userProfileUserNameLabel - component name is redundant

// Before (includes component name unnecessarily)
// In OnboardingWizardInner.tsx
const onboardingwizardinnerLoading = defineMessage({
  id: 'admin.pages.onboarding-hub-wizard.onboardingwizardinner-loading.ai-non-final',
  defaultMessage: 'Loading...',
});

// After (simplified - component name not needed)
const loading = defineMessage({
  id: 'admin.pages.onboarding-hub-wizard.loading.ai-non-final',
  defaultMessage: 'Loading...',
});
```

### Pattern 7: Creating Placeholder Names

**Problem**: Need to create descriptive placeholder names when converting strings with variables

**How to Create**:

1. **Look at variable names**: Use the variable name as inspiration for the placeholder name
   - Variable: `userName` → Placeholder: `{ userName }`
   - Variable: `itemCount` → Placeholder: `{ itemCount }`
2. **Use descriptive names**:
   - ❌ `{ value }`, `{ data }`, `{ item }`, `{ x }`, `{ temp }`
   - ✅ `{ userName }`, `{ itemCount }`, `{ projectName }`, `{ date }`
3. **Match in both places**: Ensure placeholder name matches in:
   - `formatMessage` call: `formatMessage(messageConstant, { placeholderName: variable })`
   - `defineMessage` definition: `defaultMessage: 'Text {placeholderName} more text'`
4. **Ensure consistency**: Use same placeholder names for same concepts across related messages

**Example**:

```typescript
// Before (poor placeholder name)
const greetingMessage = defineMessage({
	id: 'app.greeting.ai-non-final',
	defaultMessage: 'Hello {x}',
});
const message = formatMessage(greetingMessage, { x: user.name });

// After (better placeholder name)
const greetingMessage = defineMessage({
	id: 'app.greeting.ai-non-final',
	defaultMessage: 'Hello {userName}',
});
const message = formatMessage(greetingMessage, { userName: user.name });
```

**Real-World Example**:

```typescript
// Before (generic placeholder)
const moreProjectsMessage = defineMessage({
	id: 'app.more-projects.ai-non-final',
	defaultMessage: '+ more{value0}',
});
formatMessage(moreProjectsMessage, { value0: projects.length - limit });

// After (descriptive placeholder with ICU format)
const moreProjectsMessage = defineMessage({
	id: 'app.more-projects.ai-non-final',
	defaultMessage: '{count, plural, one {+ # more} other {+ # more}}',
});
formatMessage(moreProjectsMessage, { count: projects.length - limit });
```

**ICU Format Example**:

```typescript
// Before (simple placeholder for numeric value)
const moreProjectsMessage = defineMessage({
	id: 'app.more-projects.ai-non-final',
	defaultMessage: '+ {count} more',
});
formatMessage(moreProjectsMessage, { count: projects.length - limit });

// After (ICU plural format for proper pluralization)
const moreProjectsMessage = defineMessage({
	id: 'app.more-projects.ai-non-final',
	defaultMessage: '{count, plural, one {+ # more} other {+ # more}}',
});
formatMessage(moreProjectsMessage, { count: projects.length - limit });
```

**Context-Aware Placeholder Naming**:

- **User-related**: `{ userName }`, `{ userEmail }`, `{ userId }`
- **Count-related**: `{ count }`, `{ total }`, `{ remaining }`
- **Item-related**: `{ itemName }`, `{ itemId }`, `{ itemType }`
- **Date/time**: `{ date }`, `{ time }`, `{ timestamp }`
- **Action-related**: `{ actionName }`, `{ actionType }`

## Implementation Process for Agents

Follow these steps to convert hardcoded strings to i18n format:

1. **Determine scope** (check if specific file/package/path is provided)
2. **Find hardcoded strings** (literal strings in JSX, eslint-disable comments)
3. **Create message constants** (defineMessage calls with context-aware names)
4. **Replace hardcoded strings** (with formatMessage calls)
5. **Add hooks and imports** (useIntl hook and imports if missing)
6. **Verify conversion** (ensure all hardcoded strings are converted)

## Detailed Implementation Process for Agents

### Step -1: Determine Scope (CRITICAL - Do This First!)

**IMPORTANT**: Before starting conversion, check if a specific file, package name, or path has been
provided.

1. **Check for file path**: If a specific file path is provided (e.g.,
   `src/packages/applinks/administration/src/ui/list/index.tsx`), only work on that file
2. **Check for package name**: If a package name is provided (e.g., `applinks`), only work on files
   within `src/packages/applinks/**/*.tsx`
3. **Check for directory path**: If a directory path is provided (e.g.,
   `src/packages/applinks/administration`), only work on files within that directory and
   subdirectories
4. **If no path specified**: Work on all files provided or requested by the user
5. **Do NOT modify files outside scope**: Never modify files outside the specified path, even if
   they contain hardcoded strings

### Step 0: Find Hardcoded Strings (CRITICAL - Do This First!)

**IMPORTANT**: Always find all hardcoded strings before converting. This ensures nothing is missed.

**EFFICIENCY NOTE**: If the user provides specific violation lines (e.g., in a code block showing
file paths and line numbers), use those directly. This is more efficient than searching yourself.
Only search if violations are not provided.

**If violations are provided by user**:

- Use the provided file paths and line numbers directly
- If provided as JSON report, extract `filePath` and `violations` array
- For each violation, use the `line` number to locate the exact violation
- Focus only on those specific locations
- This is the preferred and most efficient approach

**If violations are NOT provided, search for them**:

1. **Search for eslint-disable comments FIRST** (most efficient method):
   - Search for: `@atlassian/i18n/no-literal-string-in-jsx` (the eslint rule name)
   - This will find all eslint-disable comments that suppress this rule (e.g.,
     `eslint-disable-next-line`, `eslint-disable`, etc.)
   - Read the code immediately after each disable comment to see the violation
   - This is the most reliable way to find violations when they're not provided
2. **If no eslint-disable comments found, scan for literal strings in JSX**:
   - `<Text>Hardcoded text</Text>`
   - `label="Hardcoded"`
   - `aria-label="Hardcoded"`
   - `title="Hardcoded"`
   - Any other hardcoded strings in JSX attributes or content
3. **Also check for template literals** (if they contain hardcoded text):
   - `` `Text ${variable}` ``
   - `` `Text ${variable} more text` ``
   - Note: Only convert if they contain hardcoded text, not if they're already properly using
     variables
4. **Also check for string concatenation** (if it contains hardcoded text):
   - `"Text " + variable`
   - `variable + " more text"`
   - Note: Only convert if they contain hardcoded text, not if they're already properly using
     variables
5. **Identify context**: For each hardcoded string, note:
   - What component/function it's in
   - What type of UI element (button, label, tooltip, etc.)
   - Whether it has variables that need placeholders

**Example Check**:

```typescript
// File content:
const myMessage = defineMessage({...}); // ← Usage found
const Component = () => {
  const { formatMessage } = useIntl(); // ← Usage found
  return <div>{formatMessage(myMessage)}</div>; // ← Usage found
}

// Check imports at top:
// eslint-disable-next-line jira/deprecations/ban-identifiers
import { useIntl, defineMessage } from '@atlassian/jira-intl'; // ✅ All imports present with eslint-disable
```

### Step 1: Create Message Constants

1. **For each hardcoded string found**:
   - Create a `defineMessage` constant at the top of the file (after imports, before component)
   - Use context-aware naming (see section 5 for naming guidelines)
   - Include proper `id`, `defaultMessage`, and `description`
2. **For strings with variables**:
   - Create placeholders in `defaultMessage` (e.g., `'Hello {userName}'`)
   - Use descriptive placeholder names matching variable names when possible
3. **Reuse existing constants**: Check if similar message constants already exist in the file that
   can be reused
4. **Add eslint-disable if needed**: If constant name triggers `jira/deprecations/ban-identifiers`,
   add the eslint-disable comment above the constant

### Step 2: Replace Hardcoded Strings

1. **Replace each hardcoded string**:
   - Simple strings: `<Text>Hello</Text>` → `<Text>{formatMessage(helloMessage)}</Text>`
   - Attribute values: `label="Submit"` → `label={formatMessage(submitLabel)}`
   - Template literals: `` `Hello ${userName}` `` → `formatMessage(helloMessage, { userName })`
   - String concatenation: `"Count: " + count` → `formatMessage(countMessage, { count })`
2. **Remove eslint-disable comments**: After converting, remove
   `{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}` comments
3. **Ensure consistency**: Use either `formatMessage` OR `intl.formatMessage` consistently
   throughout the file

### Step 3: Add Hooks and Imports

1. **Add useIntl hook**: For each component that now uses `formatMessage`:
   - Check if hook exists: `const { formatMessage } = useIntl();` or `const intl = useIntl();`
   - If missing, add hook at the top of the component function body
   - Convert arrow function expressions to body form if needed (to use hooks)
2. **Add imports**: Add required imports if missing:
   - `import { useIntl, defineMessage } from '@atlassian/jira-intl';`
   - Add `// eslint-disable-next-line jira/deprecations/ban-identifiers` above the import if it
     includes `defineMessage`
3. **Check parent components**: If converting strings in nested components:
   - Check if parent already has the hook
   - Check if `formatMessage` is passed as prop
   - Only add hook if neither parent has it nor receives it as prop

### Step 4: Add Message Descriptions

1. **For each NEW message constant created**:
   - Add a `description` field if missing
   - Ensure description is at least 40 characters long
   - Ensure description is different from `defaultMessage`
   - Follow template format: "The text is shown as [context] when [condition]. [Additional
     context]."
2. **Analyze code context**:
   - Read the component code to understand where and when the message is used
   - Identify UI component type (button, label, tooltip, error message, etc.)
   - Determine usage location (form footer, header, modal, etc.)
   - Document placeholders if the message has variables
3. **Skip pre-existing messages**: Do NOT update descriptions for messages that already existed in
   the codebase

### Step 5: Verify Conversion

1. **Manual verification**: Read through the code to ensure:
   - All hardcoded strings have been converted
   - All `formatMessage` calls have corresponding hooks
   - All message constants are context-aware and descriptive
   - All placeholder names are meaningful and consistent
   - All message descriptions meet quality standards (40+ chars, unique, template format)
   - All eslint-disable comments for no-literal-string-in-jsx have been removed
2. **Check for remaining hardcoded strings**: Scan the file again for any missed hardcoded strings

## Notes for Agents

- **CRITICAL SCOPE**: Only convert **hardcoded strings** to i18n format. Do NOT modify pre-existing
  messages that were already in the codebase, even if they have quality issues.
- **Priority order**: Focus on converting all hardcoded strings systematically
  1. **Find all hardcoded strings** (literal strings in JSX, eslint-disable comments)
  2. **Create message constants** (with context-aware names and proper descriptions)
  3. **Replace hardcoded strings** (with formatMessage calls)
  4. **Add hooks and imports** (useIntl hook and imports if missing)
  5. **Verify conversion** (ensure all hardcoded strings are converted)
- **Context is key**: Always consider component name, file path, and surrounding code when
  implementing constants and placeholders
- **Consistency matters**: Use consistent patterns within each file and across related files
  - If a file has `documentTitle`, `tableHeaderIssue`, follow similar patterns for new keys
  - Don't create keys like `productsjswstoragemanagementStorageManagement` when `pageHeaderTitle`
    fits the pattern
- **Verify everything**: Always verify conversion by manually checking that all hardcoded strings
  are converted
- **Update both places**: When creating placeholders, ensure they match in both the `defineMessage`
  call and the `formatMessage` usage
- **Think like a developer**: Message constants and placeholders should be self-documenting -
  another developer should understand what they represent without reading the code
- **Colocated messages**: Messages are defined directly in component files as individual
  `defineMessage` constants
  - Each message is a separate constant: `const messageKey = defineMessage({...})`
  - All messages are at the top of the file (after imports, before component)
  - Usage: `formatMessage(messageKey)` NOT `formatMessage(messages.messageKey)`
  - **NO `messages.tsx` files**: Messages are NOT in separate `messages.tsx` files
  - **NO `messages` import**: Do not import from `messages.tsx` - messages are in the same file
- **Do NOT fix linting errors**:
  - **Important**: Do not fix linting errors as part of the i18n conversion process
  - Common linting errors to ignore: import ordering, primitive component suggestions,
    style/formatting rules
  - Focus only on converting hardcoded strings to i18n format
  - Linting errors can be addressed in a separate follow-up PR
- **Best practices** (when converting hardcoded strings):
  - Use descriptive placeholder names (`count`, `total`, `userName`) not generic ones (`value0`,
    `value1`, `x`)
  - Use ICU plural format for numeric values: `{count, plural, one {# item} other {# items}}`
  - Use context-aware message constant names that match existing patterns in the file
  - Remove `eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx` comments after
    conversion
  - **Add eslint-disable for import**: Add
    `// eslint-disable-next-line jira/deprecations/ban-identifiers` above the import statement that
    includes `defineMessage`
  - **Add eslint-disable for banned identifiers**: If message constant name triggers
    `jira/deprecations/ban-identifiers`, add the eslint-disable comment above the constant
  - **Add proper descriptions**: Ensure all NEW message descriptions meet quality standards:
    - At least 40 characters long
    - Different from defaultMessage
    - Follow template format: "The text is shown as [context] when [condition]. [Additional
      context]."
    - Document all placeholders
    - Include usage location information
- **Do NOT modify**:
  - Pre-existing message descriptions (even if they don't meet quality standards)
  - Pre-existing message `defaultMessage` values
  - Pre-existing message placeholder names
  - Pre-existing message constant names
