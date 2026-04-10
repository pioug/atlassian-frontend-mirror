# Editor Plugin Local ID

LocalId plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development. External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Local ID plugin ensures that all non-ignored nodes in the document have unique `localId` attributes. It combines two approaches for optimal performance:

1. **One-time initialization scan** - Adds missing local IDs to existing nodes when the editor starts
2. **Incremental transaction processing** - Adds local IDs to new nodes as they're created

## Key features

- **Automatic local ID assignment** - Ensures all nodes without local IDs receive unique identifiers
- **Efficient initialization** - Uses `requestIdleCallback` with `requestAnimationFrame` fallback for Safari
- **Incremental updates** - Processes only changed nodes during transactions
- **Node filtering** - Skips ignored node types (text, hardBreak, mediaGroup)
- **Batch processing** - Applies all updates in a single transaction
- **Error tracking** - Optional error reporting for local ID changes via watchmen plugin
- **Plugin actions** - Provides `getNode` and `replaceNode` actions for querying and modifying nodes by local ID

### How It Works

#### Initialization Phase

- **Trigger**: Uses the editor view's initialization lifecycle to schedule the scan
- **Execution**: Performs a single document traversal during browser idle time
- **Scheduling**: Uses `requestIdleCallback` with `requestAnimationFrame` fallback for Safari
- **Purpose**: Ensures all existing nodes have local IDs

#### Transaction Processing Phase

- **Trigger**: Activates on every document-changing transaction
- **Execution**: Processes only the new/changed nodes from transaction steps
- **Performance**: Only scans changed ranges, not the entire document
- **Purpose**: Adds local IDs to newly created nodes

#### Node Processing

For each node (both during initialization and transaction processing):
- **Ignored nodes**: Always skipped (text, hardBreak)
- **Nodes with existing localId**: Left unchanged
- **Nodes without localId**: New UUID generated and assigned

#### Transaction Handling

- **Incremental updates**: Only processes nodes that actually changed
- **Efficient scanning**: Uses `step.getMap()` to identify changed ranges
- **Position accuracy**: Gets precise document positions for all changed nodes
- **Batch processing**: All updates applied in a single transaction

#### Behavior

| Case | Action Taken | Transaction Impact |
|------|-------------|-------------------|
| Existing node without `localId` (initialization) | `localId` is added | Single transaction with all changes |
| New node added without `localId` (transaction) | `localId` is added | Single transaction with all changes |
| Node already has a `localId` | Left unchanged | No transaction |
| Only selection changes | No action taken | No transaction |
| Cut operations | Skipped to avoid conflicts | No transaction |
| Document unchanged | Early exit | No transaction |

## Install

- **Install** - *yarn add @atlaskit/editor-plugin-local-id*
- **npm** - [@atlaskit/editor-plugin-local-id](https://www.npmjs.com/package/@atlaskit/editor-plugin-local-id)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-local-id)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-local-id/dist/)

## Usage

**Internal use only**

@atlaskit/editor-plugin-local-id is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin local-id](https://atlaskit.atlassian.com/packages/editor/editor-plugin-local-id) for documentation and examples for this package.

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
