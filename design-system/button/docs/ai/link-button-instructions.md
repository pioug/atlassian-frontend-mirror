# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import { LinkButton } from '@atlaskit/button/new';
+import AddIcon from '@atlaskit/icon/core/add';
// Link styled as button
-<a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-block">
-  Go to Dashboard
-</a>
+<LinkButton appearance="primary" href="/dashboard">
+  Go to Dashboard
+</LinkButton>

// External link
-<a href="https://atlassian.com" target="_blank" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded inline-block">
-  Learn More
-</a>
+<LinkButton appearance="default" href="https://atlassian.com" target="_blank">
+  Learn More
+</LinkButton>

// Link with icon
-<a href="/create" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded inline-flex items-center gap-2">
-  <PlusIcon className="w-4 h-4" />
-  Create New
-</a>
+<LinkButton appearance="primary" href="/create" iconBefore={AddIcon}>
+  Create New
+</LinkButton>
```
