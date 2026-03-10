# UFO Experience Key

Utility for generating UFO experience key headers for GraphQL and HTTP requests across Atlassian
Frontend Monorepo (AFM).

## Purpose

This package provides utilities to capture and generate experience key headers for GraphQL and HTTP
requests. Experience keys represent feature names registered in Glance (formerly PerfPortal) and are
used to track which frontend features initiated requests.

## Installation

```bash
npm install @atlaskit/ufo-experience-key
```

## Exports

### `PRODUCT_NAMES`

Constants for product names to ensure consistency across the codebase.

```typescript
import { PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';

export const PRODUCT_NAMES = {
	JIRA: 'jira',
	CONFLUENCE: 'confluence',
	MERCURY: 'mercury',
	SOFTWARE: 'software',
	SERVICE_DESK: 'serviceDesk',
	CORE: 'core',
	PRODUCT_DISCOVERY: 'product-discovery',
	CUSTOMER_SERVICE: 'customer-service',
} as const;
```

### `getUfoExperienceKey(product: string): string`

Builds the UFO experience key in the format: `product.fe.loadType.featureName`

**Parameters:**

- `product` (string): The product name - use `PRODUCT_NAMES` constants for type safety

**Returns:** Experience key string (always returns a value, never undefined)

**Example:**

```typescript
import { getUfoExperienceKey, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';

const key = getUfoExperienceKey(PRODUCT_NAMES.JIRA);
// Returns: "jira.fe.page-load.issueView" (if active interaction exists)
// Returns: "jira.fe.feature-type-absent.feature-name-absent" (if no active interaction)
```

### `getUfoExperienceKeyHeader(product: string)`

Returns the header object to be included in GraphQL/HTTP requests.

**Parameters:**

- `product` (string): The product name - use `PRODUCT_NAMES` constants for type safety

**Returns:** 
- When active interaction exists: `{ 'atl-paas-cnsmr-ctx-experience-key': string }`
- When no active interaction: `{ 'atl-paas-missing-experience-key-product': string }`

Always returns a value object, never undefined or null.

**Example:**

```typescript
import { getUfoExperienceKeyHeader, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';

// In GraphQL middleware/headers layer
const headers = {
	'Content-Type': 'application/json',
	...getUfoExperienceKeyHeader(PRODUCT_NAMES.JIRA),
	// ... other headers
};

// With active interaction:
// {
//   'atl-paas-cnsmr-ctx-experience-key': 'jira.fe.page-load.issueView'
// }

// Without active interaction:
// {
//   'atl-paas-missing-experience-key-product': 'jira'
// }
```

### `mergeUfoExperienceKeyHeaders(product: string, existingHeaders?: Record<string, string>)`

Convenience utility for merging UFO experience key headers into an existing headers object.
Useful for code that constructs headers manually (e.g., raw `fetch()` calls).

**Parameters:**

- `product` (string): The product name - use `PRODUCT_NAMES` constants for type safety
- `existingHeaders` (optional): Existing headers to merge with

**Returns:** Headers object with UFO experience key headers merged in

**Example:**

```typescript
import { mergeUfoExperienceKeyHeaders, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';

const headers = mergeUfoExperienceKeyHeaders(PRODUCT_NAMES.JIRA, {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer token'
});

fetch('/gateway/api/graphql', {
	method: 'POST',
	headers,
	body: JSON.stringify(...)
});
```

## Constants

The following constants are exported for use in type definitions and code:

### `EXPERIENCE_KEY_HEADER_NAME`

Header name used when an active interaction exists.

```typescript
import { EXPERIENCE_KEY_HEADER_NAME } from '@atlaskit/ufo-experience-key';
// Value: 'atl-paas-cnsmr-ctx-experience-key'
```

### `MISSING_EXPERIENCE_KEY_HEADER_NAME`

Header name used when no active interaction exists.

```typescript
import { MISSING_EXPERIENCE_KEY_HEADER_NAME } from '@atlaskit/ufo-experience-key';
// Value: 'atl-paas-missing-experience-key-product'
```

## Experience Key Format

### With Active Interaction
Format: `product.fe.loadType.featureName`

Example: `jira.fe.page-load.issueView`

### Without Active Interaction
Format: `product.fe.feature-type-absent.feature-name-absent`

Example: `jira.fe.feature-type-absent.feature-name-absent`

## Load Type Mapping

UFO interaction types are mapped to load types as follows:

| Interaction Type | Load Type           |
| ---------------- | ------------------- |
| `page_load`      | `page-load`         |
| `transition`     | `page-load`         |
| `segment`        | `page-segment-load` |
| Other/undefined  | `inline-result`     |

## Architecture & Design Principles

This utility is designed to be called from centralized middleware/headers layers (e.g., Relay fetch
layer, HTTP fetch layer) rather than at individual component/hook call sites.

**Benefits:**

- **Single source of truth** for experience key generation
- **Automatic application** to all requests from a single location
- **Simplified maintenance** and updates across all products
- **No performance overhead** from repeated calls
- **Clear separation of concerns** - infrastructure layer handles header injection

**Design:**

- Pure functions with no side effects
- Constants extracted for maintainability (`EXPERIENCE_KEY_HEADER_NAME`, `MISSING_EXPERIENCE_KEY_HEADER_NAME`)
- Helper functions for clarity (`buildActiveExperienceKey`, `buildAbsentExperienceKey`, `deriveLoadType`)
- Always returns a value - no undefined/null returns
- Optional chaining for safe null checks

## Usage in Different Products

### Jira

```typescript
import { getUfoExperienceKeyHeader, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';

// In jira/src/packages/platform/fetch/src/utils/observability-headers.tsx
const experienceKeyHeader = getUfoExperienceKeyHeader(PRODUCT_NAMES.JIRA);
```

### Confluence

```typescript
import { getUfoExperienceKeyHeader, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';

// In confluence/next/packages/graphql/src/createWrappedFetch.ts
const experienceKeyHeader = getUfoExperienceKeyHeader(PRODUCT_NAMES.CONFLUENCE);
```

### Mercury

```typescript
import { getUfoExperienceKeyHeader, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';

// In mercury/src/clients/apolloClient.ts
const experienceKeyHeader = getUfoExperienceKeyHeader(PRODUCT_NAMES.MERCURY);
```

## Related

- [@atlaskit/react-ufo](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/ufo/react-ufo/) -
  UFO interaction metrics
