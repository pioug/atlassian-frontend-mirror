# Prop guidance

- **label** - Always provide descriptive text for accessibility
- **size** - Use default 16px unless design requires different
- **color** - Use design tokens for consistent theming

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import AddIcon from '@atlaskit/icon/core/add';
-<div className="w-4 h-4 text-blue-600">
-  <svg>...</svg>
-</div>
+<AddIcon label="Add item" />

-<span className="inline-flex items-center">
-  <svg className="w-4 h-4 mr-2">...</svg>
-  Text
-</span>
+<AddIcon label="Add item" />
+Text
```
