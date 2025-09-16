# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import { IconButton } from '@atlaskit/button/new';
+import EditIcon from '@atlaskit/icon/core/edit';
+import AddIcon from '@atlaskit/icon/core/add';
// Icon button
-<button className="p-2 rounded hover:bg-gray-100" title="Edit">
-  <EditIcon className="w-5 h-5" />
-</button>
+<IconButton icon={EditIcon} label="Edit item" />

// Primary icon button
-<button className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white" title="Add">
-  <PlusIcon className="w-5 h-5" />
-</button>
+<IconButton appearance="primary" icon={AddIcon} label="Add new item" />
```
