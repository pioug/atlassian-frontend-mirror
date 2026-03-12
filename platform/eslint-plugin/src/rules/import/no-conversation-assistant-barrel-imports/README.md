# no-conversation-assistant-barrel-imports

Prevents barrel imports from `@atlassian/conversation-assistant` packages for faster IDE type highlight, faster dev server startup, and fewer CI tests run on changes.

## Rule Details

This rule blocks imports from the root of any package starting with `@atlassian/conversation-assistant`, requiring instead that imports use specific package.json export entries.

### ❌ Incorrect

```typescript
import { ConversationProvider } from '@atlassian/conversation-assistant';
import { useAgent } from '@atlassian/conversation-assistant-agent';
import { ConversationStore } from '@atlassian/conversation-assistant-store';
```

### ✅ Correct

```typescript
import { ConversationProvider } from '@atlassian/conversation-assistant/providers';
import { useAgent } from '@atlassian/conversation-assistant-agent/hooks';
import { ConversationStore } from '@atlassian/conversation-assistant-store/store';
```

## Why?

Large barrel files in widely-used platform packages leads to dependency graph bloat which leads to very inefficient test selection, slow IDE type highlight/linting, and slow dev server & Jest startup time locally.

## Options

This rule has no options.

## When Not To Use It

This rule is specific to `@atlassian/conversation-assistant` packages. If you're not using these packages, this rule won't affect you.

## Related Rules

- `no-restricted-imports` - ESLint's built-in rule for restricting imports
