# Editor Plugin: `editor-plugin-local-id`

## 🧠 Overview

This plugin ensures that all non-ignored nodes in the document have unique `localId` attributes. It combines **two approaches** for optimal performance:

1. **One-time initialization scan** - Adds missing local IDs to existing nodes when the editor starts
2. **Incremental transaction processing** - Adds local IDs to new nodes as they're created

---

## ⚙️ How It Works

### Initialization Phase
- **Trigger**: Uses the editor view's initialization lifecycle to schedule the scan
- **Execution**: Performs a single document traversal during browser idle time
- **Scheduling**: Uses `requestIdleCallback` with `requestAnimationFrame` fallback for Safari
- **Purpose**: Ensures all existing nodes have local IDs

### Transaction Processing Phase
- **Trigger**: Activates on every document-changing transaction
- **Execution**: Processes only the new/changed nodes from transaction steps
- **Performance**: Only scans changed ranges, not the entire document
- **Purpose**: Adds local IDs to newly created nodes

### Node Processing
For each node (both during initialization and transaction processing):
- **Ignored nodes**: Always skipped (text, hardBreak)
- **Nodes with existing localId**: Left unchanged
- **Nodes without localId**: New UUID generated and assigned

### Transaction Handling
- **Incremental updates**: Only processes nodes that actually changed
- **Efficient scanning**: Uses `step.getMap()` to identify changed ranges
- **Position accuracy**: Gets precise document positions for all changed nodes
- **Batch processing**: All updates applied in a single transaction

---

## ✅ Behavior

| Case | Action Taken | Transaction Impact |
|------|-------------|-------------------|
| Existing node without `localId` (initialization) | `localId` is added | Single transaction with all changes |
| New node added without `localId` (transaction) | `localId` is added | Single transaction with all changes |
| Node already has a `localId` | Left unchanged | No transaction |
| Only selection changes | No action taken | No transaction |
| Cut operations | Skipped to avoid conflicts | No transaction |
| Document unchanged | Early exit | No transaction |

---

