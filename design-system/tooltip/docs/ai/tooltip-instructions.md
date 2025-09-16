# Prop guidance

- **content** - Tooltip text or JSX content
- **position** - Tooltip position (top, bottom, left, right)
- **delay** - Delay before showing tooltip (default 300ms)
- **testId** - Testing identifier

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Tooltip from '@atlaskit/tooltip';

-<div className="relative group">
-  <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>
-  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
-    Tooltip content
-    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
-  </div>
-</div>
+<Tooltip content="Tooltip content">
+  <button>Hover me</button>
+</Tooltip>

-<div className="relative group">
-  <span className="text-gray-500">?</span>
-  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded">
-    Help text
-  </div>
-</div>
+<Tooltip content="Help text" position="top">
+  <span>?</span>
+</Tooltip>
```
