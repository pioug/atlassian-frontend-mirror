# Editor Plugin: `editor-plugin-local-id`

## 🧠 Overview

This plugin ensures that all non-ignored nodes in the document have unique `localId` attributes. It performs a **one-time scan** of the document when the editor is initialized to add missing local IDs to existing nodes.

The plugin is designed to run only once per editor instance to avoid performance issues and prevent duplicate ID generation. It's optimized by using idle time scheduling and avoiding unnecessary transactions.

---

## ⚙️ How It Works

### Core Mechanism
- **Trigger**: Uses the editor view's initialization lifecycle to schedule the scan
- **Execution**: Performs a single document traversal during browser idle time
- **Scheduling**: Uses `requestIdleCallback` with `requestAnimationFrame` fallback for Safari

### Node Processing
For each node in the document:
- **Ignored nodes**: Always skipped (no local IDs needed)
- **Nodes with existing localId**: Left unchanged
- **Nodes without localId**: New UUID generated and assigned

### Transaction Handling
- All node updates are batched into a single transaction (only when needed)
- Transaction is marked with `addToHistory: false` to prevent undo/redo issues
- No transactions are dispatched if no local IDs need to be added

---

## ✅ Behavior

| Case | Action Taken | Transaction Impact |
|------|-------------|-------------------|
| Node has no `localId` and is not ignored | `localId` is added | Single transaction with all changes |
| Node already has a `localId` | Left unchanged | No transaction |
| Plugin has already run | No action taken | No transaction |
| Document has no applicable nodes | No action taken | No transaction |

